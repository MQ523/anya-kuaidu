const AudioFx = (() => {
  let ctx = null;
  let generation = 0;
  let clipsArmed = false;
  const ding = makeClip(
    [
      [1046.5, 0, 0.18, 0.85],
      [1318.5, 0.12, 0.2, 0.9],
      [1568.0, 0.26, 0.28, 0.95],
      [2093.0, 0.4, 0.22, 0.7],
    ],
    "sine"
  );
  const buzz = makeClip(
    [
      [392, 0, 0.22, 0.9],
      [247, 0.16, 0.32, 0.95],
    ],
    "square"
  );

  function makeClip(notes, wave) {
    const sr = 22050;
    let end = 0;
    notes.forEach(([, start, dur]) => {
      end = Math.max(end, start + dur);
    });
    const count = Math.floor(sr * (end + 0.04));
    const pcm = new Int16Array(count);
    notes.forEach(([freq, start, dur, vol]) => {
      const i0 = Math.floor(start * sr);
      const n = Math.floor(dur * sr);
      for (let i = 0; i < n; i += 1) {
        const t = i / sr;
        const env = Math.min(1, i / (0.012 * sr)) * Math.max(0, 1 - i / n);
        let sample = Math.sin(2 * Math.PI * freq * t);
        if (wave === "square") sample = sample >= 0 ? 1 : -1;
        const idx = i0 + i;
        if (idx < count) {
          const mixed = pcm[idx] / 32767 + sample * vol * env;
          pcm[idx] = Math.max(-32767, Math.min(32767, mixed * 32767));
        }
      }
    });
    const bytes = pcm.byteLength;
    const buf = new ArrayBuffer(44 + bytes);
    const view = new DataView(buf);
    const ascii = (offset, text) => {
      for (let i = 0; i < text.length; i += 1) view.setUint8(offset + i, text.charCodeAt(i));
    };
    ascii(0, "RIFF");
    view.setUint32(4, 36 + bytes, true);
    ascii(8, "WAVE");
    ascii(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sr, true);
    view.setUint32(28, sr * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    ascii(36, "data");
    view.setUint32(40, bytes, true);
    new Uint8Array(buf, 44).set(new Uint8Array(pcm.buffer));
    const audio = new Audio(URL.createObjectURL(new Blob([buf], { type: "audio/wav" })));
    audio.preload = "auto";
    audio.volume = 1;
    return audio;
  }

  function playClip(clip) {
    try {
      clip.pause();
      clip.currentTime = 0;
      clip.volume = 1;
      const playing = clip.play();
      if (playing && playing.catch) playing.catch(() => {});
    } catch (err) {
      /* ignore */
    }
  }

  function context() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    return ctx;
  }

  function unlock() {
    const audio = context();
    if (audio.state === "suspended") audio.resume();
    if (window.speechSynthesis) window.speechSynthesis.getVoices();
    if (!clipsArmed) {
      clipsArmed = true;
      [ding, buzz].forEach((clip) => {
        clip.volume = 0.001;
        const playing = clip.play();
        if (playing && playing.then) {
          playing
            .then(() => {
              clip.pause();
              clip.currentTime = 0;
              clip.volume = 1;
            })
            .catch(() => {
              clip.volume = 1;
            });
        }
      });
    }
    return audio;
  }

  function stopSpeak() {
    generation += 1;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function pickVoice() {
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    return (
      voices.find((v) => /sinji/i.test(v.name)) ||
      voices.find((v) => /zh[-_]HK/i.test(v.lang) && /google/i.test(v.name)) ||
      voices.find((v) => /zh[-_]HK/i.test(v.lang)) ||
      voices.find((v) => /yue/i.test(v.lang)) ||
      voices.find((v) => /粵語|粤语|cantonese|hong kong/i.test(v.name))
    );
  }

  function speak(text, { lang = "zh-HK", rate = 0.78, pitch = 1.05 } = {}) {
    stopSpeak();
    if (!window.speechSynthesis) return Promise.resolve();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = 1;
    const voice = pickVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    }
    return new Promise((resolve) => {
      utter.onend = resolve;
      utter.onerror = resolve;
      window.speechSynthesis.speak(utter);
    });
  }

  function speakChar(item) {
    const text = item.speak || item.z;
    const rate = item.kind === "sentence" ? 0.86 : item.kind === "word" ? 0.78 : 0.7;
    return speak(text, { rate });
  }

  function speakWords(words) {
    return speak(words.join("，"), { rate: 0.82 });
  }

  function success() {
    playClip(ding);
  }

  function oops() {
    playClip(buzz);
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  return { unlock, stopSpeak, speak, speakChar, speakWords, success, oops };
})();

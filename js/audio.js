const AudioFx = (() => {
  let ctx = null;
  let unlocked = false;
  let generation = 0;

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
    unlocked = true;
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

  function speak(text, { lang = "zh-HK", rate = 0.78 } = {}) {
    stopSpeak();
    if (!window.speechSynthesis) return Promise.resolve();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = rate;
    utter.pitch = 1.05;
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

  function tone(freq, start, duration, type, gainValue) {
    const audio = unlock();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audio.currentTime + start);
    gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(gainValue, audio.currentTime + start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(audio.currentTime + start);
    osc.stop(audio.currentTime + start + duration + 0.02);
  }

  function success() {
    stopSpeak();
    tone(587.33, 0, 0.12, "triangle", 0.14);
    tone(739.99, 0.09, 0.13, "triangle", 0.14);
    tone(880.0, 0.18, 0.16, "triangle", 0.16);
    tone(1174.66, 0.3, 0.22, "sine", 0.12);
  }

  function oops() {
    stopSpeak();
    tone(311.13, 0, 0.16, "square", 0.08);
    tone(233.08, 0.12, 0.22, "square", 0.07);
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  return { unlock, stopSpeak, speak, speakChar, speakWords, success, oops };
})();

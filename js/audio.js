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
    if (!unlocked) return;
    const audio = context();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audio.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(gainValue, audio.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(audio.currentTime + start);
    osc.stop(audio.currentTime + start + duration + 0.02);
  }

  function success() {
    tone(523.25, 0, 0.14, "sine", 0.05);
    tone(659.25, 0.1, 0.16, "sine", 0.05);
    tone(783.99, 0.2, 0.22, "sine", 0.06);
  }

  function oops() {
    tone(220, 0, 0.14, "sine", 0.04);
  }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  return { unlock, stopSpeak, speak, speakChar, speakWords, success, oops };
})();

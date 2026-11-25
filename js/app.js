const appEl = document.getElementById("app");
const celebrateEl = document.getElementById("celebrate");
const starEl = document.getElementById("star-count");
const confettiCanvas = document.getElementById("confetti");
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

const state = {
  screen: "home",
  lesson: 1,
  mode: "read",
  item: null,
  choices: [],
  status: "idle",
  heard: "",
  showHint: false,
};

let recognizer = null;
let recTimer = null;

function todayKey() {
  return `kuaidu-stars-${new Date().toISOString().slice(0, 10)}`;
}

function loadStars() {
  return Number(localStorage.getItem(todayKey()) || 0);
}

function addStar() {
  const next = loadStars() + 1;
  localStorage.setItem(todayKey(), String(next));
  starEl.textContent = `⭐ ${next}`;
  return next;
}

function stopListening() {
  if (recTimer) {
    clearTimeout(recTimer);
    recTimer = null;
  }
  if (recognizer) {
    try {
      recognizer.onresult = null;
      recognizer.onerror = null;
      recognizer.onend = null;
      recognizer.stop();
    } catch (err) {
      /* already stopped */
    }
    recognizer = null;
  }
}

function goHome() {
  stopListening();
  AudioFx.stopSpeak();
  state.screen = "home";
  render();
}

function startGame(mode) {
  AudioFx.unlock();
  state.mode = mode;
  state.screen = "play";
  nextItem(true);
}

function nextItem(reset) {
  stopListening();
  AudioFx.stopSpeak();
  const prev = state.item && state.item.z;
  state.item = pickChar(state.lesson, reset ? null : prev);
  state.choices = pickChoices(state.item, state.lesson);
  state.status = "idle";
  state.heard = "";
  state.showHint = false;
  render();
}

function isMatch(transcripts, item) {
  const needles = [item.z, item.s, item.jy, stripJyutping(item.jy)];
  if (item.z === "媽") needles.push("妈妈", "媽媽", "妈");
  if (item.z === "爸") needles.push("爸爸");
  if (item.z === "爺") needles.push("爷爷", "爺爺");
  if (item.z === "奶") needles.push("奶奶");
  if (item.z === "的") needles.push("嘅");
  if (item.z === "不") needles.push("唔");
  return transcripts.some((raw) => {
    const t = String(raw).replace(/\s/g, "");
    const low = t.toLowerCase();
    return needles.some((n) => t.includes(n) || low.includes(String(n).toLowerCase()));
  });
}

function render() {
  starEl.textContent = `⭐ ${loadStars()}`;
  if (state.screen === "home") {
    appEl.innerHTML = homeHTML();
    bindHome();
    return;
  }
  appEl.innerHTML = playHTML();
  bindPlay();
}

function homeHTML() {
  const chips = LESSONS.map(
    (lesson) =>
      `<button class="chip ${state.lesson === lesson.id ? "active" : ""}" data-lesson="${lesson.id}">${lesson.title}</button>`
  ).join("");
  return `
    <section class="hero-card">
      <h2>先出字，再自己读</h2>
      <p>按《四五快读》第一册十课来，<strong>听和读都是香港广东话</strong>。先看汉字，卡住了可以听标准粤语；也可以录音，读对了得星星。</p>
    </section>
    <div class="filters">
      ${chips}
      <button class="chip ${state.lesson === "mix" ? "active" : ""}" data-lesson="mix">混合复习</button>
    </div>
    <button class="mode-card" data-mode="read">
      <span class="mode-icon">👀</span>
      <span>
        <h3>看字朗读</h3>
        <p>大字出现，自己试着读。可听、可录音、可读对了给星星。</p>
      </span>
    </button>
    <button class="mode-card" data-mode="tap">
      <span class="mode-icon">👂</span>
      <span>
        <h3>听音点字</h3>
        <p>电脑读一个字，从四个字里点出来。录音不稳时更好玩。</p>
      </span>
    </button>
    <section class="tips panel">
      <h3>怎么带她玩</h3>
      <ol>
        <li>先选课。第一课最像图画：人、口、大、小、哭、笑。</li>
        <li>不要把粤拼先念给她听。让她先看字，用广东话读。</li>
        <li>电脑有时听不准四岁的声音。她读对了，点「读对了，给星星」。</li>
        <li>认得出的字，马上读下面的词。词比单个字更容易记住。</li>
        <li>听不到广东话时：iPhone/iPad 去设置里下载「中文（香港）」语音（Sinji）。Chrome 也要装香港粤语语音包。</li>
      </ol>
    </section>
  `;
}

function bindHome() {
  appEl.querySelectorAll("[data-lesson]").forEach((btn) => {
    btn.onclick = () => {
      const value = btn.dataset.lesson;
      state.lesson = value === "mix" ? "mix" : Number(value);
      render();
    };
  });
  appEl.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.onclick = () => startGame(btn.dataset.mode);
  });
}

function playHTML() {
  if (state.mode === "tap") return tapHTML();
  return readHTML();
}

function readHTML() {
  const item = state.item;
  const recording = state.status === "recording";
  const pinyin = state.status === "tryagain" || state.showHint ? item.jy : "";
  const words = state.status === "tryagain" || state.showHint ? item.words.join("　") : "先自己读这个字";
  return `
    <div class="game-header">
      <button class="back" id="back">← 返回</button>
      <strong>看字朗读</strong>
      <button class="ghost" id="skip">换一个</button>
    </div>
    <p class="coach ${state.status === "tryagain" || state.status === "no-mic" ? "warn" : ""}" id="coach">${coachText()}</p>
    <section class="word-card">
      <div class="hanzi">${item.z}</div>
      <p class="pinyin" id="pinyin">${pinyin}</p>
      <p class="words" id="words">${words}</p>
      <div class="actions">
        <button class="listen-btn" id="listen">🔊 听一听</button>
        <div class="mic-wrap">
          <button class="mic ${recording ? "recording" : ""}" id="mic">🎤</button>
          <span class="mic-label">${recording ? "正在听…" : "录音"}</span>
        </div>
      </div>
      <p class="heard" id="heard">${state.heard ? `电脑听到：${state.heard}` : ""}</p>
      <button class="parent-ok" id="parent-ok">读对了，给星星</button>
      <p class="hint">家长提示：${item.hint}</p>
    </section>
  `;
}

function tapHTML() {
  const cards = state.choices
    .map((item) => `<button class="tap-card" data-z="${item.z}">${item.z}</button>`)
    .join("");
  return `
    <div class="game-header">
      <button class="back" id="back">← 返回</button>
      <strong>听音点字</strong>
      <button class="ghost" id="skip">换一个</button>
    </div>
    <p class="coach" id="coach">先听广东话，再点那个字。</p>
    <section class="word-card">
      <div class="tap-grid">${cards}</div>
      <div class="actions">
        <button class="listen-btn" id="listen">🔊 再听一次</button>
      </div>
      <p class="hint">家长提示：${state.item.hint}</p>
    </section>
  `;
}

function coachText() {
  if (state.status === "recording") return "请大声读这个字。";
  if (state.status === "tryagain") {
    return state.heard
      ? `电脑听到的是「${state.heard}」。再试一次，或先听一听。`
      : "没有听清。再点麦克风，或先点「听一听」。";
  }
  if (state.status === "no-mic") return "没有麦克风权限。可以听一听跟读，读对了由爸爸妈妈点「给星星」。";
  if (state.status === "no-engine") return "这个浏览器不太会判分。请用 Chrome，或读对后点「给星星」。";
  return "先看这个字，试着读出来。";
}

function bindPlay() {
  document.getElementById("back").onclick = goHome;
  document.getElementById("skip").onclick = () => nextItem(false);
  document.getElementById("listen").onclick = () => {
    stopListening();
    state.showHint = true;
    if (state.mode === "read") {
      document.getElementById("pinyin").textContent = state.item.jy;
      document.getElementById("words").textContent = state.item.words.join("　");
    }
    AudioFx.speakChar(state.item);
  };
  const mic = document.getElementById("mic");
  if (mic) mic.onclick = toggleRecord;
  const parentOk = document.getElementById("parent-ok");
  if (parentOk) parentOk.onclick = () => succeed(state.item);
  appEl.querySelectorAll(".tap-card").forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.z === state.item.z) {
        btn.classList.add("right");
        succeed(state.item);
        return;
      }
      btn.classList.add("wrong");
      AudioFx.oops();
      setTimeout(() => {
        btn.classList.remove("wrong");
        AudioFx.speakChar(state.item);
      }, 400);
    };
  });
  if (state.mode === "tap") setTimeout(() => AudioFx.speakChar(state.item), 250);
}

function updateReadChrome() {
  const coach = document.getElementById("coach");
  const heard = document.getElementById("heard");
  const mic = document.getElementById("mic");
  const label = document.querySelector(".mic-label");
  if (!coach) return;
  coach.textContent = coachText();
  coach.classList.toggle("warn", state.status === "tryagain" || state.status === "no-mic");
  if (heard) heard.textContent = state.heard ? `电脑听到：${state.heard}` : "";
  if (mic) mic.classList.toggle("recording", state.status === "recording");
  if (label) label.textContent = state.status === "recording" ? "正在听…" : "录音";
  if (state.status === "tryagain") {
    document.getElementById("pinyin").textContent = state.item.jy;
    document.getElementById("words").textContent = state.item.words.join("　");
  }
}

function toggleRecord() {
  if (state.status === "recording") {
    stopListening();
    state.status = state.heard ? "tryagain" : "idle";
    updateReadChrome();
    return;
  }
  beginRecord();
}

function beginRecord() {
  AudioFx.unlock();
  AudioFx.stopSpeak();
  if (!SpeechRec) {
    state.status = "no-engine";
    updateReadChrome();
    return;
  }
  stopListening();
  state.status = "recording";
  state.heard = "";
  updateReadChrome();

  const rec = new SpeechRec();
  recognizer = rec;
  rec.lang = "zh-HK";
  rec.interimResults = true;
  rec.maxAlternatives = 5;
  rec.continuous = false;

  rec.onresult = (event) => {
    const transcripts = [];
    for (let i = 0; i < event.results.length; i += 1) {
      for (let j = 0; j < event.results[i].length; j += 1) {
        transcripts.push(event.results[i][j].transcript);
      }
    }
    const last = event.results[event.results.length - 1];
    state.heard = last[0].transcript;
    updateReadChrome();
    if (last.isFinal) finishRecord(transcripts);
  };

  rec.onerror = (event) => {
    if (event.error === "not-allowed" || event.error === "service-not-allowed") state.status = "no-mic";
    else if (event.error === "no-speech") {
      state.status = "tryagain";
      state.heard = "";
    } else state.status = "tryagain";
    updateReadChrome();
  };

  rec.onend = () => {
    if (state.status === "recording") {
      state.status = "tryagain";
      updateReadChrome();
    }
  };

  try {
    rec.start();
  } catch (err) {
    rec.lang = "zh-HK";
    try {
      rec.start();
    } catch (err2) {
      state.status = "no-engine";
      updateReadChrome();
      return;
    }
  }

  recTimer = setTimeout(() => {
    if (state.status === "recording") {
      try {
        rec.stop();
      } catch (err) {
        /* ignore */
      }
    }
  }, 4000);
}

function finishRecord(transcripts) {
  stopListening();
  if (isMatch(transcripts, state.item)) {
    succeed(state.item);
    return;
  }
  state.status = "tryagain";
  updateReadChrome();
}

function succeed(item) {
  stopListening();
  addStar();
  AudioFx.success();
  burstConfetti();
  celebrateEl.className = "celebrate show";
  celebrateEl.innerHTML = `
    <div class="celebrate-card">
      <div class="hanzi">${item.z}</div>
      <p>${item.jy}</p>
      <p>${item.words.join("　")}</p>
      <p>读对了！得到一颗星星</p>
      <div class="actions" style="margin-top:14px">
        <button class="btn gold" id="hear-again">再听一遍</button>
        <button class="btn" id="again">下一个</button>
      </div>
    </div>
  `;
  document.getElementById("hear-again").onclick = () => {
    AudioFx.speakChar(item).then(() => AudioFx.speakWords(item.words));
  };
  document.getElementById("again").onclick = () => {
    celebrateEl.className = "celebrate";
    nextItem(false);
  };
  setTimeout(() => {
    AudioFx.speakChar(item).then(() => AudioFx.speakWords(item.words));
  }, 280);
}

function burstConfetti() {
  const ctx = confettiCanvas.getContext("2d");
  const pieces = [];
  const colors = ["#e07a5f", "#e8a838", "#7eb89a", "#4c8d9e", "#f4d35e"];
  const { width, height } = resizeConfetti();
  for (let i = 0; i < 70; i += 1) {
    pieces.push({
      x: width * 0.5,
      y: height * 0.35,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -11 - 4,
      size: Math.random() * 8 + 4,
      color: colors[i % colors.length],
      rot: Math.random() * 6,
      life: 70 + Math.random() * 20,
    });
  }
  const tick = () => {
    ctx.clearRect(0, 0, width, height);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28;
      p.life -= 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.life / 80);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (pieces.some((p) => p.life > 0)) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, width, height);
  };
  tick();
}

function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  return { width: confettiCanvas.width, height: confettiCanvas.height };
}

window.addEventListener("resize", resizeConfetti);
document.addEventListener("pointerdown", () => AudioFx.unlock(), { once: true });
resizeConfetti();
render();

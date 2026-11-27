const appEl = document.getElementById("app");
const celebrateEl = document.getElementById("celebrate");
const starEl = document.getElementById("star-count");
const confettiCanvas = document.getElementById("confetti");
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

const STAGE = {
  char: { read: "看字朗读", tap: "听音点字", unit: "字", prompt: "先自己读这个字" },
  word: { read: "看詞朗读", tap: "听音点詞", unit: "詞語", prompt: "先自己读这个词" },
  sentence: { read: "看句朗读", tap: "听音点句", unit: "句子", prompt: "先自己读这句话" },
};

const state = {
  screen: "home",
  book: 1,
  lesson: 1,
  stage: "char",
  mode: "read",
  item: null,
  choices: [],
  status: "idle",
  heard: "",
  showHint: false,
};

function currentFilter() {
  if (state.book === "all") return "mix";
  if (state.lesson === "mix") return `mix-${state.book}`;
  return state.lesson;
}

function lessonsInBook(book) {
  if (book === "all") return LESSONS;
  if (book === 7) return LESSONS.filter((lesson) => lesson.book <= 6);
  return LESSONS.filter((lesson) => lesson.book === book);
}

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
  if (!lessonHasStage(currentFilter(), state.stage)) return;
  AudioFx.unlock();
  state.mode = mode;
  state.screen = "play";
  nextItem(true);
}

function nextItem(reset) {
  stopListening();
  AudioFx.stopSpeak();
  const prev = state.item && state.item.z;
  state.item = pickItem(currentFilter(), state.stage, reset ? null : prev);
  state.choices = pickChoices(state.item, currentFilter(), state.stage);
  state.status = "idle";
  state.heard = "";
  state.showHint = false;
  render();
}

function isMatch(transcripts, item) {
  if (item.kind === "sentence") {
    const chars = [...item.z].filter((ch) => /[\u4e00-\u9fff]/.test(ch));
    const need = Math.min(4, Math.max(2, Math.ceil(chars.length * 0.5)));
    return transcripts.some((raw) => {
      const t = String(raw).replace(/\s/g, "");
      const hit = chars.filter((ch) => t.includes(ch) || t.includes(toSimplified(ch))).length;
      return hit >= need;
    });
  }
  const needles = [item.z, item.s, item.jy, stripJyutping(item.jy)].filter(Boolean);
  if (item.kind === "word") needles.push(toSimplified(item.z));
  if (item.z === "媽" || item.z.includes("媽")) needles.push("妈妈", "媽媽", "妈");
  if (item.z === "爸" || item.z.includes("爸")) needles.push("爸爸");
  if (item.z.includes("爺")) needles.push("爷爷", "爺爺");
  if (item.z.includes("奶")) needles.push("奶奶");
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
  const bookChips = BOOK_META.map((book) => {
    const label = book.id === 7 ? "第七冊·總複習" : book.id === 8 ? "第八冊·故事" : book.title;
    return `<button class="chip ${state.book === book.id ? "active" : ""}" data-book="${book.id}">${label}</button>`;
  }).join("");
  const inBook = lessonsInBook(state.book);
  const lessonChips = inBook
    .map(
      (lesson) =>
        `<button class="chip ${state.lesson === lesson.id ? "active" : ""}" data-lesson="${lesson.id}">${lesson.title}</button>`
    )
    .join("");
  const filter = currentFilter();
  const hasChars = lessonHasStage(filter, "char");
  const hasWords = lessonHasStage(filter, "word");
  const hasSentences = lessonHasStage(filter, "sentence");
  const labels = STAGE[state.stage];
  return `
    <section class="hero-card">
      <h2>字 → 詞 → 句</h2>
      <p>八册《四五快讀／學前識字》原文：先认生字，再读詞語，再读句子和故事。<strong>听和读都是香港广东话</strong>。</p>
    </section>
    <div class="filters">
      ${bookChips}
      <button class="chip ${state.book === "all" ? "active" : ""}" data-book="all">八册混合</button>
    </div>
    <div class="filters">
      ${lessonChips}
      <button class="chip ${state.lesson === "mix" ? "active" : ""}" data-lesson="mix">本册混合</button>
    </div>
    <div class="filters">
      <button class="chip ${state.stage === "char" ? "active" : ""} ${hasChars ? "" : "off"}" data-stage="char">生字</button>
      <button class="chip ${state.stage === "word" ? "active" : ""} ${hasWords ? "" : "off"}" data-stage="word">詞語</button>
      <button class="chip ${state.stage === "sentence" ? "active" : ""} ${hasSentences ? "" : "off"}" data-stage="sentence">句子</button>
    </div>
    <button class="mode-card" data-mode="read">
      <span class="mode-icon">👀</span>
      <span>
        <h3>${labels.read}</h3>
        <p>先看${labels.unit}，自己试着读。可听、可录音，读对了得星星。</p>
      </span>
    </button>
    <button class="mode-card" data-mode="tap">
      <span class="mode-icon">👂</span>
      <span>
        <h3>${labels.tap}</h3>
        <p>电脑用广东话读，从几个选项里点出来。录音不稳时更好玩。</p>
      </span>
    </button>
    <section class="tips panel">
      <h3>怎么带她玩</h3>
      <ol>
        <li>生字、詞語、句子都来自你放进来的八册书，没有另外编写。</li>
        <li>第一至六册按课认字；第七册是总复习；第八册是故事朗读。</li>
        <li>句子里金黄色的是关键词：书里出现过的詞語和生字。</li>
        <li>句子比较长，四岁读不全很正常。读对了就点「给星星」。</li>
      </ol>
    </section>
  `;
}

function bindHome() {
  appEl.querySelectorAll("[data-book]").forEach((btn) => {
    btn.onclick = () => {
      const value = btn.dataset.book;
      state.book = value === "all" ? "all" : Number(value);
      const pool = lessonsInBook(state.book);
      state.lesson = pool[0] ? pool[0].id : "mix";
      if (state.book === "all" || state.book === 7) state.lesson = "mix";
      if (state.book === 8) state.stage = "sentence";
      if (!lessonHasStage(currentFilter(), state.stage)) {
        state.stage = lessonHasStage(currentFilter(), "char")
          ? "char"
          : lessonHasStage(currentFilter(), "word")
            ? "word"
            : "sentence";
      }
      render();
    };
  });
  appEl.querySelectorAll("[data-lesson]").forEach((btn) => {
    btn.onclick = () => {
      const value = btn.dataset.lesson;
      state.lesson = value === "mix" ? "mix" : Number(value);
      if (typeof state.lesson === "number") {
        const hit = LESSONS.find((item) => item.id === state.lesson);
        if (hit) state.book = hit.book;
      }
      if (!lessonHasStage(currentFilter(), state.stage)) {
        state.stage = lessonHasStage(currentFilter(), "char")
          ? "char"
          : lessonHasStage(currentFilter(), "word")
            ? "word"
            : "sentence";
      }
      render();
    };
  });
  appEl.querySelectorAll("[data-stage]").forEach((btn) => {
    btn.onclick = () => {
      const stage = btn.dataset.stage;
      if (!lessonHasStage(currentFilter(), stage)) return;
      state.stage = stage;
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
  const showExtra = state.status === "tryagain" || state.showHint;
  const pinyin = showExtra && item.kind === "char" ? item.jy : "";
  const words =
    showExtra && item.kind === "char"
      ? phrasesForChar(item.z).slice(0, 6).join("　") || STAGE[state.stage].prompt
      : STAGE[state.stage].prompt;
  const sizeClass = item.kind === "sentence" ? "sentence" : item.kind === "word" ? "word" : "";
  const display = item.kind === "sentence" ? item.html : item.z;
  return `
    <div class="game-header">
      <button class="back" id="back">← 返回</button>
      <strong>${STAGE[state.stage].read}</strong>
      <button class="ghost" id="skip">换一个</button>
    </div>
    <p class="coach ${state.status === "tryagain" || state.status === "no-mic" ? "warn" : ""}" id="coach">${coachText()}</p>
    <section class="word-card">
      <div class="hanzi ${sizeClass}">${display}</div>
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
  const sizeClass = state.stage === "sentence" ? "sentence" : state.stage === "word" ? "word" : "";
  const cards = state.choices
    .map(
      (item) =>
        `<button class="tap-card ${sizeClass}" data-z="${item.z}">${
          item.kind === "sentence" ? item.html : item.z
        }</button>`
    )
    .join("");
  return `
    <div class="game-header">
      <button class="back" id="back">← 返回</button>
      <strong>${STAGE[state.stage].tap}</strong>
      <button class="ghost" id="skip">换一个</button>
    </div>
    <p class="coach" id="coach">先听广东话，再点那个${STAGE[state.stage].unit}。</p>
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
  if (state.status === "recording") return `请大声读这个${STAGE[state.stage].unit}。`;
  if (state.status === "tryagain") {
    return state.heard
      ? `电脑听到的是「${state.heard}」。再试一次，或先听一听。`
      : "没有听清。再点麦克风，或先点「听一听」。";
  }
  if (state.status === "no-mic") return "没有麦克风权限。可以听一听跟读，读对了由爸爸妈妈点「给星星」。";
  if (state.status === "no-engine") return "这个浏览器不太会判分。请用 Chrome，或读对后点「给星星」。";
  return `先看这个${STAGE[state.stage].unit}，试着用广东话读出来。`;
}

function bindPlay() {
  document.getElementById("back").onclick = goHome;
  document.getElementById("skip").onclick = () => nextItem(false);
  document.getElementById("listen").onclick = () => {
    stopListening();
    state.showHint = true;
    if (state.mode === "read") {
      document.getElementById("pinyin").textContent = state.item.kind === "char" ? state.item.jy : "";
      document.getElementById("words").textContent =
        state.item.kind === "char"
          ? phrasesForChar(state.item.z).slice(0, 6).join("　")
          : STAGE[state.stage].prompt;
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
  if (state.status === "tryagain" && state.item.kind === "char") {
    document.getElementById("pinyin").textContent = state.item.jy;
    document.getElementById("words").textContent = phrasesForChar(state.item.z).slice(0, 6).join("　");
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
  }, state.item && state.item.kind === "sentence" ? 8000 : 4000);
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
  const sizeClass = item.kind === "sentence" ? "sentence" : item.kind === "word" ? "word" : "";
  const extra =
    item.kind === "char"
      ? `<p>${item.jy || ""}</p><p>${phrasesForChar(item.z).slice(0, 6).join("　")}</p>`
      : "";
  const display = item.kind === "sentence" ? item.html : item.z;
  celebrateEl.className = "celebrate show";
  celebrateEl.innerHTML = `
    <div class="celebrate-card">
      <div class="hanzi ${sizeClass}">${display}</div>
      ${extra}
      <p>读对了！得到一颗星星</p>
      <div class="actions" style="margin-top:14px">
        <button class="btn gold" id="hear-again">再听一遍</button>
        <button class="btn" id="again">下一个</button>
      </div>
    </div>
  `;
  const replay = () => {
    AudioFx.speakChar(item).then(() => {
      if (item.kind === "char") AudioFx.speakWords(item.words);
    });
  };
  document.getElementById("hear-again").onclick = replay;
  document.getElementById("again").onclick = () => {
    celebrateEl.className = "celebrate";
    nextItem(false);
  };
  setTimeout(replay, 280);
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

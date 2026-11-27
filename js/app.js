const appEl = document.getElementById("app");
const celebrateEl = document.getElementById("celebrate");
const starEl = document.getElementById("star-count");
const confettiCanvas = document.getElementById("confetti");
const STAGE = {
  char: { read: "学习", tap: "测验", unit: "字", prompt: "先自己读这个字" },
  word: { read: "学习", tap: "测验", unit: "詞語", prompt: "先自己读这个词" },
  sentence: { read: "学习", tap: "测验", unit: "句子", prompt: "先自己读这句话" },
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
  showHint: false,
  missMode: false,
  queueIndex: 0,
  quizOrder: [],
  quizCorrect: 0,
  justSticker: null,
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

function goHome() {
  AudioFx.stopSpeak();
  celebrateEl.className = "celebrate";
  celebrateEl.innerHTML = "";
  state.missMode = false;
  state.justSticker = null;
  state.screen = "home";
  render();
}

function startGame(mode, startAt) {
  if (!lessonHasStage(currentFilter(), state.stage)) return;
  AudioFx.unlock();
  state.missMode = false;
  state.justSticker = null;
  state.mode = mode;
  state.screen = "play";
  if (mode === "tap") {
    state.quizOrder = shuffle(currentQueue());
    state.queueIndex = 0;
    state.quizCorrect = 0;
  } else {
    state.quizOrder = [];
    state.quizCorrect = 0;
    state.queueIndex = typeof startAt === "number" ? startAt : 0;
  }
  nextItem(true);
}

function startMissGame(mode) {
  if (!Stats.missItems().length) return;
  AudioFx.unlock();
  state.missMode = true;
  state.mode = mode;
  state.screen = "play";
  nextItem(true);
}

function stageOf(item) {
  if (item.kind === "word") return "word";
  if (item.kind === "sentence") return "sentence";
  return "char";
}

function currentQueue() {
  return itemsFor(currentFilter(), state.stage);
}

function shuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function prevItem() {
  if (state.missMode || state.mode !== "read") return;
  if (state.queueIndex <= 0) return;
  state.queueIndex -= 1;
  nextItem(true);
}

function nextItem(reset) {
  AudioFx.stopSpeak();
  const prev = reset ? null : state.item && state.item.z;
  if (state.missMode) {
    const picked = Stats.pickMiss(prev);
    if (!picked) {
      state.screen = "miss-done";
      render();
      return;
    }
    state.stage = stageOf(picked);
    state.item = picked;
    state.choices = pickChoices(picked, "mix", state.stage);
  } else if (state.mode === "read") {
    const queue = currentQueue();
    if (!reset) state.queueIndex += 1;
    if (!queue.length) {
      goHome();
      return;
    }
    if (state.queueIndex >= queue.length) {
      state.justSticker = Stickers.markLearned(state.lesson);
      state.screen = "lesson-done";
      render();
      return;
    }
    state.item = queue[state.queueIndex];
    state.choices = pickChoices(state.item, currentFilter(), state.stage);
  } else {
    const queue = state.quizOrder;
    if (!reset) state.queueIndex += 1;
    if (!queue.length) {
      goHome();
      return;
    }
    if (state.queueIndex >= queue.length) {
      state.justSticker = Stickers.markQuiz(state.lesson) || state.justSticker;
      state.screen = "quiz-done";
      render();
      return;
    }
    state.item = queue[state.queueIndex];
    state.choices = pickChoices(state.item, currentFilter(), state.stage);
  }
  state.status = "idle";
  state.showHint = false;
  render();
}

function render() {
  starEl.textContent = `⭐ ${loadStars()}`;
  if (state.screen === "home") {
    appEl.innerHTML = homeHTML();
    bindHome();
    return;
  }
  if (state.screen === "miss-done") {
    appEl.innerHTML = missDoneHTML();
    bindMissDone();
    return;
  }
  if (state.screen === "lesson-done") {
    appEl.innerHTML = lessonDoneHTML();
    bindLessonDone();
    return;
  }
  if (state.screen === "quiz-done") {
    appEl.innerHTML = quizDoneHTML();
    bindQuizDone();
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
  const queue = itemsFor(filter, state.stage);
  return `
    ${installHintHTML()}
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
    ${rosterHTML(queue)}
    ${
      queue.length
        ? `<button class="mode-card" data-mode="tap">
      <span class="mode-icon">📝</span>
      <h3>${labels.tap}</h3>
    </button>`
        : ""
    }
    ${albumHTML()}
    ${missPanelHTML()}
  `;
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function installHintHTML() {
  if (isStandalone() || localStorage.getItem("kuaidu-hide-install")) return "";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const text = ios
    ? "点 Safari 底部「分享」，再选「添加到主屏幕」，以后像 App 一样打开。"
    : "用浏览器菜单把「Anya快讀」加到主屏幕，以后像 App 一样打开。";
  return `<section class="install-hint"><p>${text}</p><button type="button" class="ghost" id="hide-install">知道了</button></section>`;
}

function albumHTML() {
  const items = Stickers.album();
  const got = items.filter((item) => item.earned).length;
  const cells = items
    .map((item) => {
      if (item.earned) {
        return `<div class="sticker-slot on">${Stickers.img(item)}<em>${item.name}</em></div>`;
      }
      return `<div class="sticker-slot"><span>?</span></div>`;
    })
    .join("");
  return `
    <section class="sticker-album">
      <h3>公主贴纸 ${got} / ${items.length}</h3>
      <p>选一课，做完测验，就送一张。</p>
      <div class="sticker-grid">${cells}</div>
    </section>
  `;
}

function stickerNoteHTML() {
  if (state.justSticker) {
    return `${Stickers.img(state.justSticker, "sticker-prize")}<p class="pic-label">送你一张「${state.justSticker.name}」贴纸</p>`;
  }
  if (typeof state.lesson !== "number") {
    return state.screen === "quiz-done" ? `<p class="words">选一课再测，才能得贴纸。</p>` : "";
  }
  const info = Stickers.status(state.lesson);
  if (info && info.sticker) {
    return `${Stickers.img(info.sticker, "sticker-prize tiny")}<p class="words">这一课的贴纸已经收下了</p>`;
  }
  if (state.screen === "lesson-done") {
    return `<p class="words">再做测验，测完就送公主贴纸。</p>`;
  }
  return "";
}

function rosterTitle() {
  if (typeof state.lesson === "number") {
    const hit = LESSONS.find((lesson) => lesson.id === state.lesson);
    return hit ? hit.title : "这一课";
  }
  if (state.book === "all") return "八册混合";
  const book = BOOK_META.find((item) => item.id === state.book);
  return book ? `${book.title}混合` : "本册混合";
}

function rosterHTML(queue) {
  if (!queue.length) return "";
  const unit = STAGE[state.stage].unit;
  const maxShow = state.stage === "sentence" ? 12 : 40;
  const shown = queue.slice(0, maxShow);
  const more =
    queue.length > maxShow ? `<span class="roster-more">还有 ${queue.length - maxShow} 个</span>` : "";
  const cells = shown
    .map((item, index) => {
      const text =
        item.kind === "sentence" && item.z.length > 12 ? `${item.z.slice(0, 12)}…` : item.z;
      return `<button type="button" class="roster-item ${item.kind}" data-start="${index}">${escapeHtml(
        text
      )}</button>`;
    })
    .join("");
  return `
    <section class="roster-panel">
      <h3>${rosterTitle()} · ${queue.length} 个${unit}</h3>
      <button type="button" class="roster-go" data-start="0">从第一个开始学</button>
      <div class="roster-grid">${cells}${more}</div>
    </section>
  `;
}

function playProgressHTML() {
  if (state.missMode) return "";
  if (state.mode === "tap") {
    const total = state.quizOrder.length;
    if (!total) return "";
    return `<p class="progress">第 ${state.queueIndex + 1} / ${total} 题</p>`;
  }
  if (state.mode !== "read") return "";
  const queue = currentQueue();
  const total = queue.length;
  const now = state.queueIndex;
  let mini = "";
  if (state.stage === "char" && total && total <= 24) {
    mini = `<div class="roster-mini">${queue
      .map(
        (item, index) =>
          `<button type="button" class="roster-dot ${index === now ? "now" : ""}" data-jump="${index}">${escapeHtml(
            item.z
          )}</button>`
      )
      .join("")}</div>`;
  }
  return `<p class="progress">第 ${now + 1} / ${total} 个${STAGE[state.stage].unit}</p>${mini}`;
}

function lessonDoneHTML() {
  const unit = STAGE[state.stage].unit;
  const total = currentQueue().length;
  return `
    <div class="game-header">
      <button class="back" id="back">← 返回</button>
      <strong>${rosterTitle()}</strong>
      <span></span>
    </div>
    <section class="word-card miss-done">
      <div class="hanzi">⭐</div>
      <p class="pic-label">${total} 个${unit}都过完了</p>
      ${stickerNoteHTML()}
      <div class="actions">
        <button class="btn gold" id="again-seq">再学一遍</button>
        <button class="btn" id="go-tap">去做测验</button>
      </div>
    </section>
  `;
}

function bindLessonDone() {
  document.getElementById("back").onclick = goHome;
  document.getElementById("again-seq").onclick = () => startGame("read", 0);
  document.getElementById("go-tap").onclick = () => startGame("tap");
  if (state.justSticker) burstConfetti();
}

function quizDoneHTML() {
  const total = state.quizOrder.length;
  const ok = state.quizCorrect;
  const unit = STAGE[state.stage].unit;
  const all = total && ok === total;
  return `
    <div class="game-header">
      <button class="back" id="back">← 返回</button>
      <strong>测验</strong>
      <span></span>
    </div>
    <section class="word-card miss-done">
      <div class="hanzi">${all ? "⭐" : "📝"}</div>
      <p class="pic-label">${all ? "全对了！" : "测验完成"}</p>
      <p class="words">答对 ${ok} / ${total} 个${unit}。</p>
      ${stickerNoteHTML()}
      <div class="actions">
        <button class="btn gold" id="quiz-again">再测一次</button>
        <button class="btn" id="quiz-home">回首页</button>
      </div>
    </section>
  `;
}

function bindQuizDone() {
  document.getElementById("back").onclick = goHome;
  document.getElementById("quiz-again").onclick = () => startGame("tap");
  document.getElementById("quiz-home").onclick = goHome;
  if (state.justSticker) burstConfetti();
}

function missPanelHTML() {
  const list = Stats.missList();
  if (!list.length) return "";
  const pills = list
    .slice(0, 16)
    .map(
      ({ item, row }) =>
        `<span class="miss-pill">${item.kind === "sentence" ? "句" : item.kind === "word" ? "詞" : "字"} ${escapeHtml(
          item.z.length > 8 ? `${item.z.slice(0, 8)}…` : item.z
        )} <em>${row.wrong}</em></span>`
    )
    .join("");
  return `
    <section class="miss-panel">
      <h3>错题本 · ${list.length}</h3>
      <div class="miss-pills">${pills}</div>
      <div class="miss-actions">
        <button class="btn gold" data-miss-mode="tap">错题测验</button>
      </div>
    </section>
  `;
}

function missDoneHTML() {
  return `
    <div class="game-header">
      <button class="back" id="back">← 返回</button>
      <strong>错题本</strong>
      <span></span>
    </div>
    <section class="word-card miss-done">
      ${Pics.html({ kind: "char", z: "星" })}
      <div class="hanzi">⭐</div>
      <p class="pic-label">错题本清空了</p>
      <p class="words">常错的都练会了。要不要再玩一课？</p>
      <div class="actions">
        <button class="btn gold" id="back-home">回首页</button>
      </div>
    </section>
  `;
}

function bindMissDone() {
  document.getElementById("back").onclick = goHome;
  document.getElementById("back-home").onclick = goHome;
}

function bindHome() {
  const hideInstall = document.getElementById("hide-install");
  if (hideInstall) {
    hideInstall.onclick = () => {
      localStorage.setItem("kuaidu-hide-install", "1");
      render();
    };
  }
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
  appEl.querySelectorAll("[data-miss-mode]").forEach((btn) => {
    btn.onclick = () => startMissGame(btn.dataset.missMode);
  });
  appEl.querySelectorAll("[data-start]").forEach((btn) => {
    btn.onclick = () => startGame("read", Number(btn.dataset.start));
  });
}

function playHTML() {
  if (state.mode === "tap") return tapHTML();
  return readHTML();
}

function phraseButtonsHTML(phrases) {
  return phrases
    .map((phrase) => {
      const safe = escapeHtml(phrase).replace(/"/g, "&quot;");
      return `<button type="button" class="phrase-chip" data-say="${safe}">${escapeHtml(phrase)}</button>`;
    })
    .join("");
}

function bindPhraseChips(root) {
  (root || appEl).querySelectorAll("[data-say]").forEach((btn) => {
    btn.onclick = () => {
      AudioFx.unlock();
      AudioFx.speak(btn.dataset.say, { rate: 0.78 });
    };
  });
}

function readHTML() {
  const item = state.item;
  const showExtra = state.showHint;
  const pinyin = showExtra && item.kind === "char" ? item.jy : "";
  const words =
    showExtra && item.kind === "char" ? phraseButtonsHTML(phrasesForChar(item.z).slice(0, 6)) : "";
  const sizeClass = item.kind === "sentence" ? "sentence" : item.kind === "word" ? "word" : "";
  const display = item.kind === "sentence" ? item.html : item.z;
  const atFirst = state.missMode || state.queueIndex <= 0;
  const nextLabel = state.missMode ? "换一个" : "下一个";
  return `
    <div class="game-header">
      <button class="back" id="back">← 返回</button>
      <strong>${state.missMode ? "错题跟读 · " : rosterTitle()}</strong>
      <span></span>
    </div>
    ${playProgressHTML()}
    <section class="word-card">
      ${Pics.html(item)}
      <div class="hanzi ${sizeClass}">${display}</div>
      <p class="pinyin" id="pinyin">${pinyin}</p>
      <div class="phrase-row" id="words">${words}</div>
      <div class="actions learn-nav">
        <button class="nav-btn" id="prev" ${atFirst ? "disabled" : ""}>上一个</button>
        <button class="listen-btn" id="listen">听一听</button>
        <button class="nav-btn" id="next">${nextLabel}</button>
      </div>
      <button class="parent-ok" id="parent-ok">读对了，给星星</button>
      <p class="hint">家长提示：${item.hint}</p>
    </section>
  `;
}

function tapHTML() {
  const sizeClass = state.stage === "sentence" ? "sentence" : state.stage === "word" ? "word" : "";
  const cards = state.choices
    .map(
      (item, index) =>
        `<button class="tap-card ${sizeClass}" data-i="${index}">${
          item.kind === "sentence" ? item.html : item.z
        }</button>`
    )
    .join("");
  return `
    <div class="game-header">
      <button class="back" id="back">← 返回</button>
      <strong>${state.missMode ? "错题测验" : "测验"}</strong>
      <button class="ghost" id="skip">${state.missMode ? "换一个" : "跳过"}</button>
    </div>
    ${playProgressHTML()}
    <section class="word-card">
      <div class="tap-grid">${cards}</div>
      <div class="actions">
        <button class="listen-btn" id="listen">再听一次</button>
      </div>
      <p class="hint">家长提示：${state.item.hint}</p>
    </section>
  `;
}

function bindPlay() {
  document.getElementById("back").onclick = goHome;
  const skip = document.getElementById("skip");
  if (skip) skip.onclick = () => nextItem(false);
  const prev = document.getElementById("prev");
  if (prev) prev.onclick = prevItem;
  const next = document.getElementById("next");
  if (next) next.onclick = () => nextItem(false);
  appEl.querySelectorAll("[data-jump]").forEach((btn) => {
    btn.onclick = () => {
      state.queueIndex = Number(btn.dataset.jump);
      nextItem(true);
    };
  });
  document.getElementById("listen").onclick = () => {
    state.showHint = true;
    if (state.mode === "read") {
      document.getElementById("pinyin").textContent = state.item.kind === "char" ? state.item.jy : "";
      const wordsEl = document.getElementById("words");
      if (wordsEl) {
        wordsEl.innerHTML =
          state.item.kind === "char" ? phraseButtonsHTML(phrasesForChar(state.item.z).slice(0, 6)) : "";
        bindPhraseChips();
      }
    }
    AudioFx.speakChar(state.item);
  };
  bindPhraseChips();
  const parentOk = document.getElementById("parent-ok");
  if (parentOk) parentOk.onclick = () => succeed(state.item);
  appEl.querySelectorAll(".tap-card").forEach((btn) => {
    btn.onclick = () => {
      AudioFx.unlock();
      const choice = state.choices[Number(btn.dataset.i)];
      if (choice && choice.z === state.item.z) {
        btn.classList.add("right");
        succeed(state.item);
        return;
      }
      btn.classList.add("wrong");
      Stats.record(state.item, false);
      AudioFx.oops();
      setTimeout(() => {
        btn.classList.remove("wrong");
        AudioFx.speakChar(state.item);
      }, 700);
    };
  });
  if (state.mode === "tap") setTimeout(() => AudioFx.speakChar(state.item), 250);
}

function succeed(item) {
  if (state.mode === "tap" && !state.missMode) {
    state.quizCorrect += 1;
    const last = state.quizOrder && state.queueIndex >= state.quizOrder.length - 1;
    if (last) state.justSticker = Stickers.markQuiz(state.lesson) || state.justSticker;
  }
  const row = Stats.record(item, true);
  const cleared = state.missMode && row.streak >= 2;
  addStar();
  AudioFx.success();
  burstConfetti();
  const sizeClass = item.kind === "sentence" ? "sentence" : item.kind === "word" ? "word" : "";
  const extra =
    item.kind === "char"
      ? `<p>${item.jy || ""}</p><div class="phrase-row">${phraseButtonsHTML(
          phrasesForChar(item.z).slice(0, 6)
        )}</div>`
      : "";
  const display = item.kind === "sentence" ? item.html : item.z;
  const stickerBit = state.justSticker
    ? `${Stickers.img(state.justSticker, "sticker-prize")}<p class="pic-label">送你一张「${state.justSticker.name}」贴纸</p>`
    : "";
  const msg = stickerBit
    ? ""
    : cleared
      ? "连对两次，从错题本拿走了！"
      : "读对了！得到一颗星星";
  celebrateEl.className = "celebrate show";
  celebrateEl.innerHTML = `
    <div class="celebrate-card">
      ${Pics.html(item, "celebrate-pics")}
      <div class="hanzi ${sizeClass}">${display}</div>
      ${extra}
      ${stickerBit}
      <p>${msg}</p>
      <div class="actions" style="margin-top:14px">
        <button class="btn gold" id="hear-again">再听一遍</button>
        <button class="btn" id="again">${stickerBit ? "收下" : "下一个"}</button>
      </div>
    </div>
  `;
  const replay = () => {
    AudioFx.speakChar(item).then(() => {
      if (item.kind === "char") AudioFx.speakWords(item.words);
    });
  };
  bindPhraseChips(celebrateEl);
  document.getElementById("hear-again").onclick = replay;
  document.getElementById("again").onclick = () => {
    celebrateEl.className = "celebrate";
    nextItem(false);
  };
  setTimeout(replay, 700);
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

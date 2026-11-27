const Stickers = (() => {
  const KEY = "kuaidu-stickers-v1";
  const PACK = [
    { id: "crown", name: "皇冠" },
    { id: "castle", name: "城堡" },
    { id: "wand", name: "魔法棒" },
    { id: "slipper", name: "水晶鞋" },
    { id: "rose", name: "玫瑰" },
    { id: "bow", name: "蝴蝶结" },
    { id: "carriage", name: "马车" },
    { id: "swan", name: "小天鹅" },
    { id: "necklace", name: "项链" },
    { id: "sparkle", name: "星星" },
    { id: "peach", name: "粉裙公主" },
    { id: "lavender", name: "紫裙公主" },
  ];

  function src(id) {
    return `stickers/${id}.svg`;
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (err) {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function byId(id) {
    return PACK.find((item) => item.id === id) || null;
  }

  function earnedIds() {
    const data = load();
    const lessons = data.lessons || {};
    return Object.keys(lessons)
      .map((key) => lessons[key] && lessons[key].sticker)
      .filter(Boolean);
  }

  function row(lessonId) {
    const data = load();
    const lessons = data.lessons || {};
    return lessons[String(lessonId)] || { learned: false, quiz: false, sticker: null };
  }

  function writeRow(lessonId, patch) {
    const data = load();
    if (!data.lessons) data.lessons = {};
    const key = String(lessonId);
    data.lessons[key] = { ...row(lessonId), ...patch };
    save(data);
    return data.lessons[key];
  }

  function awardIfReady(lessonId) {
    const current = row(lessonId);
    if (!current.quiz || current.sticker) return null;
    const used = new Set(earnedIds());
    const next = PACK.find((item) => !used.has(item.id));
    if (!next) return null;
    writeRow(lessonId, { sticker: next.id });
    return { ...next, src: src(next.id) };
  }

  function markLearned(lessonId) {
    if (typeof lessonId !== "number") return null;
    writeRow(lessonId, { learned: true });
    return awardIfReady(lessonId);
  }

  function markQuiz(lessonId) {
    if (typeof lessonId !== "number") return null;
    writeRow(lessonId, { quiz: true });
    return awardIfReady(lessonId);
  }

  function status(lessonId) {
    if (typeof lessonId !== "number") return null;
    const current = row(lessonId);
    const sticker = current.sticker && current.sticker !== "full" ? byId(current.sticker) : null;
    return {
      learned: !!current.learned,
      quiz: !!current.quiz,
      sticker: sticker ? { ...sticker, src: src(sticker.id) } : null,
      albumFull: current.sticker === "full",
    };
  }

  function album() {
    const got = new Set(earnedIds().filter((id) => id !== "full"));
    return PACK.map((item) => ({
      ...item,
      src: src(item.id),
      earned: got.has(item.id),
    }));
  }

  function img(sticker, className) {
    if (!sticker || !sticker.src) return "";
    return `<img class="${className || "sticker-art"}" src="${sticker.src}" alt="${sticker.name || ""}" />`;
  }

  return { PACK, src, markLearned, markQuiz, status, album, img, earnedIds };
})();

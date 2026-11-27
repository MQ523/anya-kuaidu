const Stats = (() => {
  const KEY = "kuaidu-stats-v1";

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

  function itemKey(item) {
    return `${item.kind}:${item.z}`;
  }

  function blank(item) {
    return {
      z: item.z,
      kind: item.kind,
      lesson: item.lesson || 0,
      right: 0,
      wrong: 0,
      streak: 0,
      last: 0,
      lastWrong: 0,
    };
  }

  function get(item) {
    return load()[itemKey(item)] || blank(item);
  }

  function record(item, ok) {
    const data = load();
    const key = itemKey(item);
    const row = data[key] || blank(item);
    row.z = item.z;
    row.kind = item.kind;
    row.lesson = item.lesson || row.lesson || 0;
    row.last = Date.now();
    if (ok) {
      row.right += 1;
      row.streak = Math.max(0, row.streak) + 1;
    } else {
      row.wrong += 1;
      row.streak = Math.min(0, row.streak) - 1;
      row.lastWrong = Date.now();
    }
    data[key] = row;
    save(data);
    return row;
  }

  function isMiss(row) {
    return Boolean(row && row.wrong >= 2 && row.streak < 2);
  }

  function mastered(item) {
    return get(item).streak >= 2;
  }

  function weight(item) {
    const row = get(item);
    let w = 1 + row.wrong * 2;
    if (row.wrong > row.right) w += (row.wrong - row.right) * 2;
    if (row.streak > 0) w *= Math.pow(0.4, Math.min(row.streak, 5));
    if (row.streak < 0) w *= Math.pow(1.6, Math.min(-row.streak, 4));
    if (row.lastWrong && Date.now() - row.lastWrong < 36e5 * 24) w *= 1.4;
    if (row.right >= 3 && row.wrong === 0) w *= 0.2;
    return Math.max(0.05, w);
  }

  function pickWeighted(pool) {
    if (!pool.length) return null;
    const weights = pool.map((item) => weight(item));
    let total = weights.reduce((sum, n) => sum + n, 0);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i += 1) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function allItems() {
    return ["char", "word", "sentence"].flatMap((stage) => itemsFor("mix", stage));
  }

  function missItems() {
    const data = load();
    return allItems().filter((item) => isMiss(data[itemKey(item)]));
  }

  function missList() {
    const data = load();
    return missItems()
      .map((item) => ({ item, row: data[itemKey(item)] }))
      .sort((a, b) => b.row.wrong - b.row.right - (a.row.wrong - a.row.right) || b.row.wrong - a.row.wrong);
  }

  function pickMiss(avoid) {
    const list = missItems();
    const pool = list.filter((item) => item.z !== avoid);
    return pickWeighted(pool.length ? pool : list);
  }

  function clearMiss() {
    const data = load();
    Object.keys(data).forEach((key) => {
      if (isMiss(data[key])) data[key].streak = 2;
    });
    save(data);
  }

  return { record, get, weight, pickWeighted, missList, missItems, pickMiss, mastered, clearMiss, isMiss };
})();

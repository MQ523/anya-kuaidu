const Profile = (() => {
  const KEY = "kuaidu-profile-v1";
  const THEMES = [
    { id: "peach", name: "蜜桃" },
    { id: "sky", name: "天空" },
    { id: "mint", name: "薄荷" },
    { id: "grape", name: "葡萄" },
    { id: "berry", name: "草莓" },
  ];

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

  function ready() {
    return !!String(load().name || "").trim();
  }

  function name() {
    return String(load().name || "").trim();
  }

  function theme() {
    const id = load().theme || "peach";
    return THEMES.some((item) => item.id === id) ? id : "peach";
  }

  function set(patch) {
    const next = { ...load() };
    if (patch.name != null) next.name = String(patch.name).trim().slice(0, 8);
    if (patch.theme) next.theme = patch.theme;
    save(next);
    applyTheme();
    return next;
  }

  function applyTheme(id) {
    document.documentElement.setAttribute("data-theme", id || theme());
    const meta = document.querySelector('meta[name="theme-color"]');
    const cream = getComputedStyle(document.documentElement).getPropertyValue("--cream").trim();
    if (meta && cream) meta.setAttribute("content", cream);
  }

  function confettiColors() {
    const css = getComputedStyle(document.documentElement);
    return ["--coral", "--gold", "--sage", "--teal", "--confetti"]
      .map((key) => css.getPropertyValue(key).trim())
      .filter(Boolean);
  }

  return { THEMES, load, ready, name, theme, set, applyTheme, confettiColors };
})();

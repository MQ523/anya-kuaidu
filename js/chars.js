const LESSONS = [
  {
    id: 1,
    title: "第一課",
    chars: [
      { z: "天", s: "天", jy: "tin1", hint: "抬头看外面", words: ["天上", "一天"] },
      { z: "太", s: "太", jy: "taai3", hint: "比「大」多一点", words: ["太大", "太小"] },
      { z: "月", s: "月", jy: "jyut6", hint: "晚上那一轮", words: ["一月", "二月"] },
      { z: "二", s: "二", jy: "ji6", hint: "两横", words: ["二月"] },
      { z: "人", s: "人", jy: "jan4", hint: "两腿分开站", words: ["大人", "小人"] },
      { z: "口", s: "口", jy: "hau2", hint: "方方的嘴巴", words: ["大口", "小口"] },
      { z: "大", s: "大", jy: "daai6", hint: "张开双臂", words: ["大人", "大哭"] },
      { z: "中", s: "中", jy: "zung1", hint: "口里插一竖", words: ["中"] },
      { z: "小", s: "小", jy: "siu2", hint: "蹲下来就变小", words: ["小人", "小口"] },
      { z: "哭", s: "哭", jy: "huk1", hint: "做哭脸", words: ["大哭"] },
      { z: "笑", s: "笑", jy: "siu3", hint: "做笑脸", words: ["大笑"] },
      { z: "一", s: "一", jy: "jat1", hint: "一条横线", words: ["一天"] },
      { z: "上", s: "上", jy: "soeng6", hint: "手举高", words: ["天上"] },
      { z: "下", s: "下", jy: "haa6", hint: "指地板", words: ["上下"] },
      { z: "爸", s: "爸", jy: "baa4", hint: "指爸爸", words: ["爸爸"] },
      { z: "媽", s: "妈", jy: "maa1", hint: "指妈妈", words: ["媽媽"] },
    ],
    phrases: ["大人", "小人", "大哭", "大笑", "大口", "小口"],
    sentences: [],
  },
  {
    id: 2,
    title: "第二課",
    chars: [
      { z: "地", s: "地", jy: "dei6", hint: "脚下踩的", words: ["地上"] },
      { z: "陽", s: "阳", jy: "joeng4", hint: "白天那个火球", words: ["太陽"] },
      { z: "亮", s: "亮", jy: "loeng6", hint: "灯打开了", words: ["月亮"] },
      { z: "星", s: "星", jy: "sing1", hint: "夜里一闪一闪", words: ["星星"] },
      { z: "雲", s: "云", jy: "wan4", hint: "天上软软的", words: ["白雲"] },
      { z: "火", s: "火", jy: "fo2", hint: "烫烫的", words: ["大火"] },
      { z: "水", s: "水", jy: "seoi2", hint: "可以喝的", words: ["大水"] },
      { z: "三", s: "三", jy: "saam1", hint: "三横", words: ["三天", "三月"] },
    ],
    phrases: ["爸爸", "媽媽", "上天", "天上", "太大", "太小", "一天", "一月", "二月", "上上下下"],
    sentences: [],
  },
  {
    id: 3,
    title: "第三課",
    chars: [
      { z: "土", s: "土", jy: "tou2", hint: "地上的泥", words: ["土地"] },
      { z: "山", s: "山", jy: "saan1", hint: "三座尖尖", words: ["大山", "小山"] },
      { z: "石", s: "石", jy: "sek6", hint: "硬硬的石头", words: ["石山"] },
      { z: "木", s: "木", jy: "muk6", hint: "一棵树的样子", words: ["木星"] },
      { z: "我", s: "我", jy: "ngo5", hint: "指自己", words: ["我有", "我爸"] },
      { z: "好", s: "好", jy: "hou2", hint: "竖大拇指", words: ["好人", "好山"] },
      { z: "有", s: "有", jy: "jau5", hint: "手里拿着", words: ["我有"] },
      { z: "田", s: "田", jy: "tin4", hint: "四块格子", words: ["水田", "田地"] },
    ],
    phrases: ["天地", "大地", "太陽", "月亮", "星星", "天亮", "大火", "大水", "火星", "水星", "三天", "三月", "地上", "地下"],
    sentences: [],
  },
  {
    id: 4,
    title: "第四課",
    chars: [
      { z: "牛", s: "牛", jy: "ngau4", hint: "哞哞叫", words: ["大牛", "小牛"] },
      { z: "羊", s: "羊", jy: "joeng4", hint: "咩咩叫", words: ["山羊", "小羊"] },
      { z: "聰", s: "聪", jy: "cung1", hint: "耳朵灵", words: ["聰明"] },
      { z: "耳", s: "耳", jy: "ji5", hint: "指耳朵", words: ["耳"] },
      { z: "目", s: "目", jy: "muk6", hint: "指眼睛", words: ["目"] },
      { z: "心", s: "心", jy: "sam1", hint: "拍胸口", words: ["小心", "心中"] },
      { z: "和", s: "和", jy: "wo4", hint: "还有、一起", words: ["和"] },
      { z: "四", s: "四", jy: "sei3", hint: "四个", words: ["四天", "四月"] },
    ],
    phrases: ["土地", "大山", "小山", "土山", "石山", "火山", "土星", "木星", "好人", "田地", "水田", "我有", "我爸", "我媽", "我哭", "我笑", "好山好水"],
    sentences: [
      "我有好爸爸、好媽媽。",
      "天上有太陽、月亮、星星。",
      "地上有土、石、山、水田。",
      "爸爸上山，媽媽下山。",
    ],
  },
  {
    id: 5,
    title: "第五課",
    chars: [
      { z: "明", s: "明", jy: "ming4", hint: "日加月", words: ["明亮", "明天"] },
      { z: "頭", s: "头", jy: "tau4", hint: "指脑袋", words: ["石頭", "木頭"] },
      { z: "眉", s: "眉", jy: "mei4", hint: "眼睛上面", words: ["眉頭"] },
      { z: "鼻", s: "鼻", jy: "bei6", hint: "指鼻子", words: ["鼻子", "鼻頭"] },
      { z: "手", s: "手", jy: "sau2", hint: "伸出小手", words: ["小手", "手心"] },
      { z: "花", s: "花", jy: "faa1", hint: "香香的", words: ["小花"] },
      { z: "樹", s: "树", jy: "syu6", hint: "高高的", words: ["大樹", "小樹"] },
      { z: "五", s: "五", jy: "ng5", hint: "五个", words: ["五天", "五月"] },
    ],
    phrases: ["大牛", "小牛", "水牛", "山羊", "小羊", "小心", "中心", "心中", "四月", "四天"],
    sentences: [
      "地上有小草和大樹。",
      "草地上有水牛和小山羊。",
      "爸爸和媽媽心中有我。",
      "我心中有爸爸和媽媽。",
    ],
  },
  {
    id: 6,
    title: "第六課",
    chars: [
      { z: "草", s: "草", jy: "cou2", hint: "地上绿绿的", words: ["小草", "草地"] },
      { z: "葉", s: "叶", jy: "jip6", hint: "树上的小片", words: ["樹葉", "葉子"] },
      { z: "日", s: "日", jy: "jat6", hint: "太阳，也是天", words: ["一日"] },
      { z: "風", s: "风", jy: "fung1", hint: "呼呼吹", words: ["大風"] },
      { z: "雨", s: "雨", jy: "jyu5", hint: "从天上掉下来", words: ["大雨", "小雨"] },
      { z: "的", s: "的", jy: "dik1", hint: "我的、你的（口語常說「嘅」）", words: ["我的"] },
      { z: "孩", s: "孩", jy: "haai4", hint: "小朋友", words: ["孩子"] },
      { z: "六", s: "六", jy: "luk6", hint: "六个", words: ["六天", "六月"] },
    ],
    phrases: ["聰明", "明亮", "明天", "明月", "眉頭", "鼻頭", "石頭", "木頭", "心頭", "小手", "小花", "大樹", "小樹", "樹木", "五月", "五天", "手心"],
    sentences: [
      "我有小手。",
      "頭上有眉、目、耳、鼻和口。",
      "眉下有目，鼻下有口。",
      "樹上有花和葉。",
    ],
  },
  {
    id: 7,
    title: "第七課",
    chars: [
      { z: "白", s: "白", jy: "baak6", hint: "白云的颜色", words: ["白雲", "白天"] },
      { z: "紅", s: "红", jy: "hung4", hint: "红花的颜色", words: ["紅花", "紅日"] },
      { z: "是", s: "是", jy: "si6", hint: "我是……", words: ["我是", "是的"] },
      { z: "家", s: "家", jy: "gaa1", hint: "我们住的地方", words: ["我家", "大家"] },
      { z: "多", s: "多", jy: "do1", hint: "好多好多", words: ["多少"] },
      { z: "唱", s: "唱", jy: "coeng3", hint: "张嘴唱歌", words: ["唱歌"] },
      { z: "子", s: "子", jy: "zi2", hint: "孩子、叶子", words: ["孩子", "鼻子"] },
      { z: "七", s: "七", jy: "cat1", hint: "七个", words: ["七天", "七月"] },
    ],
    phrases: ["花草", "小草", "草地", "樹葉", "一日", "大風", "大雨", "小雨", "下雨", "風雨", "雨水", "我的", "六月", "六日", "六天"],
    sentences: [
      "天上有明亮的太陽和月亮。",
      "我有爸爸和媽媽。",
      "明日有大風，下大雨。",
      "石頭上有小草和小花。",
    ],
  },
  {
    id: 8,
    title: "第八課",
    chars: [
      { z: "愛", s: "爱", jy: "oi3", hint: "抱抱", words: ["愛笑", "不愛"] },
      { z: "爺", s: "爷", jy: "je4", hint: "爸爸的爸爸", words: ["爺爺"] },
      { z: "奶", s: "奶", jy: "naai5", hint: "爸爸的妈妈", words: ["奶奶"] },
      { z: "少", s: "少", jy: "siu2", hint: "一点点", words: ["多少"] },
      { z: "歌", s: "歌", jy: "go1", hint: "唱的歌", words: ["唱歌", "兒歌"] },
      { z: "不", s: "不", jy: "bat1", hint: "摇头（口語常說「唔」）", words: ["不是", "不哭"] },
      { z: "朋", s: "朋", jy: "pang4", hint: "两个月在一起", words: ["朋友"] },
      { z: "入", s: "入", jy: "jap6", hint: "走进去", words: ["入"] },
    ],
    phrases: ["白雲", "白天", "明白", "紅花", "紅日", "火紅", "火花", "是的", "我是", "大家", "我家", "人家", "鼻子", "葉子", "七月", "七日", "七天", "紅太陽"],
    sentences: [
      "我是爸爸、媽媽的好孩子。",
      "天是太陽、月亮、星星的家。",
      "白天，天上有紅太陽；地上有紅花、白花和小草。",
      "爺爺、奶奶家有大水牛和小山羊。",
    ],
  },
  {
    id: 9,
    title: "第九課",
    chars: [
      { z: "寶", s: "宝", jy: "bou2", hint: "家里的宝贝", words: ["寶寶"] },
      { z: "在", s: "在", jy: "zoi6", hint: "在家、在这", words: ["在家", "不在"] },
      { z: "學", s: "学", jy: "hok6", hint: "去学校", words: ["上學", "學習"] },
      { z: "書", s: "书", jy: "syu1", hint: "翻开的书", words: ["看書"] },
      { z: "游", s: "游", jy: "jau4", hint: "在水里游", words: ["游水"] },
      { z: "友", s: "友", jy: "jau5", hint: "好朋友", words: ["朋友"] },
      { z: "兒", s: "儿", jy: "ji4", hint: "花儿、儿子", words: ["花兒", "兒子"] },
      { z: "九", s: "九", jy: "gau2", hint: "九个", words: ["九天", "九月"] },
    ],
    phrases: ["爺爺", "奶奶", "多少", "唱歌", "愛笑", "愛哭", "愛唱", "不愛", "不哭", "不笑", "不唱", "不是", "是不是", "好不好", "不好", "八日", "八月", "八天"],
    sentences: [
      "明天多雲，有小雨。",
      "聰聰愛唱歌。",
      "我家有爺爺、奶奶、爸爸、媽媽和我。",
      "爺爺愛我，奶奶愛我，爸爸愛我，媽媽愛我。",
      "我愛爺爺，我愛奶奶，我愛爸爸，我愛媽媽。",
    ],
  },
  {
    id: 10,
    title: "第十課",
    chars: [
      { z: "貝", s: "贝", jy: "bui3", hint: "宝贝的贝", words: ["寶貝"] },
      { z: "生", s: "生", jy: "sang1", hint: "学生、生气", words: ["學生", "生氣"] },
      { z: "習", s: "习", jy: "zaap6", hint: "练习", words: ["學習"] },
      { z: "看", s: "看", jy: "hon3", hint: "用手遮眼看", words: ["看書", "看戲"] },
      { z: "戲", s: "戏", jy: "hei3", hint: "看戏、游戏", words: ["看戲", "遊戲"] },
      { z: "字", s: "字", jy: "zi6", hint: "我们认的字", words: ["生字"] },
      { z: "氣", s: "气", jy: "hei3", hint: "生不生气", words: ["生氣"] },
      { z: "十", s: "十", jy: "sap6", hint: "十字", words: ["十天", "十月"] },
    ],
    phrases: ["寶寶", "在家", "不在", "游水", "朋友", "友人", "花兒", "兒子", "兒歌", "歌兒", "九日", "九月", "九天"],
    sentences: [
      "我是寶寶，我在家愛唱兒歌。",
      "我不愛哭，我愛笑。",
      "我的好朋友是聰聰。",
      "爸爸和兒子玩遊戲。",
    ],
  },
  {
    id: 11,
    title: "課後複習",
    chars: [],
    phrases: [
      "寶貝", "學習", "上學", "看書", "看戲", "游戲", "生字", "生氣", "氣人",
      "十月", "十日", "十天", "好孩子", "小朋友", "下雨天", "好朋友",
      "小學生", "中學生", "大學生", "唱兒歌", "小紅花",
    ],
    sentences: [
      "小寶是愛學習的好孩子",
      "爺爺愛看書，奶奶愛看戲，爸爸愛看書，媽媽愛唱歌。",
      "我愛爺爺、奶奶、爸爸和媽媽。我是大家的好寶貝。",
      "心心和小葉子是好朋友。",
      "我愛看書，我愛學習。我是聰明的孩子。",
      "下雨天，我和明明在我家看書。",
      "天上有太陽、月亮、星星和白雲；地上有土、石、山、水、花和樹木。",
      "不愛生氣、不愛哭的孩子是好孩子。我愛笑，我是好孩子。",
      "我的好朋友聰聰是小學生，聰聰天天上學。",
      "爸爸的爸爸是爺爺。爸爸是爺爺的兒子，我是爸爸的兒子。",
    ],
  },
];

function allChars() {
  return LESSONS.flatMap((lesson) =>
    lesson.chars.map((item) => ({ ...item, kind: "char", speak: item.z, lesson: lesson.id }))
  );
}

function selectedLessons(filter) {
  if (filter === "mix" || filter === "review") return LESSONS;
  const lesson = LESSONS.find((item) => item.id === Number(filter));
  return lesson ? [lesson] : LESSONS;
}

function lessonsUpTo(filter) {
  if (filter === "mix" || filter === "review") return LESSONS;
  const id = Number(filter);
  return LESSONS.filter((lesson) => lesson.id <= id);
}

function allBookPhrases(filter) {
  const unique = [];
  lessonsUpTo(filter).forEach((lesson) => {
    (lesson.phrases || []).forEach((phrase) => {
      if (!unique.includes(phrase)) unique.push(phrase);
    });
  });
  return unique.sort((a, b) => b.length - a.length);
}

function taughtChars(filter) {
  const set = new Set();
  lessonsUpTo(filter).forEach((lesson) => {
    lesson.chars.forEach((item) => set.add(item.z));
  });
  return set;
}

function phrasesForChar(z) {
  return LESSONS.flatMap((lesson) => lesson.phrases || []).filter((phrase) => phrase.includes(z));
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightHtml(text, filter) {
  const phrases = allBookPhrases(filter);
  const chars = taughtChars(filter);
  let html = "";
  let i = 0;
  while (i < text.length) {
    let hit = "";
    for (let p = 0; p < phrases.length; p += 1) {
      if (text.startsWith(phrases[p], i)) {
        hit = phrases[p];
        break;
      }
    }
    if (hit) {
      html += `<span class="kw">${escapeHtml(hit)}</span>`;
      i += hit.length;
    } else if (chars.has(text[i])) {
      html += `<span class="kw">${escapeHtml(text[i])}</span>`;
      i += 1;
    } else {
      html += escapeHtml(text[i]);
      i += 1;
    }
  }
  return html;
}

function toSimplified(text) {
  const map = {};
  LESSONS.forEach((lesson) => {
    lesson.chars.forEach((item) => {
      map[item.z] = item.s;
    });
  });
  return [...text].map((ch) => map[ch] || ch).join("");
}

function wrapText(text, kind, lessonId) {
  return {
    kind,
    z: text,
    s: toSimplified(text),
    speak: text,
    jy: "",
    html: kind === "sentence" ? highlightHtml(text, lessonId) : escapeHtml(text),
    hint: kind === "word" ? "把字连起来，用广东话读" : "金黄色的是这一课要抓住的词和字",
    words: kind === "word" ? [text] : [],
    lesson: lessonId,
  };
}

function itemsFor(filter, stage) {
  if (stage === "char") {
    return selectedLessons(filter).flatMap((lesson) =>
      lesson.chars.map((item) => ({ ...item, kind: "char", speak: item.z, lesson: lesson.id }))
    );
  }
  const key = stage === "word" ? "phrases" : "sentences";
  const kind = stage === "word" ? "word" : "sentence";
  return selectedLessons(filter).flatMap((lesson) =>
    (lesson[key] || []).map((text) => wrapText(text, kind, lesson.id))
  );
}

function lessonHasStage(filter, stage) {
  return itemsFor(filter, stage).length > 0;
}

function pickItem(filter, stage, avoid) {
  const pool = itemsFor(filter, stage).filter((item) => item.z !== avoid);
  return pool[Math.floor(Math.random() * pool.length)] || itemsFor(filter, stage)[0];
}

function pickChoices(target, filter, stage) {
  const pool = itemsFor(filter, stage).filter((item) => item.z !== target.z);
  const want = target.kind === "sentence" ? 2 : 3;
  const distractors = shuffle(pool).slice(0, want);
  return shuffle([target, ...distractors]);
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function stripJyutping(jy) {
  return String(jy).replace(/[1-6]/g, "").toLowerCase();
}

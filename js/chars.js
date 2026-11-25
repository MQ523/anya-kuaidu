const LESSONS = [
  {
    id: 1,
    title: "第一課",
    chars: [
      { z: "天", s: "天", py: "tiān", hint: "抬头看外面", words: ["天上", "一天"] },
      { z: "太", s: "太", py: "tài", hint: "比「大」多一点", words: ["太大", "太小"] },
      { z: "月", s: "月", py: "yuè", hint: "晚上那一轮", words: ["一月", "二月"] },
      { z: "二", s: "二", py: "èr", hint: "两横", words: ["二月"] },
      { z: "人", s: "人", py: "rén", hint: "两腿分开站", words: ["大人", "小人"] },
      { z: "口", s: "口", py: "kǒu", hint: "方方的嘴巴", words: ["大口", "小口"] },
      { z: "大", s: "大", py: "dà", hint: "张开双臂", words: ["大人", "大哭"] },
      { z: "中", s: "中", py: "zhōng", hint: "口里插一竖", words: ["中"] },
      { z: "小", s: "小", py: "xiǎo", hint: "蹲下来就变小", words: ["小人", "小口"] },
      { z: "哭", s: "哭", py: "kū", hint: "做哭脸", words: ["大哭"] },
      { z: "笑", s: "笑", py: "xiào", hint: "做笑脸", words: ["大笑"] },
      { z: "一", s: "一", py: "yī", hint: "一条横线", words: ["一天"] },
      { z: "上", s: "上", py: "shàng", hint: "手举高", words: ["天上"] },
      { z: "下", s: "下", py: "xià", hint: "指地板", words: ["上下"] },
      { z: "爸", s: "爸", py: "bà", hint: "指爸爸", words: ["爸爸"] },
      { z: "媽", s: "妈", py: "mā", hint: "指妈妈", words: ["媽媽"] },
    ],
  },
  {
    id: 2,
    title: "第二課",
    chars: [
      { z: "地", s: "地", py: "dì", hint: "脚下踩的", words: ["地上"] },
      { z: "陽", s: "阳", py: "yáng", hint: "白天那个火球", words: ["太陽"] },
      { z: "亮", s: "亮", py: "liàng", hint: "灯打开了", words: ["月亮"] },
      { z: "星", s: "星", py: "xīng", hint: "夜里一闪一闪", words: ["星星"] },
      { z: "雲", s: "云", py: "yún", hint: "天上软软的", words: ["白雲"] },
      { z: "火", s: "火", py: "huǒ", hint: "烫烫的", words: ["大火"] },
      { z: "水", s: "水", py: "shuǐ", hint: "可以喝的", words: ["大水"] },
      { z: "三", s: "三", py: "sān", hint: "三横", words: ["三天", "三月"] },
    ],
  },
  {
    id: 3,
    title: "第三課",
    chars: [
      { z: "土", s: "土", py: "tǔ", hint: "地上的泥", words: ["土地"] },
      { z: "山", s: "山", py: "shān", hint: "三座尖尖", words: ["大山", "小山"] },
      { z: "石", s: "石", py: "shí", hint: "硬硬的石头", words: ["石山"] },
      { z: "木", s: "木", py: "mù", hint: "一棵树的样子", words: ["木星"] },
      { z: "我", s: "我", py: "wǒ", hint: "指自己", words: ["我有", "我爸"] },
      { z: "好", s: "好", py: "hǎo", hint: "竖大拇指", words: ["好人", "好山"] },
      { z: "有", s: "有", py: "yǒu", hint: "手里拿着", words: ["我有"] },
      { z: "田", s: "田", py: "tián", hint: "四块格子", words: ["水田", "田地"] },
    ],
  },
  {
    id: 4,
    title: "第四課",
    chars: [
      { z: "牛", s: "牛", py: "niú", hint: "哞哞叫", words: ["大牛", "小牛"] },
      { z: "羊", s: "羊", py: "yáng", hint: "咩咩叫", words: ["山羊", "小羊"] },
      { z: "聰", s: "聪", py: "cōng", hint: "耳朵灵", words: ["聰明"] },
      { z: "耳", s: "耳", py: "ěr", hint: "指耳朵", words: ["耳"] },
      { z: "目", s: "目", py: "mù", hint: "指眼睛", words: ["目"] },
      { z: "心", s: "心", py: "xīn", hint: "拍胸口", words: ["小心", "心中"] },
      { z: "和", s: "和", py: "hé", hint: "还有、一起", words: ["和"] },
      { z: "四", s: "四", py: "sì", hint: "四个", words: ["四天", "四月"] },
    ],
  },
  {
    id: 5,
    title: "第五課",
    chars: [
      { z: "明", s: "明", py: "míng", hint: "日加月", words: ["明亮", "明天"] },
      { z: "頭", s: "头", py: "tóu", hint: "指脑袋", words: ["石頭", "木頭"] },
      { z: "眉", s: "眉", py: "méi", hint: "眼睛上面", words: ["眉頭"] },
      { z: "鼻", s: "鼻", py: "bí", hint: "指鼻子", words: ["鼻子", "鼻頭"] },
      { z: "手", s: "手", py: "shǒu", hint: "伸出小手", words: ["小手", "手心"] },
      { z: "花", s: "花", py: "huā", hint: "香香的", words: ["小花"] },
      { z: "樹", s: "树", py: "shù", hint: "高高的", words: ["大樹", "小樹"] },
      { z: "五", s: "五", py: "wǔ", hint: "五个", words: ["五天", "五月"] },
    ],
  },
  {
    id: 6,
    title: "第六課",
    chars: [
      { z: "草", s: "草", py: "cǎo", hint: "地上绿绿的", words: ["小草", "草地"] },
      { z: "葉", s: "叶", py: "yè", hint: "树上的小片", words: ["樹葉", "葉子"] },
      { z: "日", s: "日", py: "rì", hint: "太阳，也是天", words: ["一日"] },
      { z: "風", s: "风", py: "fēng", hint: "呼呼吹", words: ["大風"] },
      { z: "雨", s: "雨", py: "yǔ", hint: "从天上掉下来", words: ["大雨", "小雨"] },
      { z: "的", s: "的", py: "de", hint: "我的、你的", words: ["我的"] },
      { z: "孩", s: "孩", py: "hái", hint: "小朋友", words: ["孩子"] },
      { z: "六", s: "六", py: "liù", hint: "六个", words: ["六天", "六月"] },
    ],
  },
  {
    id: 7,
    title: "第七課",
    chars: [
      { z: "白", s: "白", py: "bái", hint: "白云的颜色", words: ["白雲", "白天"] },
      { z: "紅", s: "红", py: "hóng", hint: "红花的颜色", words: ["紅花", "紅日"] },
      { z: "是", s: "是", py: "shì", hint: "我是……", words: ["我是", "是的"] },
      { z: "家", s: "家", py: "jiā", hint: "我们住的地方", words: ["我家", "大家"] },
      { z: "多", s: "多", py: "duō", hint: "好多好多", words: ["多少"] },
      { z: "唱", s: "唱", py: "chàng", hint: "张嘴唱歌", words: ["唱歌"] },
      { z: "子", s: "子", py: "zi", hint: "孩子、叶子", words: ["孩子", "鼻子"] },
      { z: "七", s: "七", py: "qī", hint: "七个", words: ["七天", "七月"] },
    ],
  },
  {
    id: 8,
    title: "第八課",
    chars: [
      { z: "愛", s: "爱", py: "ài", hint: "抱抱", words: ["愛笑", "不愛"] },
      { z: "爺", s: "爷", py: "yé", hint: "爸爸的爸爸", words: ["爺爺"] },
      { z: "奶", s: "奶", py: "nǎi", hint: "爸爸的妈妈", words: ["奶奶"] },
      { z: "少", s: "少", py: "shǎo", hint: "一点点", words: ["多少"] },
      { z: "歌", s: "歌", py: "gē", hint: "唱的歌", words: ["唱歌", "兒歌"] },
      { z: "不", s: "不", py: "bù", hint: "摇头", words: ["不是", "不哭"] },
      { z: "朋", s: "朋", py: "péng", hint: "两个月在一起", words: ["朋友"] },
      { z: "入", s: "入", py: "rù", hint: "走进去", words: ["入"] },
    ],
  },
  {
    id: 9,
    title: "第九課",
    chars: [
      { z: "寶", s: "宝", py: "bǎo", hint: "家里的宝贝", words: ["寶寶"] },
      { z: "在", s: "在", py: "zài", hint: "在家、在这", words: ["在家", "不在"] },
      { z: "學", s: "学", py: "xué", hint: "去学校", words: ["上學", "學習"] },
      { z: "書", s: "书", py: "shū", hint: "翻开的书", words: ["看書"] },
      { z: "游", s: "游", py: "yóu", hint: "在水里游", words: ["游水"] },
      { z: "友", s: "友", py: "yǒu", hint: "好朋友", words: ["朋友"] },
      { z: "兒", s: "儿", py: "ér", hint: "花儿、儿子", words: ["花兒", "兒子"] },
      { z: "九", s: "九", py: "jiǔ", hint: "九个", words: ["九天", "九月"] },
    ],
  },
  {
    id: 10,
    title: "第十課",
    chars: [
      { z: "貝", s: "贝", py: "bèi", hint: "宝贝的贝", words: ["寶貝"] },
      { z: "生", s: "生", py: "shēng", hint: "学生、生气", words: ["學生", "生氣"] },
      { z: "習", s: "习", py: "xí", hint: "练习", words: ["學習"] },
      { z: "看", s: "看", py: "kàn", hint: "用手遮眼看", words: ["看書", "看戲"] },
      { z: "戲", s: "戏", py: "xì", hint: "看戏、游戏", words: ["看戲", "遊戲"] },
      { z: "字", s: "字", py: "zì", hint: "我们认的字", words: ["生字"] },
      { z: "氣", s: "气", py: "qì", hint: "生不生气", words: ["生氣"] },
      { z: "十", s: "十", py: "shí", hint: "十字", words: ["十天", "十月"] },
    ],
  },
];

function allChars() {
  return LESSONS.flatMap((lesson) =>
    lesson.chars.map((item) => ({ ...item, lesson: lesson.id }))
  );
}

function charsForFilter(filter) {
  if (filter === "mix" || filter === "review") return allChars();
  const lesson = LESSONS.find((item) => item.id === Number(filter));
  return (lesson ? lesson.chars : allChars()).map((item) => ({
    ...item,
    lesson: lesson ? lesson.id : item.lesson,
  }));
}

function pickChar(filter, avoid) {
  const pool = charsForFilter(filter).filter((item) => item.z !== avoid);
  return pool[Math.floor(Math.random() * pool.length)] || charsForFilter(filter)[0];
}

function pickChoices(target, filter) {
  const pool = charsForFilter(filter).filter((item) => item.z !== target.z);
  const distractors = shuffle(pool).slice(0, 3);
  while (distractors.length < 3) {
    const extra = allChars().find((item) => item.z !== target.z && !distractors.some((d) => d.z === item.z));
    if (!extra) break;
    distractors.push(extra);
  }
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

function stripTone(py) {
  return py
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ü/g, "v")
    .toLowerCase();
}

const Pics = (() => {
  const WORD = {
    大人: "b1p06_00.jpg",
    小人: "b1p06_02.jpg",
    大哭: "b1p06_03.jpg",
    小口: "b1p06_04.jpg",
    大笑: "b1p06_05.jpg",
    大口: "b1p06_06.jpg",
    爸爸: "b1p09_00.jpg",
    上天: "b1p09_01.jpg",
    媽媽: "b1p09_02.jpg",
    太大: "b1p09_04.jpg",
    太小: "b1p09_04.jpg",
    天上: "b1p09_05.jpg",
    一天: "b1p09_05.jpg",
    大水: "b1p12_00.jpg",
    太陽: "b1p12_01.jpg",
    天亮: "b1p12_01.jpg",
    大火: "b1p12_03.jpg",
    火星: "b1p12_04.jpg",
    大山: "b1p15_00.jpg",
    小山: "b1p15_00.jpg",
    石山: "b1p15_01.jpg",
    田地: "b1p15_02.jpg",
    土地: "b1p15_02.jpg",
    水田: "b1p15_03.jpg",
    好山好水: "b1p15_04.jpg",
    火山: "b1p15_06.jpg",
    土星: "b1p15_07.jpg",
    我爸: "b1p15_08.jpg",
    我媽: "b1p15_08.jpg",
    好人: "b1p15_08.jpg",
    我笑: "b1p15_09.jpg",
    我哭: "b1p15_10.jpg",
    大牛: "b1p21_00.jpg",
    小牛: "b1p21_00.jpg",
    水牛: "b1p21_01.jpg",
    山羊: "b1p21_02.jpg",
    小羊: "b1p21_04.jpg",
    明天: "b1p26_00.jpg",
    明亮: "b1p26_00.jpg",
    明月: "b1p32_05.jpg",
    白雲: "b1p26_01.jpg",
    小花: "b1p26_02.jpg",
    紅花: "b1p36_03.jpg",
    石頭: "b1p26_03.jpg",
    大樹: "b1p26_04.jpg",
    小樹: "b1p26_04.jpg",
    樹木: "b1p26_04.jpg",
    鼻頭: "b1p26_05.jpg",
    鼻子: "b1p26_05.jpg",
    木頭: "b1p26_07.jpg",
    小草: "b1p30_00.jpg",
    草地: "b1p30_03.jpg",
    花草: "b1p30_06.jpg",
    樹葉: "b1p30_05.jpg",
    葉子: "b1p30_05.jpg",
    下雨: "b1p32_00.jpg",
    大雨: "b1p32_00.jpg",
    小雨: "b1p32_00.jpg",
    風雨: "b1p32_00.jpg",
    紅日: "b1p32_04.jpg",
    紅太陽: "b1p32_04.jpg",
    月亮: "b1p32_05.jpg",
    我家: "b1p32_06.jpg",
    大家: "b1p32_06.jpg",
    火花: "b1p36_01.jpg",
    朋友: "b1p36_04.jpg",
    唱歌: "b2p07_00.jpg",
    上學: "b2p07_04.jpg",
    學習: "b2p07_04.jpg",
    看書: "b2p07_03.jpg",
    飛: "b2p11_00.jpg",
    小鳥: "b2p11_00.jpg",
    遊戲: "b2p11_03.jpg",
    黃牛: "b2p11_04.jpg",
    吃飯: "b2p11_05.jpg",
    雪人: "b2p17_00.jpg",
    白雪: "b2p17_00.jpg",
    大雪: "b2p17_00.jpg",
    小貓: "b2p43_00.jpg",
    小狗: "b2p43_00.jpg",
    小雞: "b3p10_00.jpg",
    小鴨: "b3p10_00.jpg",
    小鵝: "b3p10_00.jpg",
    拔蘿蔔: "b4p38_00.jpg",
    蘿蔔: "b4p38_00.jpg",
    狼來了: "b4p20_00.jpg",
    獅子: "b5p12_00.jpg",
    老鼠: "b5p12_00.jpg",
    汽車: "b5p58_00.jpg",
    火車: "b5p58_00.jpg",
  };

  const CHAR = {
    人: "b1p06_00.jpg",
    大: "b1p06_00.jpg",
    小: "b1p06_02.jpg",
    哭: "b1p06_03.jpg",
    口: "b1p06_06.jpg",
    笑: "b1p06_05.jpg",
    爸: "b1p09_00.jpg",
    媽: "b1p09_02.jpg",
    上: "b1p09_01.jpg",
    下: "b1p09_03.jpg",
    太: "b1p09_04.jpg",
    天: "b1p09_05.jpg",
    雲: "b1p09_05.jpg",
    水: "b1p12_00.jpg",
    陽: "b1p12_01.jpg",
    日: "b1p32_04.jpg",
    火: "b1p12_03.jpg",
    星: "b1p12_04.jpg",
    山: "b1p15_00.jpg",
    石: "b1p15_01.jpg",
    田: "b1p15_02.jpg",
    地: "b1p15_04.jpg",
    土: "b1p15_02.jpg",
    牛: "b1p21_00.jpg",
    羊: "b1p21_04.jpg",
    花: "b1p26_02.jpg",
    樹: "b1p26_04.jpg",
    木: "b1p26_07.jpg",
    鼻: "b1p26_05.jpg",
    草: "b1p30_00.jpg",
    葉: "b1p30_05.jpg",
    雨: "b1p32_00.jpg",
    風: "b1p30_01.jpg",
    月: "b1p32_05.jpg",
    家: "b1p32_06.jpg",
    紅: "b1p36_03.jpg",
    白: "b1p26_01.jpg",
    朋: "b1p36_04.jpg",
    友: "b1p36_04.jpg",
    歌: "b2p07_00.jpg",
    唱: "b2p07_00.jpg",
    學: "b2p07_04.jpg",
    習: "b2p07_04.jpg",
    書: "b2p07_03.jpg",
    看: "b2p07_03.jpg",
    鳥: "b2p11_00.jpg",
    飛: "b2p11_00.jpg",
    雞: "b3p10_00.jpg",
    鴨: "b3p10_00.jpg",
    鵝: "b3p10_00.jpg",
    魚: "b3p10_00.jpg",
    貓: "b2p43_00.jpg",
    狗: "b2p43_00.jpg",
    雪: "b2p17_00.jpg",
    狼: "b4p20_00.jpg",
    獅: "b5p12_00.jpg",
    鼠: "b5p12_00.jpg",
    蘿: "b4p38_00.jpg",
    蔔: "b4p38_00.jpg",
    車: "b5p58_00.jpg",
    心: "b1p15_08.jpg",
  };

  const SENTENCE = {
    "我有好爸爸、好媽媽。": ["b1p17_04.jpg"],
    "天上有太陽、月亮、星星。": ["b1p17_00.jpg", "b1p17_03.jpg"],
    "地上有土、石、山、水田。": ["b1p17_01.jpg"],
    "爸爸上山，媽媽下山。": ["b1p17_02.jpg", "b1p17_05.jpg"],
  };

  function src(name) {
    return `pics/${name}`;
  }

  function filesFor(item) {
    if (!item) return [];
    if (item.kind === "sentence" && SENTENCE[item.z]) return SENTENCE[item.z].map(src);
    if (item.kind === "word" && WORD[item.z]) return [src(WORD[item.z])];
    if (item.kind === "char" && CHAR[item.z]) return [src(CHAR[item.z])];
    if (item.kind === "char") {
      const hit = Object.keys(WORD)
        .filter((word) => word.includes(item.z))
        .sort((a, b) => a.length - b.length)[0];
      return hit ? [src(WORD[hit])] : [];
    }
    const files = [];
    const seen = new Set();
    const keys = Object.keys(WORD).sort((a, b) => b.length - a.length);
    let rest = item.z || "";
    keys.forEach((word) => {
      if (files.length >= 3) return;
      if (rest.includes(word) && !seen.has(WORD[word])) {
        seen.add(WORD[word]);
        files.push(src(WORD[word]));
        rest = rest.split(word).join(" ");
      }
    });
    if (!files.length) {
      for (const ch of item.z || "") {
        if (CHAR[ch] && !seen.has(CHAR[ch])) {
          seen.add(CHAR[ch]);
          files.push(src(CHAR[ch]));
        }
        if (files.length >= 3) break;
      }
    }
    return files;
  }

  function html(item, extraClass) {
    const files = filesFor(item);
    if (!files.length) return "";
    const imgs = files
      .map((file) => `<img class="pic-art" src="${file}" alt="" draggable="false">`)
      .join("");
    return `<div class="pic-stage ${extraClass || ""}">${imgs}</div>`;
  }

  return { html, filesFor };
})();

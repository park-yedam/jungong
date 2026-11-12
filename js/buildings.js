// 우리 회사 단지 건물 도트 그림: 작은 격자(1칸 = 점 하나)에 그린 뒤 그림(PNG)으로 바꿔 두고, 화면에서는 키워서 보여 준다.
// 아늑한 마을 분위기로, 단지 전용 색(PALETTE)만 쓴다. 모든 건물이 같은 규칙(외곽선, 윗줄 빛, 오른쪽 그늘, 같은 창문)을 따른다.
(() => {
  const JG = globalThis.JG;

  // 단지 전용 색 13가지 (건물·시설 모두 이것만)
  const C = {
    O: '#3B2A20', white: '#FBF6EA', cream: '#F1E4C8', sand: '#D9C4A0', sandD: '#B79E7A',
    terra: '#B4583E', terraD: '#8A4130', slate: '#6F8B94', slateD: '#4F6870',
    win: '#F6D27A', wood: '#8B5A2B', sage: '#7A9A62', glass: '#A9C6CF'
  };
  // 재료: [바탕, 윗줄 빛, 오른쪽 그늘]
  const MAT = {
    white: [C.white, C.white, C.cream], cream: [C.cream, C.white, C.sand], sand: [C.sand, C.cream, C.sandD],
    terra: [C.terra, C.terra, C.terraD], slate: [C.slate, C.glass, C.slateD], glass: [C.glass, C.white, C.slate],
    wood: [C.wood, C.wood, C.terraD], sage: [C.sage, C.sage, C.slateD], dark: [C.slateD, C.slate, C.O]
  };

  // 그림판: w × h 칸. 아래쪽이 땅
  function Pic(w, h) {
    const g = Array.from({ length: h }, () => new Array(w).fill(null));
    const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < w && y < h) g[y][x] = c; };
    const p = {
      w, h, g,
      px(x, y, c) { set(x, y, c); return p; },
      fill(x, y, ww, hh, c) { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) set(x + i, y + j, c); return p; },
      // 외곽선 상자 (재료 이름): 윗줄은 밝게, 오른쪽 줄은 어둡게
      box(x, y, ww, hh, m) {
        const [base, hi, lo] = MAT[m];
        p.fill(x, y, ww, hh, C.O).fill(x + 1, y + 1, ww - 2, hh - 2, base);
        if (hh > 3) p.fill(x + 1, y + 1, ww - 2, 1, hi);
        if (ww > 3) p.fill(x + ww - 2, y + 2, 1, hh - 3, lo);
        return p;
      },
      // 창문: 모든 건물이 같은 창 (외곽선 + 불빛 + 왼쪽 위 반짝임)
      win(x, y, ww, hh) { p.fill(x, y, ww || 4, hh || 5, C.O).fill(x + 1, y + 1, (ww || 4) - 2, (hh || 5) - 2, C.win).px(x + 1, y + 1, C.white); return p; },
      wins(xs, ys, ww, hh) { xs.forEach(x => ys.forEach(y => p.win(x, y, ww, hh))); return p; },
      door(x, y, ww, hh) { p.box(x, y, ww || 5, hh || 8, 'wood'); return p; },
      // 박공 지붕: 가운데 cx, 처마 높이 eave(아래 끝 줄), 처마 폭 ww. 한 줄 오를 때마다 양쪽 1칸씩 좁아짐
      gable(cx, eave, ww, m) {
        const [base, , lo] = MAT[m];
        for (let k = 0; ; k++) {
          const half = Math.floor(ww / 2) - k, y = eave - k;
          if (half < 1) break;
          p.fill(cx - half, y, half * 2, 1, k === 0 ? lo : base).px(cx - half, y, C.O).px(cx + half - 1, y, C.O);
          if (half === 1 || k === Math.floor(ww / 2) - 1) p.fill(cx - half, y - 1, half * 2, 1, C.O);
        }
        p.fill(cx - Math.floor(ww / 2), eave + 1, Math.floor(ww / 2) * 2, 1, C.O);
        return p;
      },
      // 셔터 문: 가로 줄
      shutter(x, y, ww, hh, m) { const [base, , lo] = MAT[m]; p.fill(x, y, ww, hh, C.O); for (let j = 1; j < hh; j++) p.fill(x + 1, y + j, ww - 2, 1, j % 3 === 0 ? lo : base); return p; }
    };
    return p;
  }

  // ---------- 건물 17종 (현장 5 + 데일리 12): 실루엣과 표시 하나로 알아보게 ----------
  const DESIGNS = {
    house() {   // 박공지붕 집
      const p = Pic(36, 32);
      p.box(25, 2, 4, 9, 'slate');
      p.gable(18, 13, 36, 'terra');
      p.box(4, 14, 28, 18, 'cream').wins([8, 23], [17], 5, 5).door(15, 24, 6, 8);
      return p;
    },
    retail() {   // 1층 가게(유리창·차양) + 위층
      const p = Pic(40, 42);
      p.box(1, 0, 38, 4, 'terra').box(2, 3, 36, 39, 'sand');
      p.wins([7, 18, 29], [7, 16], 5, 6);
      p.box(1, 24, 38, 4, 'terra');
      p.box(5, 29, 22, 13, 'glass').door(29, 31, 6, 11);
      return p;
    },
    apart() {   // 5층 아파트, 층마다 난간
      const p = Pic(40, 56);
      p.box(1, 0, 38, 4, 'slate').box(2, 3, 36, 53, 'cream');
      for (let f = 0; f < 5; f++) {
        const y = 6 + f * 9;
        p.wins([7, 18, 29], [y], 5, 5);
        if (f < 4) p.fill(5, y + 6, 30, 1, C.slate);
      }
      p.door(17, 48, 6, 8);
      return p;
    },
    warehouse() {   // 넓고 낮은 물류창고, 셔터 문 둘
      const p = Pic(56, 28);
      p.box(0, 0, 56, 4, 'slate').box(2, 3, 52, 25, 'sand');
      p.fill(6, 7, 44, 3, C.O).fill(7, 8, 42, 1, C.glass);
      p.shutter(7, 13, 16, 15, 'slate').shutter(33, 13, 16, 15, 'slate');
      return p;
    },
    office() {   // 유리 오피스 타워
      const p = Pic(32, 58);
      p.fill(15, 0, 2, 5, C.slateD);
      p.box(3, 4, 26, 54, 'glass');
      for (let y = 9; y < 50; y += 5) p.fill(4, y, 24, 1, C.slate);
      for (let x = 9; x < 28; x += 6) p.fill(x, 5, 1, 45, C.slate);
      p.box(11, 50, 10, 8, 'dark');
      return p;
    },

    school() {   // 가운데 시계탑
      const p = Pic(44, 40);
      p.gable(22, 7, 14, 'terra');
      p.box(15, 7, 14, 12, 'cream').box(19, 9, 6, 6, 'white').px(21, 11, C.O).px(22, 11, C.O).px(21, 12, C.O);
      p.box(0, 16, 44, 4, 'terra').box(2, 19, 40, 21, 'cream');
      p.wins([6, 13, 26, 33], [22], 5, 5).wins([6, 33], [31], 5, 5).door(19, 31, 6, 9);
      return p;
    },
    hospital() {   // 하얀 건물, 십자 표시
      const p = Pic(38, 44);
      p.box(1, 0, 36, 4, 'slate').box(2, 3, 34, 41, 'white');
      p.fill(17, 6, 4, 10, C.terra).fill(14, 9, 10, 4, C.terra);
      p.wins([6, 28], [7], 4, 5).wins([6, 13, 21, 28], [20, 28], 4, 5);
      p.box(13, 36, 12, 8, 'glass');
      return p;
    },
    library() {   // 박공 지붕과 기둥
      const p = Pic(44, 34);
      p.gable(22, 9, 44, 'sand');
      p.box(2, 9, 40, 4, 'sand');
      [5, 13, 27, 35].forEach(x => p.box(x, 13, 4, 16, 'cream'));
      p.door(19, 18, 6, 11);
      p.box(0, 28, 44, 3, 'sand').box(0, 30, 44, 4, 'sand');
      return p;
    },
    daycare() {   // 낮은 2층, 작은 지붕 둘
      const p = Pic(40, 28);
      p.gable(10, 9, 20, 'terra').gable(30, 9, 20, 'sage');
      p.box(1, 10, 38, 18, 'cream').wins([6, 29], [14], 5, 5).door(17, 19, 6, 9);
      return p;
    },
    gym() {   // 둥근 지붕의 넓은 체육관
      const p = Pic(52, 28);
      [[4, 44], [2, 48], [0, 52]].forEach(([y, w], k) => p.fill(26 - w / 2, y + k * 2, w, 3, C.O).fill(27 - w / 2, y + k * 2 + 1, w - 2, 1, k === 2 ? C.slateD : C.sage));
      p.box(2, 10, 48, 18, 'sand');
      p.fill(6, 13, 40, 5, C.O).fill(7, 14, 38, 3, C.glass); for (let x = 12; x < 45; x += 6) p.fill(x, 14, 1, 3, C.O);
      p.door(23, 20, 6, 8);
      return p;
    },
    center() {   // 깃대 있는 주민센터
      const p = Pic(40, 42);
      p.fill(36, 0, 1, 42, C.slateD).box(31, 1, 6, 5, 'terra');
      p.box(0, 12, 33, 30, 'white');
      p.box(6, 15, 21, 4, 'slate');
      p.wins([5, 14, 23], [22], 5, 5).box(13, 33, 7, 9, 'glass');
      return p;
    },
    officetel() {   // 좁고 높은 오피스텔
      const p = Pic(28, 50);
      p.box(1, 0, 26, 4, 'dark').box(2, 3, 24, 47, 'sand');
      for (let r = 0; r < 6; r++) p.wins([7, 16], [6 + r * 7], 5, 5);
      p.door(11, 43, 6, 7);
      return p;
    },
    lab() {   // 띠창과 옥상 설비
      const p = Pic(42, 34);
      p.box(6, 0, 9, 5, 'slate');
      p.box(1, 4, 40, 30, 'white');
      p.fill(5, 8, 32, 5, C.O).fill(6, 9, 30, 3, C.glass);
      p.fill(5, 16, 32, 5, C.O).fill(6, 17, 30, 3, C.glass);
      p.box(17, 25, 8, 9, 'glass');
      return p;
    },
    mall() {   // 간판 하나, 넓은 상가
      const p = Pic(44, 40);
      p.box(0, 0, 44, 4, 'slate').box(1, 3, 42, 37, 'cream');
      p.box(10, 6, 24, 5, 'terra');
      p.wins([5, 14, 25, 34], [14, 22], 5, 5);
      p.box(4, 30, 36, 10, 'glass').fill(21, 31, 1, 9, C.slate);
      return p;
    },
    factory() {   // 톱니 지붕과 굴뚝
      const p = Pic(46, 40);
      p.fill(37, 0, 3, 2, C.white).fill(40, 2, 3, 2, C.white);
      p.box(35, 4, 6, 18, 'terra');
      for (let k = 0; k < 3; k++) for (let j = 0; j < 7; j++) {
        const x = 1 + k * 11;
        p.fill(x + j, 21 - j, 1, j + 1, C.O).fill(x + j + 1, 22 - j, 1, j, C.slate);
        if (j < 6) p.fill(x + 8, 16 + j, 2, 1, C.glass);
      }
      p.box(0, 22, 44, 18, 'sand');
      p.shutter(4, 27, 13, 13, 'slate').wins([24, 33], [27], 5, 5);
      return p;
    },
    fire() {   // 소방서: 망루와 차고 문 둘
      const p = Pic(42, 38);
      p.box(31, 0, 10, 16, 'terra').win(34, 3, 4, 5);
      p.box(0, 12, 42, 26, 'terra');
      p.box(4, 15, 24, 4, 'cream');
      p.shutter(4, 22, 11, 16, 'white').shutter(17, 22, 11, 16, 'white').win(32, 23, 5, 5);
      return p;
    },
    dorm() {   // 기숙사: 창이 많은 4층
      const p = Pic(38, 42);
      p.box(1, 0, 36, 4, 'dark').box(2, 3, 34, 39, 'terra');
      for (let r = 0; r < 3; r++) p.wins([6, 15, 24, 31].slice(0, 4), [6 + r * 8], 4, 5);
      p.wins([6, 27], [31], 4, 5).door(16, 33, 6, 9);
      return p;
    }
  };

  // 그림판 → PNG 주소 (한 번 만들면 기억해 둔다)
  const cache = {};
  JG.buildingImg = look => {
    if (cache[look]) return cache[look];
    const p = (DESIGNS[look] || DESIGNS.house)();
    const cv = document.createElement('canvas');
    cv.width = p.w; cv.height = p.h;
    const ctx = cv.getContext('2d');
    const colors = new Set();
    p.g.forEach((row, y) => row.forEach((c, x) => { if (c) { colors.add(c); ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); } }));
    return (cache[look] = { src: cv.toDataURL('image/png'), w: p.w, h: p.h, colors: [...colors] });
  };
  // 단지에 놓을 건물 그림 HTML: 가운데 cx, 땅 높이 ground, 점 하나 크기 dot(px)
  JG.buildingHtml = (look, cx, ground, dot) => {
    const b = JG.buildingImg(look), w = b.w * dot, h = b.h * dot;
    return '<img alt="" aria-hidden="true" src="' + b.src + '" style="position: absolute; left: ' + Math.round(cx - w / 2) + 'px; top: ' + (ground - h) + 'px; width: ' + w + 'px; height: ' + h + 'px; image-rendering: pixelated">';
  };
  JG.BUILDING_LOOKS = Object.keys(DESIGNS);
  JG.TOWN_COLORS = C;   // 단지 시설 그림도 같은 색을 쓴다
})();

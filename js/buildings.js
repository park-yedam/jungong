// 우리 회사 단지 건물 도트 그림: 작은 격자(1칸 = 점 하나)에 그린 뒤 그림(PNG)으로 바꿔 둔다.
// 화면에서는 2~3배로 키워 점이 또렷하게 보이게 한다 (image-rendering: pixelated). 브라우저에서만 쓴다.
(() => {
  const JG = globalThis.JG;
  const O = '#3B2A20';   // 외곽선

  // 색을 밝게(+)/어둡게(-)
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
    return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  // 그림판: w × h 칸. 아래쪽이 땅
  function Pic(w, h) {
    const g = Array.from({ length: h }, () => new Array(w).fill(null));
    const set = (x, y, c) => { if (x >= 0 && y >= 0 && x < w && y < h) g[y][x] = c; };
    const p = {
      w, h, g,
      px(x, y, c) { set(x, y, c); return p; },
      fill(x, y, ww, hh, c) { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) set(x + i, y + j, c); return p; },
      // 외곽선 상자: 윗줄은 밝게, 오른쪽 줄은 어둡게 (도트 그림의 빛과 그늘)
      box(x, y, ww, hh, c) {
        p.fill(x, y, ww, hh, O).fill(x + 1, y + 1, ww - 2, hh - 2, c);
        p.fill(x + 1, y + 1, ww - 2, 1, shade(c, 0.12)).fill(x + ww - 2, y + 2, 1, hh - 3, shade(c, -0.12));
        return p;
      },
      // 창문: 외곽선, 유리, 왼쪽 위 반짝임, 넓으면 가운데 창살
      win(x, y, ww, hh, c) {
        c = c || '#FFE08A';
        p.fill(x, y, ww, hh, O).fill(x + 1, y + 1, ww - 2, hh - 2, c).px(x + 1, y + 1, shade(c, 0.25));
        if (ww >= 6) p.fill(x + Math.floor(ww / 2), y + 1, 1, hh - 2, shade(c, -0.3));
        if (hh >= 6) p.fill(x + 1, y + Math.floor(hh / 2), ww - 2, 1, shade(c, -0.3));
        return p;
      },
      // 벽돌 무늬 (줄눈이 엇갈림)
      bricks(x, y, ww, hh, c, mortar) {
        for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) {
          const row = Math.floor(j / 2), lineY = j % 2 === 1, lineX = (i + (row % 2) * 2) % 4 === 0;
          set(x + i, y + j, lineY || lineX ? mortar : (i + j) % 7 === 0 ? shade(c, 0.08) : c);
        }
        return p;
      },
      // 가로 줄무늬 (셔터 문 등)
      lines(x, y, ww, hh, c, every) { for (let j = 0; j < hh; j++) p.fill(x, y + j, ww, 1, j % every === every - 1 ? shade(c, -0.22) : c); return p; },
      // 계단식 세모 지붕: 가운데 cx, 밑줄 y에서 위로, 한 단 rh칸, 단마다 폭 ws
      roof(cx, y, ws, rh, c) {
        ws.forEach((ww, k) => {
          const x = cx - Math.floor(ww / 2), yy = y - (k + 1) * rh;
          p.fill(x, yy, ww, rh + 1, O).fill(x + 1, yy + 1, ww - 2, rh - 1, k % 2 ? shade(c, -0.1) : c);
        });
        return p;
      },
      door(x, y, ww, hh, c) { p.box(x, y, ww, hh, c || '#8B5A2B').px(x + ww - 3, y + Math.floor(hh / 2), '#F7C948'); return p; }
    };
    return p;
  }

  // ---------- 건물 17종 (현장 5 + 데일리 12) ----------
  const DESIGNS = {
    house() {   // 뾰족 지붕 2층 집
      const p = Pic(40, 38), G = 38;
      p.box(30, 4, 5, 10, '#9AA0A6');
      p.roof(20, 20, [40, 34, 28, 22, 16, 10], 3, '#C0603C');
      p.box(3, 19, 34, G - 19, '#F4E4BC');
      p.win(7, 22, 7, 6).win(26, 22, 7, 6).win(7, 30, 7, 6).win(26, 30, 7, 6);
      p.door(17, 28, 6, 10);
      return p;
    },
    retail() {   // 1층 가게(유리·줄무늬 차양·간판) + 위층 사무실
      const p = Pic(48, 50), G = 50;
      p.box(0, 0, 48, 3, '#8E6440').box(1, 2, 46, G - 2, '#E8D2A0');
      [5, 16, 27, 38].forEach(x => p.win(x, 6, 6, 7).win(x, 17, 6, 7));
      p.box(8, 27, 32, 5, '#5B8DEF');
      for (let i = 10; i < 38; i += 3) p.px(i, 29, '#FFFFFF');   // 간판 글자 점
      for (let i = 0; i < 48; i++) p.fill(i, 33, 1, 4, Math.floor(i / 4) % 2 ? '#FFFFFF' : '#E35D5B');
      p.fill(0, 33, 48, 1, O); for (let i = 0; i < 48; i += 4) p.px(i, 37, O);
      p.box(3, 38, 30, G - 38, '#9CC7DC').fill(13, 39, 1, G - 39, O).fill(23, 39, 1, G - 39, O).px(5, 40, '#DDF0FA').px(15, 40, '#DDF0FA');
      p.door(36, 38, 9, G - 38);
      return p;
    },
    apart() {   // 층마다 발코니 난간이 있는 5층 아파트
      const p = Pic(48, 62), G = 62;
      p.box(0, 0, 48, 3, '#3E8C42').box(1, 2, 46, G - 2, '#F4F1E8');
      for (let f = 0; f < 5; f++) {
        const y = 5 + f * 11;
        [5, 21, 37].forEach(x => p.win(x, y, 7, 6));
        if (f < 4) { p.fill(3, y + 7, 42, 1, O).fill(3, y + 8, 42, 2, '#B8BEC4'); for (let i = 4; i < 45; i += 3) p.px(i, y + 8, O); }
      }
      p.door(20, G - 9, 8, 9);
      return p;
    },
    warehouse() {   // 넓고 낮은 물류창고, 셔터 문 3개
      const p = Pic(64, 32), G = 32;
      p.box(0, 0, 64, 5, '#5B8DEF');
      p.box(2, 4, 60, G - 4, '#B8C2CC');
      for (let i = 6; i < 60; i += 5) p.fill(i, 6, 1, 6, shade('#B8C2CC', -0.1));
      p.box(5, 7, 54, 4, '#9CC7DC');
      [6, 25, 44].forEach(x => { p.fill(x, 14, 14, G - 14, O); p.lines(x + 1, 15, 12, G - 15, '#9AA0A6', 3); });
      return p;
    },
    office() {   // 유리 커튼월 오피스, 옥상 안테나
      const p = Pic(40, 64), G = 64;
      p.fill(19, 0, 2, 6, O).px(19, 0, '#E35D5B');
      p.box(4, 6, 32, G - 6, '#6FA8DC');
      for (let y = 8; y < G - 1; y++) for (let x = 5; x < 35; x++) {
        if ((x - 5) % 5 === 0 || (y - 8) % 5 === 0) p.px(x, y, '#3E5C8A');
        else if ((x + y) % 11 === 0 || (x + y) % 11 === 1) p.px(x, y, '#BFE0F7');   // 유리 반사
      }
      p.box(15, G - 9, 10, 9, '#3E5C8A');
      return p;
    },

    school() {   // 가운데 시계탑, 넓은 3층
      const p = Pic(48, 50), G = 50;
      p.roof(24, 6, [16, 10, 4], 2, '#C0603C');
      p.box(17, 5, 14, 14, '#F4E4BC').box(20, 7, 8, 8, '#FFFFFF').fill(23, 9, 1, 3, O).fill(23, 11, 3, 1, O);
      p.box(0, 17, 48, 3, '#C0603C').box(1, 19, 46, G - 19, '#F4E4BC');
      [4, 12, 30, 38].forEach(x => p.win(x, 22, 6, 7).win(x, 32, 6, 7));
      p.win(4, 42, 6, 6).win(38, 42, 6, 6).door(20, 40, 8, 10);
      return p;
    },
    hospital() {   // 하얀 건물, 빨간 십자
      const p = Pic(44, 48), G = 48;
      p.box(2, 0, 40, G, '#FFFFFF');
      p.fill(19, 3, 6, 14, O).fill(15, 7, 14, 6, O).fill(20, 4, 4, 12, '#E35D5B').fill(16, 8, 12, 4, '#E35D5B');
      [5, 34].forEach(x => p.win(x, 4, 5, 6, '#9CC7DC').win(x, 13, 5, 6, '#9CC7DC'));
      [5, 14, 25, 34].forEach(x => p.win(x, 23, 5, 6, '#9CC7DC'));
      p.box(12, 32, 20, 4, '#5B8DEF').box(15, 36, 14, G - 36, '#9CC7DC').fill(22, 37, 1, G - 37, O);
      return p;
    },
    library() {   // 박공 지붕과 기둥 (고전 양식)
      const p = Pic(48, 40), G = 40;
      p.roof(24, 12, [48, 38, 28, 18, 8], 2, '#B8BEC4');
      p.box(2, 11, 44, 5, '#E8E3D5');
      [5, 14, 23, 32, 41].forEach(x => { p.fill(x - 1, 15, 4, 20, O).fill(x, 16, 2, 19, '#F4F1E8').fill(x + 1, 16, 1, 19, '#D9D2C0'); });
      p.door(20, 22, 8, 13, '#5C3A1E');
      p.box(0, 34, 48, 3, '#B8BEC4').box(0, 36, 48, 4, '#9AA0A6');
      return p;
    },
    daycare() {   // 알록달록 낮은 2층, 세모 지붕 둘
      const p = Pic(48, 32), G = 32;
      p.roof(12, 11, [24, 18, 12, 6], 2, '#E35D5B').roof(36, 11, [24, 18, 12, 6], 2, '#5B8DEF');
      p.box(0, 10, 48, G - 10, '#F7C948');
      p.win(4, 13, 6, 6, '#FFFFFF').win(14, 13, 6, 6, '#7BD389').win(28, 13, 6, 6, '#7BD389').win(38, 13, 6, 6, '#FFFFFF');
      ['#E35D5B', '#F2994A', '#F7C948', '#7BD389', '#5B8DEF', '#9C7BB8'].forEach((c, k) => p.fill(1 + k * 8, 21, 8, 2, c));
      p.door(20, 23, 8, 9, '#E35D5B');
      return p;
    },
    gym() {   // 둥근 지붕의 넓고 낮은 체육관
      const p = Pic(58, 32), G = 32;
      p.roof(29, 10, [58, 52, 42, 28, 12], 2, '#3E8C42');
      p.box(2, 9, 54, G - 9, '#E8D2A0');
      p.box(5, 12, 48, 7, '#9CC7DC'); for (let x = 11; x < 52; x += 6) p.fill(x, 13, 1, 5, O);
      p.door(24, 22, 10, 10);
      return p;
    },
    center() {   // 국기 게양대, 파란 간판의 3층 관공서
      const p = Pic(46, 50), G = 50;
      p.fill(41, 0, 1, G, '#7E858C').box(34, 1, 8, 6, '#FFFFFF').fill(36, 3, 2, 2, '#E35D5B').fill(38, 3, 2, 2, '#5B8DEF');
      p.box(0, 14, 38, G - 14, '#E8E3D5');
      p.box(6, 17, 26, 5, '#3E5C8A'); for (let i = 8; i < 30; i += 3) p.px(i, 19, '#FFFFFF');
      [3, 12, 21, 30].forEach(x => p.win(x, 25, 5, 6).win(x, 34, 5, 6));
      p.box(14, 41, 10, G - 41, '#9CC7DC').fill(19, 42, 1, G - 42, O);
      return p;
    },
    officetel() {   // 좁고 높은 6층
      const p = Pic(30, 52), G = 52;
      p.box(0, 0, 30, 3, '#5C3A1E').box(1, 2, 28, G - 2, '#9AA0A6');
      for (let r = 0; r < 6; r++) [4, 12, 20].forEach(x => p.win(x, 5 + r * 7, 5, 5));
      p.door(11, G - 8, 8, 8, '#3E5C8A');
      return p;
    },
    lab() {   // 띠창과 옥상 설비가 있는 연구동
      const p = Pic(46, 40), G = 40;
      p.box(6, 0, 10, 6, '#B8BEC4').box(30, 1, 8, 5, '#B8BEC4').fill(32, 0, 4, 1, O);
      p.box(1, 5, 44, G - 5, '#F4F1E8');
      [9, 19].forEach(y => { p.box(4, y, 38, 6, '#5B8DEF'); for (let x = 9; x < 42; x += 5) p.fill(x, y + 1, 1, 4, O); p.px(5, y + 1, '#BFE0F7'); });
      p.box(18, 30, 10, G - 30, '#9CC7DC');
      return p;
    },
    mall() {   // 층마다 다른 색 간판
      const p = Pic(48, 46), G = 46;
      p.box(0, 0, 48, G, '#E8D2A0');
      ['#E35D5B', '#5B8DEF', '#7BD389', '#F7C948'].forEach((c, k) => {
        const y = 3 + k * 9;
        p.box(3, y, 42, 5, c); for (let i = 6; i < 42; i += 4) p.px(i, y + 2, '#FFFFFF');
        p.win(4, y + 5, 5, 3, '#9CC7DC').win(39, y + 5, 5, 3, '#9CC7DC');
      });
      p.box(3, 39, 42, G - 39, '#9CC7DC').fill(24, 40, 1, G - 40, O);
      return p;
    },
    factory() {   // 톱니 지붕과 굴뚝, 연기
      const p = Pic(50, 48), G = 48;
      p.fill(41, 2, 3, 3, '#DDE6E8').fill(44, 0, 4, 3, '#DDE6E8').fill(38, 5, 3, 2, '#DDE6E8');
      p.box(37, 7, 7, 22, '#B5533A'); for (let y = 9; y < 28; y += 3) p.fill(38, y, 5, 1, shade('#B5533A', -0.15));
      for (let k = 0; k < 3; k++) for (let j = 0; j < 8; j++) {   // 톱니: 한쪽은 지붕, 한쪽은 유리
        const x = 1 + k * 12;
        p.fill(x + j, 28 - j, 1, j + 1, O).fill(x + j + 1, 28 - j + 1, 1, j, '#9AA0A6');
        if (j < 7) p.fill(x + 9, 21 + j, 3, 1, '#5B8DEF');
      }
      p.box(0, 28, 46, G - 28, '#B8C2CC');
      p.fill(4, 34, 14, G - 34, O).lines(5, 35, 12, G - 35, '#9AA0A6', 3);
      p.win(24, 33, 6, 5, '#9CC7DC').win(34, 33, 6, 5, '#9CC7DC');
      return p;
    },
    fire() {   // 빨간 소방서, 차고 문 둘, 망루
      const p = Pic(48, 46), G = 46;
      p.box(34, 0, 12, 20, '#E35D5B').win(37, 3, 6, 5, '#FFFFFF');
      p.box(0, 16, 48, G - 16, '#E35D5B');
      p.box(3, 19, 30, 5, '#FFFFFF'); for (let i = 6; i < 31; i += 3) p.px(i, 21, '#E35D5B');
      [3, 18].forEach(x => { p.fill(x, 26, 14, G - 26, O); p.lines(x + 1, 27, 12, G - 27, '#F4F1E8', 3); });
      p.win(37, 28, 7, 6);
      return p;
    },
    dorm() {   // 벽돌색 4층, 작은 창 여러 개
      const p = Pic(44, 46), G = 46;
      p.box(0, 0, 44, 3, '#5C3A1E');
      p.fill(1, 2, 42, G - 2, O).bricks(2, 3, 40, G - 4, '#B4533A', '#8B3A1E');
      for (let r = 0; r < 3; r++) [4, 12, 20, 28, 36].forEach(x => p.win(x, 6 + r * 9, 5, 6));
      [4, 12, 28, 36].forEach(x => p.win(x, 34, 5, 6));
      p.door(19, 36, 7, 10);
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
    p.g.forEach((row, y) => row.forEach((c, x) => { if (c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); } }));
    return (cache[look] = { src: cv.toDataURL('image/png'), w: p.w, h: p.h });
  };
  // 단지에 놓을 건물 그림 HTML: 가운데 cx, 땅 높이 ground, 점 하나 크기 dot(px)
  JG.buildingHtml = (look, cx, ground, dot) => {
    const b = JG.buildingImg(look), w = b.w * dot, h = b.h * dot;
    return '<img alt="" aria-hidden="true" src="' + b.src + '" style="position: absolute; left: ' + Math.round(cx - w / 2) + 'px; top: ' + (ground - h) + 'px; width: ' + w + 'px; height: ' + h + 'px; image-rendering: pixelated">';
  };
  JG.BUILDING_LOOKS = Object.keys(DESIGNS);
})();

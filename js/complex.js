// 우리 회사 단지: 준공한 건물이 하나씩 들어서는 도트 마을. 판과 판 사이에 돌아오는 곳.
// 뒷줄: 현장 5곳의 땅 (준공 → 건물, 열림 → 비계, 잠김 → 울타리). 길: 가진 작업팀이 오간다.
// 앞줄: 현장 게시판(현장 고르기), 자재 창고(덱), 도감 책장(도감), 데일리 현장.
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc, P = JG.progress;
  const GROUND = 400, CELL = 36, K = CELL / 48;   // 건물 칸은 대전 화면의 3/4 크기
  let msg = '';

  const span = (x, y, w, h, style) => '<span aria-hidden="true" style="' + L.at(x, y, w, h) + ' display: block; box-sizing: border-box; ' + style + '"></span>';
  // 3/4 크기로 줄인 벽돌 칸 하나
  const bay = (name, x, y, extra) => '<span aria-hidden="true" style="display: block; position: absolute; left: ' + (x - 3 * K) + 'px; top: ' + (y - 3 * K) + 'px; width: 3px; height: 3px; box-shadow: '
    + JG.SPRITES[name] + '; transform: scale(' + K + '); transform-origin: 0 0; ' + (extra || '') + '"></span>';

  // ---------- 종류별 건물 그림 (단지용) ----------
  // 외곽선 있는 상자, 불 켜진 창문 여러 개
  const box = (x, y, w, h, bg) => span(x, y, w, h, 'background: ' + bg + '; border: 3px solid #3B2A20');
  const wins = (xs, ys, w, h, bg) => xs.map(x => ys.map(y => box(x, y, w, h, bg || '#FFE08A')).join('')).join('');
  // look: 건물 종류, L: 왼쪽, G: 땅 높이 (버튼 안 좌표). 그림 높이는 종류마다 다르다
  function building(look, L, G) {
    if (look === 'house') {   // 뾰족 지붕 2층 집, 굴뚝
      return box(L + 98, G - 112, 14, 26, '#9AA0A6')
        + [140, 108, 76, 44].map((w, k) => span(L + 72 - w / 2, G - 84 - k * 9, w, 12, 'background: #C0603C; border: 3px solid #3B2A20')).join('')
        + box(L + 12, G - 74, 120, 74, '#F4E4BC') + wins([L + 26, L + 98], [G - 62, G - 30], 22, 20) + box(L + 60, G - 34, 24, 34, '#8B5A2B');
    }
    if (look === 'retail') {   // 1층 가게(유리·줄무늬 차양·간판) + 위층 사무실
      return box(L, G - 144, 144, 144, '#E8D2A0') + span(L - 3, G - 150, 150, 9, 'background: #8E6440; border: 3px solid #3B2A20')
        + wins([L + 12, L + 46, L + 80, L + 114], [G - 134, G - 98], 18, 20)
        + box(L + 22, G - 70, 100, 16, '#5B8DEF')
        + span(L - 4, G - 52, 152, 14, 'background: repeating-linear-gradient(90deg, #E35D5B 0 12px, #FFFFFF 12px 24px); border: 3px solid #3B2A20')
        + box(L + 8, G - 38, 92, 38, '#9CC7DC') + box(L + 106, G - 38, 30, 38, '#8B5A2B');
    }
    if (look === 'apart') {   // 층마다 발코니 난간이 있는 아파트
      let h = box(L, G - 180, 144, 180, '#F4F1E8') + span(L - 3, G - 186, 150, 9, 'background: #3E8C42; border: 3px solid #3B2A20');
      for (let f = 0; f < 5; f++) {
        const y = G - 174 + f * 36;
        h += wins([L + 12, L + 60, L + 108], [y], 24, 20) + (f < 4 ? span(L + 6, y + 22, 132, 6, 'background: #9AA0A6; border: 2px solid #3B2A20') : '');
      }
      return h + box(L + 60, G - 30, 24, 30, '#8B5A2B');
    }
    if (look === 'warehouse') {   // 넓고 낮은 물류창고, 셔터 문 3개
      return span(L - 24, G - 96, 192, 15, 'background: #5B8DEF; border: 3px solid #3B2A20') + box(L - 20, G - 84, 184, 84, '#B8C2CC')
        + span(L - 8, G - 74, 160, 10, 'background: #9CC7DC; border: 2px solid #3B2A20')
        + [0, 1, 2].map(k => span(L - 6 + k * 58, G - 50, 46, 50, 'background: repeating-linear-gradient(#9AA0A6 0 6px, #7E858C 6px 9px); border: 3px solid #3B2A20')).join('');
    }
    if (look === 'office') {   // 유리 커튼월 오피스 빌딩, 옥상 안테나
      return span(L + 70, G - 186, 4, 24, 'background: #3B2A20') + box(L + 12, G - 166, 120, 166,
        '#7FB2E5; background-image: linear-gradient(90deg, rgba(59, 42, 32, 0.55) 2px, transparent 2px), linear-gradient(rgba(59, 42, 32, 0.55) 2px, transparent 2px); background-size: 20px 18px')
        + box(L + 52, G - 34, 40, 34, '#3E5C8A');
    }
    return dailyBuilding(look, L, G);
  }

  // 데일리 건물 12종 (높이 150 안쪽, 폭 144 안쪽)
  const steps = (cx, y, ws, bg) => ws.map((w, k) => span(cx - w / 2, y - k * 9, w, 12, 'background: ' + bg + '; border: 3px solid #3B2A20')).join('');   // 계단식 지붕
  function dailyBuilding(look, L, G) {
    const door = (bg) => box(L + 60, G - 30, 24, 30, bg || '#8B5A2B');
    switch (look) {
      case 'school':   // 가운데 시계탑, 넓은 3층
        return box(L + 50, G - 140, 44, 40, '#F4E4BC') + box(L + 61, G - 132, 22, 22, '#FFFFFF') + span(L + 71, G - 126, 3, 10, 'background: #3B2A20') + steps(L + 72, G - 150, [52, 30], '#C0603C')
          + box(L, G - 104, 144, 104, '#F4E4BC') + span(L - 3, G - 108, 150, 9, 'background: #C0603C; border: 3px solid #3B2A20')
          + wins([L + 10, L + 38, L + 88, L + 116], [G - 94, G - 62], 18, 20) + wins([L + 10, L + 116], [G - 30], 18, 20) + door();
      case 'hospital':   // 하얀 건물, 빨간 십자
        return box(L + 6, G - 140, 132, 140, '#FFFFFF') + span(L + 64, G - 134, 16, 40, 'background: #E35D5B; border: 2px solid #3B2A20') + span(L + 52, G - 122, 40, 16, 'background: #E35D5B; border: 2px solid #3B2A20')
          + wins([L + 16, L + 112], [G - 132, G - 104], 18, 18, '#9CC7DC') + wins([L + 16, L + 46, L + 80, L + 112], [G - 76], 18, 18, '#9CC7DC')
          + span(L + 40, G - 46, 64, 10, 'background: #5B8DEF; border: 3px solid #3B2A20') + box(L + 50, G - 36, 44, 36, '#9CC7DC');
      case 'library':   // 박공 지붕과 기둥 (고전 양식)
        return steps(L + 72, G - 112, [150, 116, 82, 48], '#B8BEC4') + box(L + 6, G - 106, 132, 18, '#E8E3D5')
          + [0, 1, 2, 3, 4].map(k => box(L + 14 + k * 26, G - 88, 12, 70, '#F4F1E8')).join('') + box(L, G - 18, 144, 18, '#B8BEC4') + box(L + 60, G - 76, 24, 58, '#8B5A2B');
      case 'daycare':   // 알록달록 낮은 2층, 세모 지붕 둘
        return steps(L + 38, G - 84, [76, 52, 28], '#E35D5B') + steps(L + 106, G - 84, [76, 52, 28], '#5B8DEF')
          + box(L, G - 76, 144, 76, '#F7C948') + wins([L + 14, L + 112], [G - 62], 18, 18, '#FFFFFF') + wins([L + 40, L + 86], [G - 62], 18, 18, '#7BD389')
          + span(L - 3, G - 34, 150, 6, 'background: repeating-linear-gradient(90deg, #E35D5B 0 12px, #5B8DEF 12px 24px, #7BD389 24px 36px)') + door('#E35D5B');
      case 'gym':   // 둥근 지붕의 넓고 낮은 체육관
        return steps(L + 72, G - 96, [176, 150, 112, 60], '#3E8C42') + box(L - 16, G - 80, 176, 80, '#E8D2A0')
          + span(L - 6, G - 66, 156, 22, 'background: #9CC7DC; border: 3px solid #3B2A20; background-image: linear-gradient(90deg, #3B2A20 2px, transparent 2px); background-size: 26px 100%')
          + box(L + 50, G - 34, 44, 34, '#8B5A2B');
      case 'center':   // 국기 게양대, 파란 간판의 3층 관공서
        return span(L + 132, G - 150, 4, 150, 'background: #7E858C') + JG.look.sprite('flag', L + 126, G - 160)
          + box(L, G - 108, 124, 108, '#E8E3D5') + box(L + 22, G - 100, 80, 14, '#3E5C8A')
          + wins([L + 12, L + 42, L + 72, L + 98], [G - 78, G - 50], 16, 18) + box(L + 48, G - 30, 28, 30, '#9CC7DC');
      case 'officetel':   // 좁고 높은 6층
        return box(L + 30, G - 150, 84, 150, '#9AA0A6') + span(L + 27, G - 156, 90, 9, 'background: #5C3A1E; border: 3px solid #3B2A20')
          + wins([L + 40, L + 66, L + 92], [G - 140, G - 116, G - 92, G - 68, G - 44], 14, 16) + box(L + 62, G - 22, 20, 22, '#3E5C8A');
      case 'lab':   // 띠창과 옥상 설비가 있는 연구동
        return box(L + 18, G - 128, 30, 18, '#B8BEC4') + box(L + 92, G - 132, 22, 22, '#B8BEC4') + box(L + 4, G - 112, 136, 112, '#F4F1E8')
          + [0, 1, 2].map(k => span(L + 12, G - 100 + k * 32, 120, 16, 'background: #5B8DEF; border: 3px solid #3B2A20; background-image: linear-gradient(90deg, #3B2A20 2px, transparent 2px); background-size: 20px 100%')).join('')
          + box(L + 58, G - 28, 28, 28, '#9CC7DC');
      case 'mall':   // 층마다 다른 색 간판
        return box(L, G - 132, 144, 132, '#E8D2A0') + ['#E35D5B', '#5B8DEF', '#7BD389', '#F7C948'].map((c, k) => box(L + 8, G - 124 + k * 26, 128, 12, c)).join('')
          + box(L + 8, G - 20, 128, 20, '#9CC7DC');
      case 'factory':   // 톱니 지붕과 굴뚝, 연기
        return box(L + 110, G - 140, 18, 80, '#B5533A') + span(L + 112, G - 154, 14, 10, 'background: #DDE6E8; border: 2px solid #9AA0A6') + span(L + 122, G - 166, 12, 10, 'background: #DDE6E8; border: 2px solid #9AA0A6')
          + [0, 1, 2].map(k => span(L - 8 + k * 46, G - 88, 46, 24, 'background: linear-gradient(135deg, #9AA0A6 50%, #5B8DEF 50%); border: 3px solid #3B2A20')).join('')
          + box(L - 8, G - 66, 138, 66, '#B8C2CC') + span(L + 6, G - 46, 46, 46, 'background: repeating-linear-gradient(#9AA0A6 0 6px, #7E858C 6px 9px); border: 3px solid #3B2A20') + wins([L + 70, L + 98], [G - 54], 18, 16, '#9CC7DC');
      case 'fire':   // 빨간 소방서, 차고 문 둘, 망루
        return box(L + 104, G - 140, 32, 56, '#E35D5B') + box(L + 110, G - 130, 20, 16, '#FFFFFF') + box(L, G - 88, 144, 88, '#E35D5B')
          + box(L + 10, G - 80, 92, 14, '#FFFFFF') + [0, 1].map(k => span(L + 10 + k * 50, G - 56, 42, 56, 'background: repeating-linear-gradient(#F4F1E8 0 6px, #B8BEC4 6px 9px); border: 3px solid #3B2A20')).join('')
          + wins([L + 112], [G - 70], 18, 18);
      case 'dorm':   // 벽돌색 4층, 작은 창 여러 개
        return box(L + 6, G - 132, 132, 132, '#B4533A') + span(L + 3, G - 138, 138, 9, 'background: #5C3A1E; border: 3px solid #3B2A20')
          + wins([L + 16, L + 40, L + 64, L + 88, L + 112], [G - 120, G - 92, G - 64], 14, 16) + wins([L + 16, L + 40, L + 88, L + 112], [G - 36], 14, 16) + box(L + 62, G - 30, 20, 30, '#8B5A2B');
    }
    return '';
  }

  // 현장 땅 하나 (200×?) → 버튼. 건물·비계·울타리와 이름판
  function lot(site, i) {
    const x = 50 + i * 272, open = P.unlocked(i), best = P.best(site.id);
    const floors = site.bricks / JG.RULES.bricksPerFloor - (site.basement || 0);   // 단지에서는 땅 위 층만 보인다
    const bx = x + 28, top = GROUND - CELL * floors;
    let art = '';
    if (best) {
      art += building(site.look, bx - x, GROUND - (top - 60));   // 준공한 현장: 종류별 건물
    } else if (open) {
      for (let f = 0; f < floors; f++) for (let b = 0; b < 4; b++) art += bay('bay_empty', bx + b * CELL - x, GROUND - CELL * (f + 1) - (top - 60));
    } else {
      // 잠긴 땅: 가설 울타리
      art += span(0, GROUND - (top - 60) - 36, 200, 36, 'background: #E8D2A0; border: 3px solid #3B2A20; background-image: repeating-linear-gradient(90deg, #E8D2A0 0 18px, #5BB65F 18px 24px)');
    }
    const plate = best ? esc(site.name) + '<br><span style="color: #F7C948; ' + L.OUT1 + '">' + '★'.repeat(best) + '☆'.repeat(3 - best) + '</span> 다시 하기'
      : open ? esc(site.name) + '<br>공사 예정 · 시작하기' : '현장 ' + site.no + '<br>잠김';
    const aria = best ? site.name + ' 준공. 최고 별 ' + best + '개. 눌러서 다시 하기' : open ? site.name + ' 공사 예정. 눌러서 시작' : site.no + '번 현장 잠김';
    const y0 = top - 60, h = GROUND - y0 + 54;
    return '<button type="button" data-act="lot:' + i + '" aria-label="' + esc(aria) + '" style="' + L.at(x, y0, 200, h) + ' ' + L.BTN + '; background: transparent; border: 0">'
      + art
      + '<span style="' + L.at(10, h - 50, 180, 48) + ' display: block; box-sizing: border-box; ' + L.PAPER + '; text-align: center; font-size: 16px; line-height: 19px; padding-top: 3px">' + plate + '</span></button>';
  }

  // 앞줄 시설: 그림 + 이름판
  function facility(act, x, art, name, sub, aria, dim) {
    return '<button type="button" data-act="' + act + '" aria-label="' + esc(aria) + '" style="' + L.at(x, 628, 260, 170) + ' ' + L.BTN + '; background: transparent; border: 0' + (dim ? '; opacity: 0.6' : '') + '">'
      + art
      + '<span style="' + L.at(10, 108, 240, 58) + ' display: block; box-sizing: border-box; ' + L.PAPER + '; text-align: center; font-size: 16px; line-height: 22px; padding-top: 4px">'
      + esc(name) + '<br><span style="color: #5C3A1E">' + esc(sub) + '</span></span></button>';
  }

  const ART = {
    board: span(60, 30, 12, 80, 'background: #6B4420; border: 3px solid #3B2A20') + span(188, 30, 12, 80, 'background: #6B4420; border: 3px solid #3B2A20')
      + span(40, 6, 180, 72, L.WOOD)
      + [58, 112, 166].map((px, k) => span(px, 18 + (k % 2) * 6, 40, 46, 'background: #F4E4BC; border: 3px solid #3B2A20') + span(px + 15, 14 + (k % 2) * 6, 10, 10, 'background: #E35D5B; border: 2px solid #3B2A20')).join(''),
    shed: span(54, 24, 152, 12, 'background: #8E6440; border: 3px solid #3B2A20') + span(42, 34, 176, 14, 'background: #8E6440; border: 3px solid #3B2A20')
      + span(54, 46, 152, 62, 'background: #B8BEC4; border: 3px solid #3B2A20') + span(102, 60, 56, 48, 'background: #5C3A1E; border: 3px solid #3B2A20')
      + span(66, 58, 28, 20, 'background: #F4E4BC; border: 3px solid #3B2A20') + span(166, 58, 28, 20, 'background: #F4E4BC; border: 3px solid #3B2A20'),
    shelf: span(70, 4, 120, 104, 'background: #8B5A2B; border: 3px solid #3B2A20')
      + [0, 1, 2].map(r => span(78, 12 + r * 32, 104, 4, 'background: #5C3A1E') + ['#E07A3F', '#5B8DEF', '#F7C948', '#5BB65F', '#E35D5B', '#9AA0A6', '#B5835A'].map((c, k) => span(80 + k * 14, 18 + r * 32 - (k % 3 === 0 ? 2 : 0), 12, 22 + (k % 3 === 0 ? 2 : 0), 'background: ' + c + '; border: 2px solid #3B2A20')).join('')).join('')
  };
  function calendarArt(day, locked) {
    return span(118, 66, 24, 42, 'background: #6B4420; border: 3px solid #3B2A20')
      + span(70, 2, 120, 72, 'background: ' + (locked ? '#CFC8B8' : '#FFFFFF') + '; border: 3px solid #3B2A20')
      + span(70, 2, 120, 22, 'background: ' + (locked ? '#8E8576' : '#E35D5B') + '; border: 3px solid #3B2A20')
      + '<span aria-hidden="true" style="' + L.at(70, 26, 120) + ' display: block; text-align: center; font-size: 32px; line-height: 40px; color: ' + (locked ? '#8E8576' : '#3B2A20') + '">' + (locked ? '?' : day) + '</span>';
  }

  // 길을 오가는 작업팀 (가진 작업팀, 장비·가설물 빼고 최대 6명)
  function walkers() {
    const people = P.owned().filter(id => JG.CARDS[id].kind === 'crew' && !['pump', 'tower', 'shore', 'earth'].includes(id)).slice(0, 6);
    return people.map((id, k) => {
      const x = 80 + k * 210, d = 140 + (k % 3) * 60, dur = 9 + (k * 1.7) % 6;
      return '<span aria-hidden="true" style="display: block; position: absolute; left: ' + x + 'px; top: 480px; width: 3px; height: 3px; box-shadow: ' + JG.SPRITES[id]
        + '; --d: ' + d + 'px; transform-origin: 30px 0; animation: walk ' + dur.toFixed(1) + 's steps(' + Math.round(dur * 8) + ') infinite; animation-delay: -' + (k * 2.3).toFixed(1) + 's"></span>';
    }).join('');
  }

  JG.screens.complex = {
    enter() { msg = '우리 회사 단지예요. 준공한 건물을 누르면 그 현장을 다시 할 수 있어요.'; },
    msg: () => msg,

    click(act, n) {
      JG.sound.play('tick');
      if (act === 'title') { JG.app.show('title'); return; }
      if (act === 'board') { JG.app.show('sites'); return; }
      if (act === 'shed') { JG.app.show('deck'); return; }
      if (act === 'shelf') { JG.app.show('dex'); return; }
      if (act === 'daily') {
        if (!JG.daily.unlocked()) { msg = '데일리 현장은 5번 현장(도심 지하 굴착)을 준공하면 열려요.'; return; }
        JG.app.show('tbm', { daily: true });
        return;
      }
      if (act === 'lot') {
        const site = JG.SITES[n];
        if (!P.unlocked(n)) { msg = JG.engine.eun(site.name) + ' 아직 잠겨 있어요. ' + (site.no - 1) + '번 현장을 먼저 준공해 주세요.'; return; }
        JG.app.show('tbm', { siteId: site.id });
      }
    },

    render() {
      const d = JG.save.data, rank = JG.RANKS[P.rankOf(d.stars)].name;
      const today = JG.daily.today(), dailyOpen = JG.daily.unlocked(), dBest = JG.daily.best(today.dateKey);
      let h = '<div style="' + L.ROOT + '; background: #A9CFE0">';
      h += L.sprite('cloud', 470, 120) + L.sprite('cloud', 1010, 90) + L.sprite('cloud', 760, 170);
      // 땅, 길
      h += '<div aria-hidden="true" style="' + L.at(0, GROUND, 1440, 810 - GROUND) + ' background: #8BC34A"></div>';
      h += '<div aria-hidden="true" style="' + L.at(0, GROUND, 1440, 12) + ' background: #8BC34A; box-shadow: inset 0 -6px 0 #6FA83A"></div>';
      h += '<div aria-hidden="true" style="' + L.at(0, 520, 1440, 96) + ' background: #D9A066; border-top: 3px solid #B07A47; border-bottom: 3px solid #B07A47"></div>';
      // 현장 땅 5곳
      JG.SITES.forEach((site, i) => { h += lot(site, i); });
      h += walkers();
      h += L.sprite(JG.bossSprite(), 1330, 480);   // 길 끝에 선 현장소장 (용어 OX를 다 맞히면 금색 안전모)
      // 앞줄 시설
      h += facility('board', 70, ART.board, '현장 게시판', '현장 고르기', '현장 게시판. 현장 고르기');
      h += facility('shed', 410, ART.shed, '자재 창고', '덱 ' + ((d.deck && d.deck.length) || 12) + '장', '자재 창고. 덱 편집');
      h += facility('shelf', 750, ART.shelf, '도감 책장', '카드 ' + d.dex.cards.length + '/' + Object.keys(JG.CARDS).length, '도감 책장. 도감 보기');
      h += facility('daily', 1090, calendarArt(Number(today.dateKey.slice(8)), !dailyOpen), '데일리 현장',
        dailyOpen ? today.name + ' · ' + (dBest ? '★'.repeat(dBest) + '☆'.repeat(3 - dBest) : '오늘 아직') : '5번 현장 준공 후 열림',
        dailyOpen ? '데일리 현장. 오늘은 ' + today.name + (dBest ? ', 최고 별 ' + dBest + '개' : ', 아직 안 함') : '데일리 현장 잠김. 5번 현장을 준공하면 열려요', !dailyOpen);
      // 위쪽: 단지 이름판, 안내, 타이틀로
      h += '<div style="' + L.at(24, 18, 360, 93) + ' box-sizing: border-box; ' + L.WOOD + '">'
        + '<div style="' + L.at(6, 6, 342, 75) + ' box-sizing: border-box; ' + L.PAPER + '">'
        + '<h1 style="' + L.at(12, 9) + ' margin: 0; font-size: 32px; line-height: 32px; font-weight: normal">우리 회사 단지</h1>'
        + '<div style="' + L.at(12, 44) + ' color: #5C3A1E">칭호: ' + esc(rank) + ' · 모은 별 ' + d.stars + '개</div></div></div>';
      h += '<p style="' + L.at(402, 30, 816, 60) + ' margin: 0; box-sizing: border-box; padding: 0 18px; ' + L.PAPER + '; line-height: 54px; white-space: nowrap; overflow: hidden">' + esc(msg) + '</p>';
      h += '<button type="button" data-act="title" style="' + L.at(1236, 30, 180, 60) + ' ' + L.BTN + '; ' + L.PAPER + '">◀ 타이틀로</button>';
      return h + '</div>';
    }
  };
})();

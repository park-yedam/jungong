// 우리 회사 단지: 준공한 건물이 하나씩 들어서는 도트 마을. 판과 판 사이에 돌아오는 곳.
// 뒷줄: 현장 5곳의 땅 (준공 → 건물, 열림 → 비계, 잠김 → 울타리). 길: 가진 작업팀이 오간다.
// 앞줄: 현장 게시판(현장 고르기), 자재 창고(덱), 도감 책장(도감), 데일리 현장.
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc, P = JG.progress;
  const GROUND = 400, CELL = 36, K = CELL / 48;   // 건물 칸은 대전 화면의 3/4 크기
  let msg = '', zone = 0;   // zone: 0 = 1구역(현장 5곳), 1 = 2구역(데일리로 모은 건물)

  const span = (x, y, w, h, style) => '<span aria-hidden="true" style="' + L.at(x, y, w, h) + ' display: block; box-sizing: border-box; ' + style + '"></span>';
  // 3/4 크기로 줄인 벽돌 칸 하나
  const bay = (name, x, y, extra) => '<span aria-hidden="true" style="display: block; position: absolute; left: ' + (x - 3 * K) + 'px; top: ' + (y - 3 * K) + 'px; width: 3px; height: 3px; box-shadow: '
    + JG.SPRITES[name] + '; transform: scale(' + K + '); transform-origin: 0 0; ' + (extra || '') + '"></span>';

  // 현장 땅 하나 (200×?) → 버튼. 건물·비계·울타리와 이름판
  function lot(site, i) {
    const x = 50 + i * 272, open = P.unlocked(i), best = P.best(site.id);
    const floors = site.bricks / JG.RULES.bricksPerFloor - (site.basement || 0);   // 단지에서는 땅 위 층만 보인다
    const bx = x + 28, top = GROUND - CELL * floors;
    const y0 = best ? Math.min(top - 60, GROUND - JG.buildingImg(site.look).h * 3 - 12) : top - 60;   // 준공 건물은 그림 높이만큼
    let art = '';
    if (best) {
      art += JG.buildingHtml(site.look, 100, GROUND - y0, 3);   // 준공한 현장: 종류별 도트 건물 (점 3px)
    } else if (open) {
      for (let f = 0; f < floors; f++) for (let b = 0; b < 4; b++) art += bay('bay_empty', bx + b * CELL - x, GROUND - CELL * (f + 1) - (top - 60));
    } else {
      // 잠긴 땅: 가설 울타리
      art += span(0, GROUND - (top - 60) - 36, 200, 36, 'background: #E8D2A0; border: 3px solid #3B2A20; background-image: repeating-linear-gradient(90deg, #E8D2A0 0 18px, #5BB65F 18px 24px)');
    }
    const plate = best ? esc(site.name) + '<br><span style="color: #F7C948; ' + L.OUT1 + '">' + '★'.repeat(best) + '☆'.repeat(3 - best) + '</span> 다시 하기'
      : open ? esc(site.name) + '<br>공사 예정 · 시작하기' : '현장 ' + site.no + '<br>잠김';
    const aria = best ? site.name + ' 준공. 최고 별 ' + best + '개. 눌러서 다시 하기' : open ? site.name + ' 공사 예정. 눌러서 시작' : site.no + '번 현장 잠김';
    const h = GROUND - y0 + 54;
    return '<button type="button" data-act="lot:' + i + '" aria-label="' + esc(aria) + '" style="' + L.at(x, y0, 200, h) + ' ' + L.BTN + '; background: transparent; border: 0">'
      + art
      + '<span style="' + L.at(10, h - 50, 180, 48) + ' display: block; box-sizing: border-box; ' + L.PAPER + '; text-align: center; font-size: 16px; line-height: 19px; padding-top: 3px">' + plate + '</span></button>';
  }

  // 2구역 땅 하나 (데일리 건물 12종, 두 줄 × 6칸): 모았으면 도트 건물(점 2px), 아니면 빈 땅
  function dailyLot(b, k) {
    const x = 30 + (k % 6) * 232, ground = k < 6 ? 250 : 400, got = (JG.save.data.built || {})[b.id];
    const y0 = ground - 112, h = 112 + 30;
    const art = got ? JG.buildingHtml(b.id, 110, 112, 2)
      : span(40, 100, 140, 12, 'background: #C9A36B; border: 3px dashed #8B5A2B') + '<span aria-hidden="true" style="' + L.at(0, 66, 220) + ' display: block; text-align: center; font-size: 32px; line-height: 32px; color: rgba(139, 90, 43, 0.6)">?</span>';
    const plate = esc(b.name) + (got ? ' <span style="color: #F7C948; ' + L.OUT1 + '">' + '★'.repeat(got.stars) + '</span>' : ' · 데일리로');
    const aria = got ? b.name + '. ' + got.date + ' 데일리 준공, 최고 별 ' + got.stars + '개' : b.name + '. 아직 없어요. 데일리 현장이 ' + b.name + '인 날 준공하면 들어서요';
    return '<button type="button" data-act="dlot:' + k + '" aria-label="' + esc(aria) + '" style="' + L.at(x, y0, 220, h) + ' ' + L.BTN + '; background: transparent; border: 0">'
      + art + '<span style="' + L.at(20, 114, 180, 26) + ' display: block; box-sizing: border-box; ' + L.PAPER + '; text-align: center; font-size: 16px; line-height: 20px; white-space: nowrap">' + plate + '</span></button>';
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
    enter() { zone = 0; msg = '우리 회사 단지예요. 준공한 건물을 누르면 그 현장을 다시 할 수 있어요.'; },
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
      if (act === 'zone') {   // 1구역·2구역
        zone = n;
        const got = Object.keys(JG.save.data.built || {}).length;
        msg = zone ? '2구역: 데일리로 모은 건물 ' + got + '/' + JG.BUILDINGS.length + '채. 데일리 현장을 준공하면 그날의 건물이 들어서요.' : '1구역: 현장 5곳. 준공한 건물을 누르면 다시 할 수 있어요.';
        return;
      }
      if (act === 'dlot') {
        const b = JG.BUILDINGS[n], got = (JG.save.data.built || {})[b.id];
        msg = got ? b.name + ': ' + got.date.replace(/-/g, '.') + ' 데일리 준공 · 최고 별 ' + '★'.repeat(got.stars) + '☆'.repeat(3 - got.stars)
          : b.name + ': 아직 없어요. 데일리 현장이 ' + b.name + '인 날 준공하면 들어서요.' + (JG.daily.unlocked() ? '' : ' (데일리 현장은 5번 현장을 준공하면 열려요)');
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
      if (zone === 1) {   // 2구역 뒷줄이 설 언덕 (뒤쪽 땅이라 조금 연하게)
        h += '<div aria-hidden="true" style="' + L.at(0, 250, 1440, 150) + ' background: #A8D672"></div>';
        h += '<div aria-hidden="true" style="' + L.at(0, 250, 1440, 9) + ' background: #A8D672; box-shadow: inset 0 -4px 0 #8BC34A"></div>';
      }
      if (zone === 0) JG.SITES.forEach((site, i) => { h += lot(site, i); });
      else JG.BUILDINGS.forEach((b, k) => { h += dailyLot(b, k); });
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
      const got = Object.keys(d.built || {}).length;
      [['1구역 · 현장', 976], ['2구역 ' + got + '/' + JG.BUILDINGS.length, 1102]].forEach(([label, x], k) => {
        h += '<button type="button" data-act="zone:' + k + '" aria-pressed="' + (zone === k) + '" aria-label="' + (k ? '2구역, 데일리로 모은 건물 ' + got + '채' : '1구역, 현장 5곳') + '" style="' + L.at(x, 30, 120, 60) + ' ' + L.BTN + '; '
          + (zone === k ? L.PAPER : 'background: #CF965C; border: 3px solid #3B2A20') + '; font-size: 16px">' + esc(label) + '</button>';
      });
      h += '<p style="' + L.at(402, 30, 560, 60) + ' margin: 0; box-sizing: border-box; padding: 6px 18px; ' + L.PAPER + '; line-height: 21px; word-break: keep-all; overflow: hidden">' + esc(msg) + '</p>';
      h += '<button type="button" data-act="title" style="' + L.at(1236, 30, 180, 60) + ' ' + L.BTN + '; ' + L.PAPER + '">◀ 타이틀로</button>';
      return h + '</div>';
    }
  };
})();

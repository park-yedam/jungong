// 우리 회사 단지: 준공한 건물이 하나씩 들어서는 도트 마을. 판과 판 사이에 돌아오는 곳.
// 뒷줄: 땅 17칸을 한 줄로, 양옆으로 넘겨 본다. 현장 5곳(준공 → 건물, 열림 → 비계, 잠김 → 울타리) 다음에 데일리 건물 12종.
// 길: 가진 작업팀이 오간다.
// 앞줄: 현장 게시판(현장 고르기), 자재 창고(덱), 도감 책장(도감), 데일리 현장.
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc, P = JG.progress;
  const GROUND = 400, CELL = 36, K = CELL / 48;   // 건물 칸은 대전 화면의 3/4 크기
  let msg = '', scrollX = 0, scrollTo = null;   // 건물 줄을 넘긴 위치 (다시 그려도 그대로), 화살표로 넘길 목표
  const TOP = 112, ROW_H = GROUND + 56 - TOP, G = GROUND - TOP;   // 건물 줄: 무대 위쪽 TOP부터, 줄 안에서 땅 높이 G
  const SLOT = 240, SLOTS = 5 + JG.BUILDINGS.length, TRACK = 40 + SLOTS * SLOT;   // 땅 한 칸 폭, 칸 수, 줄 전체 폭
  const plateHtml = (line1, line2) => '<span style="' + L.at(10, G + 6, 180, 48) + ' display: block; box-sizing: border-box; ' + L.PAPER + '; text-align: center; font-size: 16px; line-height: 19px; padding-top: 3px; white-space: nowrap">' + line1 + '<br>' + line2 + '</span>';

  const span = (x, y, w, h, style) => '<span aria-hidden="true" style="' + L.at(x, y, w, h) + ' display: block; box-sizing: border-box; ' + style + '"></span>';
  // 3/4 크기로 줄인 벽돌 칸 하나
  const bay = (name, x, y, extra) => '<span aria-hidden="true" style="display: block; position: absolute; left: ' + (x - 3 * K) + 'px; top: ' + (y - 3 * K) + 'px; width: 3px; height: 3px; box-shadow: '
    + JG.SPRITES[name] + '; transform: scale(' + K + '); transform-origin: 0 0; ' + (extra || '') + '"></span>';

  // 땅 한 칸 버튼 (줄 안 좌표 x, 폭 200, 줄 높이 전체)
  const slotBtn = (act, x, aria, inner) => '<button type="button" data-act="' + act + '" aria-label="' + esc(aria) + '" style="' + L.at(x, 0, 200, ROW_H) + ' ' + L.BTN + '; background: transparent; border: 0">' + inner + '</button>';
  const stars = n => '<span style="color: #F7C948; ' + L.OUT1 + '">' + '★'.repeat(n) + '☆'.repeat(3 - n) + '</span>';

  // 현장 땅: 준공 → 도트 건물, 열림 → 비계, 잠김 → 울타리
  function lot(site, i) {
    const open = P.unlocked(i), best = P.best(site.id), floors = site.bricks / JG.RULES.bricksPerFloor - (site.basement || 0);
    let art = '';
    if (best) art = JG.buildingHtml(site.look, 100, G, 3);
    else if (open) { for (let f = 0; f < floors; f++) for (let b = 0; b < 4; b++) art += bay('bay_empty', 28 + b * CELL, G - CELL * (f + 1)); }
    else art = span(0, G - 36, 200, 36, 'background: #D9C4A0; border: 3px solid #3B2A20; background-image: repeating-linear-gradient(90deg, #D9C4A0 0 18px, #7A9A62 18px 24px)');
    const plate = best ? plateHtml(esc(site.name), stars(best) + ' 다시 하기') : open ? plateHtml(esc(site.name), '공사 예정 · 시작하기') : plateHtml('현장 ' + site.no, '잠김');
    const aria = best ? site.name + ' 준공. 최고 별 ' + best + '개. 눌러서 다시 하기' : open ? site.name + ' 공사 예정. 눌러서 시작' : site.no + '번 현장 잠김';
    return slotBtn('lot:' + i, 40 + i * SLOT, aria, art + plate);
  }

  // 데일리 땅: 모았으면 도트 건물, 아니면 빈 땅
  function dailyLot(b, k) {
    const got = (JG.save.data.built || {})[b.id];
    const art = got ? JG.buildingHtml(b.id, 100, G, 3)
      : span(30, G - 12, 140, 12, 'background: #D9C4A0; border: 3px dashed #B79E7A') + '<span aria-hidden="true" style="' + L.at(0, G - 52, 200) + ' display: block; text-align: center; font-size: 32px; line-height: 32px; color: rgba(139, 90, 43, 0.5)">?</span>';
    const aria = got ? b.name + '. ' + got.date + ' 데일리 준공, 최고 별 ' + got.stars + '개' : b.name + '. 아직 없어요. 데일리 현장이 ' + b.name + '인 날 준공하면 들어서요';
    return slotBtn('dlot:' + k, 40 + (5 + k) * SLOT, aria, art + plateHtml(esc(b.name), got ? stars(got.stars) : '데일리로 모아요'));
  }

  // 앞줄 시설 (예전의 70% 크기, 182×119): 도트 그림(점 3px) + 작은 이름판. extra: 그림 위에 얹을 것 (달력 날짜)
  function facility(act, cx, look, name, sub, aria, dim, extra) {
    return '<button type="button" data-act="' + act + '" aria-label="' + esc(aria) + '" style="' + L.at(cx - 91, 644, 182, 140) + ' ' + L.BTN + '; background: transparent; border: 0' + (dim ? '; opacity: 0.55' : '') + '">'
      + JG.buildingHtml(look, 91, 78, 3) + (extra || '')
      + '<span style="' + L.at(11, 84, 160, 44) + ' display: block; box-sizing: border-box; background: #F1E4C8; border: 3px solid #3B2A20; text-align: center; padding-top: 2px; white-space: nowrap">'
      + '<span style="display: block; font-size: 16px; line-height: 19px">' + esc(name) + '</span><span style="display: block; font-size: 14px; line-height: 16px; color: #8A4130">' + esc(sub) + '</span></span></button>';
  }
  // 달력 그림 위에 오늘 날짜 (잠겨 있으면 ?)
  const dayText = (day, locked) => '<span aria-hidden="true" style="' + L.at(46, 34, 90) + ' display: block; text-align: center; font-size: 24px; line-height: 30px; color: #3B2A20">' + (locked ? '?' : day) + '</span>';

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
    enter() { scrollX = 0; scrollTo = null; msg = '우리 회사 단지예요. 건물 줄은 옆으로 넘겨 볼 수 있어요. 준공한 현장을 누르면 다시 할 수 있어요.'; },
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
      if (act === 'scroll') { scrollTo = Math.max(0, Math.min(TRACK - 1440, scrollX + n * SLOT * 3)); return; }   // ◀ ▶: 세 칸씩
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

    afterRender(stage) {
      const row = stage.querySelector('#town-row');
      if (!row) return;
      row.scrollLeft = scrollX;
      if (scrollTo !== null) { row.scrollTo({ left: scrollTo, behavior: 'smooth' }); scrollTo = null; }
      row.addEventListener('scroll', () => { scrollX = row.scrollLeft; });
      row.addEventListener('wheel', e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { row.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
      // 마우스로 끌기 (손가락은 브라우저가 알아서 넘김). 끌었으면 손을 뗄 때 생기는 누르기는 무시
      let down = null, dragged = false;
      row.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button === 0) { down = { x: e.clientX, left: row.scrollLeft, k: stage.getBoundingClientRect().width / 1440 }; dragged = false; } });
      row.addEventListener('pointermove', e => {
        if (!down) return;
        const dx = (e.clientX - down.x) / down.k;
        if (Math.abs(dx) > 6) dragged = true;
        if (dragged) row.scrollLeft = down.left - dx;
      });
      addEventListener('pointerup', () => { down = null; }, { once: true });
      row.addEventListener('click', e => { if (dragged) { e.stopPropagation(); dragged = false; } }, true);
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
      // 건물 줄 (17칸, 옆으로 넘김) + 양 끝 화살표
      h += '<div id="town-row" style="' + L.at(0, TOP, 1440, ROW_H) + ' overflow-x: auto; overflow-y: hidden; scrollbar-width: none">'
        + '<div style="position: relative; width: ' + TRACK + 'px; height: ' + ROW_H + 'px">';
      JG.SITES.forEach((site, i) => { h += lot(site, i); });
      JG.BUILDINGS.forEach((b, k) => { h += dailyLot(b, k); });
      h += '</div></div>';
      [[-1, 8, '◀', '건물 줄 왼쪽으로'], [1, 1384, '▶', '건물 줄 오른쪽으로']].forEach(([dir, x, label, aria]) => {
        h += '<button type="button" data-act="scroll:' + dir + '" aria-label="' + aria + '" style="' + L.at(x, TOP + 120, 48, 72) + ' ' + L.BTN + '; ' + L.PAPER + '; font-size: 24px; opacity: 0.9">' + label + '</button>';
      });
      h += walkers();
      h += L.sprite(JG.bossSprite(), 1330, 480);   // 길 끝에 선 현장소장 (용어 OX를 다 맞히면 금색 안전모)
      // 앞줄 시설
      h += facility('board', 180, 'fac_board', '현장 게시판', '현장 고르기', '현장 게시판. 현장 고르기');
      h += facility('shed', 540, 'fac_shed', '자재 창고', '덱 ' + ((d.deck && d.deck.length) || 12) + '장', '자재 창고. 덱 편집');
      h += facility('shelf', 900, 'fac_shelf', '도감 책장', '카드 ' + d.dex.cards.length + '/' + Object.keys(JG.CARDS).length, '도감 책장. 도감 보기');
      h += facility('daily', 1260, 'fac_daily', '데일리 현장',
        dailyOpen ? today.name + ' · ' + (dBest ? '★'.repeat(dBest) + '☆'.repeat(3 - dBest) : '오늘 아직') : '5번 현장 준공 후',
        dailyOpen ? '데일리 현장. 오늘은 ' + today.name + (dBest ? ', 최고 별 ' + dBest + '개' : ', 아직 안 함') : '데일리 현장 잠김. 5번 현장을 준공하면 열려요', !dailyOpen,
        dayText(Number(today.dateKey.slice(8)), !dailyOpen));
      // 위쪽: 단지 이름판, 안내, 타이틀로
      h += '<div style="' + L.at(24, 18, 360, 93) + ' box-sizing: border-box; ' + L.WOOD + '">'
        + '<div style="' + L.at(6, 6, 342, 75) + ' box-sizing: border-box; ' + L.PAPER + '">'
        + '<h1 style="' + L.at(12, 9) + ' margin: 0; font-size: 32px; line-height: 32px; font-weight: normal">우리 회사 단지</h1>'
        + '<div style="' + L.at(12, 44) + ' color: #5C3A1E">칭호: ' + esc(rank) + ' · 모은 별 ' + d.stars + '개</div></div></div>';
      h += '<p style="' + L.at(402, 30, 816, 60) + ' margin: 0; box-sizing: border-box; padding: 6px 18px; ' + L.PAPER + '; line-height: 21px; word-break: keep-all; overflow: hidden">' + esc(msg) + '</p>';
      h += '<button type="button" data-act="title" style="' + L.at(1236, 30, 180, 60) + ' ' + L.BTN + '; ' + L.PAPER + '">◀ 타이틀로</button>';
      return h + '</div>';
    }
  };
})();

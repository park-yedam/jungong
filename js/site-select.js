// 현장 고르기 화면 (현장 게시판): 현장마다 종이 공고 한 장. 앞 현장을 준공하면 다음 현장이 열린다
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc, P = JG.progress;
  let msg = '';

  // 이 현장에 나오는 문제 이름들 (예고 순서에서 중복 빼고)
  const problemNames = site => [...new Set(site.forecast.filter(Boolean))].map(id => JG.PROBLEMS[id].name).join(', ');

  // 공고 위의 작은 건물: 준공했으면 벽돌과 불 켜진 창(지하층은 어둡게), 아니면 비계(점선). 층이 많으면 칸을 낮춘다
  function miniBuilding(site, x, bottom) {
    const floors = site.bricks / JG.RULES.bricksPerFloor, done = P.best(site.id) > 0, base = site.basement || 0;
    const step = Math.min(24, Math.floor(108 / floors));
    let h = '';
    for (let f = 0; f < floors; f++) {
      for (let b = 0; b < 4; b++) {
        const st = L.at(x + b * 33, bottom - (f + 1) * step, 30, step - 3) + ' display: block; box-sizing: border-box; ';
        h += done
          ? '<span aria-hidden="true" style="' + st + 'background: ' + (f < base ? '#8E4A30' : '#C0603C') + '; border: 3px solid #3B2A20"><span style="' + L.at(9, 3, 6, Math.min(6, step - 12)) + ' display: block; background: #F7C948"></span></span>'
          : '<span aria-hidden="true" style="' + st + 'border: 3px dashed #B07A47"></span>';
      }
    }
    return h;
  }

  function notice(site, i, x, y, w, h) {
    const open = P.unlocked(i), best = P.best(site.id), next = open && site.id === P.nextSite().id && !best;
    const cond = site.condition ? JG.CONDITIONS[site.condition] : null;
    const floors = site.bricks / JG.RULES.bricksPerFloor, base = site.basement || 0;
    const floorText = base ? '지하 ' + base + '층 + 지상 ' + (floors - base) + '층' : floors + '층';
    const aria = site.no + '번 현장 ' + site.name + '. 벽돌 ' + site.bricks + '칸 ' + floorText + '. '
      + (open ? (best ? '최고 기록 별 ' + best + '개' : '아직 준공 전') : '잠김. ' + (site.no - 1) + '번 현장을 준공하면 열려요');
    const para = (text, color) => '<span style="display: block; margin-bottom: 6px; color: ' + (color || '#3B2A20') + '">' + esc(text) + '</span>';

    let b = '<button type="button" data-act="site:' + i + '" aria-label="' + esc(aria) + '" style="' + L.at(x, y, w, h) + ' ' + L.BTN + '; text-align: left; '
      + (open ? L.PAPER : 'background: #D9C08A; border: 3px solid #3B2A20') + (next ? '; ' + L.PULSE : '') + '">';
    b += '<span aria-hidden="true" style="' + L.at(w / 2 - 9, 6, 12, 12) + ' display: block; background: #E35D5B; border: 3px solid #3B2A20"></span>';
    b += '<span style="' + L.at(15, 22) + ' display: block; color: #5C3A1E">현장 ' + site.no + '</span>';
    b += '<span style="' + L.at(15, 42, w - 30) + ' display: block; font-size: 32px; line-height: 34px; word-break: keep-all">' + esc(site.name) + '</span>';
    b += '<span style="' + L.at(0, 0, w, h) + ' display: block">' + miniBuilding(site, Math.round((w - 6 - 129) / 2), 236) + '</span>';
    // 정보는 글이 넘치지 않게 흘려서 쓴다
    b += '<span style="' + L.at(15, 248, w - 30) + ' display: block; line-height: 20px; word-break: keep-all">'
      + para('벽돌 ' + site.bricks + '칸 · ' + floorText)
      + para('조건: ' + (cond ? cond.name + ' (' + cond.text + ')' : '없음') + (site.turnSeconds ? ' · 턴 ' + site.turnSeconds + '초' : ''), cond ? '#8B3A1E' : '#3B2A20')
      + para('배우는 것: ' + site.learn, '#3E5C8A')
      + para('문제: ' + problemNames(site), '#5C3A1E') + '</span>';
    if (!open) {
      b += '<span style="' + L.at(9, h - 54, w - 24, 42) + ' display: block; box-sizing: border-box; background: #5C3A1E; color: #FFFFFF; text-align: center; line-height: 18px; padding-top: 1px; border: 3px solid #3B2A20">잠김<br>' + (site.no - 1) + '번 현장을 준공하면</span>';
    } else {
      b += '<span style="' + L.at(15, h - 44, w - 30) + ' display: block; color: #5C3A1E">'
        + (best ? '<span style="color: #F7C948; ' + L.OUT1 + '">' + '★'.repeat(best) + '☆'.repeat(3 - best) + '</span> 최고 기록' : (next ? '다음 현장! 눌러서 시작' : '아직 준공 전')) + '</span>';
    }
    return b + '</button>';
  }

  JG.screens.sites = {
    enter() { msg = '어느 현장으로 갈까요? 공고를 누르면 그 현장이 시작돼요.'; },
    msg: () => msg,

    click(act, n) {
      JG.sound.play('tick');
      if (act === 'title') { JG.app.show('title'); return; }
      if (act !== 'site') return;
      const site = JG.SITES[n];
      if (!P.unlocked(n)) { msg = JG.engine.eun(site.name) + ' 아직 잠겨 있어요. ' + (site.no - 1) + '번 현장을 먼저 준공해 주세요.'; return; }
      JG.app.show('tbm', { siteId: site.id });
    },

    render() {
      const n = JG.SITES.length, gap = 24, inner = 1236;
      const w = Math.floor((inner - gap * (n - 1)) / n);
      let h = '<div style="' + L.ROOT + '; background: #A9CFE0">';
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 120) + ' background: #D9A066"></div>';
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 12) + ' background: #8BC34A; box-shadow: inset 0 -3px 0 #6FA83A"></div>';
      h += '<div style="' + L.at(84, 24, 1272, 642) + ' box-sizing: border-box; ' + L.WOOD + '">';
      h += '<h1 style="' + L.at(0, 15, 1266) + ' margin: 0; text-align: center; font-size: 32px; line-height: 32px; font-weight: normal; color: #FFFFFF; ' + L.OUT2 + '">현장 게시판</h1>';
      JG.SITES.forEach((site, i) => { h += notice(site, i, 15 + i * (w + gap), 72, w, 540); });
      h += '</div>';
      h += '<button type="button" data-act="title" style="' + L.at(84, 714, 240, 72) + ' ' + L.BTN + '; ' + L.PAPER + '; font-size: 16px">◀ 타이틀로</button>';
      h += '<p style="' + L.at(348, 714, 1008, 72) + ' margin: 0; box-sizing: border-box; padding: 0 18px; ' + L.PAPER + '; line-height: 66px; white-space: nowrap; overflow: hidden">' + esc(msg) + '</p>';
      return h + '</div>';
    }
  };
})();

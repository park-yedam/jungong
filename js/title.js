// 타이틀 화면: 빠른 시작(다음 현장 바로), 이어하기(하던 판), 현장 고르기
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc;
  const GROUND = 588;   // 잔디 윗선
  let msg = '';

  function siteOf(id) { return JG.SITES.find(s => s.id === id); }

  // 왼쪽의 다 지은 건물 (4층, 창문에 불)
  function building(x0, floors) {
    let h = '';
    for (let f = 0; f < floors; f++) {
      for (let b = 0; b < 4; b++) h += L.sprite('bay_lit', x0 + b * 48 - 3, GROUND - 48 * (f + 1) - 3);
    }
    const top = GROUND - 48 * floors;
    h += '<div aria-hidden="true" style="' + L.at(x0 - 6, top - 21, 204, 21) + ' box-sizing: border-box; background: #9AA0A6; border: 3px solid #3B2A20"></div>';
    h += L.sprite('flag', x0 + 75, top - 60);
    return h;
  }

  function button(act, x, y, w, h, style, label, sub, aria) {
    return '<button type="button" data-act="' + act + '" aria-label="' + esc(aria) + '" style="' + L.at(x, y, w, h) + ' ' + L.BTN + '; ' + style + '">'
      + label + (sub ? '<span style="display: block; margin-top: 8px; font-size: 16px; line-height: 16px">' + esc(sub) + '</span>' : '') + '</button>';
  }

  JG.screens.title = {
    enter() { msg = '준공!에 오신 걸 환영해요. 빠른 시작을 누르면 다음 현장으로 바로 가요.'; },
    msg: () => msg,

    click(act) {
      if (act === 'quick') JG.app.show('tbm', { siteId: JG.progress.nextSite().id });
      else if (act === 'continue' && JG.save.data.game) JG.app.show('battle', { resume: true });
      else if (act === 'sites') JG.app.show('sites');
    },

    render() {
      const next = JG.progress.nextSite(), game = JG.save.data.game, gsite = game && siteOf(game.siteId);
      let h = '<div style="' + L.ROOT + '; background: #A9CFE0">';

      // 하늘과 땅
      h += L.sprite('cloud', 96, 96) + L.sprite('cloud', 1180, 60) + L.sprite('cloud', 960, 250) + L.sprite('cloud', 380, 300);
      h += '<div aria-hidden="true" style="' + L.at(0, GROUND, 1440, 810 - GROUND) + ' background: #D9A066"></div>';
      h += '<div aria-hidden="true" style="' + L.at(0, GROUND, 1440, 12) + ' background: #8BC34A; box-shadow: inset 0 -3px 0 #6FA83A"></div>';

      // 다 지은 건물과 작업팀
      h += building(150, 4);
      ['rebar', 'form', 'pour', 'safety'].forEach((id, i) => { h += L.sprite(id, 1000 + i * 72, GROUND - 72); });
      h += L.sprite('pump', 1290, GROUND - 42);
      h += '<div aria-hidden="true" style="' + L.at(1150, GROUND - 120) + ' padding: 6px 9px; background: #FFFFFF; border: 3px solid #3B2A20; white-space: nowrap">오늘도 무사고!'
        + '<div style="' + L.at(18, 30, 9, 6) + ' background: #FFFFFF; border-left: 3px solid #3B2A20; border-right: 3px solid #3B2A20"></div></div>';

      // 로고
      h += '<h1 style="' + L.at(0, 48, 1440) + ' margin: 0; text-align: center; font-size: 96px; line-height: 96px; font-weight: normal; color: #F7C948; ' + L.OUT4 + '">준공!</h1>';
      h += '<p style="' + L.at(470, 168, 500, 40) + ' margin: 0; box-sizing: border-box; ' + L.PAPER + '; text-align: center; font-size: 16px; line-height: 34px">현장소장이 되어 건물을 끝까지 올려요</p>';

      // 버튼 게시판 (나무판 + 기둥). 이어할 판이 있을 때만 이어하기 버튼이 생긴다
      const stars = JG.progress.totalStars();
      const rows = [{ act: 'quick', h: 84, style: L.GREEN + '; color: #FFFFFF; font-size: 32px; line-height: 32px; ' + L.OUT2,
        label: '빠른 시작', sub: '다음 현장: ' + next.no + '. ' + next.name, aria: '빠른 시작. 다음 현장 ' + next.no + '번 ' + next.name }];
      if (game && gsite) rows.push({ act: 'continue', h: 64, style: L.PAPER,
        label: '이어하기', sub: gsite.name + ' · ' + game.turn + '턴', aria: '이어하기. ' + gsite.name + ' ' + game.turn + '턴' });
      rows.push({ act: 'sites', h: 64, style: L.PAPER, label: '현장 고르기', sub: '모은 별 ' + stars + '개', aria: '현장 고르기. 모은 별 ' + stars + '개' });

      const bx = 564, by = 240, pad = 21, gap = 12;
      const bh = pad * 2 + 6 + rows.reduce((n, r) => n + r.h, 0) + gap * (rows.length - 1);
      [bx + 60, bx + 288].forEach(px => {
        h += '<div aria-hidden="true" style="' + L.at(px, by + bh, 12, GROUND - by - bh) + ' box-sizing: border-box; background: #6B4420; border: 3px solid #3B2A20; border-top: 0"></div>';
      });
      h += '<div style="' + L.at(bx, by, 360, bh) + ' box-sizing: border-box; ' + L.WOOD + '">';
      let y = pad;
      rows.forEach(r => { h += button(r.act, pad, y, 312, r.h, r.style, r.label, r.sub, r.aria); y += r.h + gap; });
      h += '</div>';

      h += '<p style="' + L.at(0, 772, 1440) + ' margin: 0; text-align: center; font-size: 16px; color: #5C3A1E">도트 글꼴: 갈무리 (SIL 오픈 폰트 라이선스)</p>';
      return h + '</div>';
    }
  };
})();

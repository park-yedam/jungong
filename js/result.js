// 준공 결과 화면 (시안 ③): 기념사진, 별, 이번 판 공정표, 칭호, 새 카드, 오늘의 현장 말
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc, E = JG.engine;
  const TRADES = [['rebar', '철근', '#E07A3F'], ['formwork', '형틀·가설', '#B5835A'], ['concrete', '타설', '#9AA0A6'], ['equipment', '장비', '#F2C230'], ['safety', '안전', '#5BB65F']];
  const NOT_PEOPLE = ['pump', 'tower', 'shore', 'earth'];   // 사진에 사람으로 세우지 않는 카드 (장비, 가설물)
  let g, info, msg, today;

  const site = () => E.siteOf(g);
  const pad2 = n => String(n).padStart(2, '0');
  const txt = (x, y, text, style) => '<div style="' + L.at(x, y) + ' ' + (style || '') + '">' + esc(text) + '</div>';

  // 준공한 현장 다음 현장 id (열려 있을 때만)
  function nextSiteId() {
    const i = JG.SITES.findIndex(s => s.id === g.siteId);
    return i + 1 < JG.SITES.length && JG.progress.unlocked(i + 1) ? JG.SITES[i + 1].id : null;
  }

  // 스프라이트 크기 (점 단위 → px)
  function spriteSize(name) {
    const pts = JG.SPRITES[name].split(',').map(p => p.trim().split(/\s+/).slice(0, 2).map(parseFloat));
    return [Math.max(...pts.map(p => p[0])) + 3, Math.max(...pts.map(p => p[1])) + 3];
  }

  // 이번 판 공정표: 공종별로 일한 턴을 막대로, 층 완성 턴을 표시로
  function gantt() {
    const N = g.turn, colW = Math.min(54, Math.floor(486 / N)), x0 = 96;
    let h = txt(12, 9, '이번 판 공정표') + txt(414, 9, '실제 기록 · ' + N + '턴', 'width: 168px; text-align: right; color: #5C3A1E');
    for (let t = 0; t <= N; t++) h += '<div aria-hidden="true" style="' + L.at(x0 + t * colW, 33, 3, 228) + ' background: rgba(139, 90, 43, 0.18)"></div>';
    for (let t = 1; t <= N; t++) h += txt(x0 + (t - 1) * colW, 36, colW >= 54 ? t + '턴' : String(t), 'width: ' + colW + 'px; text-align: center; color: #5C3A1E');

    h += txt(12, 64, '층 완성', 'color: #8B3A1E');
    // 같은 턴에 완성한 층은 한 표시로 (지하층은 B2, B1)
    const b = site().basement || 0, short = f => (f <= b ? 'B' + (b - f + 1) : (f - b) + '층');
    const byTurn = {};
    g.rec.floors.forEach((t, f) => { (byTurn[t] = byTurn[t] || []).push(f + 1); });
    Object.keys(byTurn).forEach(t => {
      const fl = byTurn[t], unit = colW >= 54 ? '층' : '';   // 칸이 좁으면 '층'을 빼서 옆 표시와 겹치지 않게
      const label = fl.every(f => f > b) ? fl.map(f => f - b).join('·') + unit : fl.map(short).join('·').replace(/층/g, unit);
      const w = 12 + [...label].reduce((n, ch) => n + (ch === '층' ? 16 : 9), 0);
      const x = Math.round(x0 + (t - 1) * colW + colW / 2 - w / 2);
      h += '<div style="' + L.at(x, 60, w, 24) + ' box-sizing: border-box; background: #FFE08A; border: 3px solid #3B2A20; text-align: center; line-height: 18px">' + esc(label) + '</div>';
    });

    TRADES.forEach(([id, name, color], i) => {
      const y = 104 + i * 33;
      h += txt(12, y, name) + '<div aria-hidden="true" style="' + L.at(96, y + 22, 486, 3) + ' background: #E0C998"></div>';
      for (let t = 1; t <= N; t++) {
        const on = k => (g.rec.work[k - 1] || []).includes(id);
        if (!on(t) || on(t - 1)) continue;   // 이어지는 턴 묶음의 첫 턴에서만 막대를 그린다
        let len = 1;
        while (t + len <= N && on(t + len)) len++;
        h += '<div aria-hidden="true" style="' + L.at(x0 + (t - 1) * colW + 3, y - 2, len * colW - 6, 21) + ' box-sizing: border-box; background: ' + color + '; border: 3px solid #3B2A20"></div>';
      }
    });
    h += txt(12, 270, '막대 = 그 공종 작업팀이 일한 턴. 양생 중인 턴은 비어요.', 'color: #5C3A1E');
    return h;
  }

  // 공정표를 읽기 프로그램용 문장으로
  function ganttAria() {
    const floors = g.rec.floors.map((t, f) => E.floorName(g, f + 1) + ' ' + t + '턴').join(', ');
    const rows = TRADES.map(([id, name]) => {
      const turns = g.rec.work.map((w, k) => (w || []).includes(id) ? k + 1 : 0).filter(Boolean);
      return name + ' ' + (turns.length ? turns.join('·') + '턴' : '없음');
    }).join(', ');
    return '이번 판 공정표. 층 완성: ' + floors + '. 공종별 일한 턴: ' + rows + '.';
  }

  function rankPanel() {
    const R = JG.RANKS, up = info.rank > info.rankBefore, next = R[info.rank + 1];
    return txt(12, 12, up ? '칭호 승진! (' + R[info.rankBefore].name + ' →)' : '지금 칭호', 'color: #B83E3C')
      + txt(12, 38, R[info.rank].name, 'font-size: 32px; line-height: 32px')
      + txt(12, 82, '모은 별 ' + info.total + '개 (이번 판 +' + info.stars + ')', 'color: #5C3A1E')
      + txt(12, 102, next ? '다음 칭호: ' + next.name + ' (별 ' + next.stars + '개)' : '가장 높은 칭호예요!', 'color: #5C3A1E');
  }

  // 새 카드 칸: 처음 준공한 현장이면 보상 카드(보통 2장), 아니면 '이번에는 없어요'
  function cardPanel() {
    const list = info.rewards || [];
    let h = txt(12, 12, list.length ? '새 카드 ' + list.length + '장 · 자재 창고로' : '새 카드', 'color: #B83E3C');
    if (!list.length) {
      return h + txt(12, 40, '이번에는 없어요', 'font-size: 32px; line-height: 32px')
        + '<p style="' + L.at(12, 82, 264) + ' margin: 0; line-height: 20px; color: #5C3A1E; word-break: keep-all">현장을 처음 준공하면 확장 카드를 받아요.</p>';
    }
    const box = (id, x) => { const [sw, sh] = spriteSize(id); return '<div aria-hidden="true" style="' + L.at(x, 36, 66, 84) + ' box-sizing: border-box; ' + L.PAPER + '">' + L.sprite(id, Math.round((60 - sw) / 2), Math.round((78 - sh) / 2)) + '</div>'; };
    if (list.length === 1) {
      const c = JG.CARDS[list[0]], meta = '코인 ' + c.cost + ' · ' + (c.kind === 'crew' ? c.atk + '/' + c.hp : '공법') + ' · ' + c.text;
      return h + box(list[0], 12) + txt(90, 40, c.name, 'font-size: 32px; line-height: 32px; white-space: nowrap')
        + '<p style="' + L.at(90, 82, 186) + ' margin: 0; line-height: 20px; color: #5C3A1E; word-break: keep-all">' + esc(meta) + '</p>';
    }
    // 2장이면 한 줄에 하나씩: 반 크기 그림 + 이름 + 능력치
    list.slice(0, 2).forEach((id, i) => {
      const c = JG.CARDS[id], [sw, sh] = spriteSize(id), y = 34 + i * 46;
      h += '<div aria-hidden="true" style="' + L.at(12, y, 42, 42) + ' box-sizing: border-box; ' + L.PAPER + '; overflow: hidden">'
        + '<div style="' + L.at(Math.round((36 - sw / 2) / 2), Math.round((36 - sh / 2) / 2)) + ' transform: scale(0.5); transform-origin: 0 0">' + L.sprite(id, 0, 0) + '</div></div>'
        + txt(64, y + 3, c.name, 'white-space: nowrap')
        + txt(64, y + 23, (c.kind === 'crew' ? c.atk + '/' + c.hp : '공법') + ' · 코인 ' + c.cost, 'color: #5C3A1E; white-space: nowrap');
    });
    return h;
  }

  function button(act, x, w, label, style) {
    return '<button type="button" data-act="' + act + '" style="' + L.at(x, 654, w, 60) + ' ' + L.BTN + '; ' + style + '">' + esc(label) + '</button>';
  }

  // 사진에 넣을 값: 층수, 이번 판에 낸 작업팀(차 제외), 펌프카를 썼는지, 날짜
  function photoData() {
    const crew = g.rec.cards.filter(id => JG.CARDS[id].kind === 'crew' && !NOT_PEOPLE.includes(id));
    return { floors: E.totalFloors(g), crew, pump: g.rec.cards.includes('pump'), dateText: today + ' · ' + site().name + ' 준공' };
  }

  function savePhoto() {
    const canvas = document.getElementById('photo');
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '준공_' + site().name.replace(/\s/g, '') + '_' + today.replace(/\./g, '-') + '.png';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  }

  JG.screens.result = {
    // arg: { state: 끝난 판의 엔진 상태, info: JG.progress.record()가 돌려준 정보 }
    enter(arg) {
      g = arg.state; info = arg.info;
      const d = new Date();
      today = d.getFullYear() + '.' + pad2(d.getMonth() + 1) + '.' + pad2(d.getDate());
      JG.progress.seeSlang('shimai');
      msg = '준공! ' + E.eul(site().name) + ' ' + g.turn + '턴 만에 다 올렸어요. 별 ' + info.stars + '개.'
        + ((info.rewards || []).length ? ' 새 카드 ' + E.eul(info.rewards.map(id => JG.CARDS[id].name).join(', ')) + ' 받았어요.' : '')
        + (info.rank > info.rankBefore ? ' 칭호가 ' + E.ro(JG.RANKS[info.rank].name) + ' 올랐어요!' : '');
    },
    msg: () => msg,

    click(act) {
      JG.sound.play('tick');
      if (act === 'next') JG.app.show('tbm', { siteId: nextSiteId() });
      else if (act === 'restart') JG.app.show('tbm', { siteId: g.siteId });
      else if (act === 'sites') JG.app.show('sites');
      else if (act === 'title') JG.app.show('title');
      else if (act === 'photo') { savePhoto(); msg = '기념사진을 PNG 파일로 저장했어요. 다운로드 폴더를 확인해 주세요.'; }
    },

    afterRender(stage) {
      const canvas = stage.querySelector('#photo');
      document.fonts.load("32px 'Galmuri11'").then(() => JG.drawPhoto(canvas, photoData()));
    },

    render() {
      const st = info.stars, next = nextSiteId(), sl = JG.SLANG.shimai;
      let h = '<div style="' + L.ROOT + '; background: #7A4E26">';
      for (let y = 45; y < 810; y += 54) h += '<div aria-hidden="true" style="' + L.at(0, y, 1440, 3) + ' background: #6B4420"></div>';

      h += '<canvas id="photo" width="640" height="678" role="img" aria-label="준공 기념사진. ' + esc(site().name) + ' 앞에 작업팀과 현장소장이 모여 있어요. ' + esc(today) + ', 모두 무사히 마무리!"'
        + ' style="' + L.at(60, 72, 640, 678) + ' transform: rotate(-1.5deg); box-shadow: 9px 9px 0 rgba(59, 42, 32, 0.35); image-rendering: pixelated"></canvas>';

      h += '<div style="' + L.at(756, 48, 648, 732) + ' box-sizing: border-box; ' + L.WOOD + '">';
      h += '<h1 style="' + L.at(24, 24) + ' margin: 0; font-size: 48px; line-height: 48px; font-weight: normal; color: #FFFFFF; ' + L.OUT2 + '">준공!</h1>';
      h += '<div aria-label="별 ' + st + '개" style="' + L.at(204, 24) + ' font-size: 48px; line-height: 48px; color: #F7C948; ' + L.OUT2 + '">' + '★'.repeat(st) + '☆'.repeat(3 - st) + '</div>';
      h += txt(24, 80, site().name + ' · 남은 공기 D-' + g.days + ' · ' + g.turn + '턴', 'color: #FFE08A; ' + L.OUT1);

      h += '<div role="img" aria-label="' + esc(ganttAria()) + '" style="' + L.at(24, 120, 600, 300) + ' box-sizing: border-box; ' + L.PAPER + '">' + gantt() + '</div>';
      h += '<div style="' + L.at(24, 438, 288, 132) + ' box-sizing: border-box; ' + L.PAPER + '">' + rankPanel() + '</div>';
      h += '<div style="' + L.at(336, 438, 288, 132) + ' box-sizing: border-box; ' + L.PAPER + '">' + cardPanel() + '</div>';
      h += '<div style="' + L.at(24, 588, 600, 48) + ' box-sizing: border-box; ' + L.PAPER + '">'
        + txt(12, 13, '오늘의 현장 말', 'color: #8B3A1E') + txt(156, 13, sl.said + ' → ' + sl.proper) + txt(330, 13, '(도감에 저장됨)', 'color: #5C3A1E') + '</div>';

      const green = L.GREEN + '; font-size: 32px; line-height: 32px; color: #FFFFFF; ' + L.OUT2;
      const wood = L.WOOD + '; color: #FFFFFF; ' + L.OUT1;
      h += button(next ? 'next' : 'sites', 24, 192, next ? '다음 현장' : '현장 고르기', green);
      h += button('restart', 228, 120, '다시 하기', wood);
      h += button(next ? 'sites' : 'title', 360, 120, next ? '현장 고르기' : '타이틀로', L.PAPER);
      h += button('photo', 492, 120, '사진 저장', L.PAPER);
      h += '</div>';
      return h + '</div>';
    }
  };
})();

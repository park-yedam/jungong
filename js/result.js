// 준공 결과 화면 (시안 ③): 기념사진, 별, 이번 판 공정표, 칭호, 새 카드, 오늘의 현장 말
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc, E = JG.engine;
  const TRADES = [['rebar', '철근', '#E07A3F'], ['formwork', '형틀·가설', '#B5835A'], ['concrete', '타설', '#9AA0A6'], ['equipment', '장비', '#F2C230'], ['safety', '안전', '#5BB65F'],
    ['steel', '철골', '#5B6B7A'], ['finish', '조적·방수', '#B4533A'], ['general', '공통', '#9C7BB8']];
  // 이번 판에 한 번이라도 일한 공종만 (카드 확장으로 공종이 8개라 다 그리면 넘친다)
  const usedTrades = () => TRADES.filter(([id]) => g.rec.work.some(w => (w || []).includes(id)));
  const NOT_PEOPLE = ['pump', 'tower', 'shore', 'earth'];   // 사진에 사람으로 세우지 않는 카드 (장비, 가설물)
  let g, info, msg, today;

  const site = () => E.siteOf(g);
  const isDaily = () => !!site().daily;
  const siteTitle = () => (isDaily() ? '데일리 · ' : '') + site().name;
  const pad2 = n => String(n).padStart(2, '0');
  const txt = (x, y, text, style) => '<div style="' + L.at(x, y) + ' ' + (style || '') + '">' + esc(text) + '</div>';

  // 준공한 현장 다음 현장 id (열려 있을 때만, 데일리는 없음)
  function nextSiteId() {
    if (isDaily()) return null;
    const i = JG.SITES.findIndex(s => s.id === g.siteId);
    return i + 1 < JG.SITES.length && JG.progress.unlocked(i + 1) ? JG.SITES[i + 1].id : null;
  }

  const isScenario = () => !!site().scenario;

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

    const rows = usedTrades(), rowH = Math.min(33, Math.floor(165 / Math.max(1, rows.length)));
    rows.forEach(([id, name, color], i) => {
      const y = 104 + i * rowH;
      h += txt(12, y, name) + '<div aria-hidden="true" style="' + L.at(96, y + 22, 486, 3) + ' background: #E0C998"></div>';
      for (let t = 1; t <= N; t++) {
        const on = k => (g.rec.work[k - 1] || []).includes(id);
        if (!on(t) || on(t - 1)) continue;   // 이어지는 턴 묶음의 첫 턴에서만 막대를 그린다
        let len = 1;
        while (t + len <= N && on(t + len)) len++;
        h += '<div aria-hidden="true" style="' + L.at(x0 + (t - 1) * colW + 3, y - 2, len * colW - 6, Math.min(21, rowH - 3)) + ' box-sizing: border-box; background: ' + color + '; border: 3px solid #3B2A20"></div>';
      }
    });
    h += txt(12, 270, '막대 = 그 공종 작업팀이 일한 턴. 양생 중인 턴은 비어요.', 'color: #5C3A1E');
    return h;
  }

  // 공정표를 읽기 프로그램용 문장으로
  function ganttAria() {
    const floors = g.rec.floors.map((t, f) => E.floorName(g, f + 1) + ' ' + t + '턴').join(', ');
    const rows = usedTrades().map(([id, name]) => {
      const turns = g.rec.work.map((w, k) => (w || []).includes(id) ? k + 1 : 0).filter(Boolean);
      return name + ' ' + (turns.length ? turns.join('·') + '턴' : '없음');
    }).join(', ');
    return '이번 판 공정표. 층 완성: ' + floors + '. 공종별 일한 턴: ' + rows + '.';
  }

  function rankPanel() {
    const R = JG.RANKS, up = info.rank > info.rankBefore, next = R[info.rank + 1];
    return txt(12, 12, up ? '칭호 승진! (' + R[info.rankBefore].name + ' →)' : '지금 칭호', 'color: #B83E3C')
      + txt(12, 38, R[info.rank].name, 'font-size: 32px; line-height: 32px')
      + txt(12, 82, '모은 별 ' + info.total + '개 ' + (info.counted === false ? '(수업 현장은 기록 안 함)' : '(이번 판 +' + info.stars + ')'), 'color: #5C3A1E')
      + txt(12, 102, next ? '다음 칭호: ' + next.name + ' (별 ' + next.stars + '개)' : '가장 높은 칭호예요!', 'color: #5C3A1E');
  }

  // 새 카드를 못 받았을 때 안내: 다음에 열릴 카드까지 남은 별
  function nextCardText() {
    const u = JG.progress.nextUnlock();
    return u ? '모은 별 ' + u.stars + '개가 되면 새 카드 ' + u.cards.length + '장이 열려요. (지금 ' + info.total + '개)' : '새 카드를 모두 모았어요!';
  }
  // 새 카드 칸: 처음 준공한 현장의 보상 카드(보통 2장)와 모은 별로 열린 카드, 없으면 '이번에는 없어요'
  function cardPanel() {
    const list = info.rewards || [];
    let h = txt(12, 12, list.length ? '새 카드 ' + list.length + '장 · 자재 창고로' : '새 카드', 'color: #B83E3C');
    if (!list.length && info.newBuilding) {   // 데일리로 새 건물이 단지에
      const b = JG.BUILDINGS.find(x => x.id === info.newBuilding), img = JG.buildingImg(b.id), dot = img.h * 2 <= 90 ? 2 : 1.5;
      return txt(12, 12, '새 건물 · 우리 회사 단지로', 'color: #B83E3C') + JG.buildingHtml(b.id, 62, 124, dot)
        + txt(124, 44, b.name, 'font-size: 32px; line-height: 32px; white-space: nowrap')
        + '<p style="' + L.at(124, 84, 152) + ' margin: 0; line-height: 20px; color: #5C3A1E; word-break: keep-all">단지 2구역에 들어섰어요</p>';
    }
    if (!list.length) {
      return h + txt(12, 40, '이번에는 없어요', 'font-size: 32px; line-height: 32px')
        + '<p style="' + L.at(12, 82, 264) + ' margin: 0; line-height: 20px; color: #5C3A1E; word-break: keep-all">'
        + (isScenario() ? '수업 현장은 연습용이라 카드와 별을 주지 않아요.' : nextCardText()) + '</p>';
    }
    const box = (id, x) => { const [sw, sh] = spriteSize(id); return '<div aria-hidden="true" style="' + L.at(x, 36, 66, 84) + ' box-sizing: border-box; ' + L.PAPER + '">' + L.sprite(id, Math.round((60 - sw) / 2), Math.round((78 - sh) / 2)) + '</div>'; };
    if (list.length === 1) {
      const c = JG.CARDS[list[0]], meta = '코인 ' + c.cost + ' · ' + (c.kind === 'crew' ? c.atk + '/' + c.hp : '공법') + ' · ' + c.text;
      return h + box(list[0], 12) + txt(90, 40, c.name, 'font-size: 32px; line-height: 32px; white-space: nowrap')
        + '<p style="' + L.at(90, 82, 186) + ' margin: 0; line-height: 20px; color: #5C3A1E; word-break: keep-all">' + esc(meta) + '</p>';
    }
    if (list.length > 2) {   // 3장 이상 (현장 보상 + 모은 별로 열린 카드): 반 크기 그림을 한 줄로, 이름은 아래에
      list.slice(0, 5).forEach((id, i) => {
        const [sw, sh] = spriteSize(id);
        h += '<div aria-hidden="true" style="' + L.at(12 + i * 50, 34, 42, 42) + ' box-sizing: border-box; ' + L.PAPER + '; overflow: hidden">'
          + '<div style="' + L.at(Math.round((36 - sw / 2) / 2), Math.round((36 - sh / 2) / 2)) + ' transform: scale(0.5); transform-origin: 0 0">' + L.sprite(id, 0, 0) + '</div></div>';
      });
      return h + '<p style="' + L.at(12, 82, 264) + ' margin: 0; font-size: 14px; line-height: 18px; color: #5C3A1E; word-break: keep-all">' + esc(list.map(id => JG.CARDS[id].name).join(', ')) + '</p>';
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
    return { floors: E.totalFloors(g), crew, pump: g.rec.cards.includes('pump'), dateText: today + ' · ' + (isDaily() ? '데일리 현장 ' : '') + site().name + ' 준공' };
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
      msg = '준공! ' + (isDaily() ? '오늘의 데일리 현장 ' : '') + E.eul(site().name) + ' ' + g.turn + '턴 만에 다 올렸어요. 별 ' + info.stars + '개.'
        + (isDaily() ? ' 결과 복사를 눌러 친구와 별을 비교해 보세요.' : '') + (isScenario() ? ' 수업 현장은 연습용이라 별이 기록되지 않아요.' : '')
        + ((info.rewards || []).length ? ' 새 카드 ' + E.eul(info.rewards.map(id => JG.CARDS[id].name).join(', ')) + ' 받았어요.' : '')
        + ((info.starCards || []).length ? ' (모은 별 ' + info.total + '개로 열린 카드 포함)' : '')
        + (info.newBuilding ? ' 새 건물: ' + E.ga(JG.BUILDINGS.find(x => x.id === info.newBuilding).name) + ' 우리 회사 단지 2구역에 들어섰어요!' : '')
        + (info.rank > info.rankBefore ? ' 칭호가 ' + E.ro(JG.RANKS[info.rank].name) + ' 올랐어요!' : '');
    },
    msg: () => msg,

    click(act) {
      JG.sound.play('tick');
      if (act === 'next') JG.app.show('tbm', { siteId: nextSiteId() });
      else if (act === 'restart') JG.app.show('tbm', isDaily() ? { daily: true } : isScenario() ? { scenario: site().code } : { siteId: g.siteId });
      else if (act === 'sites') JG.app.show('sites');
      else if (act === 'complex') JG.app.show('complex');
      else if (act === 'photo') { savePhoto(); msg = '기념사진을 PNG 파일로 저장했어요. 다운로드 폴더를 확인해 주세요.'; }
      else if (act === 'copycode') {
        const c = site().code;
        JG.copyText(c).then(ok => { msg = ok ? '복사했어요: 코드 ' + c + '. 같은 현장을 나눠 보세요.' : '복사가 막혀 있어요. 코드 ' + c + ' 여섯 글자를 옮겨 적어 주세요.'; JG.app.render(); });
      }
      else if (act === 'lesson') JG.info.showPage(JG.lesson.lessonPage(g));   // 수업용 해설
      else if (act === 'ox') JG.info.showPage(JG.lesson.oxPage(g));           // 용어 OX 3문제
      else if (act === 'share') {
        const text = JG.daily.shareText(site(), g, (JG.DIFFICULTY[g.diff] || JG.DIFFICULTY.normal).name);
        JG.copyText(text).then(ok => {
          msg = ok ? '결과를 복사했어요. 메신저에 붙여 넣어 보세요: ' + text.replace(/\n/g, ' / ') : '복사가 막혀 있어요. 이 글을 옮겨 적어 주세요: ' + text.replace(/\n/g, ' / ');
          JG.app.render();
        });
      }
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
      h += txt(24, 80, siteTitle() + ' · 남은 공기 D-' + g.days + ' · ' + g.turn + '턴', 'color: #FFE08A; ' + L.OUT1);

      h += '<div role="img" aria-label="' + esc(ganttAria()) + '" style="' + L.at(24, 120, 600, 300) + ' box-sizing: border-box; ' + L.PAPER + '">' + gantt() + '</div>';
      h += '<div style="' + L.at(24, 438, 288, 132) + ' box-sizing: border-box; ' + L.PAPER + '">' + rankPanel() + '</div>';
      h += '<div style="' + L.at(336, 438, 288, 132) + ' box-sizing: border-box; ' + L.PAPER + '">' + cardPanel() + '</div>';
      h += '<div style="' + L.at(24, 588, 600, 48) + ' box-sizing: border-box; ' + L.PAPER + '">'
        + txt(12, 13, '오늘의 현장 말', 'color: #8B3A1E') + txt(150, 13, sl.said + ' → ' + sl.proper)
        + '<button type="button" data-act="lesson" style="' + L.at(345, 3, 120, 36) + ' ' + L.BTN + '; ' + L.WOOD + '; color: #FFFFFF; ' + L.OUT1 + '">해설</button>'
        + '<button type="button" data-act="ox" style="' + L.at(471, 3, 120, 36) + ' ' + L.BTN + '; ' + L.WOOD + '; color: #FFFFFF; ' + L.OUT1 + '">용어 OX</button></div>';

      const green = L.GREEN + '; font-size: 32px; line-height: 32px; color: #FFFFFF; ' + L.OUT2;
      const wood = L.WOOD + '; color: #FFFFFF; ' + L.OUT1;
      // [다음 현장 또는 단지로] [다시 하기] [단지로 / 현장 고르기 / 데일리면 결과 복사] [사진 저장]
      h += button(next ? 'next' : 'complex', 24, 192, next ? '다음 현장' : '단지로', green);
      h += button('restart', 228, 120, '다시 하기', wood);
      h += isScenario() ? button('copycode', 360, 120, '코드 복사', L.PAPER) : isDaily() ? button('share', 360, 120, '결과 복사', L.PAPER) : button(next ? 'complex' : 'sites', 360, 120, next ? '단지로' : '현장 고르기', L.PAPER);
      h += button('photo', 492, 120, '사진 저장', L.PAPER);
      h += '</div>';
      return h + '</div>';
    }
  };
})();

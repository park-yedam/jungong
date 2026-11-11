// 대전 화면: 규칙 엔진(engine.js)의 상태를 화면 값으로 바꿔 그리고(battle-view.js), 누른 곳을 엔진 행동으로 잇는다.
(() => {
  const JG = globalThis.JG, E = JG.engine, R = JG.RULES, SP = JG.SPRITES;
  const ZX = [342, 534, 726, 918];          // 작업 구역 4칸의 가로 위치 (시안 ②)
  const SITE_ID = 'apart', PLEDGE_ID = 'chant';   // 2단계: 3번 현장 + 안전 구호 제창 고정 (현장 선택은 3단계, TBM은 4단계)
  const PULSE = 'pulse 0.8s steps(2) infinite';
  const stage = document.getElementById('stage'), live = document.getElementById('live');
  const esc = x => String(x).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  let g, ui;   // g: 엔진 상태, ui: 화면에만 있는 상태(고른 것, 말풍선, 안내 문구)

  function start() {
    g = E.newGame({ siteId: SITE_ID, pledge: PLEDGE_ID, seed: Date.now() % 1000000 + 1 });
    ui = {
      sel: null, bubble: null,
      msg: g.hand.includes('rebar')
        ? '1턴이에요. 코인 1개로 철근공을 내 보세요. 카드를 누르고, 점선으로 된 빈 작업 구역을 누르면 돼요.'
        : '1턴이에요. 초록 테두리가 깜빡이는 카드가 지금 낼 수 있는 카드예요. 눌러 보세요.'
    };
  }

  // 엔진 결과를 안내 문구와 말풍선에 반영
  function apply(res) {
    ui.msg = res.msg;
    const b = res.events.filter(e => e.t === 'bubble').pop();
    ui.bubble = b ? { zone: b.zone, text: b.text } : null;
  }
  const selWorker = () => ui.sel && ui.sel.t === 'worker' ? ui.sel.i : null;

  // ---------- 누른 곳 처리 ----------
  function pickCard(i) {
    const c = JG.CARDS[g.hand[i]];
    if (ui.sel && ui.sel.t === 'card' && ui.sel.i === i) { ui.sel = null; ui.msg = '카드 선택을 취소했어요.'; return; }
    const why = E.whyCantPlay(g, i);
    if (why) { ui.sel = null; ui.msg = why; return; }
    if (c.kind === 'spell') { ui.sel = null; apply(E.playCard(g, i, null)); return; }   // 공법은 누르는 즉시
    ui.sel = { t: 'card', i };
    ui.msg = c.name + ' 선택! 점선으로 된 빈 작업 구역을 누르세요.';
  }

  function pickMy(i) {
    if (g.over) return;
    if (ui.sel && ui.sel.t === 'card') {
      const res = E.playCard(g, ui.sel.i, i);
      if (res.ok) ui.sel = null;
      apply(res);
      return;
    }
    const w = g.my[i];
    if (!w) { ui.msg = '손패에서 카드를 먼저 고른 뒤 이 자리를 누르세요.'; return; }
    if (selWorker() === i) { ui.sel = null; ui.msg = '선택을 취소했어요.'; return; }
    const why = E.whyCantHit(g, i);
    if (why) { ui.msg = why; return; }
    ui.sel = { t: 'worker', i };
    const name = JG.CARDS[w.id].name, gi = E.guardIndex(g);
    ui.msg = gi >= 0
      ? name + ' 선택! ' + E.ga(JG.PROBLEMS[g.probs[gi].id].name) + ' 방호로 막고 있어서 그것부터 쳐야 해요.'
      : name + ' 선택! 위쪽 건물을 누르면 벽돌이 쌓여요.' + (g.probs.some(p => p) ? ' 문제 카드를 누르면 그 문제를 쳐요.' : '');
  }

  function pickProb(i) {
    if (g.over) return;
    if (selWorker() === null) {
      const p = g.probs[i], d = p && JG.PROBLEMS[p.id];
      ui.msg = p ? d.name + ': 공격 ' + p.atk + ', 체력 ' + p.hp + '. ' + d.tip : '다음 턴에 예고된 문제 카드가 들어올 자리예요.';
      return;
    }
    const res = E.hit(g, selWorker(), i);
    if (res.ok) ui.sel = null;
    apply(res);
  }

  function hitBuilding() {
    if (g.over) return;
    if (selWorker() === null) { ui.msg = '건물: 벽돌 ' + g.bricks + '/' + g.totalBricks + '칸. 작업팀을 고른 뒤 건물을 누르면 벽돌이 쌓여요.'; return; }
    const res = E.hit(g, selWorker(), 'building');
    if (res.ok) ui.sel = null;
    apply(res);
  }

  const actions = {
    card: i => pickCard(i),
    my: i => pickMy(i),
    prob: i => pickProb(i),
    building: hitBuilding,
    order: () => { if (!g.over) apply(E.order(g, selWorker())); },
    end: () => { if (!g.over) { ui.sel = null; apply(E.endTurn(g)); } },
    restart: start
  };

  stage.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const [act, n] = el.dataset.act.split(':');
    actions[act](Number(n));
    render();
  });

  // ---------- 화면 값 만들기 (시안 ②의 renderVals를 엔진에 맞게 옮김) ----------
  function pledgeStatus() {
    if (g.pledge === 'chant') return g.shield > 0 ? '첫 피해 1번 무효 (1회 남음)' : '첫 피해를 이미 막았어요';
    if (g.pledge === 'delivery') return '시작 손패 +1장 (받았어요)';
    if (g.pledge === 'inspect') return g.equipDiscount > 0 ? '처음 내는 장비 카드 코인 -1' : '장비 할인을 이미 썼어요';
    return '';
  }

  function view() {
    const s = g, site = E.siteOf(s), cond = site.condition ? JG.CONDITIONS[site.condition] : null;
    const sel = ui.sel, selW = selWorker() !== null, selC = !!(sel && sel.t === 'card'), gi = E.guardIndex(s);
    const per = R.bricksPerFloor, floorsN = E.totalFloors(s), done = E.floors(s);
    const canHit = i => !E.whyCantHit(s, i);
    const sky = s.turn <= 3 ? ['#A9CFE0', '아침'] : s.turn <= 6 ? ['#8CBBD3', '낮'] : s.turn <= R.baseTurns ? ['#E9A47A', '노을'] : ['#2C3E66', '밤 (야간작업)'];

    // 건물: 벽돌 칸, 다음 칸 표시, 지붕, 크레인 훅
    const bays = [];
    for (let k = 0; k < s.totalBricks; k++) {
      const f = Math.floor(k / per), b = k % per;
      bays.push({ l: 624 + b * 48 - 3, t: 300 - 48 * (f + 1) - 3, shadow: k < s.bricks ? (f < done ? SP.bay_lit : SP.bay_full) : SP.bay_empty });
    }
    const top = 300 - 48 * floorsN;   // 건물 꼭대기 높이
    const hookEnd = Math.max(60, 300 - 48 * (Math.min(done, floorsN - 1) + 1) - 24);
    const bldTarget = selW && gi < 0;

    // 작업 구역 (내 작업팀)
    const canAnyAct = !s.over && !sel;
    const myZones = s.my.map((w, i) => {
      const c = w ? JG.CARDS[w.id] : null, isSel = selW && sel.i === i, act = canAnyAct && w && canHit(i), place = selC && !w;
      const atk = w ? E.atkOf(s, w) : 0;
      return {
        x: ZX[i], click: 'my:' + i,
        aria: w ? c.name + ', 공격 ' + atk + ', 체력 ' + w.hp : (place ? '빈 작업 구역. 여기에 놓기' : '빈 작업 구역'),
        occupied: !!w, empty: !w, emptyText: place ? '여기에 놓기' : '빈 작업 구역', emptyColor: place ? '#23602A' : '#8B5A2B',
        bg: w ? '#CF965C' : 'transparent',
        border: isSel ? '3px solid #FFE08A' : w ? '3px solid #8B5A2B' : (place ? '3px dashed #23602A' : '3px dashed #B07A47'),
        outline: isSel ? '3px solid #FFE08A' : (act || place) ? '3px solid #7BD389' : '3px solid transparent',
        anim: (act || place) ? PULSE : 'none',
        shadow: w ? SP[w.id] : '', spriteTop: w && w.id === 'pump' ? 36 : 24,
        name: w ? c.name : '', atk, hp: w ? w.hp : 0,
        tag: !w ? '' : w.curing ? '양생 중' : w.guard ? '방호' : canHit(i) ? '칠 수 있음' : (w.ready ? '대기' : '다음 턴부터'),
        tagColor: !w ? '#3B2A20' : w.curing ? '#2C4266' : w.guard ? '#8B3A1E' : canHit(i) ? '#23602A' : '#5C3A1E',
        bob: w && canHit(i) ? 'bob 1s steps(2) infinite' : 'none',
        hasBubble: !!(ui.bubble && ui.bubble.zone === i), bubble: ui.bubble ? ui.bubble.text : '', bx: ZX[i] + 18
      };
    });

    // 현장 문제 칸
    const probZones = s.probs.map((p, i) => {
      const d = p ? JG.PROBLEMS[p.id] : null, target = selW && p && (gi < 0 || p.guard);
      return {
        x: ZX[i], click: 'prob:' + i,
        aria: p ? d.name + ', 공격 ' + p.atk + ', 체력 ' + p.hp + (target ? '. 눌러서 망치질' : '') : '문제 카드 자리',
        occupied: !!p, empty: !p, emptyText: '문제 자리', emptyColor: '#8B5A2B',
        bg: p ? '#D7A26C' : 'transparent',
        border: p ? '3px solid #E85D3A' : '3px dashed #B07A47',
        outline: target ? '3px solid #7BD389' : '3px solid transparent', anim: target ? PULSE : 'none',
        shadow: p ? SP[p.id] : '', spriteTop: 36, name: p ? d.name : '', atk: p ? p.atk : 0, hp: p ? p.hp : 0,
        tag: p ? (p.guard ? '방호' : p.drain ? '공기 -' + p.drain + '/턴' : '문제') : '', tagColor: '#8B3A1E', bob: 'none',
        hasBubble: false, bubble: '', bx: 0
      };
    });

    // 손패
    const n = s.hand.length, left = 720 - (n * 144 + (n - 1) * 12) / 2;
    const hand = s.hand.map((id, i) => {
      const c = JG.CARDS[id], cost = E.costOf(s, id), afford = !s.over && cost <= s.coins, isSel = selC && sel.i === i;
      const playable = !sel && !E.whyCantPlay(s, i), crew = c.kind === 'crew';
      return {
        x: left + i * 156, y: isSel ? 582 : 606, click: 'card:' + i,
        aria: c.name + ' 카드, 코인 ' + cost + (crew ? ', 공격 ' + c.atk + ', 체력 ' + c.hp : '') + '. ' + c.text,
        name: c.name, cost, band: c.band, text: c.text, frame: crew ? '#8B5A2B' : '#5B8DEF',
        isCrew: crew, isSpell: !crew, atk: c.atk, hp: c.hp,
        shadow: SP[id], artX: 42, artY: id !== 'pump' && id !== 'drone' ? 33 : 45,
        opacity: afford ? 1 : 0.55, outline: isSel ? '3px solid #FFE08A' : playable ? '3px solid #7BD389' : '3px solid transparent',
        anim: playable ? PULSE : 'none'
      };
    });

    const coins = [0, 1, 2, 3, 4].map(k => ({ l: 9 + k * 30 - 3, shadow: k < s.coins ? SP.coin : (k < s.maxCoins ? SP.coin_empty : '0 0 0 transparent') }));
    const canAct = !s.over && (s.my.some((w, i) => canHit(i)) || s.hand.some((id, h) => !E.whyCantPlay(s, h)));
    const fcId = E.nextProblem(s), fc = fcId ? JG.PROBLEMS[fcId] : null;
    const st = E.stars(s);

    return {
      sky: sky[0], skyName: sky[1], turnText: s.turn + '턴 / ' + R.baseTurns + '턴',
      rain: !!(cond && cond.weather === '비'),
      condLabel: cond ? '현장 조건 (' + cond.weather + ')' : '현장 조건', condName: cond ? cond.name : '맑음', condText: cond ? cond.text : '특별한 조건 없음',
      siteName: site.name, bricks: s.bricks, totalBricks: s.totalBricks, floorText: done + '층 완성',
      bays, showNext: bldTarget && s.bricks < s.totalBricks,
      nextL: 624 + (s.bricks % per) * 48, nextT: 300 - 48 * (Math.floor(s.bricks / per) + 1),
      showRoof: s.bricks >= s.totalBricks, roofTop: top - 21, flagTop: top - 60,
      hookH: hookEnd - 51, palletTop: hookEnd,
      bldTop: top - 6, bldH: 48 * floorsN + 12,
      bldBorder: bldTarget ? '#7BD389' : 'transparent', bldOutline: bldTarget ? '3px solid #7BD389' : '3px solid transparent',
      bldAnim: bldTarget ? PULSE : 'none',
      bldAria: '건물, 벽돌 ' + s.bricks + '/' + s.totalBricks + '칸' + (bldTarget ? '. 눌러서 망치질' : ''),
      hitBuilding: 'building',
      fcShadow: fc ? SP[fcId] : '0 0 0 transparent', fcName: fc ? fc.name : '조용한 하루', fcStat: fc ? '공격 ' + fc.atk + ' · 체력 ' + fc.hp : '문제 없음',
      msg: ui.msg,
      pledgeName: g.pledge ? JG.PLEDGES[g.pledge].name : '없음', shieldText: pledgeStatus(),
      deckText: s.deck.length + '장 남음',
      probZones, myZones, hand, coins, coinText: s.coins + '/' + s.maxCoins,
      daysText: 'D-' + s.days, daysColor: s.days <= 5 ? '#B83E3C' : '#3B2A20',
      endTurn: 'end', order: 'order', restart: 'restart',
      orderOpacity: E.whyCantOrder(s) ? 0.55 : 1,
      endOutline: canAct ? '3px solid transparent' : '3px solid #7BD389', endAnim: canAct || s.over ? 'none' : PULSE,
      isOver: !!s.over, overTitle: s.over === 'win' ? '준공!' : '공기 지연...',
      stars: '★'.repeat(st) + '☆'.repeat(3 - st),
      overText: s.over === 'win'
        ? '남은 공기 D-' + s.days + ' · ' + s.turn + '턴 만에 ' + floorsN + '층 완성'
        : '달력이 D-0이 됐어요. 현장 문제를 먼저 치우면 공기를 지킬 수 있어요.'
    };
  }

  // ---------- 그리기 ----------
  function render() {
    const focused = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.act : null;
    stage.innerHTML = JG.battleView(view(), esc);
    if (live.textContent !== ui.msg) live.textContent = ui.msg;
    if (focused) { const el = stage.querySelector('[data-act="' + focused + '"]'); if (el) el.focus(); }
  }

  // 1440×810 무대를 창에 꽉 차게 (비율 유지, 가운데 정렬)
  function fit() {
    const k = Math.min(innerWidth / 1440, innerHeight / 810);
    stage.style.transform = 'translate(' + (innerWidth - 1440 * k) / 2 + 'px, ' + (innerHeight - 810 * k) / 2 + 'px) scale(' + k + ')';
  }
  addEventListener('resize', fit);
  document.getElementById('rotate-close').addEventListener('click', () => document.body.classList.add('rotate-ok'));

  start();
  fit();
  render();
})();

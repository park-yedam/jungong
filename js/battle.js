// 대전 화면: 규칙 엔진(engine.js)의 상태를 화면 값으로 바꿔 그리고(battle-view.js), 누른 곳을 엔진 행동으로 잇는다.
(() => {
  const JG = globalThis.JG, E = JG.engine, R = JG.RULES, SP = JG.SPRITES;
  const ZX = [342, 534, 726, 918];   // 작업 구역 4칸의 가로 위치 (시안 ②)
  const PULSE = 'pulse 0.8s steps(2) infinite';
  const STEP_MS = 700;                // 현장 턴 사건 하나를 보여 주는 시간
  const clone = o => JSON.parse(JSON.stringify(o));

  // 눈송이: 세로 48px마다 같은 무늬라 이어서 내려도 끊기지 않는다 (CSS snow 애니메이션)
  const SNOW = [];
  [15, 95, 180, 260, 340, 430, 520, 600, 690, 770, 860, 940, 1030, 1110, 1200, 1290, 1380].forEach((x, i) => {
    for (let y = -48 + (i * 17) % 48; y < 336; y += 48) SNOW.push({ l: x + (i % 3) * 9, t: y });
  });

  // 스프라이트 높이(px): 작은 그림(장비·공법)은 카드와 작업 구역에서 조금 아래에 그린다
  const spriteH = {};
  const isSmall = id => (spriteH[id] = spriteH[id] || Math.max(...SP[id].split(',').map(p => parseFloat(p.trim().split(/\s+/)[1])))) < 54;

  let g, ui;   // g: 엔진 상태, ui: 화면에만 있는 상태 (고른 것, 말풍선, 안내 문구, 현장 턴 재생, 남은 턴 시간)
  let ticker = null;

  // ---------- 판 시작, 저장 ----------
  function newGameFor(siteId, pledge) {
    const d = JG.save.data, deck = d.deck && d.deck.length === R.deckSize ? d.deck : null;   // 자재 창고에서 고른 덱
    return E.newGame({ siteId, pledge, seed: Date.now() % 1000000 + 1, deck, difficulty: d.settings.difficulty });
  }
  function begin(state, prefix) {
    g = state;
    ui = { sel: null, bubble: null, replay: null, recorded: !!state.over };
    ui.msg = (prefix || '') + turnStartText();
    startTurnTimer();
    store();
  }
  function store() {
    JG.save.data.game = g.over ? null : g;
    JG.save.write();
  }
  // 행동 뒤 공통 처리: 준공이면 별·보상 기록(결과 화면에 넘길 정보), 만난 현장 말 저장, 하던 판 저장
  function after() {
    if (g.over && !ui.recorded) {
      ui.recorded = true;
      if (g.over === 'win') ui.result = JG.progress.record(g.siteId, E.stars(g));
    }
    g.rec.cards.forEach(id => { if (JG.CARDS[id].slang) JG.progress.seeSlang(JG.CARDS[id].slang); });
    g.probs.forEach(p => { if (p && JG.PROBLEMS[p.id].slang) JG.progress.seeSlang(JG.PROBLEMS[p.id].slang); });
    store();
  }

  // ---------- 턴 시간 (현장 4~5, 도전 난이도). 0초가 되면 저절로 턴 종료 ----------
  function turnSeconds() {
    const d = JG.DIFFICULTY[g.diff] || JG.DIFFICULTY.normal;
    return d.timer === null ? (E.siteOf(g).turnSeconds || 0) : d.timer;
  }
  function startTurnTimer() { ui.left = g.over ? 0 : turnSeconds(); }
  const endLabel = () => (ui.left ? '턴 종료 ' + ui.left + '초' : '턴 종료 ▶');
  function tick() {
    if (!ui.left || ui.replay || g.over || JG.info.isOpen()) return;   // 연출 중·풀이 창이 열려 있으면 멈춤
    ui.left -= 1;
    if (ui.left <= 0) { endTurn('시간이 다 돼서 턴을 넘겼어요. '); return; }
    const btn = document.querySelector('#stage [data-act="end"]');
    if (btn) btn.textContent = endLabel();   // 1초마다 전체를 다시 그리지 않고 글자만 바꾼다
  }

  // 내 턴이 시작될 때 안내: 첫 판 안내 문구가 있으면 그것, 없으면 기본 안내
  function turnStartText() {
    const guide = E.siteOf(g).guide;
    if (guide && guide[g.turn]) return g.turn + '턴이에요. ' + guide[g.turn];
    if (g.turn === 1) return '1턴이에요. 초록 테두리가 깜빡이는 카드가 지금 낼 수 있는 카드예요. 카드를 누르고 점선으로 된 빈 작업 구역을 누르면 돼요.'
      + (turnSeconds() ? ' 이 현장은 턴마다 ' + turnSeconds() + '초 안에 끝내야 해요.' : '');
    const late = g.turn > R.baseTurns && (JG.DIFFICULTY[g.diff] || JG.DIFFICULTY.normal).delayPenalty;
    return g.turn + '턴이에요. 초록 테두리가 지금 할 수 있는 행동이에요.' + (late ? ' 기준 턴이 지나서 매 턴 지체상금이 붙어요. 서둘러요!' : '');
  }

  // 엔진 결과를 안내 문구, 말풍선, 효과음에 반영
  function apply(res) {
    ui.msg = res.msg;
    const b = res.events.filter(e => e.t === 'bubble').pop();
    ui.bubble = b ? { zone: b.zone, text: b.text } : null;
    if (res.ok) JG.sound.play(effectOf(res.events));
  }
  // 준공 "빠바밤", 층 완성 "빰!", 망치질 "통", 문제 해결, 그 밖(카드 내기·작업지시)은 코인 "짤랑"
  function effectOf(events) {
    const t = events.map(e => e.t);
    if (t.includes('win')) return 'win';
    if (t.includes('floor')) return 'floor';
    if (t.includes('solved')) return 'solved';
    if (t.includes('bricks') || t.includes('out') || events.some(e => e.text === '통통!')) return 'hammer';
    return 'coin';
  }
  // 현장 턴 사건마다 나는 소리
  const REPLAY_SFX = { calendar: 'thud', penalty: 'thud', coinDrain: 'thud', hitWorker: 'hammer', solved: 'solved', cured: 'solved', cancelled: 'solved', lose: 'lose', newProblem: 'tick', shield: 'tick', burn: 'tick', swap: 'tick' };
  const selWorker = () => (ui.sel && ui.sel.t === 'worker' ? ui.sel.i : null);
  const selCard = () => (ui.sel && ui.sel.t === 'card' ? JG.CARDS[g.hand[ui.sel.i]] : null);

  // ---------- 누른 곳 처리 ----------
  function pickCard(i) {
    const c = JG.CARDS[g.hand[i]];
    if (ui.sel && ui.sel.t === 'card' && ui.sel.i === i) { ui.sel = null; ui.msg = '카드 선택을 취소했어요.'; return; }
    const why = E.whyCantPlay(g, i);
    if (why) { ui.sel = null; ui.msg = why; return; }
    if (c.kind === 'spell' && !c.target) { ui.sel = null; apply(E.playCard(g, i, null)); return; }   // 대상이 없는 공법은 누르는 즉시
    ui.sel = { t: 'card', i };
    ui.msg = c.target === 'ally' ? c.name + ' 선택! 쓸 작업팀을 누르세요.'
      : c.target === 'problem' ? c.name + ' 선택! 없앨 문제 카드를 누르세요.'
      : c.name + ' 선택! 점선으로 된 빈 작업 구역을 누르세요.';
    JG.sound.play('tick');
  }

  function pickMy(i) {
    const c = selCard();
    if (c) {
      if (c.target === 'problem') { ui.msg = c.name + ': 위쪽 문제 카드를 골라 주세요.'; return; }
      const res = E.playCard(g, ui.sel.i, i);   // 작업팀은 빈 칸에, 아군 공법은 작업팀에
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
    JG.sound.play('tick');
    const name = JG.CARDS[w.id].name, gi = E.guardIndex(g);
    ui.msg = gi >= 0
      ? name + ' 선택! ' + E.ga(JG.PROBLEMS[g.probs[gi].id].name) + ' 방호로 막고 있어서 그것부터 쳐야 해요.'
      : name + ' 선택! 위쪽 건물을 누르면 벽돌이 쌓여요.' + (g.probs.some(p => p) ? ' 문제 카드를 누르면 그 문제를 쳐요.' : '');
  }

  function pickProb(i) {
    const c = selCard();
    if (c && c.target === 'problem') {
      const res = E.playCard(g, ui.sel.i, i);
      if (res.ok) ui.sel = null;
      apply(res);
      return;
    }
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
    if (selWorker() === null) { ui.msg = '건물: 벽돌 ' + g.bricks + '/' + g.totalBricks + '칸. 작업팀을 고른 뒤 건물을 누르면 벽돌이 쌓여요.'; return; }
    const res = E.hit(g, selWorker(), 'building');
    if (res.ok) ui.sel = null;
    apply(res);
  }

  // ---------- 턴 종료: 현장 턴을 사건 하나씩 보여 준다 (아무 곳이나 누르면 바로 끝) ----------
  function endTurn(prefix) {
    ui.sel = null; ui.bubble = null;
    const before = clone(g), forecast = E.siteOf(g).forecast;
    const res = E.endTurn(g, { snapshots: true });
    after();

    // 이 판에서 처음 나온 문제는 요령 한 줄을 붙인다
    const firstTime = e => e.t === 'newProblem' && before.fi < forecast.length && !forecast.slice(0, before.fi).includes(e.id);
    const tips = res.events.filter(firstTime).map(e => JG.PROBLEMS[e.id].name + ': ' + JG.PROBLEMS[e.id].tip);
    const frames = [{ state: before, msg: (prefix || '') + '현장 턴이에요. 현장이 움직여요...', sfx: 'tick' }]
      .concat(res.events.map(e => ({ state: e.state, msg: e.text + (firstTime(e) ? ' ' + JG.PROBLEMS[e.id].tip : ''), sfx: REPLAY_SFX[e.t] })));

    // 다 보여 준 뒤 남길 요약
    const parts = [], lost = before.days - g.days;
    if (lost > 0) parts.push('공기 -' + lost + '일');
    res.events.forEach(e => {
      if (e.t === 'newProblem') parts.push('새 문제 ' + JG.PROBLEMS[e.id].name);
      if (e.t === 'out') parts.push(e.text.split(':')[0] + ' 퇴장');
      if (e.t === 'coinDrain' || e.t === 'swap' || e.t === 'cancelled') parts.push(e.text.replace(/\.$/, ''));
    });
    const summary = parts.length ? '현장 턴: ' + parts.join(', ') + '.' : '현장 턴이 조용히 지나갔어요.';
    const final = g.over ? res.events[res.events.length - 1].text : [(prefix || '') + summary].concat(tips, turnStartText()).join(' ');

    ui.replay = { frames, i: 0, final, timer: null };
    const step = i => {
      if (!ui.replay) return;
      if (i >= frames.length) { finishReplay(); return; }
      ui.replay.i = i;
      ui.msg = frames[i].msg;
      if (frames[i].sfx) JG.sound.play(frames[i].sfx);
      JG.app.render();
      ui.replay.timer = setTimeout(() => step(i + 1), i === 0 ? 500 : STEP_MS);
    };
    step(0);
  }
  function finishReplay() {
    clearTimeout(ui.replay.timer);
    if (ui.replay.i < ui.replay.frames.length - 1 && g.over === 'lose') JG.sound.play('lose');   // 건너뛰어도 공기 지연 소리는 난다
    ui.msg = ui.replay.final;
    ui.replay = null;
    startTurnTimer();   // 새 내 턴의 시간
    JG.app.render();
  }

  // ---------- 화면 등록 ----------
  JG.screens.battle = {
    // arg: { siteId, pledge } 새 판 (아침 TBM에서 고른 다짐), { resume: true } 하던 판 이어하기
    enter(arg) {
      if (arg.resume && JG.save.data.game) begin(JG.save.data.game, '이어서 해요. ');
      else begin(newGameFor(arg.siteId, arg.pledge));
      clearInterval(ticker);
      ticker = setInterval(tick, 1000);
    },
    leave() {
      clearInterval(ticker); ticker = null;
      if (ui.replay) { clearTimeout(ui.replay.timer); ui.replay = null; }
    },
    msg: () => ui.msg,
    music: () => (g.turn > R.baseTurns ? 'night' : 'day'),   // 9턴부터 야간작업 곡

    click(act, n) {
      if (ui.replay) { finishReplay(); return; }   // 현장 턴 연출 중에는 누르면 바로 끝
      if (act === 'restart') { JG.app.show('tbm', { siteId: g.siteId }); return; }   // 새 판은 늘 아침 TBM부터
      if (act === 'exit') { JG.app.show('title'); return; }
      if (act === 'sites') { JG.app.show('sites'); return; }
      if (act === 'result') { JG.app.show('result', { state: g, info: ui.result }); return; }
      if (g.over) return;
      ui.bubble = null;
      if (act === 'card') pickCard(n);
      else if (act === 'my') pickMy(n);
      else if (act === 'prob') pickProb(n);
      else if (act === 'building') hitBuilding();
      else if (act === 'order') apply(E.order(g, selWorker()));
      else if (act === 'end') { endTurn(); return; }
      after();
    },

    render() { return JG.battleView(view(), JG.esc); }
  };

  function pledgeStatus(s) {
    if (s.pledge === 'chant') return s.shield > 0 ? '첫 피해 1번 무효 (1회 남음)' : '첫 피해를 이미 막았어요';
    if (s.pledge === 'delivery') return '시작 손패 +1장 (받았어요)';
    if (s.pledge === 'inspect') return s.equipDiscount > 0 ? '처음 내는 장비 카드 코인 -1' : '장비 할인을 이미 썼어요';
    return '';
  }

  // 끝 창 버튼: 준공이면 [결과 보기] (다음 현장·다시 하기는 결과 화면에서), 공기 지연이면 [다시 하기] [현장 고르기]
  function overButtons() {
    if (g.over === 'win') return [{ act: 'result', label: '준공 결과 보기', x: 135, w: 300, primary: true }];
    return [
      { act: 'restart', label: '다시 하기', x: 36, w: 240, primary: true },
      { act: 'sites', label: '현장 고르기', x: 294, w: 240 }
    ];
  }

  // 문제 칸 꼬리표
  function probTag(p) {
    const d = JG.PROBLEMS[p.id];
    return p.guard ? '방호' : p.drain ? '공기 -' + p.drain + '/턴' : d.coinDrain ? '공사비 -' + d.coinDrain : d.workersOnly ? '작업팀만 침' : d.swapHand ? '손패 바꿈' : '문제';
  }

  // ---------- 화면 값 만들기 (시안 ②의 renderVals를 엔진에 맞게 옮김) ----------
  function view() {
    const busy = !!ui.replay, s = busy ? ui.replay.frames[ui.replay.i].state : g;
    const site = E.siteOf(s), cond = site.condition ? JG.CONDITIONS[site.condition] : null, base = site.basement || 0;
    const sel = busy ? null : ui.sel, selW = !!(sel && sel.t === 'worker'), gi = E.guardIndex(s);
    const sc = sel && sel.t === 'card' ? JG.CARDS[s.hand[sel.i]] : null;   // 고른 카드
    const placeMode = !!(sc && sc.kind === 'crew'), allyMode = !!(sc && sc.target === 'ally'), probMode = !!(sc && sc.target === 'problem');
    const per = R.bricksPerFloor, floorsN = E.totalFloors(s), done = E.floors(s);
    const canHit = i => !busy && !E.whyCantHit(s, i);
    const sky = s.turn <= 3 ? ['#A9CFE0', '아침'] : s.turn <= 6 ? ['#8CBBD3', '낮'] : s.turn <= R.baseTurns ? ['#E9A47A', '노을'] : ['#2C3E66', '밤 (야간작업)'];
    const diffName = s.diff && s.diff !== 'normal' ? ' · ' + JG.DIFFICULTY[s.diff].name : '';

    // 건물: 5층까지는 한 칸 48px, 6층 건물은 40px로 줄여 같은 높이에 맞춘다. 지하층은 조금 어둡게
    const cell = floorsN > 5 ? 40 : 48, scale = cell / 48, x0 = 720 - 2 * cell;
    const bays = [];
    for (let k = 0; k < s.totalBricks; k++) {
      const f = Math.floor(k / per), b = k % per;
      bays.push({
        l: x0 + b * cell - 3 * scale, t: 300 - cell * (f + 1) - 3 * scale,
        shadow: k < s.bricks ? (f < done ? SP.bay_lit : SP.bay_full) : SP.bay_empty,
        filter: f < base ? 'brightness(0.8) sepia(0.4)' : 'none'
      });
    }
    const top = 300 - cell * floorsN;   // 건물 꼭대기 높이
    const hookEnd = Math.max(60, 300 - cell * (Math.min(done, floorsN - 1) + 1) - 24);
    const bldTarget = selW && gi < 0;

    // 작업 구역 (내 작업팀)
    const canAnyAct = !s.over && !sel && !busy;
    const myZones = s.my.map((w, i) => {
      const c = w ? JG.CARDS[w.id] : null, isSel = selW && sel.i === i, act = canAnyAct && w && canHit(i);
      const place = placeMode && !w, ally = allyMode && !!w;
      const atk = w ? E.atkOf(s, w) : 0;
      return {
        x: ZX[i], click: 'my:' + i, info: w ? 'card:' + w.id : '',
        aria: w ? c.name + ', 공격 ' + atk + ', 체력 ' + w.hp + (ally ? '. 눌러서 ' + sc.name : '') : (place ? '빈 작업 구역. 여기에 놓기' : '빈 작업 구역'),
        occupied: !!w, empty: !w, emptyText: place ? '여기에 놓기' : '빈 작업 구역', emptyColor: place ? '#23602A' : '#8B5A2B',
        bg: w ? '#CF965C' : 'transparent',
        border: isSel ? '3px solid #FFE08A' : w ? '3px solid #8B5A2B' : (place ? '3px dashed #23602A' : '3px dashed #B07A47'),
        outline: isSel ? '3px solid #FFE08A' : (act || place || ally) ? '3px solid #7BD389' : '3px solid transparent',
        anim: (act || place || ally) ? PULSE : 'none',
        shadow: w ? SP[w.id] : '', spriteTop: w && isSmall(w.id) ? 36 : 24,
        name: w ? c.name : '', atk, hp: w ? w.hp : 0,
        tag: !w ? '' : w.curing ? (w.curing > 1 ? '양생 ' + w.curing + '턴' : '양생 중') : w.guard ? '방호' : canHit(i) ? '칠 수 있음' : (w.ready ? '대기' : '다음 턴부터'),
        tagColor: !w ? '#3B2A20' : w.curing ? '#2C4266' : w.guard ? '#8B3A1E' : canHit(i) ? '#23602A' : '#5C3A1E',
        bob: w && canHit(i) ? 'bob 1s steps(2) infinite' : 'none',
        hasBubble: !busy && !!(ui.bubble && ui.bubble.zone === i), bubble: ui.bubble ? ui.bubble.text : '', bx: ZX[i] + 18
      };
    });

    // 현장 문제 칸
    const probZones = s.probs.map((p, i) => {
      const d = p ? JG.PROBLEMS[p.id] : null, target = (selW && p && (gi < 0 || p.guard)) || (probMode && !!p);
      return {
        x: ZX[i], click: 'prob:' + i, info: p ? 'prob:' + p.id : '',
        aria: p ? d.name + ', 공격 ' + p.atk + ', 체력 ' + p.hp + (target ? (probMode ? '. 눌러서 ' + sc.name : '. 눌러서 망치질') : '') : '문제 카드 자리',
        occupied: !!p, empty: !p, emptyText: '문제 자리', emptyColor: '#8B5A2B',
        bg: p ? '#D7A26C' : 'transparent',
        border: p ? '3px solid #E85D3A' : '3px dashed #B07A47',
        outline: target ? '3px solid #7BD389' : '3px solid transparent', anim: target ? PULSE : 'none',
        shadow: p ? SP[p.id] : '', spriteTop: 36, name: p ? d.name : '', atk: p ? p.atk : 0, hp: p ? p.hp : 0,
        tag: p ? probTag(p) : '', tagColor: '#8B3A1E', bob: 'none',
        hasBubble: false, bubble: '', bx: 0
      };
    });

    // 손패
    const n = s.hand.length, left = 720 - (n * 144 + (n - 1) * 12) / 2;
    const hand = s.hand.map((id, i) => {
      const c = JG.CARDS[id], cost = E.costOf(s, id), afford = !s.over && cost <= s.coins, isSel = sc && sel.i === i;
      const playable = !sel && !busy && !E.whyCantPlay(s, i), crew = c.kind === 'crew';
      return {
        x: left + i * 156, y: isSel ? 582 : 606, click: 'card:' + i, info: 'card:' + id,
        aria: c.name + ' 카드, 코인 ' + cost + (crew ? ', 공격 ' + c.atk + ', 체력 ' + c.hp : '') + '. ' + c.text + '. 풀이는 i 키',
        name: c.name, cost, band: c.band, text: c.text, frame: crew ? '#8B5A2B' : '#5B8DEF',
        isCrew: crew, isSpell: !crew, atk: c.atk, hp: c.hp,
        shadow: SP[id], artX: 42, artY: isSmall(id) ? 45 : 33,
        opacity: afford ? 1 : 0.55, outline: isSel ? '3px solid #FFE08A' : playable ? '3px solid #7BD389' : '3px solid transparent',
        anim: playable ? PULSE : 'none'
      };
    });

    const coins = [0, 1, 2, 3, 4].map(k => ({ l: 9 + k * 30 - 3, shadow: k < s.coins ? SP.coin : (k < s.maxCoins ? SP.coin_empty : '0 0 0 transparent') }));
    const canAct = !s.over && !busy && (s.my.some((w, i) => canHit(i)) || s.hand.some((id, h) => !E.whyCantPlay(s, h)));
    const fcId = E.nextProblem(s), fc = fcId ? JG.PROBLEMS[fcId] : null;
    const st = E.stars(s), showOver = !!s.over && !busy;
    const condOn = cond && !s.condOff;

    return {
      sky: sky[0], skyName: sky[1] + diffName, turnText: s.turn + '턴 / ' + R.baseTurns + '턴',
      rain: !!(condOn && cond.weather === '비'), snow: condOn && cond.weather === '눈' ? SNOW : [],
      condLabel: cond ? '현장 조건 (' + cond.weather + ')' : '현장 조건',
      condName: cond ? cond.name + (s.condOff ? ' 풀림' : '') : '맑음',
      condText: cond ? (s.condOff ? '보온양생으로 풀렸어요' : cond.text) : '특별한 조건 없음',
      siteName: site.name, bricks: s.bricks, totalBricks: s.totalBricks,
      floorText: done ? E.floorName(s, done) + ' 완성' : (base ? '터파기 중' : '0층 완성'),
      bays, scale, cell, showNext: bldTarget && s.bricks < s.totalBricks,
      nextL: x0 + (s.bricks % per) * cell, nextT: 300 - cell * (Math.floor(s.bricks / per) + 1),
      showRoof: s.bricks >= s.totalBricks, roofL: x0 - 6, roofW: 4 * cell + 12, roofTop: top - 21, flagL: 699, flagTop: top - 60,
      hookH: hookEnd - 51, palletTop: hookEnd,
      bldL: x0 - 12, bldW: 4 * cell + 24, bldTop: top - 6, bldH: cell * floorsN + 12,
      bldBorder: bldTarget ? '#7BD389' : 'transparent', bldOutline: bldTarget ? '3px solid #7BD389' : '3px solid transparent',
      bldAnim: bldTarget ? PULSE : 'none',
      bldAria: '건물, 벽돌 ' + s.bricks + '/' + s.totalBricks + '칸' + (bldTarget ? '. 눌러서 망치질' : ''),
      hitBuilding: 'building',
      fcShadow: fc && !s.cancelNext ? SP[fcId] : '0 0 0 transparent',
      fcName: s.cancelNext ? '예고 취소!' : fc ? fc.name : '조용한 하루',
      fcStat: s.cancelNext ? 'BIM 간섭검토' : fc ? '공격 ' + Math.max(0, fc.atk + (JG.DIFFICULTY[s.diff] || JG.DIFFICULTY.normal).probAtk) + ' · 체력 ' + fc.hp : '문제 없음',
      msg: ui.msg,
      pledgeName: s.pledge ? JG.PLEDGES[s.pledge].name : '없음', shieldText: pledgeStatus(s),
      deckText: s.deck.length + '장 남음',
      probZones, myZones, hand, coins, coinText: s.coins + '/' + s.maxCoins,
      daysText: 'D-' + s.days, daysColor: s.days <= 5 ? '#B83E3C' : '#3B2A20',
      endTurn: 'end', order: 'order', restart: 'restart', exit: 'exit', endLabel: busy ? '턴 종료 ▶' : endLabel(),
      orderOpacity: !busy && !E.whyCantOrder(s) ? 1 : 0.55,
      endOutline: canAct || busy ? '3px solid transparent' : '3px solid #7BD389', endAnim: canAct || busy || s.over ? 'none' : PULSE,
      isOver: showOver, overTitle: s.over === 'win' ? '준공!' : '공기 지연...',
      stars: '★'.repeat(st) + '☆'.repeat(3 - st), starsColor: s.over === 'win' ? '#F7C948' : '#D9CBA8',
      overText: s.over === 'win'
        ? '남은 공기 D-' + s.days + ' · ' + s.turn + '턴 만에 ' + floorsN + '층 완성' + (base ? ' (지하 ' + base + '층 포함)' : '')
        : '달력이 D-0이 됐어요. 현장 문제를 먼저 치우면 공기를 지킬 수 있어요.',
      overButtons: showOver ? overButtons() : []
    };
  }
})();

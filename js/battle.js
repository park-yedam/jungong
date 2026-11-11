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
  // arg: { siteId } 또는 { daily: true }. 데일리 현장은 날짜 시드로 섞어 같은 덱이면 누구나 같은 순서로 뽑는다
  function newGameFor(arg) {
    const d = JG.save.data, deck = d.deck && d.deck.length === R.deckSize ? d.deck : null;   // 자재 창고에서 고른 덱
    // 수업용 현장도 코드로 정해진 시드라 같은 덱이면 반 전체가 같은 순서로 뽑는다
    const site = arg.daily ? JG.daily.today() : arg.scenario ? JG.scenario.siteFor(JG.scenario.decode(arg.scenario)) : undefined;
    return E.newGame({ siteId: arg.siteId, site, pledge: arg.pledge, seed: site ? site.seed : Date.now() % 1000000 + 1, deck, difficulty: d.settings.difficulty });
  }
  const isDaily = () => !!(g.site && g.site.daily);
  const isScenario = () => !!(g.site && g.site.scenario);
  const tbmTarget = () => (isDaily() ? { daily: true } : isScenario() ? { scenario: g.site.code } : { siteId: g.siteId });
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
      if (g.over === 'win') ui.result = isDaily() ? JG.progress.recordDaily(g.site.dateKey, E.stars(g))
        : isScenario() ? JG.progress.recordScenario(E.stars(g)) : JG.progress.record(g.siteId, E.stars(g));
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

  // 엔진 결과를 안내 문구, 말풍선, 효과음에 반영 (quiet: 효과음은 연출에서 부딪히는 순간에 낸다)
  function apply(res, quiet) {
    ui.msg = res.msg;
    const b = res.events.filter(e => e.t === 'bubble').pop();
    ui.bubble = b ? { zone: b.zone, text: b.text } : null;
    if (res.ok && !quiet) {
      JG.sound.play(effectOf(res.events));
      post.push(() => res.events.forEach(numbers));
    }
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
  const REPLAY_SFX = { calendar: 'thud', penalty: 'thud', coinDrain: 'coinLoss', hitWorker: 'hurt', solved: 'solved', cured: 'solved', cancelled: 'solved', lose: 'lose', newProblem: 'tick', shield: 'shield', burn: 'tick', swap: 'tick', empty: 'thud' };
  const selWorker = () => (ui.sel && ui.sel.t === 'worker' ? ui.sel.i : null);
  const selCard = () => (ui.sel && ui.sel.t === 'card' ? JG.CARDS[g.hand[ui.sel.i]] : null);

  // ---------- 연출 (js/fx.js) ----------
  // 엔진은 이미 새 상태인데 화면은 아직 옛 상태일 때, 옛 화면에서 돌진·사라지기를 보여 준 뒤 새 상태를 그린다.
  // 'hold'를 돌려주면 app.js는 바로 다시 그리지 않는다. 연출 중에 다른 곳을 누르면 연출은 바로 끝난다(stopAnim)
  const fx = JG.fx;
  const at = act => document.querySelector('#screen [data-act="' + act + '"]');
  const calendarEl = () => document.querySelector('#screen [data-fx="calendar"]');
  const coinsEl = () => document.querySelector('#screen [data-fx="coins"]');

  // 떠오르는 숫자: 깎이는 것은 빨강, 늘어나는 것은 초록, 벽돌은 노랑. 자리는 무대 좌표 (작업 구역 가운데, 달력, 공사비)
  const RED = '#E35D5B', GREEN = '#7BD389', GOLD = '#F7C948';
  const MY_Y = 530, PROB_Y = 386, CAL = [138, 626], COIN = [1310, 626];   // 카드 그림 위, 달력·공사비 판 바로 위 빈 곳
  const pop = (x, y, text, color, size) => fx.float(x, y, text, color, size || 48);
  // 사건 하나의 숫자와 흔들림 (부딪히는 순간, 또는 그 사건을 그린 직후에 부른다)
  function numbers(e) {
    if (e.t === 'hitWorker') {
      pop(ZX[e.zone] + 90, MY_Y, e.n ? '-' + e.n : '막음', e.n ? RED : '#FFFFFF');
      if (e.back) pop(ZX[e.from] + 90, PROB_Y, '-' + e.back, RED, 32);
      if (e.n >= 3) fx.shakeScreen();
    } else if (e.t === 'hit') {
      pop(ZX[e.zone] + 90, PROB_Y, '-' + e.n);
      if (e.back) pop(ZX[e.from] + 90, MY_Y, '-' + e.back, RED, 32);
    } else if (e.t === 'calendar' || e.t === 'penalty' || e.t === 'empty') {
      pop(CAL[0], CAL[1], '-' + e.n + '일');
      fx.shake(calendarEl());
      if (e.n >= 2) fx.shakeScreen();
    } else if (e.t === 'shield') pop(CAL[0], CAL[1], '막음!', '#9CC7DC');
    else if (e.t === 'coinDrain') { pop(COIN[0], COIN[1], '-' + e.n); fx.shake(coinsEl()); }
    else if (e.t === 'bricks') { const b = fx.rectOf(at('building')); pop(b.x + b.w / 2, Math.max(60, b.y - 30), '벽돌 +' + e.n, GOLD, 36); }   // 건물 위 (층 완성 알림판과 겹치지 않게)
    else if (e.t === 'heal') pop(ZX[e.zone] + 90, MY_Y, '+' + e.n, GREEN);
    else if (e.t === 'cured') pop(ZX[e.zone] + 90, MY_Y, '+' + e.atk + '/+' + e.hp, GREEN, 32);
    else if (e.t === 'floor' || e.t === 'win') {
      const b = fx.rectOf(at('building'));
      fx.burst(b.x + b.w / 2, b.y + 24, e.t === 'win' ? 60 : 30);
      if (e.t === 'floor') fx.banner(E.floorName(g, e.n) + ' 완성!', GOLD);
    } else if (e.t === 'out') fx.shakeScreen(6);
  }
  let animId = 0;
  const post = [];   // 다시 그린 직후에 할 연출 (카드 내려앉기 등)
  function hold(run) {
    const id = ++animId, live = () => id === animId;
    const done = () => { if (live()) { ui.anim = false; JG.app.render(); } };
    ui.anim = true;
    Promise.resolve(run(live)).then(done, done);
    return 'hold';
  }
  function stopAnim() {
    if (!ui || !ui.anim) return;
    ui.anim = false; animId++;
    fx.skipAll();
    JG.app.render();   // 옛 화면을 새 상태로 바꿔 둔 뒤 누른 것을 처리한다
  }
  // 새로 뽑은 손패(k번 카드들)가 자재 더미에서 날아온다 (다시 그린 직후)
  const PILE = { x: 42, y: 468, w: 180, h: 80 };
  const arriveCards = ks => post.push(() => ks.forEach((k, j) => fx.arrive(at('card:' + k), PILE, j * 120)));
  const lastCards = n => Array.from({ length: n }, (_, j) => g.hand.length - n + j);   // 뽑은 카드는 손패 끝에 붙는다

  // 작업팀(i)이 대상(문제 칸 번호 또는 'building')으로 돌진해 친다. 해결된 문제·퇴장한 작업팀은 흐려지며 사라진다
  function animateHit(i, target, res) {
    return hold(async live => {
      const from = at('my:' + i), to = at(target === 'building' ? 'building' : 'prob:' + target);
      await fx.lunge(from, fx.rectOf(to), () => {
        if (!live()) return;
        JG.sound.play(effectOf(res.events));
        if (target !== 'building') { fx.flash(to); fx.shake(to); }
        res.events.forEach(numbers);
      });
      if (!live()) return;
      await Promise.all([
        res.events.some(e => e.t === 'solved') && fx.vanish(to),
        res.events.some(e => e.t === 'out') && fx.vanish(from)
      ]);
    });
  }

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
      if (res.ok && c.kind === 'crew') post.push(() => fx.land(at('my:' + i)));
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
      return res.ok ? hold(() => fx.vanish(at('prob:' + i))) : undefined;
    }
    if (selWorker() === null) {
      const p = g.probs[i], d = p && JG.PROBLEMS[p.id];
      ui.msg = p ? d.name + ': 공격 ' + p.atk + ', 체력 ' + p.hp + '. ' + d.tip : '다음 턴에 예고된 문제 카드가 들어올 자리예요.';
      return;
    }
    const w = selWorker(), res = E.hit(g, w, i);
    if (res.ok) ui.sel = null;
    apply(res, res.ok);
    return res.ok ? animateHit(w, i, res) : undefined;
  }

  function hitBuilding() {
    if (selWorker() === null) { ui.msg = '건물: 벽돌 ' + g.bricks + '/' + g.totalBricks + '칸. 작업팀을 고른 뒤 건물을 누르면 벽돌이 쌓여요.'; return; }
    const w = selWorker(), res = E.hit(g, w, 'building');
    if (res.ok) ui.sel = null;
    apply(res, res.ok);
    return res.ok ? animateHit(w, 'building', res) : undefined;
  }

  // ---------- 턴 종료: 현장 턴을 사건 하나씩 보여 준다 (아무 곳이나 누르면 바로 끝) ----------
  function endTurn(prefix) {
    stopAnim();
    ui.sel = null; ui.bubble = null;
    const before = clone(g), forecast = E.siteOf(g).forecast;
    const res = E.endTurn(g, { snapshots: true });
    after();

    // 이 판에서 처음 나온 문제는 요령 한 줄을 붙인다
    const firstTime = e => e.t === 'newProblem' && before.fi < forecast.length && !forecast.slice(0, before.fi).includes(e.id);
    const tips = res.events.filter(firstTime).map(e => JG.PROBLEMS[e.id].name + ': ' + JG.PROBLEMS[e.id].tip);
    const frames = [{ state: before, msg: (prefix || '') + '현장 턴이에요. 현장이 움직여요...', sfx: 'tick' }]
      .concat(res.events.map(e => ({ e, state: e.state, msg: e.text + (firstTime(e) ? ' ' + JG.PROBLEMS[e.id].tip : ''), sfx: REPLAY_SFX[e.t] })));

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

    const drawn = before.deck.length - g.deck.length - res.events.filter(e => e.t === 'burn').length;   // 다음 내 턴에 뽑은 카드 수
    ui.replay = { frames, i: 0, final, drawn };
    runReplay(ui.replay);
  }
  // 사건 하나씩: 문제 카드가 작업팀·달력으로 돌진해 부딪히고, 퇴장·해결은 흐려지며 사라지고, 새 문제는 위에서 내려앉는다
  async function runReplay(rp) {
    const live = () => ui.replay === rp;
    for (let i = 0; i < rp.frames.length; i++) {
      const f = rp.frames[i], e = f.e;
      const show = () => { if (!live()) return; rp.i = i; ui.msg = f.msg; JG.app.render(); };
      if (!e) { show(); JG.sound.play(f.sfx); fx.banner('현장 턴', '#FFB0A8'); await fx.wait(500); }
      else if (e.from != null) {   // 문제 카드의 공격 (작업팀, 달력, 안전 구호가 막음)
        const to = e.t === 'hitWorker' ? at('my:' + e.zone) : calendarEl();
        await fx.lunge(at('prob:' + e.from), fx.rectOf(to), () => {
          if (!live()) return;
          JG.sound.play(f.sfx); fx.flash(to); fx.shake(to);
          numbers(e);
        });
        show(); await fx.wait(300);
      } else if (e.t === 'out' || e.t === 'solved') {
        if (f.sfx) JG.sound.play(f.sfx);
        numbers(e);
        await fx.vanish(at((e.t === 'out' ? 'my:' : 'prob:') + e.zone));
        show(); await fx.wait(250);
      } else {
        show();
        if (f.sfx) JG.sound.play(f.sfx);
        if (e.t === 'newProblem') fx.land(at('prob:' + e.zone));
        numbers(e);
        await fx.wait(STEP_MS);
      }
      if (!live()) return;
    }
    finishReplay();
  }
  function finishReplay() {
    if (ui.replay.i < ui.replay.frames.length - 1 && g.over === 'lose') JG.sound.play('lose');   // 건너뛰어도 공기 지연 소리는 난다
    ui.msg = ui.replay.final;
    if (ui.replay.drawn > 0) arriveCards(lastCards(ui.replay.drawn));
    ui.replay = null;
    fx.skipAll();
    startTurnTimer();   // 새 내 턴의 시간
    JG.app.render();
    if (!g.over) fx.banner(g.turn + '턴 · 내 턴!');
  }

  // ---------- 자재 검수: 판을 시작할 때 처음 받은 손패에서 바꿀 카드를 고른다 (한 번만) ----------
  function mulliganPage() {
    const picks = [], L = JG.look, esc = JG.esc;
    const cardBox = (id, k) => {
      const c = JG.CARDS[id], on = picks.includes(k), crew = c.kind === 'crew';
      return '<button type="button" data-act="mull:' + k + '" aria-pressed="' + on + '" aria-label="' + esc(c.name + ', 코인 ' + c.cost + '. ' + c.text + (on ? '. 바꿀 카드로 고름' : '')) + '" style="position: absolute; left: ' + k * 138 + 'px; top: 6px; width: 128px; height: 210px; padding: 0; margin: 0; font: inherit; color: #3B2A20; cursor: pointer; box-sizing: border-box; background: #F4E4BC; border: 3px solid ' + (crew ? '#8B5A2B' : '#5B8DEF') + '; outline: ' + (on ? '4px solid #E35D5B' : '3px solid transparent') + '; outline-offset: 2px; opacity: ' + (on ? 0.6 : 1) + '">'
        + '<span style="position: absolute; left: 0; top: 6px; width: 122px; text-align: center; font-size: 16px; line-height: 16px">' + esc(c.name) + '</span>'
        + '<span aria-hidden="true" style="position: absolute; left: 34px; top: ' + (isSmall(id) ? 52 : 38) + 'px; width: 3px; height: 3px; box-shadow: ' + SP[id] + '"></span>'
        + '<span style="position: absolute; left: 6px; top: 128px; width: 110px; font-size: 14px; line-height: 16px; text-align: center; word-break: keep-all">코인 ' + c.cost + (crew ? ' · ' + c.atk + '/' + c.hp : ' · 공법') + '<br>' + esc(c.text) + '</span>'
        + (on ? '<span style="position: absolute; left: 34px; top: 74px; padding: 2px 8px; background: #B83E3C; border: 3px solid #3B2A20; color: #FFFFFF; font-size: 16px; line-height: 16px">바꿈</span>' : '')
        + '</button>';
    };
    const btn = (act, label, x, w, green) => '<button type="button" data-act="' + act + '" style="position: absolute; left: ' + x + 'px; top: 0; width: ' + w + 'px; height: 56px; padding: 0; margin: 0; font: inherit; cursor: pointer; box-sizing: border-box; ' + L.BTN + '; '
      + (green ? L.GREEN + '; color: #FFFFFF; ' + L.OUT2 : L.PAPER + '; background: #FFFFFF; color: #3B2A20') + '; font-size: 24px; line-height: 24px">' + esc(label) + '</button>';
    const finish = swap => {
      const changed = swap ? picks.slice().sort((a, b) => a - b) : [], res = E.mulligan(g, changed);
      JG.info.close();
      ui.msg = res.msg + ' ' + turnStartText();
      if (changed.length) { JG.sound.play('coin'); arriveCards(changed); }
      store();
      fx.banner(g.turn + '턴 · 내 턴!');
    };
    return {
      title: '자재 검수',
      meta: '처음 받은 자재를 살펴보세요. 바꿀 카드를 눌러 고르고 [바꾸기] (한 번만)',
      body: () => '<div style="position: relative; height: 226px">' + g.hand.map(cardBox).join('') + '</div>'
        + '<div style="position: relative; height: 56px; margin-top: 18px">' + btn('mull-go', picks.length ? picks.length + '장 바꾸기' : '바꿀 카드를 고르세요', 0, 330, picks.length > 0) + btn('mull-keep', '그대로 시작', 350, 250, false) + '</div>'
        + '<p style="margin: 12px 0 0; font-size: 14px; color: #5C3A1E">바꾼 카드는 자재 더미 맨 아래로 가고, 자재 더미 맨 위 카드가 그 자리에 들어와요.</p>',
      text: () => '손패: ' + g.hand.map(id => JG.CARDS[id].name).join(', ') + '. ' + (picks.length ? '바꿀 카드: ' + picks.map(k => JG.CARDS[g.hand[k]].name).join(', ') + '.' : '바꿀 카드를 눌러 고른 뒤 바꾸기를, 그대로 쓰려면 그대로 시작을 누르세요.'),
      click(act, n) {
        if (act === 'mull') { const k = picks.indexOf(n); if (k >= 0) picks.splice(k, 1); else picks.push(n); JG.sound.play('tick'); }
        if (act === 'mull-go' && picks.length) finish(true);
        if (act === 'mull-keep') finish(false);
      }
    };
  }

  // ---------- 남은 자재 보기: 자재 더미에 남은 카드 (뽑는 순서는 비밀이라 코인·이름 순으로) ----------
  function pilePage() {
    const count = {};
    g.deck.forEach(id => { count[id] = (count[id] || 0) + 1; });
    const ids = Object.keys(count).sort((a, b) => JG.CARDS[a].cost - JG.CARDS[b].cost || JG.CARDS[a].name.localeCompare(JG.CARDS[b].name, 'ko'));
    const line = id => { const c = JG.CARDS[id]; return c.name + ' ×' + count[id] + ' (코인 ' + c.cost + (c.kind === 'crew' ? ' · 작업팀 ' + c.atk + '/' + c.hp : ' · 공법') + ')'; };
    const rule = '자재 소진: 자재 더미가 비면 턴을 시작할 때마다 공기 -' + R.emptyDeckDays + '일. 카드를 뽑는 카드(드론 측량 등)는 자재를 빨리 써요.';
    return {
      title: '남은 자재',
      meta: '자재 더미 ' + g.deck.length + '장 · 뽑는 순서는 비밀이에요',
      body: () => (ids.length ? ids.map(id => '<p style="margin: 0 0 10px"><span style="color: #3E5C8A">' + JG.esc(line(id)) + '</span><br>' + JG.esc(JG.CARDS[id].text) + '</p>').join('')
        : '<p style="margin: 0 0 10px">자재를 다 썼어요.</p>') + '<p style="margin: 12px 0 0; color: #8B3A1E">' + JG.esc(rule) + '</p>',
      text: () => (ids.length ? ids.map(line).join(', ') + '.' : '자재를 다 썼어요.') + ' ' + rule
    };
  }

  // ---------- 화면 등록 ----------
  JG.screens.battle = {
    // arg: { siteId, pledge } 새 판 (아침 TBM에서 고른 다짐), { resume: true } 하던 판 이어하기
    enter(arg) {
      if (arg.resume && JG.save.data.game) begin(JG.save.data.game, '이어서 해요. ');
      else begin(newGameFor(arg));
      clearInterval(ticker);
      ticker = setInterval(tick, 1000);
      const guide = E.siteOf(g).guide;
      if (!arg.resume && !(guide && guide[1])) JG.info.showPage(mulliganPage());   // 첫 판 안내가 있는 현장은 빼고. 알림판은 검수를 마친 뒤
      else if (!g.over) fx.banner(g.turn + '턴 · 내 턴!');
    },
    leave() {
      clearInterval(ticker); ticker = null;
      ui.replay = null; ui.anim = false; animId++;   // 하던 연출은 이 화면을 다시 그리지 않는다
      fx.skipAll();
    },
    msg: () => ui.msg,
    music: () => (g.turn > R.baseTurns ? 'night' : 'day'),   // 9턴부터 야간작업 곡

    click(act, n) {
      if (ui.replay) { finishReplay(); return 'hold'; }   // 현장 턴 연출 중에는 누르면 바로 끝 (finishReplay가 이미 그렸으니 다시 그리지 않음: 뽑은 카드 연출이 지워지지 않게)
      stopAnim();   // 내 턴 연출 중이면 바로 끝내고 누른 것을 처리
      if (act === 'restart') { JG.app.show('tbm', tbmTarget()); return; }   // 새 판은 늘 아침 TBM부터
      if (act === 'exit') { JG.app.show(JG.app.hub); return; }
      if (act === 'sites') { JG.app.show('sites'); return; }
      if (act === 'result') { JG.app.show('result', { state: g, info: ui.result }); return; }
      if (act === 'lesson') { JG.info.showPage(JG.lesson.lessonPage(g)); return; }   // 공기 지연이어도 수업용 해설은 볼 수 있다
      if (act === 'pile') { JG.sound.play('tick'); JG.info.showPage(pilePage()); return; }
      if (g.over) return;
      ui.bubble = null;
      const coins0 = g.coins, deck0 = g.deck.length;
      let held;
      if (act === 'card') pickCard(n);
      else if (act === 'my') pickMy(n);
      else if (act === 'prob') held = pickProb(n);
      else if (act === 'building') held = hitBuilding();
      else if (act === 'order') apply(E.order(g, selWorker()));
      else if (act === 'end') { endTurn(); return; }
      if (g.coins < coins0) pop(COIN[0], COIN[1], '-' + (coins0 - g.coins), RED, 32);
      if (g.deck.length < deck0) arriveCards(lastCards(deck0 - g.deck.length));   // 드론 측량 등으로 뽑은 카드
      after();
      return held;
    },

    render() { return JG.battleView(view(), JG.esc); },
    afterRender() { post.splice(0).forEach(run => run()); }
  };

  function pledgeStatus(s) {
    if (s.pledge === 'chant') return s.shield > 0 ? '첫 피해 1번 무효 (1회 남음)' : '첫 피해를 이미 막았어요';
    if (s.pledge === 'delivery') return '시작 손패 +1장 (받았어요)';
    if (s.pledge === 'inspect') return s.equipDiscount > 0 ? '처음 내는 장비 카드 코인 -1' : '장비 할인을 이미 썼어요';
    return '';
  }

  // 끝 창 버튼: 준공이면 [결과 보기] (다음 현장·다시 하기는 결과 화면에서), 공기 지연이면 [다시 하기] [해설 보기] [현장 고르기]
  function overButtons() {
    if (g.over === 'win') return [{ act: 'result', label: '준공 결과 보기', x: 135, w: 300, primary: true }];
    return [
      { act: 'restart', label: '다시 하기', x: 13, w: 220, primary: true },
      { act: 'lesson', label: '해설 보기', x: 245, w: 150 },
      { act: 'sites', label: '현장 고르기', x: 407, w: 150 }
    ];
  }

  // 문제 카드의 다음 행동 글자: "→ 철근공 -1 퇴장", "→ 달력 -2일" (같은 대상은 합치고, 대상이 둘이면 두 줄)
  function intentText(s, pv, i) {
    const last = {};   // 작업팀마다 마지막으로 치는 문제 (퇴장은 그 문제에만 붙인다)
    pv.probs.forEach((acts, pi) => acts.forEach(a => { if (typeof a.to === 'number') last[a.to] = pi; }));
    const merged = [];
    pv.probs[i].forEach(a => {
      const same = merged.find(m => m.to === a.to);
      if (same) same.n += a.n; else merged.push({ to: a.to, n: a.n });
    });
    const parts = merged.map(a => a.to === 'calendar' ? '달력 -' + a.n + '일' : a.to === 'shield' ? '안전 구호가 막음'
      : JG.CARDS[s.my[a.to].id].name + ' -' + a.n + (pv.my[a.to].out && last[a.to] === i ? ' 퇴장' : ''));
    return parts.map(p => '→ ' + p).join('\n');
  }
  // 고른 작업팀으로 이 문제를 치면: "치면 해결!", "체력 1 남음" (되치기를 받으면 둘째 줄 "되치기 -1 퇴장")
  function hitText(h) {
    return (h.solved ? '치면 해결!' : '체력 ' + h.left + ' 남음') + (h.back ? '\n되치기 -' + h.back + (h.out ? ' 퇴장' : '') : '');
  }
  const labelSize = text => (Math.max(...text.split('\n').map(l => l.length)) > 11 ? 14 : 16);

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
    const pv = !busy && !s.over ? E.preview(s) : null;   // 지금 턴을 끝내면 현장 턴에 일어날 일 (연출 중·판 끝엔 안 보임)
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
      const atk = w ? E.atkOf(s, w) : 0, hurt = pv && w ? pv.my[i] : null;
      const label = hurt ? (hurt.n ? '-' + hurt.n + (hurt.out ? ' 퇴장' : '') : '막음') : '';
      return {
        x: ZX[i], click: 'my:' + i, info: w ? 'card:' + w.id : '',
        aria: w ? c.name + ', 공격 ' + atk + ', 체력 ' + Math.max(0, w.hp) + (hurt ? '. 다음 현장 턴에 ' + (hurt.n ? '체력 ' + label : '맞지만 피해 없음') : '') + (ally ? '. 눌러서 ' + sc.name : '') : (place ? '빈 작업 구역. 여기에 놓기' : '빈 작업 구역'),
        occupied: !!w, empty: !w, emptyText: place ? '여기에 놓기' : '빈 작업 구역', emptyColor: place ? '#23602A' : '#8B5A2B',
        bg: w ? '#CF965C' : 'transparent',
        border: isSel ? '3px solid #FFE08A' : w ? '3px solid #8B5A2B' : (place ? '3px dashed #23602A' : '3px dashed #B07A47'),
        outline: isSel ? '3px solid #FFE08A' : (act || place || ally) ? '3px solid #7BD389' : '3px solid transparent',
        anim: (act || place || ally) ? PULSE : 'none',
        shadow: w ? SP[w.id] : '', spriteTop: w && isSmall(w.id) ? 36 : 24,
        name: w ? c.name : '', atk, hp: w ? Math.max(0, w.hp) : 0,
        tag: !w ? '' : w.curing ? (w.curing > 1 ? '양생 ' + w.curing + '턴' : '양생 중') : w.guard ? '방호' : canHit(i) ? '칠 수 있음' : (w.ready ? '대기' : '다음 턴부터'),
        tagColor: !w ? '#3B2A20' : w.curing ? '#2C4266' : w.guard ? '#8B3A1E' : canHit(i) ? '#23602A' : '#5C3A1E',
        bob: w && canHit(i) ? 'bob 1s steps(2) infinite' : 'none',
        hasBubble: !busy && !!(ui.bubble && ui.bubble.zone === i), bubble: ui.bubble ? ui.bubble.text : '', bx: ZX[i] + 18,
        label, labelBg: hurt && hurt.n ? '#B83E3C' : '#5C3A1E', labelSize: 16, labelAlign: 'right: 2px'
      };
    });

    // 현장 문제 칸
    const probZones = s.probs.map((p, i) => {
      const d = p ? JG.PROBLEMS[p.id] : null, target = (selW && p && (gi < 0 || p.guard)) || (probMode && !!p);
      const h = target && selW ? E.previewHit(s, sel.i, i) : null;
      const label = h ? hitText(h) : p && pv ? intentText(s, pv, i) : '';
      return {
        x: ZX[i], click: 'prob:' + i, info: p ? 'prob:' + p.id : '',
        aria: p ? d.name + ', 공격 ' + p.atk + ', 체력 ' + Math.max(0, p.hp) + (label ? '. ' + (h ? '' : '다음 현장 턴 ') + label.replace(/→ /g, '').replace(/\n/g, ', ') : '') + (target ? (probMode ? '. 눌러서 ' + sc.name : '. 눌러서 망치질') : '') : '문제 카드 자리',
        occupied: !!p, empty: !p, emptyText: '문제 자리', emptyColor: '#8B5A2B',
        bg: p ? '#D7A26C' : 'transparent',
        border: p ? '3px solid #E85D3A' : '3px dashed #B07A47',
        outline: target ? '3px solid #7BD389' : '3px solid transparent', anim: target ? PULSE : 'none',
        shadow: p ? SP[p.id] : '', spriteTop: 36, name: p ? d.name : '', atk: p ? p.atk : 0, hp: p ? Math.max(0, p.hp) : 0,
        tag: p ? probTag(p) : '', tagColor: '#8B3A1E', bob: 'none',
        hasBubble: false, bubble: '', bx: 0,
        label, labelBg: h ? (h.solved ? '#23602A' : '#5C3A1E') : '#B83E3C', labelSize: labelSize(label), labelAlign: 'left: 50%; transform: translateX(-50%)'
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
      deckText: s.deck.length ? s.deck.length + '장 남음' : '다 씀!', deckColor: s.deck.length ? '#5C3A1E' : '#B83E3C',
      pileAria: '자재 더미, ' + (s.deck.length ? s.deck.length + '장 남음' : '다 씀. 턴마다 공기 -' + R.emptyDeckDays + '일') + '. 눌러서 남은 자재 보기',
      probZones, myZones, hand, coins, coinText: s.coins + '/' + s.maxCoins,
      daysText: 'D-' + s.days, daysColor: s.days <= 5 ? '#B83E3C' : '#3B2A20',
      daysNote: pv && pv.lose ? '이대로면 공기 지연!' : pv && pv.days > 0 ? '다음 현장 턴 -' + pv.days + '일' : '남은 날짜',
      daysNoteColor: pv && pv.days > 0 ? '#B83E3C' : '#5C3A1E',
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

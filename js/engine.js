// 준공! 규칙 엔진
// 화면(DOM)과 떨어져서 게임 상태만 다룬다. 브라우저와 Node(시뮬레이터) 양쪽에서 쓴다.
// 행동 함수는 상태 s를 직접 바꾸고 { ok, msg, events }를 돌려준다. ok가 false면 s는 바뀌지 않는다.
// events는 화면 연출용 기록이다 (예: { t: 'bubble', zone: 0, text: '통통!' }).
(() => {
  const JG = globalThis.JG;
  const R = () => JG.RULES;

  // ---------- 작은 도구 ----------
  const card = id => JG.CARDS[id];
  const problem = id => JG.PROBLEMS[id];
  const siteOf = s => JG.SITES.find(x => x.id === s.siteId);
  const conditionOf = s => { const id = siteOf(s).condition; return id ? JG.CONDITIONS[id] : null; };

  // 한국어 조사: 받침이 있으면 '은/이', 없으면 '는/가'
  const hasBatchim = w => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c < 11172 && c % 28 !== 0; };
  const eun = w => w + (hasBatchim(w) ? '은' : '는');
  const ga = w => w + (hasBatchim(w) ? '이' : '가');
  const eul = w => w + (hasBatchim(w) ? '을' : '를');
  // '로/으로': 받침이 없거나 ㄹ 받침이면 '로'
  const ro = w => w + (hasBatchim(w) && (w.charCodeAt(w.length - 1) - 0xAC00) % 28 !== 8 ? '으로' : '로');

  // 시드 난수: 같은 시드면 늘 같은 순서가 나온다 (데일리 현장, 시나리오 코드용)
  function random(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(list, seed) {
    const rnd = random(seed), a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  const result = (ok, msg, events) => ({ ok, msg, events: events || [] });
  const fail = msg => result(false, msg);

  // ---------- 계산 ----------
  // 작업팀의 지금 공격력: 기본 + 작업지시 + 현장 조건(예: 집중호우면 콘크리트 -1)
  function atkOf(s, w) {
    const cond = conditionOf(s);
    const mod = cond && cond.tradeAtk ? (cond.tradeAtk[card(w.id).trade] || 0) : 0;
    return Math.max(0, w.atk + w.buff + mod);
  }
  const guardIndex = s => s.probs.findIndex(p => p && p.guard);
  // 양옆에 안전관리자가 있으면 i번 작업팀이 받는 피해가 줄어든다
  const protection = (s, i) => Math.max(0, ...[s.my[i - 1], s.my[i + 1]].map(w => (w && card(w.id).protectNeighbors) || 0));
  // 장비 일일점검 다짐: 처음 내는 장비 카드 코인 할인
  const costOf = (s, id) => { const c = card(id); return Math.max(0, c.cost - (c.trade === 'equipment' ? s.equipDiscount : 0)); };
  const floors = s => Math.floor(s.bricks / R().bricksPerFloor);
  const totalFloors = s => s.totalBricks / R().bricksPerFloor;
  const nextProblem = s => { const f = siteOf(s).forecast; return f[s.fi % f.length]; };
  function stars(s) {
    if (s.over !== 'win') return 0;
    const t = R().stars;
    return s.days >= t[0] ? 3 : s.days >= t[1] ? 2 : 1;
  }

  // ---------- 판 시작 ----------
  // opts: { siteId, pledge(다짐 id, 없어도 됨), seed(덱 섞기), deck(카드 id 목록, 없으면 기본 덱) }
  function newGame(opts) {
    const r = R(), site = JG.SITES.find(x => x.id === opts.siteId), pledge = JG.PLEDGES[opts.pledge] || {};
    const deck = shuffle(opts.deck || JG.STARTER_DECK, opts.seed || 1);
    const handSize = r.startHand + (pledge.extraHand || 0);
    // 시작 손패 보장: 현장에 starterCard가 있으면 그 카드(첫 판 안내용),
    // 없으면 1턴 코인으로 낼 수 있는 카드 1장 (1턴에 낼 카드가 없으면 답답하니까)
    const wanted = site.starterCard ? id => id === site.starterCard : id => card(id).cost <= r.startCoins;
    if (!deck.slice(0, handSize).some(wanted)) {
      const k = deck.findIndex(wanted);
      if (k >= 0) deck.unshift(deck.splice(k, 1)[0]);
    }
    return {
      siteId: site.id, pledge: opts.pledge || null,
      turn: 1, maxCoins: r.startCoins, coins: r.startCoins,
      bricks: 0, totalBricks: site.bricks, days: r.days, fi: 0,
      hand: deck.splice(0, handSize), deck,
      my: new Array(r.zones).fill(null), probs: new Array(r.zones).fill(null),
      orderUsed: false, shield: pledge.shield || 0, equipDiscount: pledge.equipDiscount || 0,
      over: null,
      // 결과 화면용 기록: work[턴-1] = 그 턴에 일한 공종들, floors[층-1] = 완성한 턴, cards = 낸 카드 id
      rec: { work: [], floors: [], cards: [] }
    };
  }

  // 지금 작업 구역에서 일하는(양생 중이 아닌) 작업팀의 공종을 이번 턴 기록에 더한다
  function mark(s) {
    const set = s.rec.work[s.turn - 1] || [];
    s.my.forEach(w => { const tr = w && !w.curing && card(w.id).trade; if (tr && !set.includes(tr)) set.push(tr); });
    s.rec.work[s.turn - 1] = set;
  }

  function draw(s, n) {
    let got = 0;
    for (let k = 0; k < n && s.deck.length && s.hand.length < R().handMax; k++) { s.hand.push(s.deck.shift()); got++; }
    return got;
  }

  // ---------- 내 턴: 카드 내기 ----------
  // 손패 h번 카드를 낼 수 없으면 그 이유를, 낼 수 있으면 null을 돌려준다
  function whyCantPlay(s, h) {
    if (s.over) return '판이 끝났어요.';
    const id = s.hand[h];
    if (!id) return '손패에 없는 카드예요.';
    const c = card(id), cost = costOf(s, id);
    if (cost > s.coins) return c.name + ': 코인 ' + cost + '개가 필요해요. 지금은 ' + s.coins + '개뿐이에요.';
    if (c.kind === 'crew' && !s.my.some(w => !w)) return '작업 구역이 꽉 찼어요. 작업팀이 퇴장하면 자리가 나요.';
    return null;
  }

  // 손패 h번 카드를 낸다. 작업팀이면 z번 작업 구역에, 공법이면 z는 무시한다
  function playCard(s, h, z) {
    const why = whyCantPlay(s, h);
    if (why) return fail(why);
    const id = s.hand[h], c = card(id), cost = costOf(s, id);
    if (c.kind === 'crew' && (!(z >= 0 && z < s.my.length) || s.my[z])) return fail('빈 작업 구역(점선)을 골라 주세요.');

    s.coins -= cost;
    s.hand.splice(h, 1);
    if (c.trade === 'equipment') s.equipDiscount = 0;
    if (!s.rec.cards.includes(id)) s.rec.cards.push(id);

    if (c.kind === 'spell') {
      const n = draw(s, c.draw || 0);
      return result(true, c.name + '! 카드 ' + n + '장을 뽑았어요.', [{ t: 'spell', id }]);
    }

    const w = { id, atk: c.atk, hp: c.hp, ready: !!c.rush, fresh: true, curing: !!c.cure, guard: !!c.guard, buff: 0, pre: false };
    if (c.prerequisite && s.my.some(x => x && x.id === c.prerequisite)) {
      w.atk += c.preBonus.atk; w.hp += c.preBonus.hp; w.pre = true;
    }
    s.my[z] = w;
    mark(s);

    let msg = w.ready ? c.name + ' 긴급투입! 바로 망치질할 수 있어요.'
      : w.guard ? c.name + ' 배치! 방호라서 현장 문제가 이쪽을 먼저 쳐요.'
      : c.name + ' 배치! 다음 턴부터 망치질해요.';
    if (w.pre) msg += ' 앞 공정(' + card(c.prerequisite).name + ')이 있어서 +' + c.preBonus.atk + '/+' + c.preBonus.hp + '!';
    if (w.curing) msg += ' 양생이 끝나면 더 단단해져요.';
    return result(true, msg, [{ t: 'bubble', zone: z, text: c.line }]);
  }

  // ---------- 내 턴: 망치질 ----------
  function whyCantHit(s, i) {
    if (s.over) return '판이 끝났어요.';
    const w = s.my[i];
    if (!w) return '작업팀이 없는 자리예요.';
    const c = card(w.id);
    if (!w.ready) {
      if (w.curing) return eun(c.name) + ' 양생 중이에요. 다음 턴에 +' + c.cure.atk + '/+' + c.cure.hp + '로 단단해져요.';
      if (w.fresh) return eun(c.name) + ' 방금 들어왔어요. 다음 턴부터 일해요.';
      return eun(c.name) + ' 이번 턴에 이미 망치질했어요.';
    }
    if (atkOf(s, w) <= 0) return w.guard ? eun(c.name) + ' 망치질 대신 방호를 맡아요. 현장 문제가 이쪽을 먼저 쳐요.'
      : eun(c.name) + ' 지금 공격력이 0이라 망치질할 수 없어요.';
    return null;
  }

  // i번 작업팀이 target을 친다. target은 'building'(건물) 또는 문제 칸 번호
  function hit(s, i, target) {
    const why = whyCantHit(s, i);
    if (why) return fail(why);
    const w = s.my[i], c = card(w.id), a = atkOf(s, w), gi = guardIndex(s);
    const guardName = gi >= 0 ? problem(s.probs[gi].id).name : '';

    if (target === 'building') {
      if (gi >= 0) return fail(ga(guardName) + ' 방호로 막고 있어요. 먼저 치워 주세요.');
      mark(s);
      const before = floors(s);
      s.bricks = Math.min(s.totalBricks, s.bricks + a);
      for (let f = before; f < floors(s); f++) s.rec.floors[f] = s.turn;
      w.ready = false;
      const events = [{ t: 'bubble', zone: i, text: '통통!' }, { t: 'bricks', zone: i, n: a }];
      let msg = '통통! ' + ga(c.name) + ' 벽돌 ' + a + '칸을 쌓았어요 (' + s.bricks + '/' + s.totalBricks + ').';
      if (floors(s) > before) { msg += ' ' + floors(s) + '층 완성! 창문에 불이 켜졌어요.'; events.push({ t: 'floor', n: floors(s) }); }
      if (s.bricks >= s.totalBricks) { s.over = 'win'; msg = '준공! ' + totalFloors(s) + '층까지 다 올렸어요.'; events.push({ t: 'win' }); }
      return result(true, msg, events);
    }

    const p = s.probs[target];
    if (!p) return fail('문제 카드나 건물을 골라 주세요.');
    if (gi >= 0 && !p.guard) return fail('방호(' + guardName + ')부터 치워야 해요!');
    mark(s);
    const pname = problem(p.id).name, back = Math.max(0, p.atk - protection(s, i));
    p.hp -= a; w.hp -= back; w.ready = false;
    const events = [];
    let msg = c.name + ' → ' + pname + ': ' + a + ' 피해.';
    if (p.hp <= 0) { s.probs[target] = null; msg += ' ' + pname + ' 해결!'; events.push({ t: 'solved', zone: target }); }
    if (w.hp <= 0) {
      s.my[i] = null; msg += ' ' + c.name + ': "오늘 작업 끝!" 하고 퇴장했어요.'; events.push({ t: 'out', zone: i });
    } else {
      if (back > 0) msg += ' 되치기로 체력 -' + back + '.';
      events.push({ t: 'bubble', zone: i, text: p.hp <= 0 ? '치웠습니다!' : '통통!' });
    }
    return result(true, msg, events);
  }

  // ---------- 내 턴: 작업지시 ----------
  function whyCantOrder(s) {
    if (s.over) return '판이 끝났어요.';
    if (s.orderUsed) return '작업지시는 한 턴에 한 번만 쓸 수 있어요.';
    if (s.coins < R().orderCost) return '작업지시에는 코인 ' + R().orderCost + '개가 필요해요.';
    if (!s.my.some((w, k) => !whyCantHit(s, k))) return '작업지시를 받을 작업팀이 없어요. 망치질할 수 있는 작업팀이 있어야 해요.';
    return null;
  }

  // 고른 작업팀(i), 없거나 칠 수 없으면 칠 수 있는 첫 작업팀의 공격력 +1 (이번 턴만)
  function order(s, i) {
    const why = whyCantOrder(s);
    if (why) return fail(why);
    if (i == null || whyCantHit(s, i)) i = s.my.findIndex((w, k) => !whyCantHit(s, k));
    const w = s.my[i];
    w.buff += R().orderAtk; s.coins -= R().orderCost; s.orderUsed = true;
    return result(true, '작업지시! ' + card(w.id).name + ' 공격 +' + R().orderAtk + ' (이번 턴만).', [{ t: 'bubble', zone: i, text: '알겠습니다!' }]);
  }

  // ---------- 턴 종료 → 현장 턴 → 다음 내 턴 ----------
  // opts.snapshots가 true면 각 사건에 그 순간의 상태 사본(state)을 붙인다 (화면에서 하나씩 보여 주기용)
  function endTurn(s, opts) {
    if (s.over) return fail('판이 끝났어요.');
    const r = R(), events = [], snap = !!(opts && opts.snapshots);
    const say = (t, text, extra) => events.push(Object.assign({ t, text }, extra, snap ? { state: JSON.parse(JSON.stringify(s)) } : null));
    // 달력(내 공기)이 받는 피해. 안전 구호 다짐이 있으면 첫 피해 1번을 막는다
    const hitCalendar = (n, who) => {
      if (n <= 0) return;
      if (s.shield > 0) { s.shield -= 1; say('shield', who + '의 피해를 안전 구호가 막았어요.'); return; }
      s.days -= n; say('calendar', who + ': 공기 -' + n + '일.', { n });
    };

    mark(s);
    // 작업지시는 내 턴에만 적용된다
    s.my.forEach(w => { if (w) w.buff = 0; });

    // 1. 누수 같은 문제가 공기를 깎는다
    s.probs.forEach(p => { if (p && p.drain) hitCalendar(p.drain, problem(p.id).name); });

    // 2. 문제 카드가 차례로 친다. 대상: 방호 작업팀 → 한 번에 퇴장시킬 수 있는 작업팀 → 달력
    s.probs.forEach((p, pi) => {
      if (!p || p.atk <= 0) return;
      const name = problem(p.id).name, dmgTo = k => Math.max(0, p.atk - protection(s, k));
      let ti = s.my.findIndex(w => w && w.guard);
      if (ti < 0) ti = s.my.findIndex((w, k) => w && w.hp <= dmgTo(k));
      if (ti < 0) { hitCalendar(p.atk, name); return; }
      const w = s.my[ti], wname = card(w.id).name, dmg = dmgTo(ti);
      w.hp -= dmg; p.hp -= atkOf(s, w);   // 작업팀은 맞으면서 자기 공격력만큼 되친다
      say('hitWorker', name + ' → ' + wname + ': 체력 -' + dmg + '.', { from: pi, zone: ti });
      if (w.hp <= 0) { s.my[ti] = null; say('out', wname + ': "오늘 작업 끝!" 하고 퇴장.', { zone: ti }); }
      if (p.hp <= 0) { s.probs[pi] = null; say('solved', name + ' 해결!', { zone: pi }); }
    });

    // 3. 예고했던 문제가 빈칸에 들어온다 (새로 나온 문제는 이번 현장 턴에 치지 않는다)
    const next = nextProblem(s), empty = s.probs.findIndex(p => !p);
    if (next && empty >= 0) {
      const d = problem(next);
      s.probs[empty] = { id: next, atk: d.atk, hp: d.hp, guard: !!d.guard, drain: d.drain || 0 };
      say('newProblem', '새 문제: ' + d.name + '.', { zone: empty, id: next });
    }
    s.fi += 1;

    // 4. 다음 내 턴 시작: 코인 채우기, 양생, 카드 뽑기, 지체상금
    s.turn += 1;
    s.maxCoins = Math.min(r.maxCoins, s.maxCoins + 1);
    s.coins = s.maxCoins;
    s.orderUsed = false;
    s.my.forEach(w => {
      if (!w) return;
      if (w.curing) {
        const cure = card(w.id).cure;
        w.atk += cure.atk; w.hp += cure.hp; w.curing = false;
        say('cured', card(w.id).name + ' 양생 완료 +' + cure.atk + '/+' + cure.hp + '.');
      }
      w.ready = true; w.fresh = false;
    });
    if (s.deck.length) {
      if (s.hand.length < r.handMax) s.hand.push(s.deck.shift());
      else { s.deck.shift(); say('burn', '손패가 꽉 차서 카드 1장이 버려졌어요.'); }
    }
    if (s.turn > r.baseTurns) { s.days -= r.delayPenalty; say('penalty', (r.baseTurns + 1) + '턴부터 지체상금: 공기 -' + r.delayPenalty + '일.'); }
    if (s.days <= 0) { s.days = 0; s.over = 'lose'; say('lose', '달력이 D-0이 됐어요. 공기 지연...'); }

    const msg = '현장 턴 → ' + (events.length ? events.map(e => e.text).join(' ') : '조용히 지나갔어요.') + (s.over ? '' : ' 이제 ' + s.turn + '턴!');
    return result(true, msg, events);
  }

  JG.engine = {
    newGame, playCard, hit, order, endTurn,
    whyCantPlay, whyCantHit, whyCantOrder,
    atkOf, costOf, guardIndex, protection, floors, totalFloors, nextProblem, stars, siteOf,
    random, shuffle, eun, ga, eul, ro
  };
})();

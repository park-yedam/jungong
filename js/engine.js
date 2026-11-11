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
  // 현장: 데일리 현장처럼 만들어진 현장은 상태 안(s.site)에 들고 다닌다
  const siteOf = s => s.site || JG.SITES.find(x => x.id === s.siteId);
  // 현장 조건. 보온양생 같은 공법으로 무효가 되면(condOff) 없는 것으로 친다
  const conditionOf = s => { const id = siteOf(s).condition; return id && !s.condOff ? JG.CONDITIONS[id] : null; };
  const diffOf = s => JG.DIFFICULTY[s.diff] || JG.DIFFICULTY.normal;

  // 한국어 조사: 받침이 있으면 '은/이', 없으면 '는/가'
  const hasBatchim = w => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c < 11172 && c % 28 !== 0; };
  const eun = w => w + (hasBatchim(w) ? '은' : '는');
  const ga = w => w + (hasBatchim(w) ? '이' : '가');
  const eul = w => w + (hasBatchim(w) ? '을' : '를');
  const ieyo = w => w + (hasBatchim(w) ? '이에요' : '예요');
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

  // 작업팀이 피해 n을 받는다. 안전모가 있으면 첫 피해 1번을 막는다. 실제로 깎인 체력을 돌려준다
  function hurt(w, n) {
    if (n <= 0) return 0;
    if (w.helmet) { w.helmet = false; return 0; }
    w.hp -= n;
    return n;
  }
  // 망치질 한 번 쓰기. 연속 망치질 작업팀은 한 턴에 두 번 칠 수 있다
  const spend = w => { if (w.twice && !w.second) w.second = true; else w.ready = false; };
  // 숙련 승급: 필드의 같은 작업팀 위에 겹쳐 낼 수 있는지 (한 팀은 한 번만)
  const canMerge = (w, id) => !!(w && w.id === id && !w.gold);

  const result = (ok, msg, events) => ({ ok, msg, events: events || [] });
  const fail = msg => result(false, msg);

  // ---------- 계산 ----------
  // 내 필드의 오라(예: 신호수 → 장비 공격 +1). 같은 공종 오라는 겹치지 않는다
  const auraAtk = (s, trade) => Math.max(0, ...s.my.map(x => { const a = x && card(x.id).aura; return a && a.trade === trade ? a.atk : 0; }));
  // 양옆 작업팀을 이끄는 반장 (베테랑 반장 → 양옆 공격 +1, 겹치지 않음)
  const leadAtk = (s, i) => Math.max(0, ...[s.my[i - 1], s.my[i + 1]].map(x => (x && card(x.id).leadNeighbors) || 0));
  // 작업팀의 지금 공격력: 기본 + 작업지시·돌관작업 + 오라 + 반장 + 현장 조건(예: 집중호우면 콘크리트 -1, PC 부재는 날씨 무시)
  function atkOf(s, w) {
    const c = card(w.id), cond = conditionOf(s);
    const weather = cond && cond.tradeAtk && !c.weatherProof ? (cond.tradeAtk[c.trade] || 0) : 0;
    return Math.max(0, w.atk + w.buff + auraAtk(s, c.trade) + leadAtk(s, s.my.indexOf(w)) + weather);
  }
  // 문제 카드의 지금 공격력: 감리원이 있으면 모두 -1 (겹치지 않음)
  const probAtk = (s, p) => Math.max(0, p.atk - Math.max(0, ...s.my.map(w => (w && card(w.id).calmProblems) || 0)));
  const guardIndex = s => s.probs.findIndex(p => p && p.guard);
  // 양옆에 안전관리자가 있으면 i번 작업팀이 받는 피해가 줄어든다
  const protection = (s, i) => Math.max(0, ...[s.my[i - 1], s.my[i + 1]].map(w => (w && card(w.id).protectNeighbors) || 0));
  // 장비 일일점검 다짐: 처음 내는 장비 카드 코인 할인
  const costOf = (s, id) => { const c = card(id); return Math.max(0, c.cost - (c.trade === 'equipment' ? s.equipDiscount : 0)); };
  const floors = s => Math.floor(s.bricks / R().bricksPerFloor);
  const totalFloors = s => s.totalBricks / R().bricksPerFloor;
  // n번째로 완성한 층의 이름 (지하가 있으면 지하 2층 → 지하 1층 → 지상 1층 순서)
  function floorName(s, n) {
    const b = siteOf(s).basement || 0;
    return n <= b ? '지하 ' + (b - n + 1) + '층' : (b ? '지상 ' : '') + (n - b) + '층';
  }
  const nextProblem = s => { const f = siteOf(s).forecast; return f[s.fi % f.length]; };
  function stars(s) {
    if (s.over !== 'win') return 0;
    const t = R().stars;
    return s.days >= t[0] ? 3 : s.days >= t[1] ? 2 : 1;
  }

  // ---------- 판 시작 ----------
  // opts: { siteId 또는 site(만들어진 현장 데이터), pledge(다짐 id), seed(덱 섞기), deck(카드 id 목록, 없으면 기본 덱), difficulty('easy' | 'normal' | 'hard'),
  //         pool(자재 발주 시장에 나올 수 있는 카드 id 목록, 없으면 기본 카드) }
  function newGame(opts) {
    const r = R(), site = opts.site || JG.SITES.find(x => x.id === opts.siteId), pledge = JG.PLEDGES[opts.pledge] || {};
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
      siteId: site.id, site: opts.site || undefined, pledge: opts.pledge || null, diff: opts.difficulty || 'normal',
      seed: opts.seed || 1, pool: opts.pool || null,   // 자재 발주 시장 카드를 정하는 데 쓴다
      turn: 1, maxCoins: r.startCoins, coins: r.startCoins,
      bricks: 0, totalBricks: site.bricks, days: r.days, fi: 0,
      hand: deck.splice(0, handSize), deck,
      my: new Array(r.zones).fill(null), probs: new Array(r.zones).fill(null),
      orderUsed: false, shield: pledge.shield || 0, equipDiscount: pledge.equipDiscount || 0,
      condOff: false, cancelNext: false, combo: 0,   // combo: 공정 순서에서 마친 단계 수
      over: null,
      // 결과 화면용 기록: work[턴-1] = 그 턴에 일한 공종들, floors[층-1] = 완성한 턴, cards = 낸 카드 id, probs = 나온 문제 id
      rec: { work: [], floors: [], cards: [], probs: [] }
    };
  }

  // 지금 작업 구역에서 일하는(양생 중이 아닌) 작업팀의 공종을 이번 턴 기록에 더한다
  function mark(s) {
    const set = s.rec.work[s.turn - 1] || [];
    s.my.forEach(w => { const tr = w && !w.curing && card(w.id).trade; if (tr && !set.includes(tr)) set.push(tr); });
    s.rec.work[s.turn - 1] = set;
  }

  // 벽돌 n칸 쌓기: 층이 완성되면 기록하고, 다 차면 준공. 사건은 events에 붙이고, 실제로 쌓은 칸 수를 돌려준다
  function build(s, n, events) {
    const before = floors(s), b0 = s.bricks;
    s.bricks = Math.min(s.totalBricks, s.bricks + n);
    for (let f = before; f < floors(s); f++) s.rec.floors[f] = s.turn;
    if (floors(s) > before) events.push({ t: 'floor', n: floors(s) });
    if (s.bricks >= s.totalBricks) { s.over = 'win'; events.push({ t: 'win' }); }
    return s.bricks - b0;
  }
  const winMsg = s => { const b = siteOf(s).basement || 0; return '준공! ' + (b ? '지하 ' + b + '층, 지상 ' + (totalFloors(s) - b) + '층' : totalFloors(s) + '층') + '까지 다 올렸어요.'; };

  // 공정 순서: 철근 → 형틀 → 타설 공종의 작업팀을 차례로 내면 공정 완료 (벽돌 +comboBricks).
  // 다른 공종은 순서를 끊지 않고, 순서에 안 맞는 카드는 세지 않는다. 철근 공종을 내면 1단계부터 다시
  function advanceCombo(s, trade, events) {
    const steps = R().comboSteps, k = s.combo || 0;   // 개선 6단계 전에 저장된 판은 combo가 없다
    if (trade === steps[k]) s.combo = k + 1;
    else if (trade === steps[0]) s.combo = 1;
    else return '';
    if (s.combo < steps.length) return ' 공정 순서 ' + s.combo + '/' + steps.length + '.';
    s.combo = 0;
    const before = floors(s), more = [], got = build(s, R().comboBricks, more);
    events.push({ t: 'combo', n: got }, ...more);   // 공정 완료 → 층 완성 → 준공 순서
    if (s.over === 'win') return ' 공정 완료! ' + winMsg(s);
    return ' 공정 완료! 벽돌 ' + got + '칸을 쌓았어요 (' + s.bricks + '/' + s.totalBricks + ').' + (floors(s) > before ? ' ' + floorName(s, floors(s)) + ' 완성!' : '');
  }

  // i번 작업팀이 체력이 다 돼 퇴장한다. 퇴장 효과(예: 카드 뽑기)가 있으면 바로 쓰고, 안내 글을 돌려준다
  function retire(s, i) {
    const c = card(s.my[i].id);
    s.my[i] = null;
    return c.onOut && c.onOut.draw ? ' 퇴장 효과: 카드 ' + draw(s, c.onOut.draw) + '장을 뽑았어요.' : '';
  }
  // 등장 효과: z번에 낸 작업팀 말고, 정해진 공종 작업팀들이 공격·체력을 얻는다
  function onPlayEffect(s, z, e, events) {
    const ks = s.my.map((w, k) => (w && k !== z && e.trades.includes(card(w.id).trade) ? k : -1)).filter(k => k >= 0);
    ks.forEach(k => { s.my[k].atk += e.atk || 0; s.my[k].hp += e.hp || 0; });
    const stat = (e.atk ? ' 공격 +' + e.atk : '') + (e.hp ? ' 체력 +' + e.hp : '');
    if (ks.length) events.push({ t: 'buff', zones: ks, atk: e.atk || 0, hp: e.hp || 0 });
    return ' 등장 효과: ' + (ks.length ? '작업팀 ' + ks.length + '팀' + stat : '강해질 작업팀이 없었어요') + '.';
  }

  function draw(s, n) {
    let got = 0;
    for (let k = 0; k < n && s.deck.length && s.hand.length < R().handMax; k++) { s.hand.push(s.deck.shift()); got++; }
    return got;
  }

  // ---------- 판 시작: 자재 검수 ----------
  // 1턴에 한 번, 고른 손패(picks: 손패 번호 목록)를 새 카드로 바꾼다. 새 카드는 그 자리에 들어오고,
  // 바꾼 카드는 덱 맨 아래로 간다 (섞지 않으니 데일리·수업 현장은 같은 덱이면 누구나 같은 결과)
  function mulligan(s, picks) {
    if (s.mulled || s.turn !== 1 || s.rec.cards.length) return fail('자재 검수는 판을 시작할 때 한 번만 할 수 있어요.');
    s.mulled = true;
    const out = [];
    picks.filter((h, k) => s.hand[h] && picks.indexOf(h) === k).sort((a, b) => a - b).forEach(h => {
      if (!s.deck.length) return;
      out.push(s.hand[h]);
      s.hand[h] = s.deck.shift();
    });
    s.deck.push(...out);
    return result(true, out.length ? '자재 검수! 카드 ' + out.length + '장을 바꿨어요.' : '자재 검수: 손패를 그대로 써요.', [{ t: 'mulligan', n: out.length }]);
  }

  // ---------- 내 턴: 카드 내기 ----------
  // 손패 h번 카드를 낼 수 없으면 그 이유를, 낼 수 있으면 null을 돌려준다
  function whyCantPlay(s, h) {
    if (s.over) return '판이 끝났어요.';
    const id = s.hand[h];
    if (!id) return '손패에 없는 카드예요.';
    const c = card(id), cost = costOf(s, id);
    if (cost > s.coins) return c.name + ': 코인 ' + cost + '개가 필요해요. 지금은 ' + s.coins + '개뿐이에요.';
    if (c.kind === 'crew' && !s.my.some(w => !w) && !s.my.some(w => canMerge(w, id))) return '작업 구역이 꽉 찼어요. 작업팀이 퇴장하면 자리가 나요.';
    if (c.target === 'ally' && !s.my.some(Boolean)) return c.name + ': 작업팀이 있어야 쓸 수 있어요.';
    if (c.target === 'problem' && !s.probs.some(Boolean)) return c.name + ': 없앨 문제 카드가 없어요.';
    if (c.cancelForecast && (!nextProblem(s) || s.cancelNext)) return c.name + ': 취소할 예고 문제가 없어요.';
    if (c.selfDays && s.days <= c.selfDays) return c.name + ': 공기가 ' + s.days + '일뿐이라 무리예요.';
    if (c.cureNow && !s.my.some(w => w && w.curing)) return c.name + ': 양생 중인 작업팀이 없어요.';
    if (c.coinsNow && s.coins - cost >= R().maxCoins) return c.name + ': 코인이 이미 가득해요.';
    return null;
  }

  // 손패 h번 카드를 낸다. 작업팀이면 z번 작업 구역에, 대상 공법이면 z번 작업팀(ally) 또는 z번 문제(problem)에 쓴다
  function playCard(s, h, z) {
    const why = whyCantPlay(s, h);
    if (why) return fail(why);
    const id = s.hand[h], c = card(id), cost = costOf(s, id);
    if (c.kind === 'crew' && !(z >= 0 && z < s.my.length && (!s.my[z] || canMerge(s.my[z], id)))) return fail('빈 작업 구역(점선)을 골라 주세요. 같은 작업팀 위에는 겹쳐 내서 숙련 승급할 수 있어요.');
    if (c.target === 'ally' && !(z >= 0 && s.my[z])) return fail(c.name + ': 쓸 작업팀을 골라 주세요.');
    if (c.target === 'problem' && !(z >= 0 && s.probs[z])) return fail(c.name + ': 없앨 문제 카드를 골라 주세요.');

    s.coins -= cost;
    s.hand.splice(h, 1);
    if (c.trade === 'equipment') s.equipDiscount = 0;
    if (!s.rec.cards.includes(id)) s.rec.cards.push(id);

    if (c.kind === 'spell') return castSpell(s, id, z);

    if (s.my[z]) return mergeCard(s, z, c);

    const cond = conditionOf(s);
    const w = { id, atk: c.atk, hp: c.hp, ready: !!c.rush, fresh: true, curing: c.cure ? 1 + ((cond && cond.cureDelay) || 0) : 0, guard: !!c.guard, buff: 0, pre: false };
    const pre = c.prerequisite && s.my.some(x => x && x.id === c.prerequisite);
    if (pre && c.preBonus) { w.atk += c.preBonus.atk; w.hp += c.preBonus.hp; }
    w.pre = !!pre;
    if (c.helmet) w.helmet = true;
    if (c.twice || (pre && c.preTwice)) w.twice = true;
    s.my[z] = w;
    mark(s);

    let msg = w.ready ? c.name + ' 긴급투입! 바로 망치질할 수 있어요.'
      : w.guard ? c.name + ' 배치! 방호라서 현장 문제가 이쪽을 먼저 쳐요.'
      : c.name + ' 배치! 다음 턴부터 망치질해요.';
    if (pre && c.preBonus) msg += ' 앞 공정(' + card(c.prerequisite).name + ')이 있어서 +' + c.preBonus.atk + '/+' + c.preBonus.hp + '!';
    if (pre && c.preDraw) msg += ' 앞 공정(' + card(c.prerequisite).name + ')이 있어서 카드 ' + draw(s, c.preDraw) + '장을 뽑았어요!';
    if (w.curing) msg += w.curing > 1 ? ' 한파라서 양생이 ' + w.curing + '턴 걸려요.' : ' 양생이 끝나면 더 단단해져요.';
    if (pre && c.preTwice) msg += ' 앞 공정(' + card(c.prerequisite).name + ')이 있어서 연속 망치질!';
    const events = [{ t: 'bubble', zone: z, text: c.line }];
    if (c.onPlay) msg += onPlayEffect(s, z, c.onPlay, events);
    msg += advanceCombo(s, (c.comboWild ? R().comboSteps[s.combo || 0] : c.trade), events);
    return result(true, msg, events);
  }

  // 숙련 승급: z번의 같은 작업팀 위에 겹쳐 내면 두 팀이 합쳐져 금색 숙련 작업팀이 된다 (카드 공격·체력만큼 더함, 한 번만)
  function mergeCard(s, z, c) {
    const w = s.my[z];
    w.atk += c.atk; w.hp += c.hp; w.gold = true;
    if (c.helmet) w.helmet = true;   // 새로 합류한 팀이 안전모를 쓰고 온다
    mark(s);
    const events = [{ t: 'bubble', zone: z, text: '숙련 승급!' }, { t: 'merge', zone: z }];
    let msg = c.name + ' 숙련 승급! 두 팀이 합쳐졌어요 (공격 ' + w.atk + ', 체력 ' + w.hp + ').';
    if (c.onPlay) msg += onPlayEffect(s, z, c.onPlay, events);
    msg += advanceCombo(s, (c.comboWild ? R().comboSteps[s.combo || 0] : c.trade), events);
    return result(true, msg, events);
  }

  // 공법 효과 (카드 데이터의 효과 이름대로)
  function castSpell(s, id, z) {
    const c = card(id), parts = [], events = [{ t: 'spell', id }];
    if (c.draw) parts.push('카드 ' + draw(s, c.draw) + '장을 뽑았어요');
    if (c.heal) { s.my[z].hp += c.heal; parts.push(card(s.my[z].id).name + ' 체력 +' + c.heal); events.push({ t: 'heal', zone: z, n: c.heal }); }
    if (c.cancels && siteOf(s).condition === c.cancels && !s.condOff) {
      s.condOff = true;
      s.my.forEach(w => { if (w && w.curing > 1) w.curing = 1; });   // 늦어지던 양생도 원래대로
      parts.push(JG.CONDITIONS[c.cancels].name + ' 조건이 풀렸어요');
    }
    if (c.buffTrade) {
      const b = c.buffTrade, ws = s.my.filter(w => w && card(w.id).trade === b.trade);
      ws.forEach(w => { w.atk += b.atk; w.hp += b.hp; });
      parts.push(ws.length ? '콘크리트 작업팀 ' + ws.length + '팀 +' + b.atk + '/+' + b.hp : '강해질 콘크리트 작업팀은 없었어요');
    }
    if (c.cancelForecast) { s.cancelNext = true; parts.push('예고된 ' + problem(nextProblem(s)).name + ' 취소'); }
    if (c.teamAtk) {
      s.my.forEach(w => { if (w) w.buff += c.teamAtk; });
      s.days -= c.selfDays;
      events.push({ t: 'calendar', n: c.selfDays });
      parts.push('이번 턴 모두 공격 +' + c.teamAtk + ', 공기 -' + c.selfDays + '일');
    }
    if (c.remove) { parts.push(problem(s.probs[z].id).name + ' 제거'); s.probs[z] = null; events.push({ t: 'solved', zone: z }); }
    if (c.cureNow) {   // 압축강도 시험: 양생 중인 작업팀이 바로 양생을 마친다 (이번 턴에 들어온 팀은 다음 턴부터 침)
      s.my.forEach((w, k) => {
        if (!w || !w.curing) return;
        const cure = card(w.id).cure;
        w.curing = 0; w.atk += cure.atk; w.hp += cure.hp;
        if (!w.fresh) w.ready = true;
        events.push({ t: 'cured', zone: k, atk: cure.atk, hp: cure.hp });
      });
      parts.push('양생 완료 ' + events.filter(e => e.t === 'cured').length + '팀');
    }
    if (c.coinsNow) {   // 기성 청구: 이번 턴 코인 (최대치까지)
      const got = Math.min(R().maxCoins, s.coins + c.coinsNow) - s.coins;
      s.coins += got;
      events.push({ t: 'coins', n: got });
      parts.push('이번 턴 코인 +' + got);
    }
    if (c.shieldUp) { s.shield += c.shieldUp; parts.push('다음 공기 피해 ' + c.shieldUp + '번을 막아요'); }
    let msg = c.name + '!' + (parts.length ? ' ' + parts.join(', ') + '.' : '');
    if (c.comboStep) msg += advanceCombo(s, R().comboSteps[s.combo || 0], events);   // 공정표 작성: 공정 순서 1단계 진행
    return result(true, msg, events);
  }

  // ---------- 내 턴: 망치질 ----------
  function whyCantHit(s, i) {
    if (s.over) return '판이 끝났어요.';
    const w = s.my[i];
    if (!w) return '작업팀이 없는 자리예요.';
    const c = card(w.id);
    if (!w.ready) {
      if (w.curing) return eun(c.name) + ' 양생 중이에요. ' + (w.curing > 1 ? w.curing + '턴 뒤에' : '다음 턴에') + ' +' + c.cure.atk + '/+' + c.cure.hp + '로 단단해져요.';
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
    const w = s.my[i], c = card(w.id), gi = guardIndex(s);
    let a = atkOf(s, w);
    const guardName = gi >= 0 ? problem(s.probs[gi].id).name : '';

    if (target === 'building') {
      if (gi >= 0) return fail(ga(guardName) + ' 방호로 막고 있어요. 먼저 치워 주세요.');
      mark(s);
      const before = floors(s);
      spend(w);
      a += c.brickBonus || 0;   // 조적공: 벽돌 +1
      const events = [{ t: 'bubble', zone: i, text: '통통!' }, { t: 'bricks', zone: i, n: a }];
      build(s, a, events);
      let msg = '통통! ' + ga(c.name) + ' 벽돌 ' + a + '칸을 쌓았어요 (' + s.bricks + '/' + s.totalBricks + ').';
      if (floors(s) > before) msg += ' ' + floorName(s, floors(s)) + ' 완성! 창문에 불이 켜졌어요.';
      if (s.over === 'win') msg = winMsg(s);
      return result(true, msg, events);
    }

    const p = s.probs[target];
    if (!p) return fail('문제 카드나 건물을 골라 주세요.');
    if (gi >= 0 && !p.guard) return fail('방호(' + guardName + ')부터 치워야 해요!');
    mark(s);
    if (c.vsLeak && p.drain) a += c.vsLeak;   // 방수공: 누수 문제에 공격 +2
    const pname = problem(p.id).name, raw = Math.max(0, probAtk(s, p) - protection(s, i));
    p.hp -= a;
    const back = hurt(w, raw), helmet = raw > 0 && back === 0;
    spend(w);
    const events = [{ t: 'hit', from: i, zone: target, n: a, back, helmet }];   // 화면 연출용: 준 피해, 되치기로 받은 피해, 안전모가 막았는지
    let msg = c.name + ' → ' + pname + ': ' + a + ' 피해.';
    if (p.hp <= 0) { s.probs[target] = null; msg += ' ' + pname + ' 해결!'; events.push({ t: 'solved', zone: target }); }
    if (w.hp <= 0) {
      msg += ' ' + c.name + ': "오늘 작업 끝!" 하고 퇴장했어요.' + retire(s, i); events.push({ t: 'out', zone: i });
    } else {
      if (helmet) msg += ' 안전모가 되치기를 막았어요.';
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

  // ---------- 내 턴: 자재 발주 ----------
  // 시장 카드: 판의 시드와 턴으로 정해진다 (같은 판 같은 턴이면 늘 같은 카드). 쓸 수 있는 카드(pool) 중에서 겹치지 않게
  function shopOffers(s) {
    const pool = s.pool || Object.keys(JG.CARDS).filter(id => !card(id).expansion);
    return shuffle(pool.filter(id => card(id)), (s.seed || 1) * 31 + s.turn * 977 + 7).slice(0, R().shopOffers);
  }
  function whyCantShop(s) {
    if (s.over) return '판이 끝났어요.';
    if (s.shopUsed) return '자재 발주는 한 턴에 한 번만 할 수 있어요.';
    if (s.coins < R().shopCost) return '자재 발주에는 코인 ' + R().shopCost + '개가 필요해요.';
    if (s.hand.length >= R().handMax) return '손패가 꽉 찼어요 (최대 ' + R().handMax + '장). 카드를 먼저 내 주세요.';
    return null;
  }
  // 시장 카드 k번째를 사서 손패에 넣는다
  function shop(s, k) {
    const why = whyCantShop(s);
    if (why) return fail(why);
    const id = shopOffers(s)[k];
    if (!id) return fail('살 카드를 골라 주세요.');
    s.coins -= R().shopCost;
    s.hand.push(id);
    s.shopUsed = true;
    return result(true, '자재 발주! ' + card(id).name + ' 카드가 손패로 들어왔어요.', [{ t: 'shop', id }]);
  }

  // ---------- 턴 종료 → 현장 턴 → 다음 내 턴 ----------
  // opts.snapshots가 true면 각 사건에 그 순간의 상태 사본(state)을 붙인다 (화면에서 하나씩 보여 주기용)
  function endTurn(s, opts) {
    if (s.over) return fail('판이 끝났어요.');
    const r = R(), events = [], snap = !!(opts && opts.snapshots), cond = conditionOf(s);
    const say = (t, text, extra) => events.push(Object.assign({ t, text }, extra, snap ? { state: JSON.parse(JSON.stringify(s)) } : null));
    // 달력(내 공기)이 받는 피해. 안전 구호 다짐이 있으면 첫 피해 1번을 막는다. from: 친 문제 칸 번호 (화면 연출용, 현장 조건이면 없음)
    const hitCalendar = (n, who, from) => {
      if (n <= 0) return;
      if (s.shield > 0) { s.shield -= 1; say('shield', who + '의 피해를 안전 대비(안전 구호·안전점검)가 막았어요.', { from }); return; }
      s.days -= n; say('calendar', who + ': 공기 -' + n + '일.', { n, from });
    };

    mark(s);
    // 작업지시·돌관작업은 내 턴에만 적용된다
    s.my.forEach(w => { if (w) w.buff = 0; });

    // 1. 연약지반: 방호 작업팀이 없으면 공기가 깎인다. 누수 같은 문제도 공기를 깎는다
    if (cond && cond.needGuard && !s.my.some(w => w && w.guard)) hitCalendar(cond.needGuard, cond.name + '(방호 작업팀 없음)');
    s.probs.forEach((p, pi) => { if (p && p.drain) hitCalendar(p.drain, problem(p.id).name, pi); });

    // 2. 문제 카드가 차례로 친다. 대상: 방호 작업팀 → 한 번에 퇴장시킬 수 있는 작업팀 → 달력
    //    (작업팀만 치는 문제는 달력 대신 첫 작업팀, 작업팀이 없으면 쉰다)
    s.probs.forEach((p, pi) => {
      if (!p || probAtk(s, p) <= 0) return;
      const d = problem(p.id), dmgTo = k => Math.max(0, probAtk(s, p) - protection(s, k));
      let ti = s.my.findIndex(w => w && w.guard);
      if (ti < 0) ti = s.my.findIndex((w, k) => w && !w.helmet && w.hp <= dmgTo(k));
      if (ti < 0 && d.workersOnly) ti = s.my.findIndex(Boolean);
      if (ti < 0) { if (!d.workersOnly) hitCalendar(probAtk(s, p), d.name, pi); return; }
      const w = s.my[ti], wname = card(w.id).name, raw = dmgTo(ti), dmg = hurt(w, raw), helmet = raw > 0 && dmg === 0;
      const back = atkOf(s, w);
      p.hp -= back;   // 작업팀은 맞으면서 자기 공격력만큼 되친다
      say('hitWorker', d.name + ' → ' + wname + (helmet ? ': 안전모가 막았어요.' : ': 체력 -' + dmg + '.'), { from: pi, zone: ti, n: dmg, back, helmet });
      if (w.hp <= 0) { const note = retire(s, ti); say('out', wname + ': "오늘 작업 끝!" 하고 퇴장.' + note, { zone: ti }); }
      if (p.hp <= 0) { s.probs[pi] = null; say('solved', d.name + ' 해결!', { zone: pi }); }
    });

    // 3. 설계변경: 손패 맨 왼쪽 카드를 덱 맨 아래로 보내고 새로 뽑는다
    s.probs.forEach(p => {
      const n = p ? problem(p.id).swapHand || 0 : 0;
      for (let k = 0; k < n && s.hand.length && s.deck.length; k++) {
        const out = s.hand.shift();
        s.deck.push(out); s.hand.push(s.deck.shift());
        say('swap', problem(p.id).name + ': 손패의 ' + card(out).name + ' 카드가 바뀌었어요.');
      }
    });

    // 4. 예고했던 문제가 빈칸에 들어온다 (새로 나온 문제는 이번 현장 턴에 치지 않는다). BIM 간섭검토로 취소했으면 안 들어온다
    const next = nextProblem(s), empty = s.probs.findIndex(p => !p);
    if (next && s.cancelNext) say('cancelled', 'BIM 간섭검토 덕분에 ' + ga(problem(next).name) + ' 안 들어왔어요.');
    else if (next && empty >= 0) {
      const d = problem(next);
      s.probs[empty] = { id: next, atk: Math.max(0, d.atk + diffOf(s).probAtk), hp: d.hp, guard: !!d.guard, drain: d.drain || 0 };
      if (s.rec.probs && !s.rec.probs.includes(next)) s.rec.probs.push(next);   // 7단계 전에 저장된 판은 칸이 없다
      say('newProblem', '새 문제: ' + d.name + '.', { zone: empty, id: next });
    }
    s.cancelNext = false;
    s.fi += 1;

    // 5. 다음 내 턴 시작: 코인 채우기(자재 반입 지연이면 덜), 양생, 카드 뽑기, 지체상금
    s.turn += 1;
    s.maxCoins = Math.min(r.maxCoins, s.maxCoins + 1);
    const coinDrain = s.probs.reduce((n, p) => n + ((p && problem(p.id).coinDrain) || 0), 0);
    s.coins = Math.max(0, s.maxCoins - coinDrain);
    if (coinDrain) say('coinDrain', '자재 반입 지연: 이번 턴 공사비 -' + coinDrain + '.', { n: coinDrain });
    s.orderUsed = false; s.shopUsed = false;
    s.my.forEach((w, k) => {
      if (!w) return;
      if (w.curing) {
        w.curing -= 1;
        if (!w.curing) {
          const cure = card(w.id).cure;
          w.atk += cure.atk; w.hp += cure.hp;
          say('cured', card(w.id).name + ' 양생 완료 +' + cure.atk + '/+' + cure.hp + '.', { zone: k, atk: cure.atk, hp: cure.hp });
        }
      }
      w.ready = !w.curing; w.fresh = false; w.second = false;
    });
    if (s.deck.length) {
      if (s.hand.length < r.handMax) s.hand.push(s.deck.shift());
      else { s.deck.shift(); say('burn', '손패가 꽉 차서 카드 1장이 버려졌어요.'); }
    } else if (r.emptyDeckDays) { s.days -= r.emptyDeckDays; say('empty', '자재 소진: 뽑을 카드가 없어서 공기 -' + r.emptyDeckDays + '일.', { n: r.emptyDeckDays }); }
    if (s.turn > r.baseTurns && diffOf(s).delayPenalty) { s.days -= r.delayPenalty; say('penalty', (r.baseTurns + 1) + '턴부터 지체상금: 공기 -' + r.delayPenalty + '일.', { n: r.delayPenalty }); }
    if (s.days <= 0) { s.days = 0; s.over = 'lose'; say('lose', '달력이 D-0이 됐어요. 공기 지연...'); }

    const msg = '현장 턴 → ' + (events.length ? events.map(e => e.text).join(' ') : '조용히 지나갔어요.') + (s.over ? '' : ' 이제 ' + s.turn + '턴!');
    return result(true, msg, events);
  }

  // ---------- 미리 보기 (화면 안내용). 상태 사본으로 해 보고 결과만 알려 준다 (s는 바꾸지 않음) ----------
  // 지금 턴을 끝내면 현장 턴에 일어날 일
  //   probs[칸]: 그 문제가 할 행동 목록 [{ to: 작업팀 칸 | 'calendar' | 'shield', n }]
  //   my[칸]: 그 작업팀이 받을 피해 { n, out } (안 맞으면 null), days: 깎일 공기, lose: 공기 지연으로 끝나는지
  function preview(s) {
    const t = JSON.parse(JSON.stringify(s)), res = endTurn(t);
    const p = { probs: s.probs.map(() => []), my: s.my.map(() => null), days: s.days - t.days, lose: t.over === 'lose' };
    res.events.forEach(e => {
      if (e.t === 'hitWorker') {
        p.probs[e.from].push({ to: e.zone, n: e.n });
        p.my[e.zone] = { n: (p.my[e.zone] ? p.my[e.zone].n : 0) + e.n, out: false };
      }
      if (e.t === 'out') p.my[e.zone].out = true;
      if ((e.t === 'calendar' || e.t === 'shield') && e.from != null) p.probs[e.from].push({ to: e.t, n: e.n || 0 });
    });
    return p;
  }
  // i번 작업팀이 target(문제 칸 번호)을 치면: { solved, left: 남는 체력, back: 되치기 피해, out: 퇴장 } (칠 수 없으면 null)
  function previewHit(s, i, target) {
    const t = JSON.parse(JSON.stringify(s)), res = hit(t, i, target);
    if (!res.ok) return null;
    const h = res.events.find(e => e.t === 'hit');
    return { solved: !t.probs[target], left: t.probs[target] ? t.probs[target].hp : 0, back: h.back, out: !t.my[i] };
  }

  JG.engine = {
    newGame, mulligan, playCard, hit, order, shop, shopOffers, endTurn, preview, previewHit,
    whyCantPlay, whyCantHit, whyCantOrder, whyCantShop,
    atkOf, probAtk, costOf, guardIndex, protection, floors, totalFloors, floorName, nextProblem, stars, siteOf, conditionOf,
    random, shuffle, eun, ga, eul, ro, ieyo
  };
})();

// 준공! 자동 대전 시뮬레이터
// 실행: node tools\simulate.js        (설정마다 현장별 100판씩)
//       node tools\simulate.js 500    (현장별 500판씩)
// 규칙 엔진이 오류 없이 끝까지 도는지, 난이도·덱별 준공률과 판 길이가 어떤지 본다.
const path = require('path');
['data/rules.js', 'data/cards.js', 'data/problems.js', 'data/sites.js', 'data/tbm.js', 'data/slang.js', 'js/engine.js']
  .forEach(f => require(path.join(__dirname, '..', f)));

const JG = globalThis.JG, E = JG.engine, R = JG.RULES;
const GAMES = Number(process.argv[2]) || 100;
const PLEDGES = Object.keys(JG.PLEDGES);
const SECONDS_PER_TURN = 25;   // PRD: 내 턴 평균 20초 + 현장 턴 5초
const TURN_LIMIT = 40;          // 이 턴을 넘기면 끝나지 않는 판으로 보고 오류 처리
// 4·5번 현장용 확장 덱 예시 (흙막이로 방호, 보온양생으로 한파 대응)
const EXP_DECK = ['rebar', 'rebar', 'form', 'form', 'pour', 'pc', 'pump', 'tower', 'earth', 'earth', 'warmcure', 'redesign'];
const deckFor = site => (site.no >= 4 ? EXP_DECK : JG.STARTER_DECK);

// 상태가 규칙을 벗어나지 않았는지 검사한다. 벗어나면 오류를 던진다.
function check(s) {
  const bad = [];
  if (s.coins < 0 || s.coins > s.maxCoins || s.maxCoins > R.maxCoins) bad.push('코인 ' + s.coins + '/' + s.maxCoins);
  if (s.hand.length > R.handMax) bad.push('손패 ' + s.hand.length + '장');
  if (s.my.length !== R.zones || s.probs.length !== R.zones) bad.push('필드 칸 수가 바뀜');
  if (s.my.some(w => w && w.hp <= 0)) bad.push('체력 0인 작업팀이 남음');
  if (s.probs.some(p => p && p.hp <= 0)) bad.push('체력 0인 문제가 남음');
  if (s.bricks < 0 || s.bricks > s.totalBricks) bad.push('벽돌 ' + s.bricks);
  if (s.days < 0) bad.push('공기 ' + s.days);
  if (s.over === 'win' && s.bricks < s.totalBricks) bad.push('벽돌이 덜 찼는데 준공');
  if (!s.over && s.days <= 0) bad.push('공기 0인데 판이 안 끝남');
  if (s.turn > TURN_LIMIT) bad.push(TURN_LIMIT + '턴이 넘도록 안 끝남');
  if (bad.length) throw new Error(bad.join(', '));
}

// 행동 하나를 실행하고 결과 모양과 상태를 검사한다. 실패한 행동은 상태를 바꾸면 안 된다.
function act(s, fn) {
  const before = JSON.stringify(s);
  const res = fn();
  if (typeof res.ok !== 'boolean' || typeof res.msg !== 'string' || !res.msg) throw new Error('결과 모양이 이상함');
  if (!res.ok && JSON.stringify(s) !== before) throw new Error('실패한 행동이 상태를 바꿈: ' + res.msg);
  check(s);
  return res;
}

// 똑똑한 봇이 카드를 어디에 쓸지: 작업팀은 빈 칸, 아군 공법은 체력 낮은 작업팀, 문제 공법은 방호·센 문제
function targetFor(s, id) {
  const c = JG.CARDS[id];
  if (c.kind === 'crew') return s.my.findIndex(w => !w);
  if (c.target === 'ally') { let k = -1; s.my.forEach((w, i) => { if (w && (k < 0 || w.hp < s.my[k].hp)) k = i; }); return k; }
  if (c.target === 'problem') { const g = E.guardIndex(s); if (g >= 0) return g; let k = -1; s.probs.forEach((p, i) => { if (p && (k < 0 || p.atk > s.probs[k].atk)) k = i; }); return k; }
  return null;
}
const worthIt = (s, id) => id !== 'rushwork' || s.my.filter((w, i) => !E.whyCantHit(s, i)).length >= 2;

// 똑똑한 봇: 낼 수 있는 비싼 카드부터 내고, 작업지시를 쓰고, 방호 → 누수 → 건물 순으로 친다
function greedyTurn(s) {
  for (let played = true; played && !s.over;) {
    played = false;
    const byCost = s.hand.map((id, h) => h).sort((a, b) => E.costOf(s, s.hand[b]) - E.costOf(s, s.hand[a]));
    for (const h of byCost) {
      const id = s.hand[h];
      if (E.whyCantPlay(s, h) || !worthIt(s, id)) continue;
      act(s, () => E.playCard(s, h, targetFor(s, id)));
      played = true;
      break;
    }
  }
  if (!E.whyCantOrder(s)) act(s, () => E.order(s, null));
  for (let i = 0; i < R.zones; i++) {
    if (s.over || E.whyCantHit(s, i)) continue;
    const gi = E.guardIndex(s), leak = s.probs.findIndex(p => p && p.drain);
    act(s, () => E.hit(s, i, gi >= 0 ? gi : leak >= 0 ? leak : 'building'));
  }
  if (!s.over) act(s, () => E.endTurn(s));
}

// 무작위 봇: 범위 밖 칸까지 마구 누른다. 엔진이 엉뚱한 입력에도 버티는지 본다
function randomTurn(s, rnd) {
  const pick = n => Math.floor(rnd() * n) - 1;   // -1 ~ n-2 (범위 밖 값도 섞임)
  for (let k = 0; k < 10 && !s.over; k++) {
    const r = rnd();
    if (r < 0.4) act(s, () => E.playCard(s, pick(7), rnd() < 0.2 ? null : pick(6)));
    else if (r < 0.8) { const t = rnd() < 0.5 ? 'building' : pick(6); act(s, () => E.hit(s, pick(6), t)); }
    else act(s, () => E.order(s, rnd() < 0.5 ? null : pick(6)));
  }
  if (!s.over) act(s, () => E.endTurn(s));
}

// 무작위 봇용 덱: 17종 중 12종을 판마다 다르게 (모든 카드를 골고루 써 보게)
const ALL = Object.keys(JG.CARDS);
const randomDeck = n => E.shuffle(ALL, n + 7).slice(0, 12);

function playGame(site, n, bot, cfg) {
  const deck = bot === 'random' ? randomDeck(n) : deckFor(site);
  const s = E.newGame({ siteId: site.id, pledge: PLEDGES[n % PLEDGES.length], seed: n + 1, deck, difficulty: cfg.difficulty });
  check(s);
  const rnd = E.random(n + 1000);
  while (!s.over) bot === 'greedy' ? greedyTurn(s) : randomTurn(s, rnd);
  return s;
}

const errors = [];
let total = 0;

function run(bot, title, cfg) {
  console.log('\n[' + title + ']');
  JG.SITES.forEach(site => {
    const st = { wins: 0, turns: 0, days: 0, done: 0, stars: [0, 0, 0, 0] };
    for (let n = 0; n < GAMES; n++) {
      total++;
      try {
        const s = playGame(site, n, bot, cfg);
        st.done++;
        st.turns += s.over === 'win' ? s.turn : s.turn - 1;   // 공기 지연은 다음 턴 시작에 판정되므로 1을 뺀다
        if (s.over === 'win') { st.wins++; st.days += s.days; }
        st.stars[E.stars(s)]++;
      } catch (e) {
        errors.push(site.name + ' / ' + title + ' / ' + (n + 1) + '번째 판: ' + e.message);
      }
    }
    const avg = st.done ? st.turns / st.done : 0, sec = Math.round(avg * SECONDS_PER_TURN);
    console.log(site.no + '. ' + site.name + (bot === 'greedy' && site.no >= 4 ? ' (확장 덱)' : '')
      + ' | 준공 ' + Math.round(st.wins / GAMES * 100) + '%'
      + ' | 평균 ' + avg.toFixed(1) + '턴 (예상 ' + Math.floor(sec / 60) + '분 ' + (sec % 60) + '초)'
      + ' | 남은 공기 ' + (st.wins ? (st.days / st.wins).toFixed(1) + '일' : '-')
      + ' | ★3 ' + st.stars[3] + ', ★2 ' + st.stars[2] + ', ★1 ' + st.stars[1]);
  });
}

console.log('준공! 자동 대전 시뮬레이션 (설정마다 현장별 ' + GAMES + '판, 아침 TBM 다짐 3종을 번갈아 고름)');
console.log('똑똑한 봇: 1~3번 현장은 기본 덱, 4~5번 현장은 확장 덱(' + EXP_DECK.map(id => JG.CARDS[id].name).join(', ') + ')');
['easy', 'normal', 'hard'].forEach(d => run('greedy', '똑똑한 봇 · 난이도 ' + JG.DIFFICULTY[d].name, { difficulty: d }));
run('random', '무작위 봇 · 보통 · 판마다 다른 덱 (오류 찾기용)', { difficulty: 'normal' });
console.log('\n총 ' + total + '판 · 오류 ' + errors.length + '건');
errors.slice(0, 10).forEach(e => console.log('  - ' + e));
process.exitCode = errors.length ? 1 : 0;

// 규칙 점검: 규칙 하나하나가 PRD대로 동작하는지 확인한다
// 실행: node tools\rulecheck.js
const path = require('path');
const root = path.join(__dirname, '..');
['data/rules.js', 'data/cards.js', 'data/problems.js', 'data/sites.js', 'data/tbm.js', 'data/slang.js', 'js/engine.js', 'js/daily.js'].forEach(f => require(path.join(root, f)));
const JG = globalThis.JG, E = JG.engine;
let pass = 0, failN = 0;
const t = (name, cond) => { if (cond) pass++; else { failN++; console.log('실패: ' + name); } };
const fresh = (site, extra) => Object.assign(E.newGame({ siteId: site || 'apart', seed: 7 }), extra || {});

// 시작 상태
let s = E.newGame({ siteId: 'apart', seed: 3 });
t('시작 손패 3장', s.hand.length === 3);
t('덱 9장', s.deck.length === 9);
t('공기 15, 코인 1, 벽돌 0/20', s.days === 15 && s.coins === 1 && s.totalBricks === 20);
t('시작 손패에 1코인 카드', s.hand.some(id => JG.CARDS[id].cost <= 1));
t('자재 반입 확인: 손패 4장', E.newGame({ siteId: 'apart', pledge: 'delivery', seed: 3 }).hand.length === 4);
for (let seed = 1; seed < 300; seed++) { const g = E.newGame({ siteId: 'apart', seed }); if (!g.hand.some(id => JG.CARDS[id].cost <= 1)) { t('시드 ' + seed + ' 1코인 카드 보장', false); break; } }
for (let seed = 1; seed < 300; seed++) { const g = E.newGame({ siteId: 'house', seed }); if (!g.hand.includes('rebar') || g.hand.length + g.deck.length !== 12) { t('1번 현장 시드 ' + seed + ' 시작 손패에 철근공', false); break; } }

// 현장 턴 단계 기록 (화면 연출용)
s = fresh('apart');
s.probs[0] = { id: 'leak', atk: 1, hp: 2, guard: false, drain: 1 };
let snapRes = E.endTurn(s, { snapshots: true });
t('단계마다 상태 사본이 붙음', snapRes.events.length > 0 && snapRes.events.every(e => e.state && typeof e.state.days === 'number'));
t('첫 사건(누수) 직후 공기 14', snapRes.events[0].state.days === 14);
t('사본 없이 부르면 state 없음', E.endTurn(fresh('apart')).events.every(e => !e.state));

// 선행공정
s = fresh('apart', { coins: 5, maxCoins: 5, hand: ['rebar', 'form', 'form'] });
E.playCard(s, 1, 0);
t('철근공 없이 형틀목수 2/2', s.my[0].atk === 2 && s.my[0].hp === 2);
E.playCard(s, 0, 1); E.playCard(s, 0, 2);
t('철근공 있으면 형틀목수 3/3', s.my[2].atk === 3 && s.my[2].hp === 3 && s.my[2].pre);

// 집중호우와 양생
s = fresh('apart', { coins: 5, maxCoins: 5, hand: ['pour'] });
E.playCard(s, 0, 0);
t('타설팀 바로 못 침', !!E.whyCantHit(s, 0));
t('비 오는 현장 타설팀 공격 1', E.atkOf(s, s.my[0]) === 1);
E.endTurn(s);
t('양생 후 3/5, 비 때문에 공격 2', s.my[0].atk === 3 && s.my[0].hp === 5 && E.atkOf(s, s.my[0]) === 2);
s = fresh('house', { coins: 5, maxCoins: 5, hand: ['pour'] });
E.playCard(s, 0, 0);
t('맑은 현장 타설팀 공격 2', E.atkOf(s, s.my[0]) === 2);

// 긴급투입, 장비 일일점검
s = E.newGame({ siteId: 'apart', pledge: 'inspect', seed: 1 });
Object.assign(s, { coins: 5, maxCoins: 5, hand: ['pump', 'pump'] });
t('처음 장비 카드 코인 2', E.costOf(s, 'pump') === 2);
E.playCard(s, 0, 0);
t('코인 3 남음', s.coins === 3);
t('두 번째 장비 카드 코인 3', E.costOf(s, 'pump') === 3);
t('펌프카 바로 망치질 가능', !E.whyCantHit(s, 0));
let r = E.hit(s, 0, 'building');
t('벽돌 3칸', r.ok && s.bricks === 3);
t('한 턴에 두 번 못 침', !!E.whyCantHit(s, 0));

// 방호 (소음 구름)
s = fresh('apart', { coins: 5, maxCoins: 5, hand: ['pump'] });
s.probs[1] = { id: 'noise', atk: 0, hp: 3, guard: true, drain: 0 };
s.probs[0] = { id: 'crack', atk: 1, hp: 2, guard: false, drain: 0 };
E.playCard(s, 0, 0);
t('방호 있으면 건물 못 침', !E.hit(s, 0, 'building').ok);
t('방호 있으면 다른 문제 못 침', !E.hit(s, 0, 0).ok);
r = E.hit(s, 0, 1);
t('방호를 치면 해결', r.ok && s.probs[1] === null);

// 문제 카드의 되치기와 안전관리자
s = fresh('apart');
s.my[0] = { id: 'pump', atk: 3, hp: 2, ready: true, fresh: false, curing: false, guard: false, buff: 0, pre: false };
s.probs[0] = { id: 'crack', atk: 1, hp: 2, guard: false, drain: 0 };
E.hit(s, 0, 0);
t('균열이에게 되치기 1', s.my[0].hp === 1 && s.probs[0] === null);
s = fresh('apart');
s.my[0] = { id: 'pump', atk: 3, hp: 2, ready: true, fresh: false, curing: false, guard: false, buff: 0, pre: false };
s.my[1] = { id: 'safety', atk: 1, hp: 3, ready: true, fresh: false, curing: false, guard: false, buff: 0, pre: false };
s.probs[0] = { id: 'crack', atk: 1, hp: 2, guard: false, drain: 0 };
E.hit(s, 0, 0);
t('안전관리자 옆이면 되치기 0', s.my[0].hp === 2);

// 현장 턴: 대상 순서와 안전 구호
s = E.newGame({ siteId: 'apart', pledge: 'chant', seed: 1 });
s.probs[0] = { id: 'crack', atk: 1, hp: 2, guard: false, drain: 0 };
s.probs[1] = { id: 'leak', atk: 1, hp: 2, guard: false, drain: 1 };
E.endTurn(s);
// 누수 -1 (안전 구호가 막음), 균열이 -1, 누수 -1 → 15 - 2 = 13
t('안전 구호가 첫 피해 막고 공기 13', s.days === 13 && s.shield === 0);
s = fresh('apart');
s.my[0] = { id: 'rebar', atk: 1, hp: 3, ready: true, fresh: false, curing: false, guard: false, buff: 0, pre: false };
s.my[1] = { id: 'rebar', atk: 1, hp: 1, ready: true, fresh: false, curing: false, guard: false, buff: 0, pre: false };
s.my[2] = { id: 'shore', atk: 0, hp: 4, ready: true, fresh: false, curing: false, guard: true, buff: 0, pre: false };
s.probs[0] = { id: 'crack', atk: 1, hp: 5, guard: false, drain: 0 };
E.endTurn(s);
t('방호 작업팀(동바리)을 먼저 침', s.my[2].hp === 3 && s.my[1] && s.my[1].hp === 1);
s.my[2] = null;
E.endTurn(s);
t('방호가 없으면 한 방에 퇴장시킬 작업팀을 침', s.my[1] === null && s.my[0].hp === 3);

// 새 문제는 그 턴에 치지 않음, 예고 순서
s = fresh('apart');
E.endTurn(s);
t('1턴 끝에 예고된 균열이가 들어옴', s.probs[0] && s.probs[0].id === 'crack' && s.days === 15);
t('다음 예고는 소음 구름', E.nextProblem(s) === 'noise');
s = fresh('house'); E.endTurn(s);
t('1번 현장은 2턴에 문제 없음', s.probs.every(p => !p));
E.endTurn(s);
t('1번 현장은 3턴에 첫 문제', s.probs[0] && s.probs[0].id === 'crack');

// 코인, 손패, 지체상금
s = fresh('apart');
for (let k = 0; k < 6; k++) E.endTurn(s);
t('7턴 코인 5 (최대)', s.turn === 7 && s.maxCoins === 5 && s.coins === 5);
s = fresh('apart', { hand: ['rebar', 'rebar', 'rebar', 'rebar', 'rebar'] });
const deckBefore = s.deck.length; r = E.endTurn(s);
t('손패 5장이면 뽑은 카드 버림', s.hand.length === 5 && s.deck.length === deckBefore - 1 && r.events.some(e => e.t === 'burn'));
s = fresh('apart', { turn: 8 });
E.endTurn(s);
t('9턴 시작에 지체상금 -2', s.turn === 9 && s.days === 13);

// 작업지시
s = fresh('apart', { coins: 3, maxCoins: 3 });
s.my[1] = { id: 'rebar', atk: 1, hp: 2, ready: true, fresh: false, curing: false, guard: false, buff: 0, pre: false };
r = E.order(s, null);
t('작업지시 코인 2, 공격 +1', r.ok && s.coins === 1 && E.atkOf(s, s.my[1]) === 2);
t('작업지시 한 턴 한 번', !E.order(s, null).ok);
E.endTurn(s);
t('작업지시는 다음 턴에 사라짐', E.atkOf(s, s.my[1]) === 1);

// 드론 측량
s = fresh('apart', { coins: 1, hand: ['drone'] });
r = E.playCard(s, 0, null);
t('드론 측량으로 2장 뽑기', r.ok && s.hand.length === 2);

// 준공과 별
s = fresh('house', { bricks: 10 });
s.my[0] = { id: 'pump', atk: 3, hp: 2, ready: true, fresh: false, curing: false, guard: false, buff: 0, pre: false };
r = E.hit(s, 0, 'building');
t('12칸 채우면 준공, 벽돌 12에서 멈춤', s.over === 'win' && s.bricks === 12);
t('남은 공기 15 → ★3', E.stars(s) === 3);
s.days = 9; t('9일 → ★2', E.stars(s) === 2);
s.days = 4; t('4일 → ★1', E.stars(s) === 1);

// 결과 화면용 기록 (공정표, 기념사진)
s = fresh('house', { coins: 5, maxCoins: 5, hand: ['rebar', 'pour', 'drone'] });
E.playCard(s, 0, 0); E.playCard(s, 0, 1); E.playCard(s, 0, null);
t('1턴 기록: 철근만 (타설은 양생 중이라 빠짐)', s.rec.work[0].join() === 'rebar');
t('낸 카드 기록', s.rec.cards.join() === 'rebar,pour,drone');
E.endTurn(s); E.endTurn(s);
t('2턴 기록: 양생 끝난 타설 포함', s.rec.work[1].includes('concrete') && s.rec.work[1].includes('rebar'));
s = fresh('house', { bricks: 2, turn: 4 });
s.my[0] = { id: 'pump', atk: 3, hp: 2, ready: true, fresh: false, curing: false, guard: false, buff: 0, pre: false };
E.hit(s, 0, 'building');
t('1층 완성 턴 기록', s.rec.floors[0] === 4 && s.rec.floors.length === 1);

// ---- 6단계: 확장 카드·문제·현장 조건·난이도 ----
const W = (id, extra) => Object.assign({ id, atk: JG.CARDS[id].atk, hp: JG.CARDS[id].hp, ready: true, fresh: false, curing: 0, guard: !!JG.CARDS[id].guard, buff: 0, pre: false }, extra);
const P = (id, extra) => Object.assign({ id, atk: JG.PROBLEMS[id].atk, hp: JG.PROBLEMS[id].hp, guard: !!JG.PROBLEMS[id].guard, drain: JG.PROBLEMS[id].drain || 0 }, extra);
const same = (s, fn) => { const b = JSON.stringify(s); const r = fn(); return !r.ok && JSON.stringify(s) === b; };

// 신호수: 장비 공격 +1 (두 장이어도 +1)
s = fresh('house'); s.my[0] = W('pump'); s.my[1] = W('signal');
t('신호수 있으면 펌프카 공격 4', E.atkOf(s, s.my[0]) === 4);
s.my[2] = W('signal');
t('신호수 두 장이어도 공격 4', E.atkOf(s, s.my[0]) === 4);
t('신호수는 장비가 아닌 작업팀엔 효과 없음', E.atkOf(s, W('rebar')) === 1);
// PC 부재팀: 비 와도 공격 그대로
s = fresh('apart');
t('비 오는 현장 PC 부재팀 공격 4', E.atkOf(s, W('pc')) === 4 && E.atkOf(s, W('pour')) === 1);
// 갱폼팀: 철근공 있으면 카드 1장
s = fresh('house', { coins: 5, maxCoins: 5, hand: ['gangform'] }); s.my[0] = W('rebar');
const deckN = s.deck.length;
E.playCard(s, 0, 1);
t('갱폼팀 선행공정: 카드 1장 뽑기, 능력치 그대로', s.hand.length === 1 && s.deck.length === deckN - 1 && s.my[1].atk === 3 && s.my[1].pre);
// 습윤양생: 고른 작업팀 체력 +3, 대상 없거나 잘못 고르면 그대로
s = fresh('house', { coins: 5, maxCoins: 5, hand: ['wetcure'] });
t('작업팀 없으면 습윤양생 못 씀', !!E.whyCantPlay(s, 0));
s.my[2] = W('rebar');
t('빈 칸을 고르면 실패하고 상태 그대로', same(s, () => E.playCard(s, 0, 1)));
t('습윤양생: 체력 2 → 5', E.playCard(s, 0, 2).ok && s.my[2].hp === 5 && s.coins === 4);
// 한파: 양생 2턴, 보온양생으로 풀림
s = fresh('winter', { coins: 5, maxCoins: 5, hand: ['pour', 'warmcure'] });
E.playCard(s, 0, 0);
t('한파: 타설팀 양생 2턴', s.my[0].curing === 2);
E.endTurn(s);
t('한파: 1턴 지나도 아직 양생 중', s.my[0].curing === 1 && !s.my[0].ready && s.my[0].atk === 2);
E.endTurn(s);
t('한파: 2턴 지나서 양생 완료', !s.my[0].curing && s.my[0].ready && s.my[0].atk === 3);
s = fresh('winter', { coins: 5, maxCoins: 5, hand: ['pour', 'warmcure'] });
E.playCard(s, 0, 0); E.playCard(s, 0, null);
t('보온양생: 한파 풀림, 양생 1턴으로, 콘크리트 +1/+1', s.condOff && s.my[0].curing === 1 && s.my[0].atk === 3 && s.my[0].hp === 4);
// BIM 간섭검토: 예고 문제가 안 들어옴
s = fresh('apart', { coins: 5, maxCoins: 5, hand: ['bim'] });
const fi0 = s.fi;
t('BIM 간섭검토 사용', E.playCard(s, 0, null).ok && s.cancelNext);
t('취소한 뒤엔 또 못 씀 (예고 없음)', (s.hand = ['bim'], !!E.whyCantPlay(s, 0)));
r = E.endTurn(s);
t('BIM: 다음 문제 안 들어옴, 예고는 한 칸 넘어감', s.probs.every(p => !p) && s.fi === fi0 + 1 && !s.cancelNext && r.events.some(e => e.t === 'cancelled'));
// 돌관작업: 모두 공격 +2, 공기 -2, 공기가 모자라면 못 씀
s = fresh('house', { coins: 5, maxCoins: 5, hand: ['rushwork'] }); s.my[0] = W('rebar'); s.my[1] = W('form');
E.playCard(s, 0, null);
t('돌관작업: 공격 +2, 공기 13', E.atkOf(s, s.my[0]) === 3 && E.atkOf(s, s.my[1]) === 4 && s.days === 13);
E.endTurn(s);
t('돌관작업 효과는 턴이 끝나면 사라짐', E.atkOf(s, s.my[0]) === 1);
s = fresh('house', { coins: 5, maxCoins: 5, hand: ['rushwork'], days: 2 });
t('공기 2일이면 돌관작업 못 씀', !!E.whyCantPlay(s, 0));
// 설계변경 대응: 고른 문제 제거
s = fresh('house', { coins: 5, maxCoins: 5, hand: ['redesign'] }); s.probs[1] = P('slide');
t('빈 문제 칸을 고르면 실패', same(s, () => E.playCard(s, 0, 0)));
t('설계변경 대응: 토사 유출 제거', E.playCard(s, 0, 1).ok && !s.probs[1]);
// 연약지반: 방호 작업팀이 없으면 공기 -1
s = fresh('deep');
E.endTurn(s);
t('연약지반: 방호 없으면 공기 -1', s.days === 14);
s = fresh('deep'); s.my[0] = W('earth');
E.endTurn(s);
t('연약지반: 흙막이(방호) 있으면 그대로', s.days === 15);
// 개구부: 작업팀만 친다
s = fresh('house'); s.probs[0] = P('opening');
E.endTurn(s);
t('개구부: 작업팀 없으면 달력 안 침', s.days === 15);
s = fresh('house'); s.probs[0] = P('opening'); s.my[2] = W('earth', { guard: false });
E.endTurn(s);
t('개구부: 버티는 작업팀도 친다', s.my[2].hp === 2 && s.days === 15);
// 설계변경(문제): 손패 맨 왼쪽 카드를 바꾼다
s = fresh('house', { hand: ['drone', 'rebar'] }); s.probs[0] = P('change', { atk: 0 });
const top = s.deck[0];
E.endTurn(s);
t('설계변경: 드론 측량이 덱 맨 아래로, 새 카드가 들어옴', s.hand[0] === 'rebar' && s.hand[1] === top && s.deck[s.deck.length - 1] === 'drone');
// 자재 반입 지연: 공사비 -1
s = fresh('house'); s.probs[0] = P('delay', { atk: 0 });
E.endTurn(s);
t('자재 반입 지연: 2턴 공사비 1/2', s.coins === 1 && s.maxCoins === 2);
// 난이도
s = E.newGame({ siteId: 'apart', seed: 1, difficulty: 'easy' }); E.endTurn(s);
t('편하게: 균열이 공격 0', s.probs[0].atk === 0);
s = E.newGame({ siteId: 'apart', seed: 1, difficulty: 'hard' }); E.endTurn(s);
t('도전: 균열이 공격 2', s.probs[0].atk === 2);
s = Object.assign(E.newGame({ siteId: 'apart', seed: 1, difficulty: 'easy' }), { turn: 8 }); E.endTurn(s);
t('편하게: 지체상금 없음', s.turn === 9 && s.days === 15);
// 지하층 이름
s = fresh('deep');
t('지하층 이름: 1층째 지하 2층, 3층째 지상 1층', E.floorName(s, 1) === '지하 2층' && E.floorName(s, 2) === '지하 1층' && E.floorName(s, 3) === '지상 1층');
s = fresh('deep', { bricks: 22 }); s.my[0] = W('pump');
E.hit(s, 0, 'building');
t('5번 현장 준공 문구', s.over === 'win' && E.floorName(s, 6) === '지상 4층');

// ---- 7단계: 데일리 현장 ----
const D = JG.daily;
const d1 = D.siteFor(new Date(2026, 10, 11)), d2 = D.siteFor(new Date(2026, 10, 11, 23, 59));
t('같은 날짜면 같은 데일리 현장 (시각이 달라도)', JSON.stringify(d1) === JSON.stringify(d2));
t('날짜 키', d1.dateKey === '2026-11-11' && d1.id === 'daily-2026-11-11');
t('가을(11월)은 맑음', d1.condition === null);
t('여름(7월)은 집중호우', D.siteFor(new Date(2026, 6, 15)).condition === 'rain');
t('겨울(1월·12월)은 한파', D.siteFor(new Date(2026, 0, 10)).condition === 'cold' && D.siteFor(new Date(2026, 11, 3)).condition === 'cold');
const spring = Array.from({ length: 60 }, (_, k) => D.siteFor(new Date(2026, 2, 1 + k)).condition);
t('봄은 연약지반이거나 맑음 (둘 다 나옴)', spring.every(c => c === 'soft' || c === null) && spring.includes('soft') && spring.includes(null));
const month = Array.from({ length: 30 }, (_, k) => D.siteFor(new Date(2026, 8, 1 + k)));
t('문제 순서 8칸, 첫 문제는 균열이, 모두 있는 문제', month.every(x => x.forecast.length === 8 && x.forecast[0] === 'crack' && x.forecast.every(id => JG.PROBLEMS[id])));
t('날마다 다른 현장 (30일 중 25일 이상 서로 다름)', new Set(month.map(x => JSON.stringify([x.name, x.bricks, x.forecast]))).size >= 25);
s = E.newGame({ site: d1, seed: d1.seed });
t('데일리 현장으로 판 시작', E.siteOf(s) === d1 && s.totalBricks === d1.bricks && s.siteId === d1.id);
const s2 = JSON.parse(JSON.stringify(s));
E.endTurn(s2);
t('저장했다 불러온 데일리 판도 진행됨 (예고대로 균열이)', s2.turn === 2 && s2.probs[0] && s2.probs[0].id === 'crack');
t('같은 날 같은 덱이면 손패도 같음', JSON.stringify(E.newGame({ site: d1, seed: d1.seed }).hand) === JSON.stringify(s.hand));

// 조사
t('조사: 철근공은 / 펌프카는', E.eun('철근공') === '철근공은' && E.eun('펌프카') === '펌프카는');
t('조사: 복합 상가예요 / 도서관이에요', E.ieyo('복합 상가') === '복합 상가예요' && E.ieyo('도서관') === '도서관이에요');
t('조사: 아파트를 / 타워크레인을', E.eul('장마철 아파트') === '장마철 아파트를' && E.eul('타워크레인') === '타워크레인을');
t('조사: 주임으로 / 대리로 / 현장소장으로 / 서울로', E.ro('주임') === '주임으로' && E.ro('대리') === '대리로' && E.ro('현장소장') === '현장소장으로' && E.ro('서울') === '서울로');

console.log('규칙 점검 ' + (pass + failN) + '개 중 통과 ' + pass + '개, 실패 ' + failN + '개');
process.exitCode = failN ? 1 : 0;

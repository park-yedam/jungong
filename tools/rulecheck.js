// 규칙 점검: 규칙 하나하나가 PRD대로 동작하는지 확인한다
// 실행: node tools\rulecheck.js
const path = require('path');
const root = path.join(__dirname, '..');
['data/rules.js', 'data/cards.js', 'data/problems.js', 'data/sites.js', 'data/tbm.js', 'data/slang.js', 'js/engine.js'].forEach(f => require(path.join(root, f)));
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
for (let seed = 1; seed < 300; seed++) { const g = E.newGame({ siteId: 'house', seed }); if (!g.hand.some(id => JG.CARDS[id].cost <= 1)) { t('시드 ' + seed + ' 1코인 카드 보장', false); break; } }

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

// 조사
t('조사: 철근공은 / 펌프카는', E.eun('철근공') === '철근공은' && E.eun('펌프카') === '펌프카는');

console.log('규칙 점검 ' + (pass + failN) + '개 중 통과 ' + pass + '개, 실패 ' + failN + '개');
process.exitCode = failN ? 1 : 0;

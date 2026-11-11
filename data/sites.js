// 현장 조건과 현장 데이터
// forecast: 현장 턴마다 나오는 문제 순서 (null은 그 턴에 문제 없음). 끝까지 가면 처음부터 다시 돈다.
//           1턴이 끝날 때 첫 번째 항목이 들어온다.
var JG = globalThis.JG = globalThis.JG || {};

JG.CONDITIONS = {
  rain: { name: '집중호우', weather: '비', text: '타설팀 공격 -1', tradeAtk: { concrete: -1 } }
};

JG.SITES = [
  {
    id: 'house', no: 1, name: '단독주택 신축', bricks: 12, condition: null,
    learn: '카드 내기, 망치질',
    // 첫 문제는 3턴에 나온다 (첫 판 안내 순서와 맞춤)
    forecast: [null, 'crack', null, 'crack', 'crack', null, 'crack', 'crack']
  },
  {
    id: 'retail', no: 2, name: '근린생활시설', bricks: 16, condition: null,
    learn: '방호',
    forecast: ['crack', null, 'noise', 'crack', 'crack', 'noise', 'crack', 'crack']
  },
  {
    id: 'apart', no: 3, name: '장마철 아파트', bricks: 20, condition: 'rain',
    learn: '선행공정, 양생',
    forecast: ['crack', 'noise', 'leak', 'crack', 'leak', 'noise', 'crack', 'leak']
  }
];

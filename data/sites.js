// 현장 조건과 현장 데이터
// forecast: 현장 턴마다 나오는 문제 순서 (null은 그 턴에 문제 없음). 끝까지 가면 처음부터 다시 돈다.
//           1턴이 끝날 때 첫 번째 항목이 들어온다.
// starterCard: 시작 손패에 꼭 넣을 카드 (첫 판 안내용)
// guide: 그 턴이 시작될 때 현장 안내 패널에 띄울 첫 판 안내 문구 { 턴 번호: 문구 }
// reward: 이 현장을 처음 준공하면 받는 확장 카드
var JG = globalThis.JG = globalThis.JG || {};

JG.CONDITIONS = {
  rain: { name: '집중호우', weather: '비', text: '타설팀 공격 -1', tradeAtk: { concrete: -1 } }
};

JG.SITES = [
  {
    id: 'house', no: 1, name: '단독주택 신축', bricks: 12, condition: null,
    learn: '카드 내기, 망치질',
    // 첫 문제는 3턴에 나온다 (첫 판 안내 순서와 맞춤)
    forecast: [null, 'crack', null, 'crack', 'crack', null, 'crack', 'crack'],
    starterCard: 'rebar',
    guide: {
      1: '코인 1개로 철근공을 내 보세요. 철근공 카드를 누르고, 점선으로 된 빈 작업 구역을 누르면 돼요.',
      2: '작업팀이 초록으로 깜빡이면 일할 수 있어요. 작업팀을 누른 뒤 건물을 누르면 벽돌이 쌓여요.',
      3: '첫 문제 카드가 나왔어요. 문제도 작업팀으로 치울 수 있어요. 작업팀을 누르고 문제 카드를 눌러 보세요.',
      4: '카드를 길게 누르면(마우스는 오른쪽 클릭) 용어 풀이가 나오고, 본 풀이는 도감에 쌓여요.'
    },
    reward: 'signal'
  },
  {
    id: 'retail', no: 2, name: '근린생활시설', bricks: 16, condition: null,
    learn: '방호',
    forecast: ['crack', null, 'noise', 'crack', 'crack', 'noise', 'crack', 'crack'],
    reward: 'wetcure'
  },
  {
    id: 'apart', no: 3, name: '장마철 아파트', bricks: 20, condition: 'rain',
    learn: '선행공정, 양생',
    forecast: ['crack', 'noise', 'leak', 'crack', 'leak', 'noise', 'crack', 'leak'],
    reward: 'tower'
  }
];

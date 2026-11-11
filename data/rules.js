// 기본 규칙 수치. 숫자만 고치면 게임 전체에 반영된다.
var JG = globalThis.JG = globalThis.JG || {};

JG.RULES = {
  days: 15,              // 내 공기(체력). 탁상 달력 D-15
  startCoins: 1,         // 1턴 공사비
  maxCoins: 5,           // 공사비 최대치 (매 턴 +1)
  startHand: 3,          // 시작 손패
  handMax: 5,            // 손패 최대. 넘치면 뽑은 카드를 버린다
  zones: 4,              // 내 작업 구역 칸 수 = 현장 문제 칸 수
  baseTurns: 8,          // 기준 턴. 이 턴이 지나면 매 턴 시작에 지체상금
  delayPenalty: 2,       // 지체상금으로 깎이는 공기
  orderCost: 2,          // 작업지시 코인
  orderAtk: 1,           // 작업지시로 오르는 공격력 (이번 턴만)
  bricksPerFloor: 4,     // 벽돌 4칸 = 1층
  deckSize: 12,          // 덱 장수
  emptyDeckDays: 1,      // 자재 소진: 턴을 시작할 때 뽑을 카드가 없으면 깎이는 공기
  maxCopies: 2,          // 덱에 같은 카드 최대 장수
  stars: [10, 5]         // 준공 때 남은 공기가 10일 이상 ★3, 5일 이상 ★2, 그 아래 ★1
};

// 난이도: probAtk(문제 카드 공격 증감), delayPenalty(9턴부터 지체상금), timer(턴 시간 초. null이면 현장 기본값, 0이면 제한 없음)
JG.DIFFICULTY = {
  easy: { name: '편하게', probAtk: -1, delayPenalty: false, timer: 0, desc: '턴 시간 제한과 지체상금 없음, 문제 공격 -1' },
  normal: { name: '보통', probAtk: 0, delayPenalty: true, timer: null, desc: '기본 규칙 (현장 4~5는 턴 30초)' },
  hard: { name: '도전', probAtk: 1, delayPenalty: true, timer: 20, desc: '모든 현장 턴 20초, 문제 공격 +1' }
};

// 직급 칭호: 모은 별(준공할 때마다 받은 별의 누적)이 이 개수 이상이면 오른다
JG.RANKS = [
  { name: '신입 기사', stars: 0 },
  { name: '주임', stars: 5 },
  { name: '대리', stars: 12 },
  { name: '과장', stars: 20 },
  { name: '현장소장', stars: 30 }
];

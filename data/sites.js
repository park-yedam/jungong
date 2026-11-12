// 현장 조건과 현장 데이터
// forecast: 현장 턴마다 나오는 문제 순서 (null은 그 턴에 문제 없음). 끝까지 가면 처음부터 다시 돈다.
//           1턴이 끝날 때 첫 번째 항목이 들어온다.
// starterCard: 시작 손패에 꼭 넣을 카드 (첫 판 안내용)
// guide: 그 턴이 시작될 때 현장 안내 패널에 띄울 첫 판 안내 문구 { 턴 번호: 문구 }
// reward: 이 현장을 처음 준공하면 받는 확장 카드들
// turnSeconds: 보통 난이도의 턴 시간 제한(초). 없으면 제한 없음
// look: 우리 회사 단지에 서는 건물 모양 (house 집, retail 가게, apart 아파트, warehouse 창고, office 오피스)
// basement: 지하층 수 (벽돌 4칸 = 1층, 아래층부터 지하로 센다)
var JG = globalThis.JG = globalThis.JG || {};

// 현장 조건: tradeAtk(공종별 공격 증감), cureDelay(양생이 n턴 늦게 끝남), needGuard(방호 작업팀이 없으면 현장 턴마다 공기 -n)
// lore: 수업용 해설 모드에 나오는 설명 (loreSource에 근거를 적는다)
JG.CONDITIONS = {
  rain: { name: '집중호우', weather: '비', text: '타설팀 공격 -1', tradeAtk: { concrete: -1 },
    lore: '굳지 않은 콘크리트에 빗물이 섞이면 강도가 떨어질 수 있어, 큰비에는 타설을 미루거나 덮어서 보호한다', loreSource: '' },
  cold: { name: '한파', weather: '눈', text: '양생이 1턴 늦게 끝남', cureDelay: 1,
    lore: '기온이 낮으면 콘크리트가 늦게 굳고 얼 수도 있어, 덮고 데우는 보온양생을 한다', loreSource: '' },
  soft: { name: '연약지반', weather: '땅', text: '방호 없으면 턴마다 공기 -1', needGuard: 1,
    lore: '무른 땅을 팔 때는 흙막이로 굴착면을 버티고, 필요하면 지반을 보강한다', loreSource: '' }
};

JG.SITES = [
  {
    id: 'house', look: 'house', no: 1, name: '단독주택 신축', bricks: 12, condition: null,
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
    reward: ['signal', 'bim']
  },
  {
    id: 'retail', look: 'retail', no: 2, name: '근린생활시설', bricks: 16, condition: null,
    learn: '방호',
    forecast: ['crack', null, 'noise', 'crack', 'crack', 'noise', 'crack', 'crack'],
    reward: ['wetcure', 'redesign']
  },
  {
    id: 'apart', look: 'apart', no: 3, name: '장마철 아파트', bricks: 20, condition: 'rain',
    learn: '선행공정, 양생',
    forecast: ['crack', 'noise', 'leak', 'crack', 'leak', 'noise', 'crack', 'leak'],
    reward: ['tower', 'warmcure']
  },
  {
    id: 'winter', look: 'warehouse', no: 4, name: '겨울 물류센터', bricks: 20, condition: 'cold',
    learn: '보온양생',
    forecast: ['crack', 'opening', 'leak', 'change', 'noise', 'opening', 'crack', 'change'],
    turnSeconds: 30,
    reward: ['earth', 'gangform']
  },
  {
    id: 'deep', look: 'office', no: 5, name: '도심 지하 굴착', bricks: 24, condition: 'soft', basement: 2,
    learn: '흙막이, 덱 조합',
    forecast: ['crack', null, 'delay', 'slide', 'crack', 'opening', 'leak', 'change'],
    turnSeconds: 30,
    reward: ['pc', 'rushwork']
  }
];

// 데일리 현장 건물 12종: 데일리 현장 이름이 되고, 처음 준공하면 우리 회사 단지 2구역에 한 채씩 들어선다 (id = 단지 그림 모양)
JG.BUILDINGS = [
  { id: 'school', name: '학교' }, { id: 'hospital', name: '병원' }, { id: 'library', name: '도서관' },
  { id: 'daycare', name: '어린이집' }, { id: 'gym', name: '체육관' }, { id: 'center', name: '주민센터' },
  { id: 'officetel', name: '오피스텔' }, { id: 'lab', name: '연구동' }, { id: 'mall', name: '복합 상가' },
  { id: 'factory', name: '공장' }, { id: 'fire', name: '소방서' }, { id: 'dorm', name: '기숙사' }
];

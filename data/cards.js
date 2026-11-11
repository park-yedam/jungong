// 카드 데이터. 숫자와 문구는 여기서만 고치면 된다.
// kind  : crew(현장에 남는 작업팀) / spell(쓰고 사라지는 공법)
// trade : rebar(철근) formwork(형틀) concrete(콘크리트) equipment(장비) safety(안전) steel(철골) finish(조적·방수) general(공통) method(공법)
// band  : 카드 위 이름 띠 색 (흰 글자가 잘 보이게 공종 색보다 조금 진함)
// text  : 카드에 보이는 효과 한 줄. 카드 폭에서 2줄을 넘으면 공격·체력 배지와 겹친다
// term  : 카드를 길게 누르면 나오는 용어 풀이 (카드 이름이 무엇인지)
// lore  : 카드 하단 설명 = 건축공학 개론 수준의 사실 한 문장. loreSource에 교재·시방서 근거를 적는다
// 키워드: guard(방호) rush(긴급투입) cure(양생: 다음 턴 시작에 오르는 수치) prerequisite(선행공정: 앞 공정 카드 id)
//   helmet(안전모: 첫 피해 1번 무효) onOut(퇴장 효과: { draw: 뽑을 장수 }) twice(연속 망치질: 한 턴 2번, preTwice는 선행공정이 있을 때만)
//   onPlay(등장 효과: { trades: [공종], atk, hp } 낼 때 그 공종 다른 작업팀이 얻음)
// 카드별 효과: brickBonus(건물을 칠 때 벽돌 +n) vsLeak(누수 문제를 칠 때 공격 +n) calmProblems(문제 카드 모두 공격 -n, 겹치지 않음)
//   leadNeighbors(양옆 작업팀 공격 +n, 겹치지 않음) comboWild(공정 순서의 다음 단계로 셈)
//   공법: comboStep(공정 순서 1단계 진행) cureNow(양생 중인 작업팀 바로 양생 완료) coinsPerFloor(완성한 층마다 이번 턴 코인 +n, 최대치까지) shieldUp(공기 피해 n번 막기)
// 숙련 승급: 필드의 같은 작업팀 위에 같은 카드를 겹쳐 내면 카드 공격·체력만큼 더해져 금색 숙련 작업팀이 된다 (한 팀에 한 번)
var JG = globalThis.JG = globalThis.JG || {};

JG.CARDS = {
  rebar: {
    name: '철근공', kind: 'crew', trade: 'rebar', cost: 1, atk: 1, hp: 2,
    band: '#E07A3F',
    line: '결속 들어갑니다!',
    text: '철근은 인장력 담당',
    term: '도면대로 철근을 자르고 구부려 배치(배근)하고, 결속선으로 묶는 기능공',
    lore: '철근은 콘크리트가 약한 인장력을 받는다', loreSource: ''
  },
  form: {
    name: '형틀목수', kind: 'crew', trade: 'formwork', cost: 2, atk: 2, hp: 2,
    band: '#B5835A',
    prerequisite: 'rebar', preBonus: { atk: 1, hp: 1 },
    line: '거푸집 짭니다!',
    text: '철근공 있으면 +1/+1',
    term: '콘크리트를 부을 틀(거푸집)을 짜서 세우고, 굳은 뒤 떼어 내는 기능공',
    lore: '거푸집은 굳기 전 콘크리트의 모양을 잡는다', loreSource: ''
  },
  pour: {
    name: '타설팀', kind: 'crew', trade: 'concrete', cost: 3, atk: 2, hp: 3,
    band: '#7E858C',
    cure: { atk: 1, hp: 2 },
    line: '펌프카 붙었습니다!',
    text: '양생: 다음 턴 +1/+2',
    term: '굳지 않은 콘크리트를 거푸집에 붓고(타설) 다져서 표면을 고르는 작업팀',
    lore: '콘크리트는 압축에 강하고 인장에 약하다', loreSource: ''
  },
  pump: {
    name: '펌프카', kind: 'crew', trade: 'equipment', cost: 3, atk: 3, hp: 2,
    band: '#C99A1A',
    rush: true,
    line: '붐 펼칩니다!',
    text: '긴급투입: 바로 망치질',
    term: '콘크리트 펌프와 접었다 펴는 배관 팔(붐)을 실은 트럭',
    lore: '콘크리트를 배관으로 압송해 높은 곳까지 보낸다', loreSource: ''
  },
  shore: {
    name: '동바리', kind: 'crew', trade: 'formwork', cost: 2, atk: 0, hp: 4,
    band: '#8E6440',
    guard: true,
    line: '하중 받습니다!',
    text: '방호: 문제가 먼저 여기를 침',
    term: '거푸집과 갓 부은 콘크리트의 무게를 아래에서 받치는 임시 기둥',
    lore: '거푸집과 타설 하중을 받쳐 주는 가설 지주', loreSource: ''
  },
  safety: {
    name: '안전관리자', kind: 'crew', trade: 'safety', cost: 2, atk: 1, hp: 3,
    band: '#3E8C42',
    protectNeighbors: 1,
    line: '안전고리 체결 확인!',
    text: '양옆 작업팀 피해 -1',
    term: '현장의 위험요인을 점검하고 안전교육과 사고 예방을 맡는 사람',
    lore: '작업 전 위험요인을 찾아 없앤다', loreSource: ''
  },
  drone: {
    name: '드론 측량', kind: 'spell', trade: 'method', cost: 1,
    band: '#5B8DEF',
    draw: 2,
    text: '카드 2장 뽑기',
    term: '드론으로 하늘에서 사진을 찍어 땅과 현장의 모양을 재는 측량 방법',
    lore: '넓은 현장을 짧은 시간에 측량한다', loreSource: ''
  },

  // ---- 확장 카드: 현장을 처음 준공하면 2장씩 받는다 (expansion). 자재 창고에서 덱에 넣어 쓴다 ----
  // aura: 내 필드에 있으면 그 공종 작업팀 공격 +n (여러 장이어도 한 번만)
  // preDraw: 선행공정 조건이 맞으면 +1/+1 대신 카드 n장 뽑기 / weatherProof: 현장 조건(날씨)의 영향을 받지 않음
  // 공법 효과: target(ally 내 작업팀 하나 | problem 문제 하나를 골라 씀), heal(체력 +n), cancels(그 현장 조건 무효),
  //   buffTrade(그 공종 작업팀 +공격/+체력), cancelForecast(예고된 다음 문제 취소), teamAtk/selfDays(이번 턴 모두 공격 +n, 내 공기 -n),
  //   remove(고른 문제 제거) / slang: 이 카드에서 만나는 현장 말 (data/slang.js)
  signal: {
    name: '신호수', kind: 'crew', trade: 'safety', cost: 1, atk: 1, hp: 1,
    band: '#3E8C42', expansion: true, aura: { trade: 'equipment', atk: 1 },
    line: '신호 들어갑니다!',
    text: '내 장비 카드 공격 +1',
    term: '크레인 같은 장비가 움직일 때 수신호나 무전으로 운전원을 안내하는 사람',
    lore: '양중 장비 작업 때 신호로 운전원을 이끌고 주변 작업자를 지킨다', loreSource: ''
  },
  wetcure: {
    name: '습윤양생', kind: 'spell', trade: 'method', cost: 1,
    band: '#5B8DEF', expansion: true, target: 'ally', heal: 3,
    text: '아군 하나 체력 +3',
    term: '콘크리트를 부은 뒤 물을 뿌리거나 젖은 덮개를 덮어 촉촉하게 지키는 양생 방법',
    lore: '콘크리트 표면을 젖은 상태로 유지해 수분 증발을 막고 강도가 잘 오르게 한다', loreSource: ''
  },
  tower: {
    name: '타워크레인', kind: 'crew', trade: 'equipment', cost: 4, atk: 3, hp: 4,
    band: '#C99A1A', expansion: true, rush: true,
    line: '인양 시작합니다!',
    text: '긴급투입: 바로 망치질',
    term: '현장에 높이 세워 고정하는 기중기. 빙글 도는 팔(지브)로 자재를 들어 옮긴다',
    lore: '높은 곳까지 자재를 들어 올려 옮기는 고정식 양중 장비', loreSource: ''
  },
  earth: {
    name: '흙막이', kind: 'crew', trade: 'formwork', cost: 3, atk: 1, hp: 5,
    band: '#8E6440', expansion: true, guard: true, slang: 'kiribari',
    line: '토압 받습니다!',
    text: '방호: 문제가 먼저 여기를 침',
    term: '땅을 팔 때 둘레의 흙이 무너지지 않게 막는 임시 벽. 가로로 버팀보를 대어 받친다',
    lore: '굴착면은 흙의 무게(토압)를 받으므로 흙막이로 버틴다', loreSource: ''
  },
  gangform: {
    name: '갱폼팀', kind: 'crew', trade: 'formwork', cost: 4, atk: 3, hp: 5,
    band: '#B5835A', expansion: true, prerequisite: 'rebar', preDraw: 1,
    line: '갱폼 올립니다!',
    text: '철근공 있으면 카드 1장',
    term: '크레인으로 통째로 들어 올려 층마다 다시 쓰는 대형 벽 거푸집(갱폼)을 다루는 작업팀',
    lore: '갱폼은 아파트 벽처럼 같은 모양이 되풀이되는 곳에 여러 번 쓴다', loreSource: ''
  },
  pc: {
    name: 'PC 부재팀', kind: 'crew', trade: 'concrete', cost: 5, atk: 4, hp: 6,
    band: '#7E858C', expansion: true, weatherProof: true,
    line: '부재 들어갑니다!',
    text: '날씨 영향을 받지 않음',
    term: '공장에서 미리 만든 콘크리트 부재(PC, 프리캐스트 콘크리트)를 현장에서 세우고 잇는 작업팀',
    lore: '공장에서 만든 부재는 현장 날씨의 영향을 덜 받고 공기를 줄인다', loreSource: ''
  },
  warmcure: {
    name: '보온양생', kind: 'spell', trade: 'method', cost: 2,
    band: '#5B8DEF', expansion: true, cancels: 'cold', buffTrade: { trade: 'concrete', atk: 1, hp: 1 },
    text: '한파 무효, 콘크리트 +1/+1',
    term: '추운 날 갓 부은 콘크리트를 덮고 데워서 얼지 않게 지키는 양생 방법',
    lore: '콘크리트가 굳기 전에 얼면 강도가 제대로 나지 않는다', loreSource: ''
  },
  bim: {
    name: 'BIM 간섭검토', kind: 'spell', trade: 'method', cost: 2,
    band: '#5B8DEF', expansion: true, cancelForecast: true,
    text: '예고된 다음 문제 취소',
    term: 'BIM(건물 정보 모델)으로 만든 3차원 모델에서 구조·배관 등이 서로 부딪히는 곳을 미리 찾는 일',
    lore: '시공 전에 간섭을 찾아 고치면 현장에서 다시 하는 일이 줄어든다', loreSource: ''
  },
  rushwork: {
    name: '돌관작업', kind: 'spell', trade: 'method', cost: 2,
    band: '#5B8DEF', expansion: true, teamAtk: 2, selfDays: 2,
    text: '이번 턴 모두 공격+2, 공기-2',
    term: '공기를 맞추려고 사람과 장비를 몰아 쉬지 않고 밀어붙이는 작업',
    lore: '무리한 돌관작업은 비용과 사고 위험을 함께 키운다', loreSource: ''
  },
  redesign: {
    name: '설계변경 대응', kind: 'spell', trade: 'method', cost: 3,
    band: '#5B8DEF', expansion: true, target: 'problem', remove: true, slang: 'denaoshi',
    text: '문제 카드 하나 제거',
    term: '바뀐 설계에 맞춰 도면과 공정을 빠르게 다시 정리하는 일',
    lore: '바뀐 내용을 빨리 나눌수록 다시 시공하는 일(재시공)이 줄어든다', loreSource: ''
  },

  // ---------- 카드 확장: 건축 실무·전공 ----------
  mason: {
    name: '조적공', kind: 'crew', trade: 'finish', cost: 2, atk: 1, hp: 3,
    band: '#B4533A', expansion: true, brickBonus: 1,
    line: '줄눈 맞춰 쌓습니다!',
    text: '건물 치면 벽돌 +1',
    term: '벽돌·블록을 모르타르로 붙여 벽을 쌓는 기능공',
    lore: '벽돌은 위아래 줄눈이 엇갈리게(막힌줄눈) 쌓아야 힘이 고르게 퍼진다', loreSource: ''
  },
  proof: {
    name: '방수공', kind: 'crew', trade: 'finish', cost: 2, atk: 1, hp: 3,
    band: '#B4533A', expansion: true, vsLeak: 2,
    line: '물샐틈없이 막겠습니다!',
    text: '누수 칠 때 공격 +2',
    term: '지붕·지하·욕실에 물이 스미지 않게 방수층을 만드는 기능공',
    lore: '지하 외벽은 물이 들어오는 바깥쪽에 방수층을 두는 것(외방수)이 기본이다', loreSource: ''
  },
  steel: {
    name: '철골공', kind: 'crew', trade: 'steel', cost: 3, atk: 3, hp: 3,
    band: '#5B6B7A', expansion: true, prerequisite: 'tower', preTwice: true,
    line: '볼트 체결 완료!',
    text: '크레인 있으면 2번 침',
    term: '공장에서 만든 철골 기둥·보를 크레인으로 세우고 볼트로 조이는 기능공',
    lore: '철골은 공장에서 만들어 현장에서 조립하므로 공기를 줄일 수 있다', loreSource: ''
  },
  welder: {
    name: '용접공', kind: 'crew', trade: 'steel', cost: 2, atk: 2, hp: 2,
    band: '#5B6B7A', expansion: true, onPlay: { trades: ['steel', 'equipment'], hp: 2 },
    line: '불꽃 조심하세요!',
    text: '등장: 철골·장비 체력+2',
    term: '금속을 높은 열로 녹여 이어 붙이는(용접) 기능공',
    lore: '철골 접합은 고력볼트와 용접으로 하고, 용접부는 검사로 결함을 찾는다', loreSource: ''
  },
  remicon: {
    name: '레미콘 기사', kind: 'crew', trade: 'equipment', cost: 3, atk: 2, hp: 2,
    band: '#C99A1A', expansion: true, rush: true, onPlay: { trades: ['concrete'], atk: 1 },
    line: '레미콘 도착했습니다!',
    text: '긴급투입 타설 공격+1',
    term: '공장에서 비빈 굳지 않은 콘크리트(레미콘)를 드럼을 돌리며 실어 오는 트럭 기사',
    lore: '레미콘은 비비기 시작해서 정해진 시간(기온에 따라 90~120분) 안에 타설을 끝내야 한다', loreSource: ''
  },
  scaffold: {
    name: '비계공', kind: 'crew', trade: 'formwork', cost: 2, atk: 1, hp: 3,
    band: '#B5835A', expansion: true, helmet: true,
    line: '안전난간 확인!',
    text: '안전모: 첫 피해 무효',
    term: '높은 곳 작업용 발판과 통로(비계)를 짜고 해체하는 기능공',
    lore: '비계 작업발판에는 안전난간을 달아 떨어지는 사고를 막는다', loreSource: ''
  },
  inspector: {
    name: '감리원', kind: 'crew', trade: 'safety', cost: 2, atk: 0, hp: 4,
    band: '#3E8C42', expansion: true, calmProblems: 1,
    line: '도면대로 하셨죠?',
    text: '문제 모두 공격 -1',
    term: '설계도서대로 시공되는지 현장에서 확인·검토하는 기술자',
    lore: '감리는 품질·안전·공정을 확인하고, 잘못된 시공은 바로잡도록 지시한다', loreSource: ''
  },
  cpm: {
    name: '공정표 작성', kind: 'spell', trade: 'method', cost: 0,
    band: '#5B8DEF', expansion: true, comboStep: true,
    text: '공정 순서 1단계 진행',
    term: '작업 순서와 기간을 그린 일정표. CPM은 가장 오래 걸리는 작업 경로를 찾는 방법',
    lore: '주공정선(CP) 위의 작업이 늦어지면 전체 공기가 그만큼 늦어진다', loreSource: ''
  },
  testpiece: {
    name: '압축강도 시험', kind: 'spell', trade: 'method', cost: 0,
    band: '#5B8DEF', expansion: true, cureNow: true,
    text: '양생 중인 팀 바로 완료',
    term: '콘크리트 공시체(시험용 원기둥)를 눌러 부서질 때의 힘으로 강도를 확인하는 시험',
    lore: '콘크리트 설계기준강도는 보통 타설하고 28일 지난 압축강도로 정한다', loreSource: ''
  },
  payment: {
    name: '기성 청구', kind: 'spell', trade: 'method', cost: 0,
    band: '#5B8DEF', expansion: true, coinsPerFloor: 1,
    text: '완성한 층마다 코인 +1',
    term: '공사가 진행된 만큼(기성고) 공사비를 나눠 받는 것',
    lore: '기성은 보통 달마다 공정률을 확인해 그만큼 공사비를 청구하고 받는다', loreSource: ''
  },
  inspect: {
    name: '안전점검', kind: 'spell', trade: 'method', cost: 1,
    band: '#5B8DEF', expansion: true, shieldUp: 1,
    text: '공기 피해 1번 막기',
    term: '작업 전·중에 위험 요소를 찾아 고치는 점검',
    lore: '현장은 작업 전 안전점검과 TBM으로 그날의 위험을 함께 나눈다', loreSource: ''
  },

  // ---------- 카드 확장: 게임 요소 ----------
  apprentice: {
    name: '견습공', kind: 'crew', trade: 'general', cost: 1, atk: 1, hp: 1,
    band: '#7A5C99', expansion: true, onOut: { draw: 1 },
    line: '배우겠습니다!',
    text: '퇴장 효과: 카드 1장',
    term: '기능공 곁에서 일을 배우는 초보 작업자',
    lore: '숙련 기능공이 견습공을 가르치며 현장 기술이 이어진다', loreSource: ''
  },
  excavator: {
    name: '굴착기', kind: 'crew', trade: 'equipment', cost: 3, atk: 2, hp: 3,
    band: '#C99A1A', expansion: true, twice: true,
    line: '터파기 시작!',
    text: '한 턴 2번 망치질',
    term: '버킷으로 땅을 파고 흙을 옮기는 건설기계(백호)',
    lore: '터파기는 흙막이를 먼저 세운 뒤 단계적으로 판다', loreSource: ''
  },
  foreman: {
    name: '베테랑 반장', kind: 'crew', trade: 'general', cost: 3, atk: 2, hp: 3,
    band: '#7A5C99', expansion: true, leadNeighbors: 1,
    line: '다들 모여!',
    text: '양옆 작업팀 공격 +1',
    term: '작업팀을 이끄는 경험 많은 작업반장',
    lore: '작업반장은 그날 작업을 나누고 안전을 함께 챙긴다', loreSource: ''
  },
  multi: {
    name: '다능공', kind: 'crew', trade: 'general', cost: 2, atk: 2, hp: 2,
    band: '#7A5C99', expansion: true, comboWild: true,
    line: '뭐든 맡겨 주세요!',
    text: '공정 순서 다음 단계로 셈',
    term: '여러 공종 일을 두루 할 수 있는 기능공',
    lore: '다능공은 공정이 바뀔 때 기다리지 않고 바로 투입할 수 있다', loreSource: ''
  }
};

// 키워드 4개: 게임 규칙과 건축적 의미 (PRD 키워드 표)
JG.KEYWORDS = {
  guard: { name: '방호', rule: '상대는 이 카드부터 쳐야 한다', meaning: '가설구조물이 본 구조와 사람을 지킨다' },
  rush: { name: '긴급투입', rule: '낸 턴에 바로 망치질한다', meaning: '장비는 도착하면 곧바로 작업한다' },
  cure: { name: '양생', rule: '낸 다음 턴 시작에 +1/+2', meaning: '콘크리트는 굳으면서 강도가 오른다' },
  prerequisite: { name: '선행공정', rule: '앞 공정 카드가 내 필드에 있으면 추가 효과', meaning: '철근 → 거푸집 → 타설 순서로 짓는다' },
  helmet: { name: '안전모', rule: '처음 받는 피해 1번을 막는다', meaning: '안전모·안전대 같은 보호구는 사고가 나도 크게 다치지 않게 지켜 준다' },
  onOut: { name: '퇴장 효과', rule: '퇴장할 때 효과가 생긴다', meaning: '작업을 마친 팀은 다음 팀에게 요령과 남은 자재를 넘겨준다' },
  twice: { name: '연속 망치질', rule: '한 턴에 두 번 망치질한다', meaning: '장비와 손발이 맞는 팀은 같은 시간에 더 많은 물량을 해낸다' },
  onPlay: { name: '등장 효과', rule: '낼 때 효과가 생긴다', meaning: '자재·장비가 반입되면 그것을 쓰는 공종의 작업이 빨라진다' }
};

// 모은 별로 여는 새 카드: 모은 별이 stars개가 되면 cards를 받는다 (쉬운 카드부터). 이미 모은 별만큼은 바로 받는다
JG.CARD_UNLOCKS = [
  { stars: 3, cards: ['apprentice', 'mason', 'inspect'] },
  { stars: 8, cards: ['payment', 'scaffold', 'multi'] },
  { stars: 14, cards: ['proof', 'cpm', 'foreman'] },
  { stars: 20, cards: ['remicon', 'testpiece', 'inspector'] },
  { stars: 27, cards: ['steel', 'welder', 'excavator'] }
];

// 처음 주는 덱 12장 (같은 카드 최대 2장)
JG.STARTER_DECK = [
  'rebar', 'rebar', 'form', 'form', 'pour', 'pour',
  'pump', 'pump', 'shore', 'safety', 'drone', 'drone'
];

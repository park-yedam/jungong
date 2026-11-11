// 카드 데이터. 숫자와 문구는 여기서만 고치면 된다.
// kind  : crew(현장에 남는 작업팀) / spell(쓰고 사라지는 공법)
// trade : rebar(철근) formwork(형틀) concrete(콘크리트) equipment(장비) safety(안전) method(공법)
// band  : 카드 위 이름 띠 색 (흰 글자가 잘 보이게 공종 색보다 조금 진함)
// text  : 카드에 보이는 효과 한 줄. 카드 폭에서 2줄을 넘으면 공격·체력 배지와 겹친다
// term  : 카드를 길게 누르면 나오는 용어 풀이 (카드 이름이 무엇인지)
// lore  : 카드 하단 설명 = 건축공학 개론 수준의 사실 한 문장. loreSource에 교재·시방서 근거를 적는다
// 키워드: guard(방호) rush(긴급투입) cure(양생: 다음 턴 시작에 오르는 수치) prerequisite(선행공정: 앞 공정 카드 id)
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

  // ---- 확장 카드: 현장을 처음 준공하면 받는 보상 (expansion). 대전에서 쓰는 것과 효과는 6단계 자재 창고부터 ----
  signal: {
    name: '신호수', kind: 'crew', trade: 'safety', cost: 1, atk: 1, hp: 1,
    band: '#3E8C42', expansion: true,
    line: '신호 들어갑니다!',
    text: '내 장비 카드 공격 +1',
    term: '크레인 같은 장비가 움직일 때 수신호나 무전으로 운전원을 안내하는 사람',
    lore: '양중 장비 작업 때 신호로 운전원을 이끌고 주변 작업자를 지킨다', loreSource: ''
  },
  wetcure: {
    name: '습윤양생', kind: 'spell', trade: 'method', cost: 1,
    band: '#5B8DEF', expansion: true,
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
  }
};

// 키워드 4개: 게임 규칙과 건축적 의미 (PRD 키워드 표)
JG.KEYWORDS = {
  guard: { name: '방호', rule: '상대는 이 카드부터 쳐야 한다', meaning: '가설구조물이 본 구조와 사람을 지킨다' },
  rush: { name: '긴급투입', rule: '낸 턴에 바로 망치질한다', meaning: '장비는 도착하면 곧바로 작업한다' },
  cure: { name: '양생', rule: '낸 다음 턴 시작에 +1/+2', meaning: '콘크리트는 굳으면서 강도가 오른다' },
  prerequisite: { name: '선행공정', rule: '앞 공정 카드가 내 필드에 있으면 추가 효과', meaning: '철근 → 거푸집 → 타설 순서로 짓는다' }
};

// 처음 주는 덱 12장 (같은 카드 최대 2장)
JG.STARTER_DECK = [
  'rebar', 'rebar', 'form', 'form', 'pour', 'pour',
  'pump', 'pump', 'shore', 'safety', 'drone', 'drone'
];

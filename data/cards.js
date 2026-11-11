// 카드 데이터. 숫자와 문구는 여기서만 고치면 된다.
// kind  : crew(현장에 남는 작업팀) / spell(쓰고 사라지는 공법)
// trade : rebar(철근) formwork(형틀) concrete(콘크리트) equipment(장비) safety(안전) method(공법)
// band  : 카드 위 이름 띠 색 (흰 글자가 잘 보이게 공종 색보다 조금 진함)
// text  : 카드에 보이는 효과 한 줄. 카드 폭에서 2줄을 넘으면 공격·체력 배지와 겹친다
// 키워드: guard(방호) rush(긴급투입) cure(양생: 다음 턴 시작에 오르는 수치) prerequisite(선행공정: 앞 공정 카드 id)
var JG = globalThis.JG = globalThis.JG || {};

JG.CARDS = {
  rebar: {
    name: '철근공', kind: 'crew', trade: 'rebar', cost: 1, atk: 1, hp: 2,
    band: '#E07A3F',
    line: '결속 들어갑니다!',
    text: '철근은 인장력 담당',
    lore: '철근은 콘크리트가 약한 인장력을 받는다', loreSource: ''
  },
  form: {
    name: '형틀목수', kind: 'crew', trade: 'formwork', cost: 2, atk: 2, hp: 2,
    band: '#B5835A',
    prerequisite: 'rebar', preBonus: { atk: 1, hp: 1 },
    line: '거푸집 짭니다!',
    text: '철근공 있으면 +1/+1',
    lore: '거푸집은 굳기 전 콘크리트의 모양을 잡는다', loreSource: ''
  },
  pour: {
    name: '타설팀', kind: 'crew', trade: 'concrete', cost: 3, atk: 2, hp: 3,
    band: '#7E858C',
    cure: { atk: 1, hp: 2 },
    line: '펌프카 붙었습니다!',
    text: '양생: 다음 턴 +1/+2',
    lore: '콘크리트는 압축에 강하고 인장에 약하다', loreSource: ''
  },
  pump: {
    name: '펌프카', kind: 'crew', trade: 'equipment', cost: 3, atk: 3, hp: 2,
    band: '#C99A1A',
    rush: true,
    line: '붐 펼칩니다!',
    text: '긴급투입: 바로 망치질',
    lore: '콘크리트를 배관으로 압송해 높은 곳까지 보낸다', loreSource: ''
  },
  shore: {
    name: '동바리', kind: 'crew', trade: 'formwork', cost: 2, atk: 0, hp: 4,
    band: '#8E6440',
    guard: true,
    line: '하중 받습니다!',
    text: '방호: 문제가 먼저 여기를 침',
    lore: '거푸집과 타설 하중을 받쳐 주는 가설 지주', loreSource: ''
  },
  safety: {
    name: '안전관리자', kind: 'crew', trade: 'safety', cost: 2, atk: 1, hp: 3,
    band: '#3E8C42',
    protectNeighbors: 1,
    line: '안전고리 체결 확인!',
    text: '양옆 작업팀 피해 -1',
    lore: '작업 전 위험요인을 찾아 없앤다', loreSource: ''
  },
  drone: {
    name: '드론 측량', kind: 'spell', trade: 'method', cost: 1,
    band: '#5B8DEF',
    draw: 2,
    text: '카드 2장 뽑기',
    lore: '넓은 현장을 짧은 시간에 측량한다', loreSource: ''
  }
};

// 처음 주는 덱 12장 (같은 카드 최대 2장)
JG.STARTER_DECK = [
  'rebar', 'rebar', 'form', 'form', 'pour', 'pour',
  'pump', 'pump', 'shore', 'safety', 'drone', 'drone'
];

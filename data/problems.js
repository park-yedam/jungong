// 현장 문제 카드 데이터
// guard: 방호(이것부터 치워야 건물이나 다른 문제를 칠 수 있다)
// drain: 현장 턴마다 깎는 내 공기 / coinDrain: 있는 동안 내 턴 공사비 -n
// workersOnly: 작업팀만 친다(달력은 안 침) / swapHand: 현장 턴마다 내 손패 맨 왼쪽 카드를 n장 바꾼다
// tip  : 대전에서 문제를 누르면 나오는 요령 한 줄
// lore : 길게 누르면 나오는 해설 (실제 현장에서 이 문제가 무엇인지). loreSource에 근거를 적는다
// slang: 이 문제에서 만나는 현장 말 (data/slang.js)
var JG = globalThis.JG = globalThis.JG || {};

JG.PROBLEMS = {
  crack: {
    name: '균열이', atk: 1, hp: 2,
    tip: '그대로 두면 현장 턴마다 작업팀이나 달력을 쳐요.',
    lore: '콘크리트는 마르면서 줄어들거나 온도가 바뀌거나 힘을 받으면 금이 간다. 그대로 두면 물이 스며 철근이 녹슨다', loreSource: ''
  },
  noise: {
    name: '소음 구름', atk: 0, hp: 3, guard: true,
    tip: '방호라서 이것부터 치워야 건물을 칠 수 있어요.',
    lore: '공사장 소음은 정해진 기준과 작업 시간을 지켜야 한다. 이웃의 민원이 쌓이면 공사가 멈추기도 한다', loreSource: ''
  },
  leak: {
    name: '누수 방울', atk: 1, hp: 2, drain: 1,
    tip: '현장 턴마다 공기를 하루씩 깎아요.',
    lore: '방수층이 상하거나 이음부가 벌어지면 물이 샌다. 고치는 데 시간이 들어 공사 기간(공기)이 늘어난다', loreSource: ''
  },

  // ---- 확장 문제 (4·5번 현장) ----
  opening: {
    name: '개구부', atk: 3, hp: 2, workersOnly: true,
    tip: '작업팀만 세게 쳐요. 작업팀이 없으면 아무 일도 안 해요.',
    lore: '바닥이나 벽에 뚫린 구멍(개구부)은 떨어질 위험이 커서 덮개와 안전난간으로 막는다', loreSource: ''
  },
  change: {
    name: '설계변경', atk: 2, hp: 3, swapHand: 1,
    tip: '현장 턴마다 내 손패 맨 왼쪽 카드를 다른 카드로 바꿔요.',
    lore: '공사 중에 설계가 바뀌면 이미 한 작업을 고치거나 다시 해야 해서 일정이 흔들린다', loreSource: ''
  },
  delay: {
    name: '자재 반입 지연', atk: 1, hp: 2, coinDrain: 1, slang: 'gombang',
    tip: '현장에 있는 동안 내 턴 공사비가 1 줄어요.',
    lore: '자재가 제때 들어오지 않으면 작업팀이 기다리게 된다. 들어온 자재를 작업 위치까지 옮기는 일을 소운반이라 한다', loreSource: ''
  },
  slide: {
    name: '토사 유출', atk: 4, hp: 4, guard: true,
    tip: '방호라서 이것부터 치워야 해요. 공격도 세요.',
    lore: '굴착면의 흙이 무너지거나 쓸려 나가면 둘레의 땅과 건물까지 위험해진다', loreSource: ''
  }
};

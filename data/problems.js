// 현장 문제 카드 데이터
// guard: 방호(이것부터 치워야 건물이나 다른 문제를 칠 수 있다)
// drain: 현장 턴마다 깎는 내 공기
// tip  : 대전에서 문제를 누르면 나오는 요령 한 줄
// lore : 길게 누르면 나오는 해설 (실제 현장에서 이 문제가 무엇인지). loreSource에 근거를 적는다
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
  }
};

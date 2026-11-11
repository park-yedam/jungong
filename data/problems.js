// 현장 문제 카드 데이터
// guard: 방호(이것부터 치워야 건물이나 다른 문제를 칠 수 있다)
// drain: 현장 턴마다 깎는 내 공기
var JG = globalThis.JG = globalThis.JG || {};

JG.PROBLEMS = {
  crack: {
    name: '균열이', atk: 1, hp: 2,
    tip: '그대로 두면 현장 턴마다 작업팀이나 달력을 쳐요.'
  },
  noise: {
    name: '소음 구름', atk: 0, hp: 3, guard: true,
    tip: '방호라서 이것부터 치워야 건물을 칠 수 있어요.'
  },
  leak: {
    name: '누수 방울', atk: 1, hp: 2, drain: 1,
    tip: '현장 턴마다 공기를 하루씩 깎아요.'
  }
};

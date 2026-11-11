// 아침 TBM 다짐 카드 (판 시작에 3장 중 1장 고르기)
// shield: 처음 받는 피해 무효 횟수 / extraHand: 시작 손패 추가 / equipDiscount: 처음 내는 장비 카드 코인 할인
var JG = globalThis.JG = globalThis.JG || {};

JG.PLEDGES = {
  chant: {
    name: '안전 구호 제창', text: '이번 판 처음 받는 피해 1번 무효',
    field: '작업 전 모두 모여 구호를 외치고 오늘의 위험요인을 함께 확인해요.',
    shield: 1
  },
  delivery: {
    name: '자재 반입 확인', text: '시작 손패 +1장',
    field: '오늘 들어올 자재의 종류, 수량, 반입 시간을 미리 맞춰 봐요.',
    extraHand: 1
  },
  inspect: {
    name: '장비 일일점검', text: '처음 내는 장비 카드 코인 -1',
    field: '장비를 쓰기 전에 브레이크, 와이어, 안전장치를 점검해요.',
    equipDiscount: 1
  }
};

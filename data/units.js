// 수업용 해설 모드의 단원 분류: 판에 나온 카드·문제·키워드·현장 조건을 시공·재료·구조·안전 단원으로 묶는다.
// 교수님이 수업에 맞게 단원을 바꾸려면 여기만 고치면 된다.
var JG = globalThis.JG = globalThis.JG || {};

JG.UNITS = {
  order: ['시공', '재료', '구조', '안전'],
  card: {
    rebar: '구조', form: '시공', pour: '재료', pump: '시공', shore: '시공', safety: '안전', drone: '시공',
    signal: '안전', wetcure: '재료', tower: '시공', earth: '구조', gangform: '시공', pc: '시공',
    warmcure: '재료', bim: '시공', rushwork: '시공', redesign: '시공',
    mason: '시공', proof: '재료', steel: '구조', welder: '구조', remicon: '재료', scaffold: '안전', inspector: '시공',
    cpm: '시공', testpiece: '재료', payment: '시공', inspect: '안전', apprentice: '시공', excavator: '시공', foreman: '안전', multi: '시공'
  },
  prob: { crack: '재료', noise: '시공', leak: '재료', opening: '안전', change: '시공', delay: '시공', slide: '구조' },
  keyword: { guard: '안전', rush: '시공', cure: '재료', prerequisite: '시공', helmet: '안전', onOut: '시공', twice: '시공', onPlay: '시공' },
  condition: { rain: '재료', cold: '재료', soft: '구조' }
};

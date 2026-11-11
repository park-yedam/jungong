// 시나리오 공유 코드: 현장 조건·벽돌 수·나오는 문제·턴 시간·문제 순서를 6자리 코드 하나에 담는다.
// 교수님이 만든 코드를 학생이 넣으면 같은 현장이 열린다 (서버 없음). 브라우저와 Node 양쪽에서 쓴다.
// 30비트 = 조건 2 + 벽돌 2 + 문제 7 + 턴 시간 1 + 순서 14 + 오타 검사 4 → 32진수 6글자
(() => {
  const JG = globalThis.JG, E = JG.engine;
  const ABC = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';   // I, L, O, U는 헷갈려서 뺌
  const CONDS = [null, 'rain', 'cold', 'soft'];
  const BRICKS = [12, 16, 20, 24];
  const PROBS = ['crack', 'noise', 'leak', 'opening', 'change', 'delay', 'slide'];
  const TIMERS = [0, 30];
  const check = payload => (Math.imul(payload, 2654435761) >>> 0) >>> 28;   // 오타를 잡는 4비트

  // opts: { condition: null|'rain'|'cold'|'soft', bricks: 12|16|20|24, problems: [문제 id], turnSeconds: 0|30, seed: 0~16383 }
  function encode(opts) {
    const mask = PROBS.reduce((m, id, i) => m | (opts.problems.includes(id) ? 1 << i : 0), 0);
    const payload = CONDS.indexOf(opts.condition) | (BRICKS.indexOf(opts.bricks) << 2) | (mask << 4) | (TIMERS.indexOf(opts.turnSeconds) << 11) | ((opts.seed & 16383) << 12);
    let v = payload * 16 + check(payload), code = '';
    for (let k = 0; k < 6; k++) { code = ABC[v % 32] + code; v = Math.floor(v / 32); }
    return code;
  }

  // 코드 → opts. 틀린 코드면 null (헷갈리는 글자 O→0, I·L→1은 고쳐 읽는다)
  function decode(text) {
    const code = String(text || '').toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
    if (!/^[0-9A-HJKMNP-TV-Z]{6}$/.test(code)) return null;
    const v = [...code].reduce((n, ch) => n * 32 + ABC.indexOf(ch), 0), payload = Math.floor(v / 16);
    if (v % 16 !== check(payload)) return null;
    const mask = (payload >> 4) & 127;
    if (!mask) return null;
    return {
      code, condition: CONDS[payload & 3], bricks: BRICKS[(payload >> 2) & 3],
      problems: PROBS.filter((id, i) => mask & (1 << i)), turnSeconds: TIMERS[(payload >> 11) & 1], seed: (payload >> 12) & 16383, payload
    };
  }

  // opts → 현장 데이터. 문제 순서는 코드(payload)로 정해진 난수로 고른다
  function siteFor(opts) {
    const code = opts.code || encode(opts), d = opts.payload ? opts : decode(code), rnd = E.random(d.payload);
    const first = d.problems.includes('crack') ? 'crack' : d.problems[0];
    const forecast = [first].concat(Array.from({ length: 7 }, () => d.problems[Math.floor(rnd() * d.problems.length)]));
    return { id: 'class-' + code, scenario: true, code, seed: d.payload, no: 0, name: '수업 ' + code, bricks: d.bricks, condition: d.condition,
      learn: '수업용 현장', forecast, turnSeconds: d.turnSeconds || undefined };
  }

  JG.scenario = { encode, decode, siteFor, CONDS, BRICKS, PROBS, TIMERS };
})();

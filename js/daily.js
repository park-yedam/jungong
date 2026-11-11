// 데일리 현장: 날짜만으로 현장(건물 종류, 벽돌 수, 현장 조건, 문제 순서)이 정해진다.
// 서버 없이도 같은 날짜면 어느 기기에서나 같은 현장이 나온다 (날짜 → 시드 난수). 5번 현장을 준공하면 열린다.
// 브라우저와 Node(시뮬레이터, 규칙 점검) 양쪽에서 쓴다.
(() => {
  const JG = globalThis.JG, E = JG.engine;
  const TYPES = ['주민센터', '도서관', '오피스텔', '연구동', '복합 상가', '학교 증축', '어린이집', '체육관'];
  const BRICKS = [16, 20, 24];
  // 문제 뽑기 주머니 (균열이가 자주 나오고, 센 문제는 가끔)
  const POOL = ['crack', 'crack', 'crack', 'noise', 'leak', 'opening', 'change', 'delay', 'slide'];
  const pad2 = n => String(n).padStart(2, '0');
  const keyOf = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());

  // 계절 조건: 여름 장마(집중호우), 겨울 한파, 봄은 해빙기라 절반은 연약지반, 가을은 맑음
  function seasonCondition(month, roll) {
    if (month >= 6 && month <= 8) return 'rain';
    if (month === 12 || month <= 2) return 'cold';
    if (month <= 5) return roll < 0.5 ? 'soft' : null;
    return null;
  }

  // date(Date)의 데일리 현장. 난수는 늘 같은 순서로 같은 개수만 쓴다 (기기마다 결과가 같도록)
  function siteFor(date) {
    const dateKey = keyOf(date), seed = Number(dateKey.replace(/-/g, '')), rnd = E.random(seed);
    const name = TYPES[Math.floor(rnd() * TYPES.length)];
    const bricks = BRICKS[Math.floor(rnd() * BRICKS.length)];
    const condition = seasonCondition(date.getMonth() + 1, rnd());
    const forecast = ['crack'].concat(Array.from({ length: 7 }, () => POOL[Math.floor(rnd() * POOL.length)]));
    return { id: 'daily-' + dateKey, daily: true, dateKey, seed, no: 0, name, bricks, condition, learn: '오늘의 현장', forecast, turnSeconds: 30 };
  }

  JG.daily = {
    siteFor,
    today: () => siteFor(new Date()),
    unlocked: () => JG.progress.best('deep') > 0,   // 5번 현장 준공
    best: key => (JG.save.data.daily || {})[key] || 0,
    // 결과를 메신저 등에 붙여 넣을 수 있는 글로
    shareText(site, s, diffName) {
      const cond = site.condition ? JG.CONDITIONS[site.condition].name : '맑음', st = E.stars(s);
      return '준공! 데일리 현장 ' + site.dateKey.replace(/-/g, '.') + '\n'
        + site.name + ' · ' + cond + ' · ' + diffName + '\n'
        + '★'.repeat(st) + '☆'.repeat(3 - st) + ' ' + s.turn + '턴 · 남은 공기 D-' + s.days;
    }
  };
})();

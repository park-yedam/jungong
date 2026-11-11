// 수업·복습: 이번 판 해설(단원별 정리)과 용어 OX 3문제.
// concepts·quiz는 화면 없이 계산만 해서 Node 점검에서도 쓴다. 화면(풀이 창 페이지)은 pages에서 만든다.
(() => {
  const JG = globalThis.JG, E = JG.engine;
  const KW = ['guard', 'rush', 'cure', 'prerequisite', 'helmet', 'onOut', 'twice', 'onPlay'];
  const hasKw = (c, k) => !!(c[k] || (k === 'twice' && c.preTwice));   // 연속 망치질은 선행공정 조건부(preTwice)도
  const end = s => (/[.!?]$/.test(s) ? s : s + '.');

  // 이번 판에 나온 개념: 낸 카드, 그 카드의 키워드, 나온 문제, 현장 조건 → 단원 순서대로
  function concepts(g) {
    const U = JG.UNITS, site = E.siteOf(g), out = [], kws = [];
    const cards = g.rec.cards || [], probs = [...new Set((g.rec.probs || []).concat(g.probs.filter(Boolean).map(p => p.id)))];
    cards.forEach(id => {
      const c = JG.CARDS[id];
      out.push({ unit: U.card[id], name: c.name, kind: c.kind === 'crew' ? '작업팀' : '공법', text: end(c.term) + ' ' + end(c.lore) });
      KW.forEach(k => { if (hasKw(c, k) && !kws.includes(k)) kws.push(k); });
    });
    probs.forEach(id => {
      const p = JG.PROBLEMS[id];
      out.push({ unit: U.prob[id], name: p.name, kind: '현장 문제', text: end(p.lore) });
      if (p.guard && !kws.includes('guard')) kws.push('guard');
    });
    kws.forEach(k => { const w = JG.KEYWORDS[k]; out.push({ unit: U.keyword[k], name: w.name, kind: '키워드', text: end(w.rule) + ' 현장에서는: ' + end(w.meaning) }); });
    if (site.condition) { const c = JG.CONDITIONS[site.condition]; out.push({ unit: U.condition[site.condition], name: c.name, kind: '현장 조건', text: end(c.lore) }); }
    return U.order.map(unit => ({ unit, items: out.filter(x => x.unit === unit) })).filter(x => x.items.length);
  }

  // 용어 OX 3문제: 이번 판 카드의 용어 풀이와 키워드 뜻. 틀린 문장은 다른 카드·키워드의 설명을 바꿔 붙인다
  function quiz(g, seed) {
    const rnd = E.random(seed), pick = a => a[Math.floor(rnd() * a.length)];
    const cardItem = id => ({ kind: 'card', name: JG.CARDS[id].name, text: JG.CARDS[id].term });
    const kwItem = k => ({ kind: 'kw', name: JG.KEYWORDS[k].name, text: JG.KEYWORDS[k].meaning });
    let used = (g.rec.cards || []).slice();
    // 낸 카드가 3장보다 적으면 기본 카드로 채운다
    Object.keys(JG.CARDS).forEach(id => { if (used.length < 3 && !JG.CARDS[id].expansion && !used.includes(id)) used.push(id); });
    const kws = KW.filter(k => used.some(id => hasKw(JG.CARDS[id], k)));
    const pool = E.shuffle(used.map(cardItem).concat(kws.map(kwItem)), seed).slice(0, 3);
    const allCards = Object.keys(JG.CARDS).map(cardItem), allKws = KW.map(kwItem);
    const qs = pool.map((it, i) => {
      const truth = i === 0 ? true : i === 1 ? false : rnd() < 0.5;   // O와 X가 적어도 하나씩
      const others = (it.kind === 'card' ? allCards : allKws).filter(x => x.text !== it.text);
      return { kind: it.kind, name: it.name, shown: truth ? it.text : pick(others).text, answer: truth, correct: it.text };
    });
    return E.shuffle(qs, seed + 1);
  }

  // ---------- 풀이 창 페이지 (브라우저에서만) ----------
  const esc = s => JG.esc(s);
  const ask = q => (q.kind === 'card' ? '이 용어 풀이가 맞을까요?' : '이 키워드의 현장 뜻이 맞을까요?');

  function lessonPage(g) {
    const groups = concepts(g), n = groups.reduce((k, x) => k + x.items.length, 0), site = E.siteOf(g);
    return {
      title: '수업용 해설',
      meta: (site.daily ? '데일리 · ' : '') + site.name + ' · 이번 판에 나온 개념 ' + n + '개',
      body: () => groups.map(gr => '<p style="margin: 0 0 6px; font-size: 32px; line-height: 36px; color: #8B3A1E">' + esc(gr.unit) + '</p>'
        + gr.items.map(x => '<p style="margin: 0 0 10px"><span style="color: #3E5C8A">' + esc(x.name) + ' · ' + esc(x.kind) + '</span><br>' + esc(x.text) + '</p>').join('')).join(''),
      text: () => groups.map(gr => gr.unit + ': ' + gr.items.map(x => x.name + '. ' + x.text).join(' ')).join(' ')
    };
  }

  function oxPage(g) {
    const qs = quiz(g, Date.now() % 100000 + 1), st = { i: 0, picked: null, score: 0, reward: false };
    const btn = (act, label, x, w, green) => '<button type="button" data-act="' + act + '" style="position: absolute; left: ' + x + 'px; top: 0; width: ' + w + 'px; height: 64px; padding: 0; margin: 0; font: inherit; cursor: pointer; box-sizing: border-box; '
      + (green ? JG.look.GREEN + '; color: #FFFFFF; ' + JG.look.OUT2 : JG.look.PAPER + '; background: #FFFFFF; color: #3B2A20') + '; font-size: 32px; line-height: 32px">' + esc(label) + '</button>';
    const row = inner => '<div style="position: relative; height: 64px; margin-top: 18px">' + inner + '</div>';
    return {
      title: '용어 OX',
      meta: '이번 판 용어 3문제 · 다 맞히면 금색 안전모',
      body() {
        if (st.i >= qs.length) {
          return '<p style="margin: 0 0 12px; font-size: 32px; line-height: 40px">' + qs.length + '문제 중 ' + st.score + '개 맞혔어요!</p>'
            + '<p style="margin: 0">' + (st.score === qs.length ? (st.reward ? '금색 안전모를 받았어요! 이제 현장소장이 금색 안전모를 써요. (단지와 기념사진)' : '이미 금색 안전모를 쓰고 있어요. 멋져요!')
              : '다시 풀어 보려면 결과 화면에서 용어 OX를 한 번 더 눌러 주세요. 다 맞히면 금색 안전모를 받아요.') + '</p>';
        }
        const q = qs[st.i];
        let h = '<p style="margin: 0 0 6px; color: #5C3A1E">' + (st.i + 1) + '번 / ' + qs.length + '번 · ' + esc(ask(q)) + '</p>'
          + '<p style="margin: 0; padding: 12px; background: #FFF6DC; border: 3px solid #3B2A20; line-height: 24px">"' + esc(q.name) + '": ' + esc(q.shown) + '</p>';
        if (st.picked === null) return h + row(btn('ox:1', 'O 맞다', 0, 300, true) + btn('ox:0', 'X 틀리다', 330, 300, false));
        const right = st.picked === q.answer;
        return h + '<p style="margin: 14px 0 6px; font-size: 32px; line-height: 36px; color: ' + (right ? '#23602A' : '#B83E3C') + '">' + (right ? '정답!' : '아쉬워요') + ' 답은 ' + (q.answer ? 'O' : 'X') + '</p>'
          + (q.answer ? '' : '<p style="margin: 0">"' + esc(q.name) + '"의 바른 설명: ' + esc(q.correct) + '</p>')
          + row(btn('oxnext', st.i + 1 < qs.length ? '다음 문제' : '결과 보기', 0, 300, true));
      },
      text() {
        if (st.i >= qs.length) return qs.length + '문제 중 ' + st.score + '개 맞혔어요.' + (st.reward ? ' 금색 안전모를 받았어요.' : '');
        const q = qs[st.i];
        return (st.i + 1) + '번 문제. ' + ask(q) + ' "' + q.name + '": ' + q.shown + (st.picked === null ? '. O 또는 X를 고르세요.' : (st.picked === q.answer ? '. 정답.' : '. 오답. 바른 설명: ' + q.correct));
      },
      click(act, n) {
        if (act === 'ox' && st.picked === null) {
          st.picked = n === 1;
          const right = st.picked === qs[st.i].answer;
          if (right) st.score++;
          JG.sound.play(right ? 'solved' : 'thud');
        }
        if (act === 'oxnext') {
          st.i++; st.picked = null;
          if (st.i >= qs.length && st.score === qs.length && JG.save.data.helmet !== 'gold') {
            JG.save.data.helmet = 'gold'; JG.save.write(); st.reward = true; JG.sound.play('win');
          }
        }
      }
    };
  }

  JG.lesson = { concepts, quiz, lessonPage, oxPage };
})();

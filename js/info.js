// 풀이 창: 카드나 문제를 길게 누르면(마우스 오른쪽 클릭, 키보드 i) 용어 풀이·해설·키워드·출처를 보여 준다.
// 한 번 본 것은 도감에 쌓인다. 무대 위에 덮어 그리는 창이라 어느 화면에서나 열 수 있다.
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc;
  const TRADE = { rebar: '철근', formwork: '형틀·가설', concrete: '콘크리트', equipment: '장비', safety: '안전', method: '공법' };
  let cur = null;   // { kind: 'card' | 'prob', id } 또는 { kind: 'page', page } (해설·OX처럼 직접 만든 페이지)

  const keywordsOf = o => ['guard', 'rush', 'cure', 'prerequisite'].filter(k => o[k]).map(k => JG.KEYWORDS[k]);
  const source = o => o.loreSource || '검토 중 (교재·표준시방서와 대조 예정)';
  // 이 카드·문제에서 만나는 현장 말
  const slangRow = o => { const s = o.slang && JG.SLANG[o.slang]; return s ? [['현장 말', '"' + s.said + '" → 바른 말: ' + s.proper]] : []; };

  // 창에 넣을 내용: 제목, 그림, 한 줄 정보, [소제목, 글] 목록
  function content() {
    if (cur.kind === 'card') {
      const c = JG.CARDS[cur.id];
      const meta = (c.kind === 'crew' ? '작업팀' : '공법') + ' · ' + TRADE[c.trade] + ' · 코인 ' + c.cost + (c.kind === 'crew' ? ' · 공격 ' + c.atk + ' · 체력 ' + c.hp : '');
      return {
        title: c.name, sprite: cur.id, meta, effect: '카드 효과: ' + c.text,
        rows: [['용어 풀이', c.term], ['알아 두기', c.lore]]
          .concat(keywordsOf(c).map(k => ['키워드 ' + k.name, k.rule + '. 현장에서는: ' + k.meaning]))
          .concat(slangRow(c), [['출처', source(c)]])
      };
    }
    const p = JG.PROBLEMS[cur.id];
    return {
      title: p.name, sprite: cur.id, meta: '현장 문제 · 공격 ' + p.atk + ' · 체력 ' + p.hp + (p.drain ? ' · 현장 턴마다 공기 -' + p.drain : ''),
      effect: '요령: ' + p.tip,
      rows: [['현장에서는', p.lore]]
        .concat(keywordsOf(p).map(k => ['키워드 ' + k.name, k.rule + '. 현장에서는: ' + k.meaning]))
        .concat(slangRow(p), [['출처', source(p)]])
    };
  }

  function spriteSize(name) {
    const pts = JG.SPRITES[name].split(',').map(p => p.trim().split(/\s+/).slice(0, 2).map(parseFloat));
    return [Math.max(...pts.map(p => p[0])) + 3, Math.max(...pts.map(p => p[1])) + 3];
  }

  JG.info = {
    // key: 'card:rebar' 또는 'prob:crack'
    show(key) {
      const [kind, id] = String(key).split(':');
      if (!(kind === 'card' ? JG.CARDS[id] : kind === 'prob' ? JG.PROBLEMS[id] : null)) return false;
      cur = { kind, id };
      JG.progress.discover(kind, id);
      const o = kind === 'card' ? JG.CARDS[id] : JG.PROBLEMS[id];
      if (o.slang) JG.progress.seeSlang(o.slang);
      return true;
    },
    // page: { title, meta, body() → HTML, text() → 읽기 프로그램용 글, click(행동, 번호) (있으면) }
    showPage(page) { cur = { kind: 'page', page }; },
    click(act, n) { if (cur && cur.kind === 'page' && cur.page.click) cur.page.click(act, n); },
    close() { cur = null; },
    isOpen: () => !!cur,

    msg() {
      if (cur.kind === 'page') return cur.page.title + '. ' + cur.page.text();
      const c = content(), end = s => (/[.!?]$/.test(s) ? s : s + '.');   // 문장 끝 마침표는 한 번만
      return [c.title + ' 풀이.', end(c.meta), end(c.effect)].concat(c.rows.map(r => end(r[0] + ': ' + r[1])), '도감에 저장됐어요.').join(' ');
    },

    html() {
      let h = '<div data-act="info-close" aria-hidden="true" style="' + L.at(0, 0, 1440, 810) + ' background: rgba(59, 42, 32, 0.6)"></div>';
      if (cur.kind === 'page') {   // 직접 만든 페이지: 제목, 한 줄 정보, 본문(넘치면 스크롤), 닫기
        const p = cur.page;
        h += '<div role="dialog" aria-modal="true" aria-label="' + esc(p.title) + '" style="' + L.at(330, 105, 780, 600) + ' box-sizing: border-box; ' + L.WOOD + "; font-family: 'Galmuri11', monospace\">";
        h += '<h2 style="' + L.at(24, 18) + ' margin: 0; font-size: 32px; line-height: 32px; font-weight: normal; color: #FFFFFF; ' + L.OUT2 + '">' + esc(p.title) + '</h2>';
        h += '<div style="' + L.at(24, 58, 720) + ' color: #FFE08A; ' + L.OUT1 + '">' + esc(p.meta) + '</div>';
        h += '<div style="' + L.at(15, 84, 744, 420) + ' box-sizing: border-box; ' + L.PAPER + '">'
          + '<div tabindex="0" style="' + L.at(18, 15, 702, 384) + ' overflow-y: auto; line-height: 22px; word-break: keep-all">' + p.body() + '</div></div>';
        h += '<button type="button" data-act="info-close" style="' + L.at(300, 522, 180, 60) + ' ' + L.BTN + '; ' + L.GREEN + '; font-size: 32px; line-height: 32px; color: #FFFFFF; ' + L.OUT2 + '">닫기</button>';
        return h + '</div>';
      }
      const c = content(), [sw, sh] = spriteSize(c.sprite);
      h += '<div role="dialog" aria-modal="true" aria-label="' + esc(c.title) + ' 풀이" style="' + L.at(330, 105, 780, 600) + ' box-sizing: border-box; ' + L.WOOD + "; font-family: 'Galmuri11', monospace\">";
      h += '<h2 style="' + L.at(24, 18) + ' margin: 0; font-size: 32px; line-height: 32px; font-weight: normal; color: #FFFFFF; ' + L.OUT2 + '">' + esc(c.title) + '</h2>';
      h += '<div style="' + L.at(24, 58, 720) + ' color: #FFE08A; ' + L.OUT1 + '">' + esc(c.meta) + '</div>';
      h += '<div style="' + L.at(15, 84, 744, 420) + ' box-sizing: border-box; ' + L.PAPER + '">';
      h += '<div aria-hidden="true" style="' + L.at(18, 18, 120, 150) + ' box-sizing: border-box; ' + L.PAPER + '; background: #FFF6DC">'
        + L.sprite(c.sprite, Math.round((114 - sw) / 2), Math.round((144 - sh) / 2)) + '</div>';
      h += '<div style="' + L.at(156, 18, 564) + ' line-height: 20px; word-break: keep-all">';
      h += '<p style="margin: 0 0 12px; color: #23602A">' + esc(c.effect) + '</p>';
      c.rows.forEach(([head, text]) => {
        h += '<p style="margin: 0 0 10px"><span style="color: #8B3A1E">' + esc(head) + '</span><br>' + esc(text) + '</p>';
      });
      h += '</div>';
      h += '<div style="' + L.at(18, 378) + ' color: #5C3A1E">도감에 저장됐어요</div>';
      h += '</div>';
      h += '<button type="button" data-act="info-close" style="' + L.at(300, 522, 180, 60) + ' ' + L.BTN + '; ' + L.GREEN + '; font-size: 32px; line-height: 32px; color: #FFFFFF; ' + L.OUT2 + '">닫기</button>';
      return h + '</div>';
    }
  };
})();

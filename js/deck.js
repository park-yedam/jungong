// 자재 창고 (덱 편집): 가진 카드로 12장 덱을 짠다. 같은 카드는 최대 2장
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc, R = JG.RULES;
  let deck = [], msg = '';

  const count = id => deck.filter(x => x === id).length;
  const saveDeck = () => { JG.save.data.deck = deck.slice(); JG.save.write(); };

  function spriteSize(name) {
    const pts = JG.SPRITES[name].split(',').map(p => p.trim().split(/\s+/).slice(0, 2).map(parseFloat));
    return [Math.max(...pts.map(p => p[0])) + 3, Math.max(...pts.map(p => p[1])) + 3];
  }

  // 카드 칸 하나 (195×170): 이름 띠, 그림, 능력치, [-] 장수 [+]
  function tile(id, x, y) {
    const c = JG.CARDS[id], n = count(id), [sw, sh] = spriteSize(id), w = 195;
    const canAdd = n < R.maxCopies && deck.length < R.deckSize;
    const meta = (c.kind === 'crew' ? c.atk + '/' + c.hp : '공법') + ' · 코인 ' + c.cost;
    const btn = (act, bx, label, on, aria) => '<button type="button" data-act="' + act + '" aria-label="' + esc(aria) + '"' + (on ? '' : ' aria-disabled="true"')
      + ' style="' + L.at(bx, 132, 48, 30) + ' ' + L.BTN + '; ' + (on ? L.PAPER + '; background: #FFFFFF' : 'background: #CFC8B8; border: 3px solid #8B5A2B; color: #8B5A2B; cursor: default') + '; font-size: 16px">' + label + '</button>';
    return '<div data-info="card:' + id + '" style="' + L.at(x, y, w, 170) + ' box-sizing: border-box; ' + L.PAPER + (n ? '; outline: 3px solid #7BD389' : '') + '">'
      + '<div style="' + L.at(3, 3, w - 12, 24) + ' background: ' + c.band + '; color: #FFFFFF; text-align: center; line-height: 24px; ' + L.OUT1 + '">' + esc(c.name) + (c.expansion ? ' ★' : '') + '</div>'
      + '<div style="' + L.at(0, 30, w - 6, 80) + '">' + L.sprite(id, Math.round((w - 6 - sw) / 2), Math.round((80 - sh) / 2)) + '</div>'
      + '<div style="' + L.at(0, 110, w - 6) + ' text-align: center; color: #5C3A1E">' + esc(meta) + '</div>'
      + btn('minus:' + id, 9, '−', n > 0, c.name + ' 한 장 빼기')
      + '<div aria-hidden="true" style="' + L.at(57, 132, 75, 30) + ' text-align: center; line-height: 30px; font-size: 16px">' + n + '/' + R.maxCopies + '장</div>'
      + btn('plus:' + id, 132, '+', canAdd, c.name + ' 한 장 넣기')
      + '</div>';
  }

  JG.screens.deck = {
    enter() {
      deck = (JG.save.data.deck || JG.STARTER_DECK).filter(id => JG.progress.owned().includes(id));
      msg = '자재 창고예요. +와 −로 덱 12장을 짜요. 같은 카드는 2장까지. 카드를 길게 누르면 풀이가 나와요.';
    },
    msg: () => msg,

    // 행동 이름 뒤에 카드 id가 붙는다 (예: plus:earth → raw = 'earth')
    click(act, n, raw) {
      JG.sound.play('tick');
      if (act === 'title') {
        if (deck.length !== R.deckSize) { msg = '덱을 ' + R.deckSize + '장으로 맞춰 주세요. 지금 ' + deck.length + '장이에요. "기본 덱으로"를 눌러도 돼요.'; return; }
        JG.app.show('title'); return;
      }
      if (act === 'reset') { deck = JG.STARTER_DECK.slice(); saveDeck(); msg = '기본 덱 12장으로 되돌렸어요.'; return; }
      const id = raw, c = JG.CARDS[id];
      if (act === 'plus') {
        if (count(id) >= R.maxCopies) { msg = JG.engine.eun(c.name) + ' ' + R.maxCopies + '장까지만 넣을 수 있어요.'; return; }
        if (deck.length >= R.deckSize) { msg = '덱이 꽉 찼어요. 다른 카드를 먼저 빼 주세요.'; return; }
        deck.push(id); saveDeck(); msg = c.name + ' 넣기. 덱 ' + deck.length + '/' + R.deckSize + '장.';
      }
      if (act === 'minus') {
        const k = deck.indexOf(id);
        if (k < 0) return;
        deck.splice(k, 1); saveDeck(); msg = c.name + ' 빼기. 덱 ' + deck.length + '/' + R.deckSize + '장.';
      }
    },

    render() {
      const ids = JG.progress.owned(), full = deck.length === R.deckSize;
      const exp = ids.filter(id => JG.CARDS[id].expansion).length, expAll = Object.keys(JG.CARDS).filter(id => JG.CARDS[id].expansion).length;
      let h = '<div style="' + L.ROOT + '; background: #A9CFE0">';
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 120) + ' background: #D9A066"></div>';
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 12) + ' background: #8BC34A; box-shadow: inset 0 -6px 0 #6FA83A"></div>';
      h += '<div style="' + L.at(84, 24, 1272, 642) + ' box-sizing: border-box; ' + L.WOOD + '">';
      h += '<h1 style="' + L.at(24, 15) + ' margin: 0; font-size: 32px; line-height: 32px; font-weight: normal; color: #FFFFFF; ' + L.OUT2 + '">자재 창고</h1>';
      h += '<div style="' + L.at(240, 24) + ' color: #FFE08A; ' + L.OUT1 + '">확장 카드(★) ' + exp + '/' + expAll + '장 보유 · 현장을 처음 준공하면 2장씩 받아요</div>';
      h += '<div style="' + L.at(870, 12, 168, 42) + ' box-sizing: border-box; ' + L.PAPER + '; text-align: center; line-height: 36px; font-size: 16px; color: ' + (full ? '#23602A' : '#B83E3C') + '">덱 ' + deck.length + '/' + R.deckSize + '장</div>';
      h += '<button type="button" data-act="reset" style="' + L.at(1050, 12, 192, 42) + ' ' + L.BTN + '; ' + L.PAPER + '">기본 덱으로</button>';
      h += '<div style="' + L.at(15, 66, 1236, 555) + ' box-sizing: border-box; background: #6B4420; border: 3px solid #3B2A20">';
      ids.forEach((id, i) => { h += tile(id, (i % 6) * 207, 9 + Math.floor(i / 6) * 182); });
      h += '</div></div>';
      h += '<button type="button" data-act="title" style="' + L.at(84, 714, 240, 72) + ' ' + L.BTN + '; ' + L.PAPER + '">◀ 타이틀로</button>';
      h += '<p style="' + L.at(348, 714, 1008, 72) + ' margin: 0; box-sizing: border-box; padding: 0 18px; ' + L.PAPER + '; line-height: 66px; white-space: nowrap; overflow: hidden">' + esc(msg) + '</p>';
      return h + '</div>';
    }
  };
})();

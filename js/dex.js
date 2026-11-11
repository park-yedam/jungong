// 도감 화면: 풀이를 본 카드·현장 문제, 만난 현장 말이 쌓인다. 본 칸을 누르면 풀이 창이 다시 열린다
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc;
  const TABS = [['card', '카드'], ['prob', '현장 문제'], ['slang', '현장 말']];
  let tab = 'card', msg = '';

  const d = () => JG.save.data;
  const counts = () => ({
    card: [d().dex.cards.length, Object.keys(JG.CARDS).length],
    prob: [d().dex.probs.length, Object.keys(JG.PROBLEMS).length],
    slang: [d().slang.length, Object.keys(JG.SLANG).length]
  });

  function spriteSize(name) {
    const pts = JG.SPRITES[name].split(',').map(p => p.trim().split(/\s+/).slice(0, 2).map(parseFloat));
    return [Math.max(...pts.map(p => p[0])) + 3, Math.max(...pts.map(p => p[1])) + 3];
  }

  // 카드·문제 칸 하나 (228×250). 본 것은 그림과 이름, 못 본 것은 ??? 와 찾는 방법
  function tile(kind, id, x, y) {
    const o = kind === 'card' ? JG.CARDS[id] : JG.PROBLEMS[id];
    const seen = d().dex[kind === 'card' ? 'cards' : 'probs'].includes(id);
    if (!seen) {
      const hint = kind === 'card' && o.expansion ? '현장을 처음 준공하면 받아요' : '대전에서 길게 눌러 보세요';
      return '<div style="' + L.at(x, y, 228, 250) + ' box-sizing: border-box; background: #D9C08A; border: 3px dashed #8B5A2B; text-align: center">'
        + '<div style="' + L.at(0, 84, 222) + ' font-size: 32px; line-height: 32px; color: #8B5A2B">???</div>'
        + '<div style="' + L.at(12, 150, 198) + ' line-height: 20px; color: #5C3A1E; word-break: keep-all">' + esc(hint) + '</div></div>';
    }
    const [sw, sh] = spriteSize(id), band = kind === 'card' ? o.band : '#E85D3A';
    const sub = kind === 'card' ? (o.kind === 'crew' ? '작업팀' : '공법') + ' · 코인 ' + o.cost : '공격 ' + o.atk + ' · 체력 ' + o.hp;
    return '<button type="button" data-act="info:' + kind + ':' + id + '" aria-label="' + esc(o.name + ' 풀이 보기') + '" style="' + L.at(x, y, 228, 250) + ' ' + L.BTN + '; ' + L.PAPER + '">'
      + '<span style="' + L.at(6, 6, 210, 30) + ' display: block; background: ' + band + '; color: #FFFFFF; line-height: 30px; ' + L.OUT1 + '">' + esc(o.name) + '</span>'
      + L.sprite(id, Math.round((222 - sw) / 2), 48 + Math.round((120 - sh) / 2))
      + '<span style="' + L.at(0, 180, 222) + ' display: block; color: #5C3A1E">' + esc(sub) + '</span>'
      + '<span style="' + L.at(0, 208, 222) + ' display: block; color: #3E5C8A">눌러서 풀이 보기</span></button>';
  }

  function slangRow(id, i) {
    const s = JG.SLANG[id], seen = d().slang.includes(id), y = 24 + i * 92;
    return '<div style="' + L.at(24, y, 1188, 80) + ' box-sizing: border-box; ' + (seen ? L.PAPER : 'background: #D9C08A; border: 3px dashed #8B5A2B') + '">'
      + '<div style="' + L.at(18, 12) + ' font-size: 32px; line-height: 32px">' + esc(seen ? s.said + ' → ' + s.proper : '??? → ???') + '</div>'
      + '<div style="' + L.at(18, 50) + ' color: #5C3A1E">' + esc(seen ? '현장에서 쓰는 말 → 바른 말' : '아직 못 만났어요') + '</div>'
      + '<div style="' + L.at(720, 30, 450) + ' text-align: right; color: #8B3A1E">나오는 곳: ' + esc(s.where) + '</div></div>';
  }

  JG.screens.dex = {
    enter() { tab = 'card'; msg = '도감이에요. 대전에서 카드나 문제를 길게 누르면 풀이가 쌓여요.'; },
    msg: () => msg,

    click(act, n) {
      JG.sound.play('tick');
      if (act === 'title') { JG.app.show('title'); return; }
      if (act === 'tab') { tab = TABS[n][0]; const [a, b] = counts()[tab]; msg = TABS[n][1] + ' 도감: ' + b + '개 중 ' + a + '개를 모았어요.'; }
    },

    render() {
      const c = counts();
      let h = '<div style="' + L.ROOT + '; background: #A9CFE0">';
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 120) + ' background: #D9A066"></div>';
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 12) + ' background: #8BC34A; box-shadow: inset 0 -6px 0 #6FA83A"></div>';
      h += '<div style="' + L.at(84, 24, 1272, 642) + ' box-sizing: border-box; ' + L.WOOD + '">';
      h += '<h1 style="' + L.at(24, 15) + ' margin: 0; font-size: 32px; line-height: 32px; font-weight: normal; color: #FFFFFF; ' + L.OUT2 + '">도감</h1>';
      // 탭
      TABS.forEach(([id, name], i) => {
        const on = tab === id;
        h += '<button type="button" data-act="tab:' + i + '" aria-pressed="' + on + '" style="' + L.at(390 + i * 288, 9, 276, 48) + ' ' + L.BTN + '; '
          + (on ? L.PAPER : 'background: #CF965C; border: 3px solid #3B2A20') + '">' + esc(name + ' ' + c[id][0] + '/' + c[id][1]) + '</button>';
      });
      h += '<div style="' + L.at(15, 66, 1236, 555) + ' box-sizing: border-box; background: #6B4420; border: 3px solid #3B2A20">';
      if (tab === 'slang') {
        Object.keys(JG.SLANG).forEach((id, i) => { h += slangRow(id, i); });
      } else {
        const ids = Object.keys(tab === 'card' ? JG.CARDS : JG.PROBLEMS);
        ids.forEach((id, i) => { h += tile(tab, id, 12 + (i % 5) * 243, 12 + Math.floor(i / 5) * 268); });
      }
      h += '</div></div>';
      h += '<button type="button" data-act="title" style="' + L.at(84, 714, 240, 72) + ' ' + L.BTN + '; ' + L.PAPER + '">◀ 타이틀로</button>';
      h += '<p style="' + L.at(348, 714, 1008, 72) + ' margin: 0; box-sizing: border-box; padding: 0 18px; ' + L.PAPER + '; line-height: 66px; white-space: nowrap; overflow: hidden">' + esc(msg) + '</p>';
      return h + '</div>';
    }
  };
})();

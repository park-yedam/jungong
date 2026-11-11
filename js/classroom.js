// 수업용 현장 (시나리오 코드): 왼쪽에서 현장 조건·벽돌 수·문제·턴 시간을 골라 6자리 코드를 만들고,
// 오른쪽에서 받은 코드를 넣어 같은 현장을 연다. 현장 게시판에서 들어온다.
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc, S = JG.scenario;
  const COND_NAMES = ['맑음', '집중호우', '한파', '연약지반'];
  let opts, typed = '', opened = null, openErr = '', msg = '';

  const code = () => S.encode(opts);
  const condName = c => (c ? JG.CONDITIONS[c].name : '맑음');
  const summary = o => '조건 ' + condName(o.condition) + ' · 벽돌 ' + o.bricks + '칸(' + o.bricks / 4 + '층) · 턴 ' + (o.turnSeconds ? o.turnSeconds + '초' : '제한 없음');

  // 고르기 버튼 (고른 것은 초록)
  function pick(act, x, y, w, label, on, aria) {
    return '<button type="button" data-act="' + act + '" aria-pressed="' + on + '" aria-label="' + esc(aria || label) + '" style="' + L.at(x, y, w, 44) + ' ' + L.BTN + '; '
      + (on ? L.GREEN + '; color: #FFFFFF; ' + L.OUT1 : 'background: #FFFFFF; border: 3px solid #3B2A20') + '">' + esc(label) + '</button>';
  }
  const label = (x, y, text) => '<div style="' + L.at(x, y) + ' color: #8B3A1E; line-height: 44px">' + esc(text) + '</div>';
  const button = (act, x, y, w, h, text, green) => '<button type="button" data-act="' + act + '" style="' + L.at(x, y, w, h) + ' ' + L.BTN + '; '
    + (green ? L.GREEN + '; color: #FFFFFF; font-size: 32px; line-height: 32px; ' + L.OUT2 : L.PAPER + '; background: #FFFFFF') + '">' + esc(text) + '</button>';

  JG.screens.classroom = {
    enter() {
      opts = { condition: null, bricks: 20, problems: ['crack', 'noise', 'leak'], turnSeconds: 0, seed: 1 };
      typed = ''; opened = null; openErr = '';
      msg = '수업용 현장이에요. 조건을 고르면 6자리 코드가 생겨요. 코드를 나누면 모두 같은 현장을 해요. (별·칭호에는 기록되지 않아요)';
    },
    msg: () => msg,
    afterRender(stage) {
      const input = stage.querySelector('#code-in');
      if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') { typed = input.value; this.click('open'); JG.app.render(); } });
    },

    click(act, n) {
      const input = document.getElementById('code-in');
      if (input) typed = input.value;   // 다시 그리기 전에 입력한 글자를 챙긴다
      JG.sound.play('tick');
      if (act === 'back') { JG.app.show('sites'); return; }
      if (act === 'cond') opts.condition = S.CONDS[n];
      if (act === 'bricks') opts.bricks = S.BRICKS[n];
      if (act === 'timer') opts.turnSeconds = S.TIMERS[n];
      if (act === 'prob') {
        const id = S.PROBS[n], has = opts.problems.includes(id);
        if (has && opts.problems.length === 1) { msg = '문제는 적어도 하나는 골라야 해요.'; return; }
        opts.problems = has ? opts.problems.filter(x => x !== id) : opts.problems.concat(id);
      }
      if (act === 'reroll') { opts.seed = (opts.seed + 1) % 16384; msg = '문제 순서를 바꿨어요. 코드도 바뀌어요.'; }
      if (['cond', 'bricks', 'timer', 'prob'].includes(act)) msg = '코드 ' + code() + ' · ' + summary(opts) + ' · 문제 ' + opts.problems.length + '종';
      if (act === 'copy') {
        const c = code();
        JG.copyText(c).then(ok => { msg = ok ? '복사했어요: 코드 ' + c + '. 학생들에게 나눠 주세요.' : '복사가 막혀 있어요. 코드 ' + c + ' 여섯 글자를 옮겨 적어 주세요.'; JG.app.render(); });
      }
      if (act === 'start') { JG.app.show('tbm', { scenario: code() }); return; }
      if (act === 'open') {
        opened = S.decode(typed);
        openErr = opened ? '' : '코드가 맞지 않아요. 6자리를 다시 확인해 주세요.';
        msg = opened ? '코드 ' + opened.code + ' 현장: ' + summary(opened) : openErr;
      }
      if (act === 'startOpened' && opened) { JG.app.show('tbm', { scenario: opened.code }); return; }
    },

    render() {
      const site = S.siteFor(opts), c = code();
      let h = '<div style="' + L.ROOT + '; background: #A9CFE0">';
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 120) + ' background: #D9A066"></div>';
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 12) + ' background: #8BC34A; box-shadow: inset 0 -6px 0 #6FA83A"></div>';

      // 왼쪽: 만들기
      h += '<div style="' + L.at(84, 24, 780, 642) + ' box-sizing: border-box; ' + L.WOOD + '">';
      h += '<h1 style="' + L.at(24, 15) + ' margin: 0; font-size: 32px; line-height: 32px; font-weight: normal; color: #FFFFFF; ' + L.OUT2 + '">수업용 현장 만들기</h1>';
      h += '<div style="' + L.at(15, 66, 744, 555) + ' box-sizing: border-box; ' + L.PAPER + '">';
      h += label(18, 15, '현장 조건');
      COND_NAMES.forEach((name, i) => { h += pick('cond:' + i, 150 + i * 146, 15, 138, name, opts.condition === S.CONDS[i], '현장 조건 ' + name); });
      h += label(18, 71, '벽돌 수');
      S.BRICKS.forEach((b, i) => { h += pick('bricks:' + i, 150 + i * 146, 71, 138, b + '칸 · ' + b / 4 + '층', opts.bricks === b, '벽돌 ' + b + '칸'); });
      h += label(18, 127, '나오는 문제');
      S.PROBS.forEach((id, i) => { h += pick('prob:' + i, 150 + (i % 4) * 146, 127 + Math.floor(i / 4) * 52, 138, JG.PROBLEMS[id].name, opts.problems.includes(id), '나오는 문제 ' + JG.PROBLEMS[id].name); });
      h += label(18, 235, '턴 시간');
      S.TIMERS.forEach((t, i) => { h += pick('timer:' + i, 150 + i * 146, 235, 138, t ? t + '초' : '제한 없음', opts.turnSeconds === t, '턴 시간 ' + (t ? t + '초' : '제한 없음')); });
      h += label(18, 291, '문제 순서');
      h += '<p style="' + L.at(150, 300, 400) + ' margin: 0; line-height: 20px; word-break: keep-all">' + esc(site.forecast.map(id => JG.PROBLEMS[id].name).join(' → ')) + '</p>';
      h += button('reroll', 570, 291, 150, 44, '다른 순서로');
      h += '<div aria-hidden="true" style="' + L.at(18, 384, 702, 3) + ' background: #E0C998"></div>';
      h += label(18, 412, '코드');
      h += '<div aria-label="코드 ' + esc(c.split('').join(' ')) + '" style="' + L.at(150, 404, 300, 60) + ' box-sizing: border-box; background: #FFFFFF; border: 3px solid #3B2A20; text-align: center; font-size: 48px; line-height: 54px; letter-spacing: 6px">' + esc(c) + '</div>';
      h += button('copy', 466, 404, 254, 60, '코드 복사');
      h += button('start', 150, 476, 570, 60, '이 현장으로 시작', true);
      h += '</div></div>';

      // 오른쪽: 코드로 열기
      h += '<div style="' + L.at(888, 24, 468, 642) + ' box-sizing: border-box; ' + L.WOOD + '">';
      h += '<h2 style="' + L.at(24, 15) + ' margin: 0; font-size: 32px; line-height: 32px; font-weight: normal; color: #FFFFFF; ' + L.OUT2 + '">코드로 열기</h2>';
      h += '<div style="' + L.at(15, 66, 432, 555) + ' box-sizing: border-box; ' + L.PAPER + '">';
      h += '<p style="' + L.at(18, 15, 390) + ' margin: 0; line-height: 20px; word-break: keep-all">교수님이나 친구에게 받은 6자리 코드를 넣고 열기를 누르세요.</p>';
      h += '<input id="code-in" type="text" maxlength="8" autocomplete="off" spellcheck="false" aria-label="시나리오 코드 6자리" value="' + esc(typed) + '" style="' + L.at(18, 66, 390, 64)
        + " box-sizing: border-box; padding: 0 12px; font-family: 'Galmuri11', monospace; font-size: 32px; text-transform: uppercase; letter-spacing: 6px; color: #3B2A20; background: #FFFFFF; border: 3px solid #3B2A20\">";
      h += button('open', 18, 142, 390, 54, '열기');
      if (openErr) h += '<p style="' + L.at(18, 214, 390) + ' margin: 0; color: #B83E3C; line-height: 20px">' + esc(openErr) + '</p>';
      if (opened) {
        const os = S.siteFor(opened);
        h += '<p style="' + L.at(18, 214, 390) + ' margin: 0; line-height: 22px; word-break: keep-all">'
          + '<span style="color: #8B3A1E">코드 ' + esc(opened.code) + '</span><br>' + esc(summary(opened)) + '<br>'
          + '문제: ' + esc(opened.problems.map(id => JG.PROBLEMS[id].name).join(', ')) + '<br>'
          + '<span style="color: #5C3A1E">순서: ' + esc(os.forecast.map(id => JG.PROBLEMS[id].name).join(' → ')) + '</span></p>';
        h += button('startOpened', 18, 476, 390, 60, '이 현장 시작', true);
      }
      h += '</div></div>';

      h += '<button type="button" data-act="back" style="' + L.at(84, 714, 240, 72) + ' ' + L.BTN + '; ' + L.PAPER + '">◀ 게시판으로</button>';
      h += '<p style="' + L.at(348, 714, 1008, 72) + ' margin: 0; box-sizing: border-box; padding: 0 18px; ' + L.PAPER + '; line-height: 66px; white-space: nowrap; overflow: hidden">' + esc(msg) + '</p>';
      return h + '</div>';
    }
  };
})();

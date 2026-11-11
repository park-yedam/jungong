// 설정 화면: 효과음, 배경음 켜고 끄기
(() => {
  const JG = globalThis.JG, L = JG.look, esc = JG.esc;
  const ITEMS = [['sfx', '효과음', '망치 "통", 코인 "짤랑", 층 완성 "빰!"'], ['bgm', '배경음', '낮·밤 칩튠 (9턴부터 밤 곡)']];
  let msg = '';

  JG.screens.settings = {
    enter() { msg = '설정이에요. 소리를 켜고 끌 수 있어요.'; },
    msg: () => msg,

    click(act, n) {
      if (act === 'title') { JG.sound.play('tick'); JG.app.show('title'); return; }
      if (act === 'toggle') {
        const [kind, name] = ITEMS[n], on = !JG.save.data.settings[kind];
        JG.sound.set(kind, on);
        msg = name + '을 ' + (on ? '켰어요.' : '껐어요.');
        if (kind === 'sfx' && on) JG.sound.play('coin');
      }
      if (act === 'test') { JG.sound.play('floor'); msg = '층 완성 소리 "빰!"' + (JG.save.data.settings.sfx ? '' : ' (효과음이 꺼져 있어요)'); }
    },

    render() {
      const s = JG.save.data.settings;
      let h = '<div style="' + L.ROOT + '; background: #A9CFE0">';
      h += L.sprite('cloud', 160, 90) + L.sprite('cloud', 1180, 140);
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 120) + ' background: #D9A066"></div>';
      h += '<div aria-hidden="true" style="' + L.at(0, 690, 1440, 12) + ' background: #8BC34A; box-shadow: inset 0 -6px 0 #6FA83A"></div>';
      h += '<div style="' + L.at(390, 120, 660, 450) + ' box-sizing: border-box; ' + L.WOOD + '">';
      h += '<h1 style="' + L.at(0, 21, 654) + ' margin: 0; text-align: center; font-size: 32px; line-height: 32px; font-weight: normal; color: #FFFFFF; ' + L.OUT2 + '">설정</h1>';
      ITEMS.forEach(([kind, name, desc], i) => {
        const on = s[kind], y = 81 + i * 120;
        h += '<div style="' + L.at(24, y, 606, 102) + ' box-sizing: border-box; ' + L.PAPER + '">'
          + '<div style="' + L.at(18, 18) + ' font-size: 32px; line-height: 32px">' + esc(name) + '</div>'
          + '<div style="' + L.at(18, 62, 360) + ' color: #5C3A1E">' + esc(desc) + '</div>'
          + '<button type="button" data-act="toggle:' + i + '" aria-pressed="' + on + '" aria-label="' + esc(name + ' ' + (on ? '켜짐. 누르면 꺼요' : '꺼짐. 누르면 켜요')) + '" style="' + L.at(408, 18, 174, 60) + ' ' + L.BTN + '; '
          + (on ? L.GREEN + '; color: #FFFFFF; ' + L.OUT2 : 'background: #CFC8B8; border: 3px solid #3B2A20') + '; font-size: 32px; line-height: 32px">' + (on ? '켜짐' : '꺼짐') + '</button></div>';
      });
      h += '<button type="button" data-act="test" style="' + L.at(24, 330, 606, 54) + ' ' + L.BTN + '; ' + L.PAPER + '">소리 들어 보기 (층 완성 "빰!")</button>';
      h += '<div style="' + L.at(0, 400, 654) + ' text-align: center; color: #FFE08A; ' + L.OUT1 + '">처음 한 번 화면을 누른 뒤부터 소리가 나요</div>';
      h += '</div>';
      h += '<button type="button" data-act="title" style="' + L.at(84, 714, 240, 72) + ' ' + L.BTN + '; ' + L.PAPER + '">◀ 타이틀로</button>';
      h += '<p style="' + L.at(348, 714, 1008, 72) + ' margin: 0; box-sizing: border-box; padding: 0 18px; ' + L.PAPER + '; line-height: 66px; white-space: nowrap; overflow: hidden">' + esc(msg) + '</p>';
      return h + '</div>';
    }
  };
})();

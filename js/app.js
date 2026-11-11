// 앱 뼈대: 저장, 진행 상황, 화면 전환, 무대 크기 맞추기, 공통 모양
// 화면(JG.screens.이름)은 { enter(값), render() → HTML 문자열, click(행동, 번호), msg() → 안내 문구 }를 가진다.
(() => {
  const JG = globalThis.JG;
  const stage = document.getElementById('stage'), live = document.getElementById('live');
  JG.screens = {};
  JG.esc = x => String(x).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  // ---------- 저장 (브라우저 localStorage). 저장이 막혀 있어도 게임은 돌아간다 ----------
  const KEY = 'jungong.save.v1';
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d && d.v === 1) return d;
    } catch (e) { /* 저장소를 못 쓰면 새로 시작 */ }
    return { v: 1, best: {}, game: null };   // best: 현장별 최고 별, game: 하던 판
  }
  JG.save = {
    data: load(),
    write() { try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch (e) { /* 저장 못 해도 계속 */ } }
  };

  // ---------- 진행 상황: 현장은 앞 현장을 준공하면 열린다 ----------
  JG.progress = {
    best: id => JG.save.data.best[id] || 0,
    unlocked: i => i === 0 || JG.progress.best(JG.SITES[i - 1].id) > 0,
    // 빠른 시작: 열려 있고 아직 준공 못 한 첫 현장, 다 깼으면 마지막 현장
    nextSite: () => JG.SITES.find((s, i) => JG.progress.unlocked(i) && !JG.progress.best(s.id)) || JG.SITES[JG.SITES.length - 1],
    totalStars: () => JG.SITES.reduce((n, s) => n + JG.progress.best(s.id), 0),
    record(siteId, stars) {
      JG.save.data.best[siteId] = Math.max(JG.progress.best(siteId), stars);
      JG.save.write();
    }
  };

  // ---------- 공통 모양 (도트 디자인 시안의 나무·종이 패널) ----------
  const outline = n => 'text-shadow: ' + [[n, 0], [-n, 0], [0, n], [0, -n], [n, n], [-n, n], [n, -n], [-n, -n]].map(([x, y]) => x + 'px ' + y + 'px #3B2A20').join(', ');
  JG.look = {
    ROOT: "position: relative; width: 1440px; height: 810px; overflow: hidden; font-family: 'Galmuri11', monospace; font-size: 16px; line-height: 16px; color: #3B2A20; -webkit-font-smoothing: none",
    OUT1: outline(1), OUT2: outline(2), OUT4: outline(4),
    WOOD: 'background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420',
    PAPER: 'background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998',
    GREEN: 'background: #5BB65F; border: 3px solid #3B2A20; box-shadow: inset 0 -6px 0 #3E8C42, inset 0 3px 0 #8FD493',
    BTN: 'padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box',
    PULSE: 'outline: 3px solid #7BD389; outline-offset: 3px; animation: pulse 0.8s steps(2) infinite',
    at: (x, y, w, h) => 'position: absolute; left: ' + x + 'px; top: ' + y + 'px;' + (w != null ? ' width: ' + w + 'px;' : '') + (h != null ? ' height: ' + h + 'px;' : ''),
    sprite: (name, x, y) => '<div aria-hidden="true" style="position: absolute; left: ' + x + 'px; top: ' + y + 'px; width: 3px; height: 3px; box-shadow: ' + JG.SPRITES[name] + '"></div>'
  };

  // ---------- 화면 전환과 그리기 ----------
  let screen = null;
  JG.app = {
    show(name, arg) {
      screen = JG.screens[name];
      if (screen.enter) screen.enter(arg);
      JG.app.render();
    },
    render() {
      const focused = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.act : null;
      stage.innerHTML = screen.render();
      const msg = screen.msg ? screen.msg() : '';
      if (live.textContent !== msg) live.textContent = msg;
      if (focused) { const el = stage.querySelector('[data-act="' + focused + '"]'); if (el) el.focus(); }
    }
  };

  // 누를 수 있는 곳은 data-act="행동:번호"로 표시한다
  stage.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || !screen) return;
    const [act, n] = el.dataset.act.split(':');
    const before = screen;
    screen.click(act, Number(n));
    if (screen === before) JG.app.render();   // 화면이 바뀌었으면 show()가 이미 그렸다
  });

  // 1440×810 무대를 창에 꽉 차게 (비율 유지, 가운데 정렬)
  function fit() {
    const k = Math.min(innerWidth / 1440, innerHeight / 810);
    stage.style.transform = 'translate(' + (innerWidth - 1440 * k) / 2 + 'px, ' + (innerHeight - 810 * k) / 2 + 'px) scale(' + k + ')';
  }
  addEventListener('resize', fit);
  fit();
  document.getElementById('rotate-close').addEventListener('click', () => document.body.classList.add('rotate-ok'));

  // 모든 화면 파일이 읽힌 뒤 타이틀부터 시작
  addEventListener('DOMContentLoaded', () => JG.app.show('title'));
})();

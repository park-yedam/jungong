// 앱 뼈대: 저장, 진행 상황, 화면 전환, 무대 크기 맞추기, 공통 모양
// 화면(JG.screens.이름)은 { enter(값), render() → HTML 문자열, click(행동, 번호), msg() → 안내 문구,
//   afterRender(무대), music() → 'day' | 'night' (둘 다 있으면) }를 가진다.
(() => {
  const JG = globalThis.JG;
  const stage = document.getElementById('stage'), live = document.getElementById('live');
  JG.screens = {};
  JG.esc = x => String(x).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  // ---------- 저장 (브라우저 localStorage). 저장이 막혀 있어도 게임은 돌아간다 ----------
  const KEY = 'jungong.save.v1';
  // best: 현장별 최고 별, stars: 모은 별(누적), cards: 받은 확장 카드, slang: 본 현장 말,
  // dex: 풀이를 본 카드·문제(도감), settings: 소리·난이도 설정, deck: 자재 창고에서 고른 덱(없으면 기본 덱),
  // daily: 데일리 현장 날짜별 최고 별, game: 하던 판
  function load() {
    const d = { v: 1, best: {}, stars: 0, cards: [], slang: [], dex: { cards: [], probs: [] }, settings: { sfx: true, bgm: true, difficulty: 'normal' }, deck: null, daily: {}, game: null };
    try {
      const old = JSON.parse(localStorage.getItem(KEY));
      if (old && old.v === 1) Object.assign(d, old, { settings: Object.assign(d.settings, old.settings) });
    } catch (e) { /* 저장소를 못 쓰면 새로 시작 */ }
    if (d.game && !d.game.rec) d.game = null;   // 3단계 때 저장된 판은 기록 칸이 없어 이어할 수 없다
    // 이미 준공한 현장의 보상 카드는 모두 갖게 한다 (4단계 때는 현장마다 1장이었다)
    JG.SITES.forEach(s => {
      if (d.best[s.id]) [].concat(s.reward || []).forEach(id => { if (!d.cards.includes(id)) d.cards.push(id); if (!d.dex.cards.includes(id)) d.dex.cards.push(id); });
    });
    return d;
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
    totalStars: () => JG.save.data.stars,
    rankOf: n => JG.RANKS.filter(r => n >= r.stars).length - 1,   // 모은 별 n개일 때 칭호 번호
    // 준공 기록: 최고 별, 모은 별, 처음 준공이면 확장 카드들. 결과 화면에 쓸 정보를 돌려준다
    record(siteId, stars) {
      const d = JG.save.data, site = JG.SITES.find(s => s.id === siteId);
      const first = !JG.progress.best(siteId), before = d.stars;
      d.best[siteId] = Math.max(JG.progress.best(siteId), stars);
      d.stars += stars;
      const rewards = first ? [].concat(site.reward || []).filter(id => !d.cards.includes(id)) : [];
      rewards.forEach(id => {
        d.cards.push(id);
        if (!d.dex.cards.includes(id)) d.dex.cards.push(id);   // 받은 카드는 도감에도
        if (JG.CARDS[id].slang) JG.progress.seeSlang(JG.CARDS[id].slang);
      });
      JG.save.write();
      return { stars, first, rewards, totalBefore: before, total: d.stars, rankBefore: JG.progress.rankOf(before), rank: JG.progress.rankOf(d.stars) };
    },
    // 데일리 현장 준공 기록: 그날의 최고 별, 모은 별 (보상 카드는 없음)
    recordDaily(key, stars) {
      const d = JG.save.data, before = d.stars, first = !d.daily[key];
      d.daily[key] = Math.max(d.daily[key] || 0, stars);
      d.stars += stars;
      JG.save.write();
      return { stars, first, rewards: [], daily: true, totalBefore: before, total: d.stars, rankBefore: JG.progress.rankOf(before), rank: JG.progress.rankOf(d.stars) };
    },
    // 수업용 현장(시나리오 코드)은 연습용: 별·칭호·카드를 바꾸지 않는다
    recordScenario(stars) {
      const d = JG.save.data, r = JG.progress.rankOf(d.stars);
      return { stars, first: false, rewards: [], scenario: true, counted: false, totalBefore: d.stars, total: d.stars, rankBefore: r, rank: r };
    },
    // 자재 창고에서 쓸 수 있는 카드: 기본 카드 + 받은 확장 카드
    owned: () => Object.keys(JG.CARDS).filter(id => !JG.CARDS[id].expansion || JG.save.data.cards.includes(id)),
    seeSlang(id) {
      if (JG.save.data.slang.includes(id)) return;
      JG.save.data.slang.push(id);
      JG.save.write();
    },
    // 풀이를 본 카드(kind 'card')·문제('prob')를 도감에 넣는다
    discover(kind, id) {
      const list = JG.save.data.dex[kind === 'card' ? 'cards' : 'probs'];
      if (list.includes(id)) return;
      list.push(id);
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
    // 버튼 안에도 넣을 수 있게 span으로 그린다
    sprite: (name, x, y) => '<span aria-hidden="true" style="display: block; position: absolute; left: ' + x + 'px; top: ' + y + 'px; width: 3px; height: 3px; box-shadow: ' + JG.SPRITES[name] + '"></span>'
  };

  // 글을 클립보드에 복사 (데일리 결과, 시나리오 코드). 클립보드가 막혀 있으면 옛 방식으로. 성공하면 true
  JG.copyText = text => {
    const old = () => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      return ok;
    };
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, old);
    return Promise.resolve(old());
  };

  // 현장소장 그림: 용어 OX를 다 맞히면 금색 안전모 (흰 안전모 색 세 가지만 금색으로 바꾼다)
  JG.bossSprite = () => {
    if (JG.save.data.helmet !== 'gold') return 'boss';
    if (!JG.SPRITES.boss_gold) JG.SPRITES.boss_gold = JG.SPRITES.boss.replace(/#F4F1E8/g, '#F7C948').replace(/#FFFFFF/g, '#FFF3B0').replace(/#CFC8B8/g, '#C99A1A');
    return 'boss_gold';
  };

  // ---------- 화면 전환과 그리기 ----------
  let screen = null;
  JG.app = {
    hub: 'title',   // 돌아갈 곳: 타이틀 또는 우리 회사 단지 (도감·자재 창고·설정·게시판의 ◀ 버튼)
    hubLabel: () => (JG.app.hub === 'complex' ? '◀ 단지로' : '◀ 타이틀로'),
    show(name, arg) {
      if (screen && screen.leave) screen.leave();   // 떠나는 화면 정리 (턴 시간 등)
      if (name === 'title' || name === 'complex') JG.app.hub = name;
      screen = JG.screens[name];
      if (screen.enter) screen.enter(arg);
      JG.app.render();
    },
    render() {
      const focused = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.act : null;
      const infoOpen = JG.info.isOpen();
      stage.innerHTML = screen.render() + (infoOpen ? JG.info.html() : '');   // 풀이 창은 화면 위에 덮어 그린다
      if (screen.afterRender) screen.afterRender(stage);   // 캔버스 그림 등 HTML 뒤에 그려야 하는 것
      JG.sound.music(screen.music ? screen.music() : 'day');
      const msg = infoOpen ? JG.info.msg() : (screen.msg ? screen.msg() : '');
      if (live.textContent !== msg) live.textContent = msg;
      if (infoOpen) {   // 창 안에 고를 버튼(OX 등)이 있으면 그것, 없으면 닫기에 초점
        const el = stage.querySelector('[role=dialog] button[data-act]:not([data-act="info-close"])') || stage.querySelector('button[data-act="info-close"]');
        if (el) el.focus();
        return;
      }
      const target = focused === 'info-close' ? infoOpener : focused;
      if (target) { const el = stage.querySelector('button[data-act="' + target + '"]'); if (el) el.focus(); }
    }
  };

  // ---------- 누르기 ----------
  // 누를 수 있는 곳은 data-act="행동:번호", 풀이가 있는 곳은 data-info="card:id" 또는 "prob:id"
  let infoOpener = null, pressTimer = null, pressAt = null, longFired = false;
  function openInfo(el) {
    if (!JG.info.show(el.dataset.info)) return;
    infoOpener = el.dataset.act || null;
    JG.sound.play('tick');
    JG.app.render();
  }

  stage.addEventListener('click', e => {
    if (longFired) { longFired = false; return; }   // 길게 누른 뒤 손을 뗄 때 생기는 클릭은 무시
    const el = e.target.closest('[data-act]');
    if (!el || !screen) return;
    const parts = el.dataset.act.split(':');
    if (JG.info.isOpen()) {   // 풀이 창이 열려 있으면 닫기, 또는 창 안의 버튼(OX 등)만 받는다
      if (parts[0] === 'info-close') JG.info.close();
      else JG.info.click(parts[0], Number(parts[1]));
      JG.app.render();
      return;
    }
    if (parts[0] === 'info') { openInfo({ dataset: { info: parts.slice(1).join(':'), act: el.dataset.act } }); return; }   // 도감 칸 누르기
    const before = screen;
    screen.click(parts[0], Number(parts[1]), parts[1]);   // 번호, 그리고 글자 그대로(카드 id 등)
    if (screen === before) JG.app.render();   // 화면이 바뀌었으면 show()가 이미 그렸다
  });

  // 길게 누르기 (0.5초). 손가락이 10px 넘게 움직이면 취소
  stage.addEventListener('pointerdown', e => {
    longFired = false;   // 새로 누를 때마다 초기화 (휴대폰은 길게 누른 뒤 클릭이 안 올 수도 있다)
    const el = e.target.closest('[data-info]');
    if (!el || !el.dataset.info || JG.info.isOpen()) return;
    pressAt = [e.clientX, e.clientY];
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => { longFired = true; openInfo(el); }, 500);
  });
  stage.addEventListener('pointermove', e => {
    if (pressAt && Math.hypot(e.clientX - pressAt[0], e.clientY - pressAt[1]) > 10) { clearTimeout(pressTimer); pressAt = null; }
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => stage.addEventListener(t, () => { clearTimeout(pressTimer); pressAt = null; }));

  // 마우스 오른쪽 클릭도 풀이 (휴대폰 길게 누르기 메뉴도 막는다)
  stage.addEventListener('contextmenu', e => {
    const el = e.target.closest('[data-info]');
    e.preventDefault();
    clearTimeout(pressTimer);
    if (el && el.dataset.info && !JG.info.isOpen()) { longFired = true; openInfo(el); }
  });

  // 키보드: 고른 카드에서 i = 풀이, Esc = 풀이 닫기
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && JG.info.isOpen()) { JG.info.close(); JG.app.render(); return; }
    const el = document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-info]');
    if ((e.key === 'i' || e.key === 'I') && el && el.dataset.info && !JG.info.isOpen()) openInfo(el);
  });

  // 브라우저는 사람이 한 번 누른 뒤에야 소리를 낼 수 있게 한다
  addEventListener('pointerdown', () => JG.sound.unlock());
  addEventListener('keydown', () => JG.sound.unlock());

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

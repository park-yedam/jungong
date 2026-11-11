// 연출 도구: 화면을 다시 그려도 지워지지 않는 연출 층(#fx)에 떠오르는 숫자·알림판·색종이·날아가는 물건을 그리고,
// 화면의 카드(버튼)를 잠깐 움직인다 (돌진, 흔들림, 번쩍임, 내려앉기).
// 모든 연출은 skipAll()로 즉시 끝낼 수 있다 (화면을 누르면 건너뛰기). 동작 줄이기 설정이면 움직임 없이 글자만 잠깐 보인다.
(() => {
  const JG = globalThis.JG;
  const layer = () => document.getElementById('fx');
  const stage = () => document.getElementById('stage');
  const running = new Set();   // 진행 중인 애니메이션
  const waits = new Set();     // 진행 중인 기다리기
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const outline = n => [[n, 0], [-n, 0], [0, n], [0, -n], [n, n], [-n, n], [n, -n], [-n, -n]].map(([x, y]) => x + 'px ' + y + 'px 0 #3B2A20').join(', ');

  // 애니메이션을 기록해 두었다가 끝나면 지운다. 끝날 때 풀리는 약속(Promise)을 돌려준다
  function track(anim) {
    running.add(anim);
    const done = () => running.delete(anim);
    return anim.finished.then(done, done);
  }
  // 연출 층에 요소 하나 만들기
  function make(html, style) {
    const d = document.createElement('div');
    d.innerHTML = html;
    d.style.cssText = 'position: absolute; pointer-events: none; ' + style;
    layer().appendChild(d);
    return d;
  }

  const fx = {
    reduced,
    busy: () => running.size > 0 || waits.size > 0,

    // 화면 요소의 위치를 무대 좌표(1440×810)로
    rectOf(el) {
      const s = stage().getBoundingClientRect(), k = s.width / 1440, r = el.getBoundingClientRect();
      return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
    },
    center: r => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 }),

    // 기다리기 (건너뛰면 바로 풀린다)
    wait(ms) {
      return new Promise(resolve => {
        const w = { resolve, timer: setTimeout(() => { waits.delete(w); resolve(); }, ms) };
        waits.add(w);
      });
    },

    // 모든 연출을 즉시 끝낸다
    skipAll() {
      running.forEach(a => { try { a.finish(); } catch (e) { a.cancel(); } });
      waits.forEach(w => { clearTimeout(w.timer); w.resolve(); });
      waits.clear();
    },

    // 떠오르는 글자 (피해 -2는 빨강, 회복 +3은 초록 등). x, y는 무대 좌표의 가운데
    float(x, y, text, color, size) {
      const d = make(JG.esc(text), 'left: ' + x + 'px; top: ' + y + 'px; transform: translate(-50%, -50%); white-space: nowrap; '
        + 'font-size: ' + (size || 32) + 'px; line-height: 1; color: ' + (color || '#E35D5B') + '; text-shadow: ' + outline(3));
      const frames = reduced()
        ? [{ opacity: 1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }]
        : [{ transform: 'translate(-50%, -20%) scale(0.5)', opacity: 0 },
          { transform: 'translate(-50%, -50%) scale(1.25)', opacity: 1, offset: 0.12 },
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.25 },
          { transform: 'translate(-50%, -150%) scale(1)', opacity: 0 }];
      return track(d.animate(frames, { duration: 1100, easing: 'ease-out' })).then(() => d.remove());
    },

    // 돌진: el이 to(무대 좌표 사각형) 쪽으로 튀어 나갔다가 돌아온다. 부딪히는 순간 onImpact를 부른다
    lunge(el, to, onImpact) {
      if (!el || reduced()) { if (onImpact) onImpact(); return Promise.resolve(); }
      const a = fx.center(fx.rectOf(el)), b = fx.center(to), dx = b.x - a.x, dy = b.y - a.y, k = 0.7, ms = 520;
      el.style.zIndex = 20;
      const anim = el.animate([
        { transform: 'translate(0, 0)' },
        { transform: 'translate(' + (-dx * 0.08) + 'px, ' + (-dy * 0.08) + 'px) scale(1.05)', offset: 0.25 },   // 뒤로 살짝 당겼다가
        { transform: 'translate(' + dx * k + 'px, ' + dy * k + 'px) scale(1.1)', offset: 0.55 },             // 대상 앞까지 돌진
        { transform: 'translate(0, 0)' }
      ], { duration: ms, easing: 'ease-in-out' });
      if (onImpact) fx.wait(ms * 0.55).then(onImpact);
      return track(anim).then(() => { el.style.zIndex = ''; });
    },

    // 흔들림 (power: 흔들리는 폭 px)
    shake(el, power) {
      if (!el || reduced()) return Promise.resolve();
      const p = power || 6;
      return track(el.animate([0, 1, -1, 1, -1, 0.5, 0].map(s => ({ transform: 'translate(' + s * p + 'px, ' + (s * p) / 3 + 'px)' })), { duration: 320 }));
    },
    // 화면 전체 흔들림 (큰 피해, 작업팀 퇴장)
    shakeScreen(power) { return fx.shake(document.getElementById('screen'), power || 8); },

    // 하얗게 번쩍 (맞은 카드)
    flash(el) {
      if (!el) return Promise.resolve();
      return track(el.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(2.4) saturate(0.4)' }, { filter: 'brightness(1)' }], { duration: 260 }));
    },

    // 위에서 쿵 내려앉기 (카드를 낼 때)
    land(el) {
      if (!el || reduced()) return Promise.resolve();
      return track(el.animate([
        { transform: 'translateY(-36px) scale(1.12)', opacity: 0.4 },
        { transform: 'translateY(0) scale(1)', opacity: 1, offset: 0.55 },
        { transform: 'scale(1.06, 0.94)', offset: 0.75 },
        { transform: 'none' }
      ], { duration: 360, easing: 'ease-in' }));
    },

    // 흐려지며 사라지기 (퇴장, 문제 해결). 화면을 다시 그리기 전에 쓴다
    vanish(el) {
      if (!el) return Promise.resolve();
      const frames = reduced() ? [{ opacity: 1 }, { opacity: 0 }]
        : [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-12px) scale(1.05)', opacity: 0.8, offset: 0.4 }, { transform: 'translateY(24px) scale(0.9)', opacity: 0 }];
      return track(el.animate(frames, { duration: 420, easing: 'ease-in', fill: 'forwards' }));
    },

    // 가운데 알림판 ("내 턴!", "현장 턴", "공정 완료!")
    banner(text, color) {
      const d = make('<div style="padding: 12px 36px; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -6px 0 #6B4420">'
        + '<span style="font-size: 48px; line-height: 56px; color: ' + (color || '#FFFFFF') + '; text-shadow: ' + outline(3) + '">' + JG.esc(text) + '</span></div>',
        'left: 720px; top: 300px; transform: translate(-50%, -50%); white-space: nowrap');
      const frames = reduced()
        ? [{ opacity: 1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }]
        : [{ transform: 'translate(-50%, -50%) scale(0.3)', opacity: 0 },
          { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 1, offset: 0.15 },
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.25 },
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1, offset: 0.8 },
          { transform: 'translate(-50%, -60%) scale(0.95)', opacity: 0 }];
      return track(d.animate(frames, { duration: 1100, easing: 'ease-out' })).then(() => d.remove());
    },

    // 색종이 터지기 (층 완성, 준공, 콤보). 도트 느낌의 네모 조각
    burst(x, y, n) {
      if (reduced()) return Promise.resolve();
      const colors = ['#F7C948', '#E35D5B', '#5B8DEF', '#7BD389', '#FFFFFF'];
      const all = [];
      for (let i = 0; i < (n || 24); i++) {
        const ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 120, s = 6 + Math.floor(Math.random() * 2) * 3;
        const d = make('', 'left: ' + x + 'px; top: ' + y + 'px; width: ' + s + 'px; height: ' + s + 'px; background: ' + colors[i % colors.length]);
        const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 60;
        all.push(track(d.animate([
          { transform: 'translate(0, 0)', opacity: 1 },
          { transform: 'translate(' + dx + 'px, ' + dy + 'px)', opacity: 1, offset: 0.5 },
          { transform: 'translate(' + dx * 1.2 + 'px, ' + (dy + 120) + 'px)', opacity: 0 }
        ], { duration: 900, easing: 'ease-out' })).then(() => d.remove()));
      }
      return Promise.all(all);
    },

    // 물건이 from에서 to로 날아간다 (카드 뽑기, 물방울이 달력으로 등). html은 날아갈 모양
    fly(html, from, to, ms) {
      const a = fx.center(from), b = fx.center(to);
      const d = make(html, 'left: ' + a.x + 'px; top: ' + a.y + 'px; transform: translate(-50%, -50%)');
      if (reduced()) { d.remove(); return Promise.resolve(); }
      return track(d.animate([
        { transform: 'translate(-50%, -50%) scale(0.6)', opacity: 0.6 },
        { transform: 'translate(calc(-50% + ' + (b.x - a.x) / 2 + 'px), calc(-50% + ' + ((b.y - a.y) / 2 - 60) + 'px)) scale(1)', opacity: 1, offset: 0.5 },
        { transform: 'translate(calc(-50% + ' + (b.x - a.x) + 'px), calc(-50% + ' + (b.y - a.y) + 'px)) scale(1)', opacity: 1 }
      ], { duration: ms || 450, easing: 'ease-in-out' })).then(() => d.remove());
    }
  };

  JG.fx = fx;
})();

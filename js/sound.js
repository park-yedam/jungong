// 소리: 효과음과 배경음을 Web Audio로 직접 만든다 (소리 파일 없음)
// 브라우저는 사람이 한 번 누른 뒤에야 소리를 허락하므로 unlock()이 불린 뒤부터 난다 (app.js).
(() => {
  const JG = globalThis.JG;
  const settings = () => JG.save.data.settings;
  let ctx = null, sfxOut, bgmOut, noiseBuf;
  let wanted = 'day', playing = null, timer = null, step = 0, nextTime = 0;

  // 음 이름(C4, F#3) → 주파수
  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const hz = s => { const m = s.match(/^([A-G])(#?)(\d)$/); return 440 * Math.pow(2, (12 * (+m[3] + 1) + NOTE[m[1]] + (m[2] ? 1 : 0) - 69) / 12); };

  // 짧은 음 하나: 주파수 f (f2가 있으면 그쪽으로 미끄러짐), 시작 t, 길이 dur
  function tone(f, t, dur, type, vol, out, f2) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(t, dur, vol) {
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = noiseBuf;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(g); g.connect(sfxOut);
    s.start(t); s.stop(t + dur);
  }

  // ---------- 효과음 ----------
  const SFX = {
    hammer: t => { tone(180, t, 0.12, 'square', 0.5, sfxOut, 70); noise(t, 0.05, 0.4); },                     // 망치 "통"
    coin: t => { tone(988, t, 0.07, 'square', 0.3, sfxOut); tone(1319, t + 0.07, 0.2, 'square', 0.3, sfxOut); },  // 코인 "짤랑"
    floor: t => { ['C5', 'E5', 'G5', 'C6'].forEach(n => tone(hz(n), t, 0.4, 'triangle', 0.3, sfxOut)); tone(hz('C4'), t, 0.4, 'square', 0.18, sfxOut); },   // 층 완성 "빰!"
    win: t => {
      ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => tone(hz(n), t + i * 0.11, 0.14, 'square', 0.28, sfxOut));
      ['C5', 'E5', 'G5', 'C6'].forEach(n => tone(hz(n), t + 0.48, 0.8, 'triangle', 0.28, sfxOut));
    },
    lose: t => { ['G4', 'E4', 'C4'].forEach((n, i) => tone(hz(n), t + i * 0.2, 0.28, 'triangle', 0.35, sfxOut)); },
    solved: t => { tone(hz('E5'), t, 0.08, 'square', 0.25, sfxOut); tone(hz('A5'), t + 0.08, 0.18, 'square', 0.25, sfxOut); },
    thud: t => { tone(110, t, 0.16, 'triangle', 0.5, sfxOut, 55); noise(t, 0.08, 0.3); },   // 달력이 깎일 때
    tick: t => tone(1200, t, 0.04, 'square', 0.15, sfxOut)                                    // 고르기, 메뉴
  };

  // ---------- 배경음 (직접 지은 짧은 반복 곡). 음:길이(8분음표 개수), R은 쉼 ----------
  const THEMES = {
    day: {   // 낮: 다장조, 통통 튀는 칩튠
      bpm: 100,
      tracks: [
        { wave: 'square', vol: 0.16, notes: 'E5:2 G5:2 A5:1 G5:1 E5:2 D5:2 E5:2 C5:4 D5:2 E5:2 G5:2 E5:2 D5:6 R:2 E5:2 G5:2 A5:1 G5:1 C6:2 B5:2 A5:2 G5:4 A5:2 G5:2 E5:2 D5:2 C5:6 R:2' },
        { wave: 'triangle', vol: 0.5, notes: 'C3:4 G2:4 F2:4 C3:4 F2:4 G2:4 G2:4 D3:4 C3:4 E3:4 F2:4 G2:4 F2:4 G2:4 C3:4 C3:4' }
      ]
    },
    night: {   // 밤(9턴부터 야간작업): 가단조, 느리고 조용하게
      bpm: 72,
      tracks: [
        { wave: 'triangle', vol: 0.35, notes: 'A4:4 C5:2 B4:2 A4:4 E4:4 F4:4 A4:2 G4:2 E4:6 R:2 A4:4 C5:2 D5:2 E5:4 D5:2 C5:2 B4:4 G4:2 B4:2 A4:6 R:2' },
        { wave: 'sine', vol: 0.5, notes: 'A2:8 A2:8 F2:8 E2:8 A2:8 C3:8 G2:8 A2:8' }
      ]
    }
  };
  // 곡을 "몇 번째 8분음표에 어떤 음" 목록으로 바꿔 둔다
  const SONGS = {};
  Object.entries(THEMES).forEach(([name, th]) => {
    const at = {}; let len = 0;
    th.tracks.forEach(tr => {
      let pos = 0;
      tr.notes.split(' ').forEach(tok => {
        const [n, d] = tok.split(':');
        if (n !== 'R') (at[pos] = at[pos] || []).push({ f: hz(n), len: +d, wave: tr.wave, vol: tr.vol });
        pos += +d;
      });
      len = Math.max(len, pos);
    });
    SONGS[name] = { eighth: 60 / th.bpm / 2, at, len };
  });

  function schedule() {
    const song = SONGS[playing];
    if (nextTime < ctx.currentTime - 0.1) nextTime = ctx.currentTime + 0.05;   // 탭이 가려져 늦어졌으면 건너뛴다
    while (nextTime < ctx.currentTime + 0.3) {
      (song.at[step % song.len] || []).forEach(n => tone(n.f, nextTime, n.len * song.eighth * 0.9, n.wave, n.vol, bgmOut));
      step++;
      nextTime += song.eighth;
    }
  }
  function stopMusic() { clearInterval(timer); timer = null; playing = null; }
  function updateMusic() {
    if (!ctx) return;
    if (!settings().bgm) { stopMusic(); return; }
    if (playing === wanted) return;
    stopMusic();
    playing = wanted; step = 0; nextTime = ctx.currentTime + 0.1;
    timer = setInterval(schedule, 100);
  }

  JG.sound = {
    unlock() {
      if (!ctx) {
        ctx = new AudioContext();
        sfxOut = ctx.createGain(); sfxOut.gain.value = 0.25; sfxOut.connect(ctx.destination);
        bgmOut = ctx.createGain(); bgmOut.gain.value = 0.08; bgmOut.connect(ctx.destination);
        noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
      updateMusic();
    },
    play(name, delay) {
      if (ctx && settings().sfx) SFX[name](ctx.currentTime + 0.01 + (delay || 0));
    },
    music(name) { wanted = name; updateMusic(); },   // 'day' | 'night'
    set(kind, on) {                                  // kind: 'sfx' | 'bgm'
      settings()[kind] = on;
      JG.save.write();
      updateMusic();
    }
  };
})();

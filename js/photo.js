// 준공 기념사진: 시안 ③의 폴라로이드를 캔버스에 그린다. 화면에 보이는 그림이 그대로 PNG로 저장된다
(() => {
  const JG = globalThis.JG;
  const W = 640, H = 678;   // 폴라로이드 전체 크기
  const SLOTS = [44, 108, 180, 260, 340, 412];   // 사진 속 인물 자리 (가운데 260은 현장소장)
  const CONFETTI = [
    [180, 114, '#E35D5B'], [552, 150, '#7BD389'], [114, 30, '#E35D5B'], [12, 150, '#FFFFFF'], [222, 306, '#E35D5B'],
    [168, 198, '#FFFFFF'], [276, 102, '#F7C948'], [78, 96, '#F7C948'], [198, 306, '#5B8DEF'], [144, 60, '#5B8DEF'],
    [282, 30, '#FFFFFF'], [258, 252, '#7BD389'], [384, 90, '#F7C948'], [186, 180, '#5B8DEF'], [66, 354, '#FFFFFF'],
    [228, 0, '#5B8DEF'], [438, 270, '#5B8DEF'], [582, 192, '#F7C948'], [312, 162, '#FFFFFF'], [216, 162, '#7BD389'],
    [120, 84, '#5B8DEF'], [198, 312, '#E35D5B'], [60, 12, '#7BD389'], [480, 102, '#FFFFFF'], [408, 246, '#7BD389'],
    [534, 126, '#F7C948'], [516, 72, '#E35D5B'], [312, 348, '#F7C948'], [486, 240, '#7BD389'], [210, 66, '#5B8DEF'],
    [330, 282, '#FFFFFF'], [246, 240, '#FFFFFF'], [150, 342, '#5B8DEF'], [72, 318, '#E35D5B'], [540, 84, '#5B8DEF'],
    [582, 222, '#FFFFFF'], [180, 42, '#5B8DEF'], [132, 108, '#7BD389'], [18, 12, '#5B8DEF'], [534, 30, '#5B8DEF'],
    [564, 258, '#5B8DEF'], [12, 120, '#5B8DEF'], [312, 330, '#FFFFFF']
  ];

  // 스프라이트(box-shadow 문자열, 3px = 1도트)를 점 목록으로
  const cache = {};
  const dots = name => cache[name] || (cache[name] = JG.SPRITES[name].split(',').map(p => {
    const [x, y, , c] = p.trim().split(/\s+/);
    return [parseFloat(x) / 3, parseFloat(y) / 3, c];
  }));

  JG.drawPhoto = (canvas, o) => {   // o: { floors, crew: [작업팀 카드 id], pump: 펌프카를 썼는지, dateText }
    const ctx = canvas.getContext('2d');
    const fill = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    const box = (x, y, w, h, c, line) => { fill(x, y, w, h, line || '#3B2A20'); fill(x + 3, y + 3, w - 6, h - 6, c); };
    const sprite = (name, x, y, k) => dots(name).forEach(([dx, dy, c]) => fill(x + dx * k, y + dy * k, k, k, c));

    // 흰 폴라로이드 틀과 사진 칸
    box(0, 0, W, H, '#FFFFFF');
    fill(24, 24, 592, 546, '#3B2A20');
    ctx.save();
    ctx.beginPath(); ctx.rect(27, 27, 586, 540); ctx.clip();
    ctx.translate(27, 27);

    // 노을 하늘, 구름
    fill(0, 0, 592, 104, '#E98F6A'); fill(0, 104, 592, 130, '#F4A261'); fill(0, 234, 592, 190, '#F7C08A');
    sprite('cloud', 33, 33, 3); sprite('cloud', 396, 66, 3);

    // 타워크레인
    fill(504, 72, 24, 352, '#F2C230'); fill(504, 72, 3, 352, '#3B2A20'); fill(525, 72, 3, 352, '#3B2A20');
    for (let y = 84; y <= 420; y += 24) fill(504, y, 24, 3, '#3B2A20');
    box(316, 54, 320, 18, '#F2C230');
    for (let i = 0; i < 17; i++) fill(328 + i * 18, 60, 6, 6, '#3B2A20');
    box(564, 72, 54, 30, '#9AA0A6'); box(498, 72, 36, 27, '#F2C230'); fill(504, 78, 15, 9, '#9BD3F0');
    box(489, 415, 54, 9, '#7E858C');

    // 다 지은 건물: 층마다 불 켜진 벽돌 칸 4개, 지붕, 깃발
    const top = 424 - 48 * o.floors;
    for (let f = 0; f < o.floors; f++) for (let b = 0; b < 4; b++) sprite('bay_lit', 201 + b * 48, 424 - 48 * (f + 1) - 3, 3);
    box(198, top - 21, 204, 21, '#9AA0A6');
    sprite('flag', 285, top - 48, 3);

    // 땅, 잔디, 색종이
    fill(0, 424, 592, 122, '#D9A066'); fill(0, 424, 592, 12, '#8BC34A'); fill(0, 430, 592, 6, '#6FA83A');
    CONFETTI.forEach(([x, y, c]) => fill(x, y, 6, 6, c));

    // 인물: 가운데 현장소장, 이번 판 작업팀이 가까운 자리부터 왼쪽·오른쪽 번갈아 선다 (4px 점으로 크게)
    const order = [[3, JG.bossSprite()]].concat(o.crew.slice(0, 5).map((id, i) => [[2, 4, 1, 5, 0][i], id]));
    order.forEach(([slot, id]) => {
      fill(SLOTS[slot] + 8, 510, 56, 8, 'rgba(59, 42, 32, 0.25)');
      sprite(id, SLOTS[slot], 418, 4);
    });
    if (o.pump) sprite('pump', 499, 463, 3);

    // 테이프 커팅 리본
    fill(24, 490, 544, 9, '#E35D5B'); box(282, 481, 30, 27, '#E35D5B', '#B83E3C');
    ctx.restore();

    // 사진 아래 글씨
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#5C3A1E'; ctx.font = "16px 'Galmuri11'"; ctx.fillText(o.dateText, W / 2, 591);
    ctx.fillStyle = '#3B2A20'; ctx.font = "32px 'Galmuri11'"; ctx.fillText('모두 무사히 마무리!', W / 2, 619);
  };
})();

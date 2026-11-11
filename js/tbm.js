// 아침 TBM 화면: 판을 시작할 때마다 다짐 카드 3장 중 1장을 고른다. 고르면 바로 대전으로
(() => {
  const JG = globalThis.JG;
  const IDS = Object.keys(JG.PLEDGES);   // 시안의 카드 순서: 안전 구호 제창, 자재 반입 확인, 장비 일일점검
  let target = null, site = null, msg = '';   // target: 대전에 넘길 현장 ({ siteId } 또는 { daily: true })

  JG.screens.tbm = {
    // arg: { siteId } 현장 1~5, { daily: true } 오늘의 데일리 현장
    enter(arg) {
      target = arg.daily ? { daily: true } : { siteId: arg.siteId };
      site = arg.daily ? JG.daily.today() : JG.SITES.find(s => s.id === arg.siteId);
      msg = '아침 TBM이에요. ' + (arg.daily ? '오늘의 데일리 현장은 ' + JG.engine.ieyo(site.name) + '. ' : '') + '오늘의 다짐을 하나 골라 주세요. 고른 다짐은 이번 판 내내 적용돼요.';
      JG.progress.seeSlang('dandori');   // 오늘의 현장 말은 도감에 저장
    },
    msg: () => msg,

    click(act, n) {
      JG.sound.play('coin');   // 다짐을 고르면 짤랑
      if (act === 'pledge' && IDS[n]) JG.app.show('battle', Object.assign({ pledge: IDS[n] }, target));
    },

    render() {
      const sl = JG.SLANG.dandori;
      return JG.tbmView({
        siteName: (site.daily ? '데일리 · ' : '') + site.name,
        daysText: 'D-' + JG.RULES.days + ' · 1턴 전',
        slang: sl.said + ' → ' + sl.proper,
        p: IDS.map(id => {
          const p = JG.PLEDGES[id];
          return { name: p.name, text: p.text, field: p.field, aria: p.name + ' 고르기. ' + p.text + '. 현장에서는 ' + p.field };
        })
      }, JG.esc);
    }
  };
})();

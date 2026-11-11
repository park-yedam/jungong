// 아침 TBM 화면: 판을 시작할 때마다 다짐 카드 3장 중 1장을 고른다. 고르면 바로 대전으로
(() => {
  const JG = globalThis.JG;
  const IDS = Object.keys(JG.PLEDGES);   // 시안의 카드 순서: 안전 구호 제창, 자재 반입 확인, 장비 일일점검
  let siteId = null, msg = '';

  JG.screens.tbm = {
    enter(arg) {
      siteId = arg.siteId;
      msg = '아침 TBM이에요. 오늘의 다짐을 하나 골라 주세요. 고른 다짐은 이번 판 내내 적용돼요.';
      JG.progress.seeSlang('dandori');   // 오늘의 현장 말은 도감에 저장
    },
    msg: () => msg,

    click(act, n) {
      if (act === 'pledge' && IDS[n]) JG.app.show('battle', { siteId, pledge: IDS[n] });
    },

    render() {
      const site = JG.SITES.find(s => s.id === siteId), sl = JG.SLANG.dandori;
      return JG.tbmView({
        siteName: site.name,
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

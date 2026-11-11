// 아침 TBM 화면 그림판: 도트 디자인 시안 ①의 마크업을 옮긴 것.
// v: tbm.js가 만든 화면 값 (siteName, daysText, slang, p[다짐 3장]). 다짐 카드는 data-act="pledge:번호".
var JG = globalThis.JG = globalThis.JG || {};

JG.tbmView = (v, esc) => `<div style="position: relative; width: 1440px; height: 810px; overflow: hidden; font-family: 'Galmuri11', monospace; font-size: 16px; line-height: 16px; color: #3B2A20; -webkit-font-smoothing: none; font-smooth: never; background: #BFE3F2">
<div aria-hidden="true" style="position: absolute; left: 1188px; top: 48px; width: 72px; height: 72px; background: #FFE08A; border: 4px solid #F2C230; box-sizing: border-box; box-shadow: 0 0 0 8px rgba(255, 224, 138, 0.35)">
</div>
<div aria-hidden="true" style="position: absolute; left: 165px; top: 129px; width: 3px; height: 3px; box-shadow: 21px 3px 0 #3B2A20,24px 3px 0 #3B2A20,27px 3px 0 #3B2A20,30px 3px 0 #3B2A20,15px 6px 0 #3B2A20,18px 6px 0 #3B2A20,21px 6px 0 #FFFFFF,24px 6px 0 #FFFFFF,27px 6px 0 #FFFFFF,30px 6px 0 #FFFFFF,33px 6px 0 #3B2A20,36px 6px 0 #3B2A20,48px 6px 0 #3B2A20,51px 6px 0 #3B2A20,54px 6px 0 #3B2A20,57px 6px 0 #3B2A20,12px 9px 0 #3B2A20,15px 9px 0 #FFFFFF,18px 9px 0 #FFFFFF,21px 9px 0 #FFFFFF,24px 9px 0 #FFFFFF,27px 9px 0 #FFFFFF,30px 9px 0 #FFFFFF,33px 9px 0 #FFFFFF,36px 9px 0 #FFFFFF,39px 9px 0 #3B2A20,45px 9px 0 #3B2A20,48px 9px 0 #FFFFFF,51px 9px 0 #FFFFFF,54px 9px 0 #FFFFFF,57px 9px 0 #FFFFFF,60px 9px 0 #3B2A20,63px 9px 0 #3B2A20,6px 12px 0 #3B2A20,9px 12px 0 #3B2A20,12px 12px 0 #FFFFFF,15px 12px 0 #FFFFFF,18px 12px 0 #FFFFFF,21px 12px 0 #FFFFFF,24px 12px 0 #FFFFFF,27px 12px 0 #FFFFFF,30px 12px 0 #FFFFFF,33px 12px 0 #FFFFFF,36px 12px 0 #FFFFFF,39px 12px 0 #FFFFFF,42px 12px 0 #3B2A20,45px 12px 0 #FFFFFF,48px 12px 0 #FFFFFF,51px 12px 0 #FFFFFF,54px 12px 0 #FFFFFF,57px 12px 0 #FFFFFF,60px 12px 0 #FFFFFF,63px 12px 0 #FFFFFF,66px 12px 0 #3B2A20,3px 15px 0 #3B2A20,6px 15px 0 #FFFFFF,9px 15px 0 #FFFFFF,12px 15px 0 #FFFFFF,15px 15px 0 #FFFFFF,18px 15px 0 #FFFFFF,21px 15px 0 #FFFFFF,24px 15px 0 #FFFFFF,27px 15px 0 #FFFFFF,30px 15px 0 #FFFFFF,33px 15px 0 #FFFFFF,36px 15px 0 #FFFFFF,39px 15px 0 #FFFFFF,42px 15px 0 #FFFFFF,45px 15px 0 #FFFFFF,48px 15px 0 #FFFFFF,51px 15px 0 #FFFFFF,54px 15px 0 #FFFFFF,57px 15px 0 #FFFFFF,60px 15px 0 #FFFFFF,63px 15px 0 #FFFFFF,66px 15px 0 #FFFFFF,69px 15px 0 #3B2A20,3px 18px 0 #3B2A20,6px 18px 0 #DCE8EE,9px 18px 0 #FFFFFF,12px 18px 0 #FFFFFF,15px 18px 0 #FFFFFF,18px 18px 0 #FFFFFF,21px 18px 0 #FFFFFF,24px 18px 0 #FFFFFF,27px 18px 0 #FFFFFF,30px 18px 0 #FFFFFF,33px 18px 0 #FFFFFF,36px 18px 0 #FFFFFF,39px 18px 0 #FFFFFF,42px 18px 0 #FFFFFF,45px 18px 0 #FFFFFF,48px 18px 0 #FFFFFF,51px 18px 0 #FFFFFF,54px 18px 0 #FFFFFF,57px 18px 0 #FFFFFF,60px 18px 0 #FFFFFF,63px 18px 0 #FFFFFF,66px 18px 0 #DCE8EE,69px 18px 0 #3B2A20,6px 21px 0 #3B2A20,9px 21px 0 #DCE8EE,12px 21px 0 #DCE8EE,15px 21px 0 #DCE8EE,18px 21px 0 #DCE8EE,21px 21px 0 #DCE8EE,24px 21px 0 #DCE8EE,27px 21px 0 #DCE8EE,30px 21px 0 #DCE8EE,33px 21px 0 #DCE8EE,36px 21px 0 #DCE8EE,39px 21px 0 #DCE8EE,42px 21px 0 #DCE8EE,45px 21px 0 #DCE8EE,48px 21px 0 #DCE8EE,51px 21px 0 #DCE8EE,54px 21px 0 #DCE8EE,57px 21px 0 #DCE8EE,60px 21px 0 #DCE8EE,63px 21px 0 #DCE8EE,66px 21px 0 #3B2A20,9px 24px 0 #3B2A20,12px 24px 0 #3B2A20,15px 24px 0 #3B2A20,18px 24px 0 #3B2A20,21px 24px 0 #3B2A20,24px 24px 0 #3B2A20,27px 24px 0 #3B2A20,30px 24px 0 #3B2A20,33px 24px 0 #3B2A20,36px 24px 0 #3B2A20,39px 24px 0 #3B2A20,42px 24px 0 #3B2A20,45px 24px 0 #3B2A20,48px 24px 0 #3B2A20,51px 24px 0 #3B2A20,54px 24px 0 #3B2A20,57px 24px 0 #3B2A20,60px 24px 0 #3B2A20,63px 24px 0 #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 957px; top: 81px; width: 3px; height: 3px; box-shadow: 21px 3px 0 #3B2A20,24px 3px 0 #3B2A20,27px 3px 0 #3B2A20,30px 3px 0 #3B2A20,15px 6px 0 #3B2A20,18px 6px 0 #3B2A20,21px 6px 0 #FFFFFF,24px 6px 0 #FFFFFF,27px 6px 0 #FFFFFF,30px 6px 0 #FFFFFF,33px 6px 0 #3B2A20,36px 6px 0 #3B2A20,48px 6px 0 #3B2A20,51px 6px 0 #3B2A20,54px 6px 0 #3B2A20,57px 6px 0 #3B2A20,12px 9px 0 #3B2A20,15px 9px 0 #FFFFFF,18px 9px 0 #FFFFFF,21px 9px 0 #FFFFFF,24px 9px 0 #FFFFFF,27px 9px 0 #FFFFFF,30px 9px 0 #FFFFFF,33px 9px 0 #FFFFFF,36px 9px 0 #FFFFFF,39px 9px 0 #3B2A20,45px 9px 0 #3B2A20,48px 9px 0 #FFFFFF,51px 9px 0 #FFFFFF,54px 9px 0 #FFFFFF,57px 9px 0 #FFFFFF,60px 9px 0 #3B2A20,63px 9px 0 #3B2A20,6px 12px 0 #3B2A20,9px 12px 0 #3B2A20,12px 12px 0 #FFFFFF,15px 12px 0 #FFFFFF,18px 12px 0 #FFFFFF,21px 12px 0 #FFFFFF,24px 12px 0 #FFFFFF,27px 12px 0 #FFFFFF,30px 12px 0 #FFFFFF,33px 12px 0 #FFFFFF,36px 12px 0 #FFFFFF,39px 12px 0 #FFFFFF,42px 12px 0 #3B2A20,45px 12px 0 #FFFFFF,48px 12px 0 #FFFFFF,51px 12px 0 #FFFFFF,54px 12px 0 #FFFFFF,57px 12px 0 #FFFFFF,60px 12px 0 #FFFFFF,63px 12px 0 #FFFFFF,66px 12px 0 #3B2A20,3px 15px 0 #3B2A20,6px 15px 0 #FFFFFF,9px 15px 0 #FFFFFF,12px 15px 0 #FFFFFF,15px 15px 0 #FFFFFF,18px 15px 0 #FFFFFF,21px 15px 0 #FFFFFF,24px 15px 0 #FFFFFF,27px 15px 0 #FFFFFF,30px 15px 0 #FFFFFF,33px 15px 0 #FFFFFF,36px 15px 0 #FFFFFF,39px 15px 0 #FFFFFF,42px 15px 0 #FFFFFF,45px 15px 0 #FFFFFF,48px 15px 0 #FFFFFF,51px 15px 0 #FFFFFF,54px 15px 0 #FFFFFF,57px 15px 0 #FFFFFF,60px 15px 0 #FFFFFF,63px 15px 0 #FFFFFF,66px 15px 0 #FFFFFF,69px 15px 0 #3B2A20,3px 18px 0 #3B2A20,6px 18px 0 #DCE8EE,9px 18px 0 #FFFFFF,12px 18px 0 #FFFFFF,15px 18px 0 #FFFFFF,18px 18px 0 #FFFFFF,21px 18px 0 #FFFFFF,24px 18px 0 #FFFFFF,27px 18px 0 #FFFFFF,30px 18px 0 #FFFFFF,33px 18px 0 #FFFFFF,36px 18px 0 #FFFFFF,39px 18px 0 #FFFFFF,42px 18px 0 #FFFFFF,45px 18px 0 #FFFFFF,48px 18px 0 #FFFFFF,51px 18px 0 #FFFFFF,54px 18px 0 #FFFFFF,57px 18px 0 #FFFFFF,60px 18px 0 #FFFFFF,63px 18px 0 #FFFFFF,66px 18px 0 #DCE8EE,69px 18px 0 #3B2A20,6px 21px 0 #3B2A20,9px 21px 0 #DCE8EE,12px 21px 0 #DCE8EE,15px 21px 0 #DCE8EE,18px 21px 0 #DCE8EE,21px 21px 0 #DCE8EE,24px 21px 0 #DCE8EE,27px 21px 0 #DCE8EE,30px 21px 0 #DCE8EE,33px 21px 0 #DCE8EE,36px 21px 0 #DCE8EE,39px 21px 0 #DCE8EE,42px 21px 0 #DCE8EE,45px 21px 0 #DCE8EE,48px 21px 0 #DCE8EE,51px 21px 0 #DCE8EE,54px 21px 0 #DCE8EE,57px 21px 0 #DCE8EE,60px 21px 0 #DCE8EE,63px 21px 0 #DCE8EE,66px 21px 0 #3B2A20,9px 24px 0 #3B2A20,12px 24px 0 #3B2A20,15px 24px 0 #3B2A20,18px 24px 0 #3B2A20,21px 24px 0 #3B2A20,24px 24px 0 #3B2A20,27px 24px 0 #3B2A20,30px 24px 0 #3B2A20,33px 24px 0 #3B2A20,36px 24px 0 #3B2A20,39px 24px 0 #3B2A20,42px 24px 0 #3B2A20,45px 24px 0 #3B2A20,48px 24px 0 #3B2A20,51px 24px 0 #3B2A20,54px 24px 0 #3B2A20,57px 24px 0 #3B2A20,60px 24px 0 #3B2A20,63px 24px 0 #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 1257px; top: 237px; width: 3px; height: 3px; box-shadow: 21px 3px 0 #3B2A20,24px 3px 0 #3B2A20,27px 3px 0 #3B2A20,30px 3px 0 #3B2A20,15px 6px 0 #3B2A20,18px 6px 0 #3B2A20,21px 6px 0 #FFFFFF,24px 6px 0 #FFFFFF,27px 6px 0 #FFFFFF,30px 6px 0 #FFFFFF,33px 6px 0 #3B2A20,36px 6px 0 #3B2A20,48px 6px 0 #3B2A20,51px 6px 0 #3B2A20,54px 6px 0 #3B2A20,57px 6px 0 #3B2A20,12px 9px 0 #3B2A20,15px 9px 0 #FFFFFF,18px 9px 0 #FFFFFF,21px 9px 0 #FFFFFF,24px 9px 0 #FFFFFF,27px 9px 0 #FFFFFF,30px 9px 0 #FFFFFF,33px 9px 0 #FFFFFF,36px 9px 0 #FFFFFF,39px 9px 0 #3B2A20,45px 9px 0 #3B2A20,48px 9px 0 #FFFFFF,51px 9px 0 #FFFFFF,54px 9px 0 #FFFFFF,57px 9px 0 #FFFFFF,60px 9px 0 #3B2A20,63px 9px 0 #3B2A20,6px 12px 0 #3B2A20,9px 12px 0 #3B2A20,12px 12px 0 #FFFFFF,15px 12px 0 #FFFFFF,18px 12px 0 #FFFFFF,21px 12px 0 #FFFFFF,24px 12px 0 #FFFFFF,27px 12px 0 #FFFFFF,30px 12px 0 #FFFFFF,33px 12px 0 #FFFFFF,36px 12px 0 #FFFFFF,39px 12px 0 #FFFFFF,42px 12px 0 #3B2A20,45px 12px 0 #FFFFFF,48px 12px 0 #FFFFFF,51px 12px 0 #FFFFFF,54px 12px 0 #FFFFFF,57px 12px 0 #FFFFFF,60px 12px 0 #FFFFFF,63px 12px 0 #FFFFFF,66px 12px 0 #3B2A20,3px 15px 0 #3B2A20,6px 15px 0 #FFFFFF,9px 15px 0 #FFFFFF,12px 15px 0 #FFFFFF,15px 15px 0 #FFFFFF,18px 15px 0 #FFFFFF,21px 15px 0 #FFFFFF,24px 15px 0 #FFFFFF,27px 15px 0 #FFFFFF,30px 15px 0 #FFFFFF,33px 15px 0 #FFFFFF,36px 15px 0 #FFFFFF,39px 15px 0 #FFFFFF,42px 15px 0 #FFFFFF,45px 15px 0 #FFFFFF,48px 15px 0 #FFFFFF,51px 15px 0 #FFFFFF,54px 15px 0 #FFFFFF,57px 15px 0 #FFFFFF,60px 15px 0 #FFFFFF,63px 15px 0 #FFFFFF,66px 15px 0 #FFFFFF,69px 15px 0 #3B2A20,3px 18px 0 #3B2A20,6px 18px 0 #DCE8EE,9px 18px 0 #FFFFFF,12px 18px 0 #FFFFFF,15px 18px 0 #FFFFFF,18px 18px 0 #FFFFFF,21px 18px 0 #FFFFFF,24px 18px 0 #FFFFFF,27px 18px 0 #FFFFFF,30px 18px 0 #FFFFFF,33px 18px 0 #FFFFFF,36px 18px 0 #FFFFFF,39px 18px 0 #FFFFFF,42px 18px 0 #FFFFFF,45px 18px 0 #FFFFFF,48px 18px 0 #FFFFFF,51px 18px 0 #FFFFFF,54px 18px 0 #FFFFFF,57px 18px 0 #FFFFFF,60px 18px 0 #FFFFFF,63px 18px 0 #FFFFFF,66px 18px 0 #DCE8EE,69px 18px 0 #3B2A20,6px 21px 0 #3B2A20,9px 21px 0 #DCE8EE,12px 21px 0 #DCE8EE,15px 21px 0 #DCE8EE,18px 21px 0 #DCE8EE,21px 21px 0 #DCE8EE,24px 21px 0 #DCE8EE,27px 21px 0 #DCE8EE,30px 21px 0 #DCE8EE,33px 21px 0 #DCE8EE,36px 21px 0 #DCE8EE,39px 21px 0 #DCE8EE,42px 21px 0 #DCE8EE,45px 21px 0 #DCE8EE,48px 21px 0 #DCE8EE,51px 21px 0 #DCE8EE,54px 21px 0 #DCE8EE,57px 21px 0 #DCE8EE,60px 21px 0 #DCE8EE,63px 21px 0 #DCE8EE,66px 21px 0 #3B2A20,9px 24px 0 #3B2A20,12px 24px 0 #3B2A20,15px 24px 0 #3B2A20,18px 24px 0 #3B2A20,21px 24px 0 #3B2A20,24px 24px 0 #3B2A20,27px 24px 0 #3B2A20,30px 24px 0 #3B2A20,33px 24px 0 #3B2A20,36px 24px 0 #3B2A20,39px 24px 0 #3B2A20,42px 24px 0 #3B2A20,45px 24px 0 #3B2A20,48px 24px 0 #3B2A20,51px 24px 0 #3B2A20,54px 24px 0 #3B2A20,57px 24px 0 #3B2A20,60px 24px 0 #3B2A20,63px 24px 0 #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 129px; top: 309px; width: 3px; height: 3px; box-shadow: 3px 3px 0 #7E858C,48px 3px 0 #7E858C,3px 6px 0 #7E858C,48px 6px 0 #7E858C,3px 9px 0 #7E858C,48px 9px 0 #7E858C,3px 12px 0 #7E858C,48px 12px 0 #7E858C,3px 15px 0 #7E858C,48px 15px 0 #7E858C,3px 18px 0 #7E858C,48px 18px 0 #7E858C,3px 21px 0 #7E858C,48px 21px 0 #7E858C,3px 24px 0 #7E858C,6px 24px 0 #7E858C,9px 24px 0 #7E858C,12px 24px 0 #7E858C,15px 24px 0 #7E858C,18px 24px 0 #7E858C,21px 24px 0 #7E858C,24px 24px 0 #7E858C,27px 24px 0 #7E858C,30px 24px 0 #7E858C,33px 24px 0 #7E858C,36px 24px 0 #7E858C,39px 24px 0 #7E858C,42px 24px 0 #7E858C,45px 24px 0 #7E858C,48px 24px 0 #7E858C,3px 27px 0 #7E858C,48px 27px 0 #7E858C,3px 30px 0 #7E858C,48px 30px 0 #7E858C,3px 33px 0 #7E858C,48px 33px 0 #7E858C,3px 36px 0 #7E858C,48px 36px 0 #7E858C,3px 39px 0 #7E858C,48px 39px 0 #7E858C,3px 42px 0 #7E858C,48px 42px 0 #7E858C,3px 45px 0 #7E858C,48px 45px 0 #7E858C,3px 48px 0 #8B5A2B,6px 48px 0 #8B5A2B,9px 48px 0 #8B5A2B,12px 48px 0 #8B5A2B,15px 48px 0 #8B5A2B,18px 48px 0 #8B5A2B,21px 48px 0 #8B5A2B,24px 48px 0 #8B5A2B,27px 48px 0 #8B5A2B,30px 48px 0 #8B5A2B,33px 48px 0 #8B5A2B,36px 48px 0 #8B5A2B,39px 48px 0 #8B5A2B,42px 48px 0 #8B5A2B,45px 48px 0 #8B5A2B,48px 48px 0 #8B5A2B">
</div>
<div aria-hidden="true" style="position: absolute; left: 177px; top: 309px; width: 3px; height: 3px; box-shadow: 3px 3px 0 #7E858C,48px 3px 0 #7E858C,3px 6px 0 #7E858C,48px 6px 0 #7E858C,3px 9px 0 #7E858C,48px 9px 0 #7E858C,3px 12px 0 #7E858C,48px 12px 0 #7E858C,3px 15px 0 #7E858C,48px 15px 0 #7E858C,3px 18px 0 #7E858C,48px 18px 0 #7E858C,3px 21px 0 #7E858C,48px 21px 0 #7E858C,3px 24px 0 #7E858C,6px 24px 0 #7E858C,9px 24px 0 #7E858C,12px 24px 0 #7E858C,15px 24px 0 #7E858C,18px 24px 0 #7E858C,21px 24px 0 #7E858C,24px 24px 0 #7E858C,27px 24px 0 #7E858C,30px 24px 0 #7E858C,33px 24px 0 #7E858C,36px 24px 0 #7E858C,39px 24px 0 #7E858C,42px 24px 0 #7E858C,45px 24px 0 #7E858C,48px 24px 0 #7E858C,3px 27px 0 #7E858C,48px 27px 0 #7E858C,3px 30px 0 #7E858C,48px 30px 0 #7E858C,3px 33px 0 #7E858C,48px 33px 0 #7E858C,3px 36px 0 #7E858C,48px 36px 0 #7E858C,3px 39px 0 #7E858C,48px 39px 0 #7E858C,3px 42px 0 #7E858C,48px 42px 0 #7E858C,3px 45px 0 #7E858C,48px 45px 0 #7E858C,3px 48px 0 #8B5A2B,6px 48px 0 #8B5A2B,9px 48px 0 #8B5A2B,12px 48px 0 #8B5A2B,15px 48px 0 #8B5A2B,18px 48px 0 #8B5A2B,21px 48px 0 #8B5A2B,24px 48px 0 #8B5A2B,27px 48px 0 #8B5A2B,30px 48px 0 #8B5A2B,33px 48px 0 #8B5A2B,36px 48px 0 #8B5A2B,39px 48px 0 #8B5A2B,42px 48px 0 #8B5A2B,45px 48px 0 #8B5A2B,48px 48px 0 #8B5A2B">
</div>
<div aria-hidden="true" style="position: absolute; left: 225px; top: 309px; width: 3px; height: 3px; box-shadow: 3px 3px 0 #7E858C,48px 3px 0 #7E858C,3px 6px 0 #7E858C,48px 6px 0 #7E858C,3px 9px 0 #7E858C,48px 9px 0 #7E858C,3px 12px 0 #7E858C,48px 12px 0 #7E858C,3px 15px 0 #7E858C,48px 15px 0 #7E858C,3px 18px 0 #7E858C,48px 18px 0 #7E858C,3px 21px 0 #7E858C,48px 21px 0 #7E858C,3px 24px 0 #7E858C,6px 24px 0 #7E858C,9px 24px 0 #7E858C,12px 24px 0 #7E858C,15px 24px 0 #7E858C,18px 24px 0 #7E858C,21px 24px 0 #7E858C,24px 24px 0 #7E858C,27px 24px 0 #7E858C,30px 24px 0 #7E858C,33px 24px 0 #7E858C,36px 24px 0 #7E858C,39px 24px 0 #7E858C,42px 24px 0 #7E858C,45px 24px 0 #7E858C,48px 24px 0 #7E858C,3px 27px 0 #7E858C,48px 27px 0 #7E858C,3px 30px 0 #7E858C,48px 30px 0 #7E858C,3px 33px 0 #7E858C,48px 33px 0 #7E858C,3px 36px 0 #7E858C,48px 36px 0 #7E858C,3px 39px 0 #7E858C,48px 39px 0 #7E858C,3px 42px 0 #7E858C,48px 42px 0 #7E858C,3px 45px 0 #7E858C,48px 45px 0 #7E858C,3px 48px 0 #8B5A2B,6px 48px 0 #8B5A2B,9px 48px 0 #8B5A2B,12px 48px 0 #8B5A2B,15px 48px 0 #8B5A2B,18px 48px 0 #8B5A2B,21px 48px 0 #8B5A2B,24px 48px 0 #8B5A2B,27px 48px 0 #8B5A2B,30px 48px 0 #8B5A2B,33px 48px 0 #8B5A2B,36px 48px 0 #8B5A2B,39px 48px 0 #8B5A2B,42px 48px 0 #8B5A2B,45px 48px 0 #8B5A2B,48px 48px 0 #8B5A2B">
</div>
<div aria-hidden="true" style="position: absolute; left: 273px; top: 309px; width: 3px; height: 3px; box-shadow: 3px 3px 0 #7E858C,48px 3px 0 #7E858C,3px 6px 0 #7E858C,48px 6px 0 #7E858C,3px 9px 0 #7E858C,48px 9px 0 #7E858C,3px 12px 0 #7E858C,48px 12px 0 #7E858C,3px 15px 0 #7E858C,48px 15px 0 #7E858C,3px 18px 0 #7E858C,48px 18px 0 #7E858C,3px 21px 0 #7E858C,48px 21px 0 #7E858C,3px 24px 0 #7E858C,6px 24px 0 #7E858C,9px 24px 0 #7E858C,12px 24px 0 #7E858C,15px 24px 0 #7E858C,18px 24px 0 #7E858C,21px 24px 0 #7E858C,24px 24px 0 #7E858C,27px 24px 0 #7E858C,30px 24px 0 #7E858C,33px 24px 0 #7E858C,36px 24px 0 #7E858C,39px 24px 0 #7E858C,42px 24px 0 #7E858C,45px 24px 0 #7E858C,48px 24px 0 #7E858C,3px 27px 0 #7E858C,48px 27px 0 #7E858C,3px 30px 0 #7E858C,48px 30px 0 #7E858C,3px 33px 0 #7E858C,48px 33px 0 #7E858C,3px 36px 0 #7E858C,48px 36px 0 #7E858C,3px 39px 0 #7E858C,48px 39px 0 #7E858C,3px 42px 0 #7E858C,48px 42px 0 #7E858C,3px 45px 0 #7E858C,48px 45px 0 #7E858C,3px 48px 0 #8B5A2B,6px 48px 0 #8B5A2B,9px 48px 0 #8B5A2B,12px 48px 0 #8B5A2B,15px 48px 0 #8B5A2B,18px 48px 0 #8B5A2B,21px 48px 0 #8B5A2B,24px 48px 0 #8B5A2B,27px 48px 0 #8B5A2B,30px 48px 0 #8B5A2B,33px 48px 0 #8B5A2B,36px 48px 0 #8B5A2B,39px 48px 0 #8B5A2B,42px 48px 0 #8B5A2B,45px 48px 0 #8B5A2B,48px 48px 0 #8B5A2B">
</div>
<div aria-hidden="true" style="position: absolute; left: 129px; top: 261px; width: 3px; height: 3px; box-shadow: 3px 3px 0 #7E858C,48px 3px 0 #7E858C,3px 6px 0 #7E858C,48px 6px 0 #7E858C,3px 9px 0 #7E858C,48px 9px 0 #7E858C,3px 12px 0 #7E858C,48px 12px 0 #7E858C,3px 15px 0 #7E858C,48px 15px 0 #7E858C,3px 18px 0 #7E858C,48px 18px 0 #7E858C,3px 21px 0 #7E858C,48px 21px 0 #7E858C,3px 24px 0 #7E858C,6px 24px 0 #7E858C,9px 24px 0 #7E858C,12px 24px 0 #7E858C,15px 24px 0 #7E858C,18px 24px 0 #7E858C,21px 24px 0 #7E858C,24px 24px 0 #7E858C,27px 24px 0 #7E858C,30px 24px 0 #7E858C,33px 24px 0 #7E858C,36px 24px 0 #7E858C,39px 24px 0 #7E858C,42px 24px 0 #7E858C,45px 24px 0 #7E858C,48px 24px 0 #7E858C,3px 27px 0 #7E858C,48px 27px 0 #7E858C,3px 30px 0 #7E858C,48px 30px 0 #7E858C,3px 33px 0 #7E858C,48px 33px 0 #7E858C,3px 36px 0 #7E858C,48px 36px 0 #7E858C,3px 39px 0 #7E858C,48px 39px 0 #7E858C,3px 42px 0 #7E858C,48px 42px 0 #7E858C,3px 45px 0 #7E858C,48px 45px 0 #7E858C,3px 48px 0 #8B5A2B,6px 48px 0 #8B5A2B,9px 48px 0 #8B5A2B,12px 48px 0 #8B5A2B,15px 48px 0 #8B5A2B,18px 48px 0 #8B5A2B,21px 48px 0 #8B5A2B,24px 48px 0 #8B5A2B,27px 48px 0 #8B5A2B,30px 48px 0 #8B5A2B,33px 48px 0 #8B5A2B,36px 48px 0 #8B5A2B,39px 48px 0 #8B5A2B,42px 48px 0 #8B5A2B,45px 48px 0 #8B5A2B,48px 48px 0 #8B5A2B">
</div>
<div aria-hidden="true" style="position: absolute; left: 177px; top: 261px; width: 3px; height: 3px; box-shadow: 3px 3px 0 #7E858C,48px 3px 0 #7E858C,3px 6px 0 #7E858C,48px 6px 0 #7E858C,3px 9px 0 #7E858C,48px 9px 0 #7E858C,3px 12px 0 #7E858C,48px 12px 0 #7E858C,3px 15px 0 #7E858C,48px 15px 0 #7E858C,3px 18px 0 #7E858C,48px 18px 0 #7E858C,3px 21px 0 #7E858C,48px 21px 0 #7E858C,3px 24px 0 #7E858C,6px 24px 0 #7E858C,9px 24px 0 #7E858C,12px 24px 0 #7E858C,15px 24px 0 #7E858C,18px 24px 0 #7E858C,21px 24px 0 #7E858C,24px 24px 0 #7E858C,27px 24px 0 #7E858C,30px 24px 0 #7E858C,33px 24px 0 #7E858C,36px 24px 0 #7E858C,39px 24px 0 #7E858C,42px 24px 0 #7E858C,45px 24px 0 #7E858C,48px 24px 0 #7E858C,3px 27px 0 #7E858C,48px 27px 0 #7E858C,3px 30px 0 #7E858C,48px 30px 0 #7E858C,3px 33px 0 #7E858C,48px 33px 0 #7E858C,3px 36px 0 #7E858C,48px 36px 0 #7E858C,3px 39px 0 #7E858C,48px 39px 0 #7E858C,3px 42px 0 #7E858C,48px 42px 0 #7E858C,3px 45px 0 #7E858C,48px 45px 0 #7E858C,3px 48px 0 #8B5A2B,6px 48px 0 #8B5A2B,9px 48px 0 #8B5A2B,12px 48px 0 #8B5A2B,15px 48px 0 #8B5A2B,18px 48px 0 #8B5A2B,21px 48px 0 #8B5A2B,24px 48px 0 #8B5A2B,27px 48px 0 #8B5A2B,30px 48px 0 #8B5A2B,33px 48px 0 #8B5A2B,36px 48px 0 #8B5A2B,39px 48px 0 #8B5A2B,42px 48px 0 #8B5A2B,45px 48px 0 #8B5A2B,48px 48px 0 #8B5A2B">
</div>
<div aria-hidden="true" style="position: absolute; left: 225px; top: 261px; width: 3px; height: 3px; box-shadow: 3px 3px 0 #7E858C,48px 3px 0 #7E858C,3px 6px 0 #7E858C,48px 6px 0 #7E858C,3px 9px 0 #7E858C,48px 9px 0 #7E858C,3px 12px 0 #7E858C,48px 12px 0 #7E858C,3px 15px 0 #7E858C,48px 15px 0 #7E858C,3px 18px 0 #7E858C,48px 18px 0 #7E858C,3px 21px 0 #7E858C,48px 21px 0 #7E858C,3px 24px 0 #7E858C,6px 24px 0 #7E858C,9px 24px 0 #7E858C,12px 24px 0 #7E858C,15px 24px 0 #7E858C,18px 24px 0 #7E858C,21px 24px 0 #7E858C,24px 24px 0 #7E858C,27px 24px 0 #7E858C,30px 24px 0 #7E858C,33px 24px 0 #7E858C,36px 24px 0 #7E858C,39px 24px 0 #7E858C,42px 24px 0 #7E858C,45px 24px 0 #7E858C,48px 24px 0 #7E858C,3px 27px 0 #7E858C,48px 27px 0 #7E858C,3px 30px 0 #7E858C,48px 30px 0 #7E858C,3px 33px 0 #7E858C,48px 33px 0 #7E858C,3px 36px 0 #7E858C,48px 36px 0 #7E858C,3px 39px 0 #7E858C,48px 39px 0 #7E858C,3px 42px 0 #7E858C,48px 42px 0 #7E858C,3px 45px 0 #7E858C,48px 45px 0 #7E858C,3px 48px 0 #8B5A2B,6px 48px 0 #8B5A2B,9px 48px 0 #8B5A2B,12px 48px 0 #8B5A2B,15px 48px 0 #8B5A2B,18px 48px 0 #8B5A2B,21px 48px 0 #8B5A2B,24px 48px 0 #8B5A2B,27px 48px 0 #8B5A2B,30px 48px 0 #8B5A2B,33px 48px 0 #8B5A2B,36px 48px 0 #8B5A2B,39px 48px 0 #8B5A2B,42px 48px 0 #8B5A2B,45px 48px 0 #8B5A2B,48px 48px 0 #8B5A2B">
</div>
<div aria-hidden="true" style="position: absolute; left: 273px; top: 261px; width: 3px; height: 3px; box-shadow: 3px 3px 0 #7E858C,48px 3px 0 #7E858C,3px 6px 0 #7E858C,48px 6px 0 #7E858C,3px 9px 0 #7E858C,48px 9px 0 #7E858C,3px 12px 0 #7E858C,48px 12px 0 #7E858C,3px 15px 0 #7E858C,48px 15px 0 #7E858C,3px 18px 0 #7E858C,48px 18px 0 #7E858C,3px 21px 0 #7E858C,48px 21px 0 #7E858C,3px 24px 0 #7E858C,6px 24px 0 #7E858C,9px 24px 0 #7E858C,12px 24px 0 #7E858C,15px 24px 0 #7E858C,18px 24px 0 #7E858C,21px 24px 0 #7E858C,24px 24px 0 #7E858C,27px 24px 0 #7E858C,30px 24px 0 #7E858C,33px 24px 0 #7E858C,36px 24px 0 #7E858C,39px 24px 0 #7E858C,42px 24px 0 #7E858C,45px 24px 0 #7E858C,48px 24px 0 #7E858C,3px 27px 0 #7E858C,48px 27px 0 #7E858C,3px 30px 0 #7E858C,48px 30px 0 #7E858C,3px 33px 0 #7E858C,48px 33px 0 #7E858C,3px 36px 0 #7E858C,48px 36px 0 #7E858C,3px 39px 0 #7E858C,48px 39px 0 #7E858C,3px 42px 0 #7E858C,48px 42px 0 #7E858C,3px 45px 0 #7E858C,48px 45px 0 #7E858C,3px 48px 0 #8B5A2B,6px 48px 0 #8B5A2B,9px 48px 0 #8B5A2B,12px 48px 0 #8B5A2B,15px 48px 0 #8B5A2B,18px 48px 0 #8B5A2B,21px 48px 0 #8B5A2B,24px 48px 0 #8B5A2B,27px 48px 0 #8B5A2B,30px 48px 0 #8B5A2B,33px 48px 0 #8B5A2B,36px 48px 0 #8B5A2B,39px 48px 0 #8B5A2B,42px 48px 0 #8B5A2B,45px 48px 0 #8B5A2B,48px 48px 0 #8B5A2B">
</div>
<div aria-hidden="true">
<div style="position: absolute; left: 372px; top: 168px; width: 24px; height: 192px; background: #F2C230; border-left: 3px solid #3B2A20; border-right: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 372px; top: 180px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 381px; top: 189px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 372px; top: 204px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 381px; top: 213px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 372px; top: 228px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 381px; top: 237px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 372px; top: 252px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 381px; top: 261px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 372px; top: 276px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 381px; top: 285px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 372px; top: 300px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 381px; top: 309px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 372px; top: 324px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 381px; top: 333px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 372px; top: 348px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 381px; top: 357px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 150px; top: 150px; width: 410px; height: 18px; background: #F2C230; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 162px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 180px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 198px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 216px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 234px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 252px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 270px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 288px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 306px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 324px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 342px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 360px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 378px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 396px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 414px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 432px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 450px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 468px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 486px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 504px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 522px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 540px; top: 156px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 488px; top: 168px; width: 54px; height: 30px; background: #9AA0A6; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 366px; top: 168px; width: 36px; height: 27px; background: #F2C230; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 372px; top: 174px; width: 15px; height: 9px; background: #9BD3F0">
</div>
<div style="position: absolute; left: 357px; top: 351px; width: 54px; height: 9px; background: #7E858C; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
</div>
<div aria-hidden="true" style="position: absolute; left: 0px; top: 360px; width: 1440px; height: 450px; background: #D9A066">
</div>
<div aria-hidden="true">
<div style="position: absolute; left: 0px; top: 360px; width: 1440px; height: 12px; background: #8BC34A; box-shadow: inset 0 -6px 0 #6FA83A">
</div>
<div style="position: absolute; left: 693px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 696px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1329px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1332px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 858px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 861px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1314px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1317px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1419px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1422px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1197px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1200px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 714px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 717px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 693px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 696px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 780px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 783px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1311px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1314px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 900px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 903px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 291px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 294px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 282px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 285px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1233px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1236px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 786px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 789px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 729px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 732px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 966px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 969px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 942px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 945px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1218px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1221px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 285px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 288px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 144px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 147px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 684px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 687px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 465px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 468px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 216px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 219px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 138px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 141px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 825px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 828px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1242px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1245px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1365px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1368px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1065px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1068px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 972px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 975px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 63px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 66px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 912px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 915px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 606px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 609px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 693px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 696px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1002px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1005px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1134px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1137px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 945px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 948px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 996px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 999px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 240px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 243px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 957px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 960px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 21px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 24px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1275px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1278px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 810px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 813px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 96px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 99px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 90px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 93px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 54px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 57px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 291px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 294px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1350px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1353px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 369px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 372px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 921px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 924px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 45px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 48px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1194px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1197px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 711px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 714px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 501px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 504px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 675px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 678px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 906px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 909px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1293px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1296px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 300px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 303px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 795px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 798px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 357px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 360px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 981px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 984px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 450px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 453px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 765px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 768px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 6px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 9px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1017px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1020px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 129px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 132px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 702px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 705px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1005px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1008px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 426px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 429px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 624px; top: 354px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 627px; top: 357px; width: 3px; height: 3px; background: #8BC34A">
</div>
</div>
<div aria-hidden="true">
<div style="position: absolute; left: 726px; top: 423px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 585px; top: 372px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 420px; top: 495px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 855px; top: 372px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 564px; top: 402px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 90px; top: 480px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 786px; top: 501px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1224px; top: 387px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1257px; top: 498px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 648px; top: 456px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 207px; top: 474px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1068px; top: 381px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 615px; top: 486px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 732px; top: 486px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 984px; top: 510px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1209px; top: 498px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 555px; top: 504px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 174px; top: 420px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 558px; top: 441px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 585px; top: 453px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 339px; top: 501px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 594px; top: 411px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 273px; top: 384px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 663px; top: 423px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 924px; top: 492px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 564px; top: 411px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 699px; top: 462px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 255px; top: 459px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 288px; top: 513px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 411px; top: 435px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1221px; top: 372px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 948px; top: 393px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 36px; top: 432px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 351px; top: 471px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 963px; top: 438px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1371px; top: 513px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 447px; top: 489px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 504px; top: 468px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1125px; top: 426px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1047px; top: 372px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 855px; top: 423px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 369px; top: 408px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 90px; top: 477px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 639px; top: 453px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1212px; top: 408px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 978px; top: 513px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 24px; top: 504px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1224px; top: 378px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 819px; top: 408px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1089px; top: 438px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 414px; top: 504px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 324px; top: 474px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 108px; top: 450px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 126px; top: 501px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1053px; top: 387px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1068px; top: 405px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 270px; top: 375px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 954px; top: 456px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 87px; top: 498px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 366px; top: 432px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 9px; top: 441px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1302px; top: 408px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 336px; top: 471px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 249px; top: 468px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 930px; top: 468px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 705px; top: 381px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 825px; top: 504px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1017px; top: 381px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 537px; top: 516px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1188px; top: 465px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 261px; top: 396px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1230px; top: 474px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 759px; top: 378px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 438px; top: 450px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1248px; top: 486px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 192px; top: 420px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 633px; top: 453px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 624px; top: 444px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 612px; top: 405px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1281px; top: 420px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 801px; top: 381px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1182px; top: 396px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1149px; top: 375px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 18px; top: 402px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 300px; top: 507px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 282px; top: 429px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 558px; top: 501px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 687px; top: 390px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1227px; top: 447px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 717px; top: 438px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1371px; top: 471px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 30px; top: 399px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1059px; top: 390px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 933px; top: 441px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 534px; top: 381px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 648px; top: 387px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1431px; top: 417px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1053px; top: 501px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 900px; top: 462px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1161px; top: 435px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1227px; top: 417px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1005px; top: 486px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1221px; top: 516px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 456px; top: 393px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1026px; top: 423px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 351px; top: 393px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1122px; top: 435px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 519px; top: 486px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 525px; top: 408px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 354px; top: 435px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 939px; top: 480px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1143px; top: 423px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 642px; top: 390px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 264px; top: 441px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 579px; top: 435px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 543px; top: 435px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 264px; top: 489px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 495px; top: 489px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1317px; top: 399px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 510px; top: 498px; width: 3px; height: 3px; background: #B07A47">
</div>
</div>
<div aria-hidden="true" style="position: absolute; left: 0px; top: 504px; width: 1440px; height: 306px; background: #8B5A2B; border-top: 6px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F">
</div>
<div aria-hidden="true" style="position: absolute; left: 460px; top: 378px; width: 56px; height: 8px; background: rgba(59, 42, 32, 0.25)">
</div>
<div aria-hidden="true" style="position: absolute; left: 580px; top: 360px; width: 56px; height: 8px; background: rgba(59, 42, 32, 0.25)">
</div>
<div aria-hidden="true" style="position: absolute; left: 692px; top: 348px; width: 56px; height: 8px; background: rgba(59, 42, 32, 0.25)">
</div>
<div aria-hidden="true" style="position: absolute; left: 804px; top: 360px; width: 56px; height: 8px; background: rgba(59, 42, 32, 0.25)">
</div>
<div aria-hidden="true" style="position: absolute; left: 924px; top: 378px; width: 56px; height: 8px; background: rgba(59, 42, 32, 0.25)">
</div>
<div aria-hidden="true" style="position: absolute; left: 452px; top: 284px; width: 4px; height: 4px; box-shadow: 24px 8px 0 #3B2A20,28px 8px 0 #3B2A20,32px 8px 0 #3B2A20,36px 8px 0 #3B2A20,40px 8px 0 #3B2A20,44px 8px 0 #3B2A20,20px 12px 0 #3B2A20,24px 12px 0 #F2C230,28px 12px 0 #F2C230,32px 12px 0 #FFFFFF,36px 12px 0 #F2C230,40px 12px 0 #F2C230,44px 12px 0 #F2C230,48px 12px 0 #3B2A20,16px 16px 0 #3B2A20,20px 16px 0 #F2C230,24px 16px 0 #F2C230,28px 16px 0 #F2C230,32px 16px 0 #F2C230,36px 16px 0 #F2C230,40px 16px 0 #F2C230,44px 16px 0 #F2C230,48px 16px 0 #F2C230,52px 16px 0 #3B2A20,56px 16px 0 #3B2A20,60px 16px 0 #3B2A20,64px 16px 0 #3B2A20,12px 20px 0 #3B2A20,16px 20px 0 #C99A1A,20px 20px 0 #C99A1A,24px 20px 0 #C99A1A,28px 20px 0 #C99A1A,32px 20px 0 #C99A1A,36px 20px 0 #C99A1A,40px 20px 0 #C99A1A,44px 20px 0 #C99A1A,48px 20px 0 #C99A1A,52px 20px 0 #C99A1A,56px 20px 0 #3B2A20,60px 20px 0 #B5532A,64px 20px 0 #3B2A20,16px 24px 0 #3B2A20,20px 24px 0 #F2C09A,24px 24px 0 #F2C09A,28px 24px 0 #F2C09A,32px 24px 0 #F2C09A,36px 24px 0 #F2C09A,40px 24px 0 #F2C09A,44px 24px 0 #F2C09A,48px 24px 0 #F2C09A,52px 24px 0 #3B2A20,56px 24px 0 #3B2A20,60px 24px 0 #B5532A,64px 24px 0 #3B2A20,16px 28px 0 #3B2A20,20px 28px 0 #F2C09A,24px 28px 0 #3B2A20,28px 28px 0 #F2C09A,32px 28px 0 #F2C09A,36px 28px 0 #F2C09A,40px 28px 0 #F2C09A,44px 28px 0 #3B2A20,48px 28px 0 #F2C09A,52px 28px 0 #3B2A20,56px 28px 0 #3B2A20,60px 28px 0 #B5532A,64px 28px 0 #3B2A20,16px 32px 0 #3B2A20,20px 32px 0 #F2C09A,24px 32px 0 #F2C09A,28px 32px 0 #F2C09A,32px 32px 0 #F2C09A,36px 32px 0 #F2C09A,40px 32px 0 #F2C09A,44px 32px 0 #F2C09A,48px 32px 0 #F2C09A,52px 32px 0 #3B2A20,56px 32px 0 #3B2A20,60px 32px 0 #B5532A,64px 32px 0 #3B2A20,16px 36px 0 #3B2A20,20px 36px 0 #F2C09A,24px 36px 0 #EE9A8A,28px 36px 0 #F2C09A,32px 36px 0 #F2C09A,36px 36px 0 #F2C09A,40px 36px 0 #F2C09A,44px 36px 0 #EE9A8A,48px 36px 0 #F2C09A,52px 36px 0 #3B2A20,56px 36px 0 #3B2A20,60px 36px 0 #B5532A,64px 36px 0 #3B2A20,20px 40px 0 #3B2A20,24px 40px 0 #F2C09A,28px 40px 0 #F2C09A,32px 40px 0 #F2C09A,36px 40px 0 #F2C09A,40px 40px 0 #F2C09A,44px 40px 0 #F2C09A,48px 40px 0 #3B2A20,56px 40px 0 #3B2A20,60px 40px 0 #B5532A,64px 40px 0 #3B2A20,24px 44px 0 #3B2A20,28px 44px 0 #3B2A20,32px 44px 0 #3B2A20,36px 44px 0 #3B2A20,40px 44px 0 #3B2A20,44px 44px 0 #3B2A20,56px 44px 0 #3B2A20,60px 44px 0 #B5532A,64px 44px 0 #3B2A20,20px 48px 0 #3B2A20,24px 48px 0 #E07A3F,28px 48px 0 #E07A3F,32px 48px 0 #DDE6E8,36px 48px 0 #DDE6E8,40px 48px 0 #E07A3F,44px 48px 0 #E07A3F,48px 48px 0 #3B2A20,56px 48px 0 #3B2A20,60px 48px 0 #B5532A,64px 48px 0 #3B2A20,16px 52px 0 #3B2A20,20px 52px 0 #E07A3F,24px 52px 0 #E07A3F,28px 52px 0 #E07A3F,32px 52px 0 #DDE6E8,36px 52px 0 #DDE6E8,40px 52px 0 #E07A3F,44px 52px 0 #E07A3F,48px 52px 0 #E07A3F,52px 52px 0 #3B2A20,56px 52px 0 #3B2A20,60px 52px 0 #B5532A,64px 52px 0 #3B2A20,12px 56px 0 #3B2A20,16px 56px 0 #F2C09A,20px 56px 0 #3B2A20,24px 56px 0 #E07A3F,28px 56px 0 #E07A3F,32px 56px 0 #DDE6E8,36px 56px 0 #DDE6E8,40px 56px 0 #E07A3F,44px 56px 0 #E07A3F,48px 56px 0 #3B2A20,52px 56px 0 #F2C09A,56px 56px 0 #F2C09A,60px 56px 0 #B5532A,64px 56px 0 #3B2A20,12px 60px 0 #3B2A20,16px 60px 0 #F2C09A,20px 60px 0 #3B2A20,24px 60px 0 #B55E2C,28px 60px 0 #E07A3F,32px 60px 0 #DDE6E8,36px 60px 0 #DDE6E8,40px 60px 0 #E07A3F,44px 60px 0 #B55E2C,48px 60px 0 #3B2A20,52px 60px 0 #F2C09A,56px 60px 0 #F2C09A,60px 60px 0 #B5532A,64px 60px 0 #3B2A20,12px 64px 0 #3B2A20,16px 64px 0 #3B2A20,20px 64px 0 #3B2A20,24px 64px 0 #E07A3F,28px 64px 0 #E07A3F,32px 64px 0 #E07A3F,36px 64px 0 #E07A3F,40px 64px 0 #E07A3F,44px 64px 0 #E07A3F,48px 64px 0 #3B2A20,52px 64px 0 #3B2A20,56px 64px 0 #3B2A20,60px 64px 0 #B5532A,64px 64px 0 #3B2A20,20px 68px 0 #3B2A20,24px 68px 0 #DDE6E8,28px 68px 0 #DDE6E8,32px 68px 0 #DDE6E8,36px 68px 0 #DDE6E8,40px 68px 0 #DDE6E8,44px 68px 0 #DDE6E8,48px 68px 0 #3B2A20,56px 68px 0 #3B2A20,60px 68px 0 #B5532A,64px 68px 0 #3B2A20,20px 72px 0 #3B2A20,24px 72px 0 #B55E2C,28px 72px 0 #B55E2C,32px 72px 0 #B55E2C,36px 72px 0 #B55E2C,40px 72px 0 #B55E2C,44px 72px 0 #B55E2C,48px 72px 0 #3B2A20,56px 72px 0 #3B2A20,60px 72px 0 #B5532A,64px 72px 0 #3B2A20,20px 76px 0 #3B2A20,24px 76px 0 #4A5A7A,28px 76px 0 #4A5A7A,32px 76px 0 #4A5A7A,36px 76px 0 #4A5A7A,40px 76px 0 #4A5A7A,44px 76px 0 #4A5A7A,48px 76px 0 #3B2A20,56px 76px 0 #3B2A20,60px 76px 0 #3B2A20,64px 76px 0 #3B2A20,20px 80px 0 #3B2A20,24px 80px 0 #4A5A7A,28px 80px 0 #4A5A7A,32px 80px 0 #3B2A20,36px 80px 0 #3B2A20,40px 80px 0 #4A5A7A,44px 80px 0 #4A5A7A,48px 80px 0 #3B2A20,20px 84px 0 #3B2A20,24px 84px 0 #4A5A7A,28px 84px 0 #4A5A7A,32px 84px 0 #3B2A20,36px 84px 0 #3B2A20,40px 84px 0 #4A5A7A,44px 84px 0 #4A5A7A,48px 84px 0 #3B2A20,20px 88px 0 #3B2A20,24px 88px 0 #4A5A7A,28px 88px 0 #4A5A7A,32px 88px 0 #3B2A20,36px 88px 0 #3B2A20,40px 88px 0 #4A5A7A,44px 88px 0 #4A5A7A,48px 88px 0 #3B2A20,16px 92px 0 #3B2A20,20px 92px 0 #5C3A1E,24px 92px 0 #5C3A1E,28px 92px 0 #5C3A1E,32px 92px 0 #3B2A20,36px 92px 0 #3B2A20,40px 92px 0 #5C3A1E,44px 92px 0 #5C3A1E,48px 92px 0 #5C3A1E,52px 92px 0 #3B2A20,16px 96px 0 #3B2A20,20px 96px 0 #3B2A20,24px 96px 0 #3B2A20,28px 96px 0 #3B2A20,32px 96px 0 #3B2A20,36px 96px 0 #3B2A20,40px 96px 0 #3B2A20,44px 96px 0 #3B2A20,48px 96px 0 #3B2A20,52px 96px 0 #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 572px; top: 266px; width: 4px; height: 4px; box-shadow: 24px 8px 0 #3B2A20,28px 8px 0 #3B2A20,32px 8px 0 #3B2A20,36px 8px 0 #3B2A20,40px 8px 0 #3B2A20,44px 8px 0 #3B2A20,20px 12px 0 #3B2A20,24px 12px 0 #F2C230,28px 12px 0 #F2C230,32px 12px 0 #FFFFFF,36px 12px 0 #F2C230,40px 12px 0 #F2C230,44px 12px 0 #F2C230,48px 12px 0 #3B2A20,16px 16px 0 #3B2A20,20px 16px 0 #F2C230,24px 16px 0 #F2C230,28px 16px 0 #F2C230,32px 16px 0 #F2C230,36px 16px 0 #F2C230,40px 16px 0 #F2C230,44px 16px 0 #F2C230,48px 16px 0 #F2C230,52px 16px 0 #3B2A20,12px 20px 0 #3B2A20,16px 20px 0 #C99A1A,20px 20px 0 #C99A1A,24px 20px 0 #C99A1A,28px 20px 0 #C99A1A,32px 20px 0 #C99A1A,36px 20px 0 #C99A1A,40px 20px 0 #C99A1A,44px 20px 0 #C99A1A,48px 20px 0 #C99A1A,52px 20px 0 #C99A1A,56px 20px 0 #3B2A20,16px 24px 0 #3B2A20,20px 24px 0 #F2C09A,24px 24px 0 #F2C09A,28px 24px 0 #F2C09A,32px 24px 0 #F2C09A,36px 24px 0 #F2C09A,40px 24px 0 #F2C09A,44px 24px 0 #F2C09A,48px 24px 0 #F2C09A,52px 24px 0 #3B2A20,16px 28px 0 #3B2A20,20px 28px 0 #F2C09A,24px 28px 0 #3B2A20,28px 28px 0 #F2C09A,32px 28px 0 #F2C09A,36px 28px 0 #F2C09A,40px 28px 0 #F2C09A,44px 28px 0 #3B2A20,48px 28px 0 #3B2A20,52px 28px 0 #3B2A20,56px 28px 0 #3B2A20,60px 28px 0 #3B2A20,64px 28px 0 #3B2A20,16px 32px 0 #3B2A20,20px 32px 0 #F2C09A,24px 32px 0 #F2C09A,28px 32px 0 #F2C09A,32px 32px 0 #F2C09A,36px 32px 0 #F2C09A,40px 32px 0 #F2C09A,44px 32px 0 #F2C09A,48px 32px 0 #3B2A20,52px 32px 0 #B8BEC4,56px 32px 0 #B8BEC4,60px 32px 0 #B8BEC4,64px 32px 0 #3B2A20,16px 36px 0 #3B2A20,20px 36px 0 #F2C09A,24px 36px 0 #EE9A8A,28px 36px 0 #F2C09A,32px 36px 0 #F2C09A,36px 36px 0 #F2C09A,40px 36px 0 #F2C09A,44px 36px 0 #EE9A8A,48px 36px 0 #3B2A20,52px 36px 0 #B8BEC4,56px 36px 0 #B8BEC4,60px 36px 0 #B8BEC4,64px 36px 0 #3B2A20,20px 40px 0 #3B2A20,24px 40px 0 #F2C09A,28px 40px 0 #F2C09A,32px 40px 0 #F2C09A,36px 40px 0 #F2C09A,40px 40px 0 #F2C09A,44px 40px 0 #F2C09A,48px 40px 0 #3B2A20,52px 40px 0 #3B2A20,56px 40px 0 #3B2A20,60px 40px 0 #3B2A20,64px 40px 0 #3B2A20,24px 44px 0 #3B2A20,28px 44px 0 #3B2A20,32px 44px 0 #3B2A20,36px 44px 0 #3B2A20,40px 44px 0 #3B2A20,44px 44px 0 #3B2A20,52px 44px 0 #3B2A20,56px 44px 0 #8B5A2B,60px 44px 0 #3B2A20,20px 48px 0 #3B2A20,24px 48px 0 #B5835A,28px 48px 0 #B5835A,32px 48px 0 #DDE6E8,36px 48px 0 #DDE6E8,40px 48px 0 #B5835A,44px 48px 0 #B5835A,48px 48px 0 #3B2A20,52px 48px 0 #3B2A20,56px 48px 0 #8B5A2B,60px 48px 0 #3B2A20,16px 52px 0 #3B2A20,20px 52px 0 #B5835A,24px 52px 0 #B5835A,28px 52px 0 #B5835A,32px 52px 0 #DDE6E8,36px 52px 0 #DDE6E8,40px 52px 0 #B5835A,44px 52px 0 #B5835A,48px 52px 0 #B5835A,52px 52px 0 #3B2A20,56px 52px 0 #8B5A2B,60px 52px 0 #3B2A20,12px 56px 0 #3B2A20,16px 56px 0 #F2C09A,20px 56px 0 #3B2A20,24px 56px 0 #B5835A,28px 56px 0 #B5835A,32px 56px 0 #DDE6E8,36px 56px 0 #DDE6E8,40px 56px 0 #B5835A,44px 56px 0 #B5835A,48px 56px 0 #3B2A20,52px 56px 0 #F2C09A,56px 56px 0 #F2C09A,60px 56px 0 #3B2A20,12px 60px 0 #3B2A20,16px 60px 0 #F2C09A,20px 60px 0 #3B2A20,24px 60px 0 #8E6440,28px 60px 0 #B5835A,32px 60px 0 #DDE6E8,36px 60px 0 #DDE6E8,40px 60px 0 #B5835A,44px 60px 0 #8E6440,48px 60px 0 #3B2A20,52px 60px 0 #F2C09A,56px 60px 0 #8B5A2B,60px 60px 0 #3B2A20,12px 64px 0 #3B2A20,16px 64px 0 #3B2A20,20px 64px 0 #3B2A20,24px 64px 0 #B5835A,28px 64px 0 #B5835A,32px 64px 0 #B5835A,36px 64px 0 #B5835A,40px 64px 0 #B5835A,44px 64px 0 #B5835A,48px 64px 0 #3B2A20,52px 64px 0 #3B2A20,56px 64px 0 #8B5A2B,60px 64px 0 #3B2A20,20px 68px 0 #3B2A20,24px 68px 0 #DDE6E8,28px 68px 0 #DDE6E8,32px 68px 0 #DDE6E8,36px 68px 0 #DDE6E8,40px 68px 0 #DDE6E8,44px 68px 0 #DDE6E8,48px 68px 0 #3B2A20,52px 68px 0 #3B2A20,56px 68px 0 #8B5A2B,60px 68px 0 #3B2A20,20px 72px 0 #3B2A20,24px 72px 0 #8E6440,28px 72px 0 #8E6440,32px 72px 0 #8E6440,36px 72px 0 #8E6440,40px 72px 0 #8E6440,44px 72px 0 #8E6440,48px 72px 0 #3B2A20,52px 72px 0 #3B2A20,56px 72px 0 #8B5A2B,60px 72px 0 #3B2A20,20px 76px 0 #3B2A20,24px 76px 0 #4A5A7A,28px 76px 0 #4A5A7A,32px 76px 0 #4A5A7A,36px 76px 0 #4A5A7A,40px 76px 0 #4A5A7A,44px 76px 0 #4A5A7A,48px 76px 0 #3B2A20,56px 76px 0 #3B2A20,20px 80px 0 #3B2A20,24px 80px 0 #4A5A7A,28px 80px 0 #4A5A7A,32px 80px 0 #3B2A20,36px 80px 0 #3B2A20,40px 80px 0 #4A5A7A,44px 80px 0 #4A5A7A,48px 80px 0 #3B2A20,20px 84px 0 #3B2A20,24px 84px 0 #4A5A7A,28px 84px 0 #4A5A7A,32px 84px 0 #3B2A20,36px 84px 0 #3B2A20,40px 84px 0 #4A5A7A,44px 84px 0 #4A5A7A,48px 84px 0 #3B2A20,20px 88px 0 #3B2A20,24px 88px 0 #4A5A7A,28px 88px 0 #4A5A7A,32px 88px 0 #3B2A20,36px 88px 0 #3B2A20,40px 88px 0 #4A5A7A,44px 88px 0 #4A5A7A,48px 88px 0 #3B2A20,16px 92px 0 #3B2A20,20px 92px 0 #5C3A1E,24px 92px 0 #5C3A1E,28px 92px 0 #5C3A1E,32px 92px 0 #3B2A20,36px 92px 0 #3B2A20,40px 92px 0 #5C3A1E,44px 92px 0 #5C3A1E,48px 92px 0 #5C3A1E,52px 92px 0 #3B2A20,16px 96px 0 #3B2A20,20px 96px 0 #3B2A20,24px 96px 0 #3B2A20,28px 96px 0 #3B2A20,32px 96px 0 #3B2A20,36px 96px 0 #3B2A20,40px 96px 0 #3B2A20,44px 96px 0 #3B2A20,48px 96px 0 #3B2A20,52px 96px 0 #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 684px; top: 254px; width: 4px; height: 4px; box-shadow: 24px 8px 0 #3B2A20,28px 8px 0 #3B2A20,32px 8px 0 #3B2A20,36px 8px 0 #3B2A20,40px 8px 0 #3B2A20,44px 8px 0 #3B2A20,20px 12px 0 #3B2A20,24px 12px 0 #F4F1E8,28px 12px 0 #F4F1E8,32px 12px 0 #FFFFFF,36px 12px 0 #F4F1E8,40px 12px 0 #F4F1E8,44px 12px 0 #F4F1E8,48px 12px 0 #3B2A20,16px 16px 0 #3B2A20,20px 16px 0 #F4F1E8,24px 16px 0 #F4F1E8,28px 16px 0 #F4F1E8,32px 16px 0 #F4F1E8,36px 16px 0 #F4F1E8,40px 16px 0 #F4F1E8,44px 16px 0 #F4F1E8,48px 16px 0 #F4F1E8,52px 16px 0 #3B2A20,12px 20px 0 #3B2A20,16px 20px 0 #CFC8B8,20px 20px 0 #CFC8B8,24px 20px 0 #CFC8B8,28px 20px 0 #CFC8B8,32px 20px 0 #CFC8B8,36px 20px 0 #CFC8B8,40px 20px 0 #CFC8B8,44px 20px 0 #CFC8B8,48px 20px 0 #CFC8B8,52px 20px 0 #CFC8B8,56px 20px 0 #3B2A20,16px 24px 0 #3B2A20,20px 24px 0 #F2C09A,24px 24px 0 #F2C09A,28px 24px 0 #F2C09A,32px 24px 0 #F2C09A,36px 24px 0 #F2C09A,40px 24px 0 #F2C09A,44px 24px 0 #F2C09A,48px 24px 0 #F2C09A,52px 24px 0 #3B2A20,16px 28px 0 #3B2A20,20px 28px 0 #F2C09A,24px 28px 0 #3B2A20,28px 28px 0 #F2C09A,32px 28px 0 #F2C09A,36px 28px 0 #F2C09A,40px 28px 0 #F2C09A,44px 28px 0 #3B2A20,48px 28px 0 #F2C09A,52px 28px 0 #3B2A20,60px 28px 0 #3B2A20,16px 32px 0 #3B2A20,20px 32px 0 #F2C09A,24px 32px 0 #F2C09A,28px 32px 0 #F2C09A,32px 32px 0 #F2C09A,36px 32px 0 #F2C09A,40px 32px 0 #F2C09A,44px 32px 0 #F2C09A,48px 32px 0 #F2C09A,52px 32px 0 #3B2A20,56px 32px 0 #3B2A20,60px 32px 0 #9BD3F0,64px 32px 0 #3B2A20,16px 36px 0 #3B2A20,20px 36px 0 #F2C09A,24px 36px 0 #EE9A8A,28px 36px 0 #F2C09A,32px 36px 0 #F2C09A,36px 36px 0 #F2C09A,40px 36px 0 #F2C09A,44px 36px 0 #EE9A8A,48px 36px 0 #F2C09A,52px 36px 0 #3B2A20,56px 36px 0 #3B2A20,60px 36px 0 #9BD3F0,64px 36px 0 #3B2A20,20px 40px 0 #3B2A20,24px 40px 0 #F2C09A,28px 40px 0 #F2C09A,32px 40px 0 #F2C09A,36px 40px 0 #F2C09A,40px 40px 0 #F2C09A,44px 40px 0 #F2C09A,48px 40px 0 #3B2A20,56px 40px 0 #3B2A20,60px 40px 0 #9BD3F0,64px 40px 0 #3B2A20,24px 44px 0 #3B2A20,28px 44px 0 #3B2A20,32px 44px 0 #3B2A20,36px 44px 0 #3B2A20,40px 44px 0 #3B2A20,44px 44px 0 #3B2A20,56px 44px 0 #3B2A20,60px 44px 0 #9BD3F0,64px 44px 0 #3B2A20,20px 48px 0 #3B2A20,24px 48px 0 #3E5C8A,28px 48px 0 #3E5C8A,32px 48px 0 #DDE6E8,36px 48px 0 #DDE6E8,40px 48px 0 #3E5C8A,44px 48px 0 #3E5C8A,48px 48px 0 #3B2A20,56px 48px 0 #3B2A20,60px 48px 0 #9BD3F0,64px 48px 0 #3B2A20,16px 52px 0 #3B2A20,20px 52px 0 #3E5C8A,24px 52px 0 #3E5C8A,28px 52px 0 #3E5C8A,32px 52px 0 #DDE6E8,36px 52px 0 #DDE6E8,40px 52px 0 #3E5C8A,44px 52px 0 #3E5C8A,48px 52px 0 #3E5C8A,52px 52px 0 #3B2A20,56px 52px 0 #3B2A20,60px 52px 0 #9BD3F0,64px 52px 0 #3B2A20,12px 56px 0 #3B2A20,16px 56px 0 #F2C09A,20px 56px 0 #3B2A20,24px 56px 0 #3E5C8A,28px 56px 0 #3E5C8A,32px 56px 0 #DDE6E8,36px 56px 0 #DDE6E8,40px 56px 0 #3E5C8A,44px 56px 0 #3E5C8A,48px 56px 0 #3B2A20,52px 56px 0 #F2C09A,56px 56px 0 #F2C09A,60px 56px 0 #9BD3F0,64px 56px 0 #3B2A20,12px 60px 0 #3B2A20,16px 60px 0 #F2C09A,20px 60px 0 #3B2A20,24px 60px 0 #2C4266,28px 60px 0 #3E5C8A,32px 60px 0 #DDE6E8,36px 60px 0 #DDE6E8,40px 60px 0 #3E5C8A,44px 60px 0 #2C4266,48px 60px 0 #3B2A20,52px 60px 0 #F2C09A,56px 60px 0 #F2C09A,60px 60px 0 #9BD3F0,64px 60px 0 #3B2A20,12px 64px 0 #3B2A20,16px 64px 0 #3B2A20,20px 64px 0 #3B2A20,24px 64px 0 #3E5C8A,28px 64px 0 #3E5C8A,32px 64px 0 #3E5C8A,36px 64px 0 #3E5C8A,40px 64px 0 #3E5C8A,44px 64px 0 #3E5C8A,48px 64px 0 #3B2A20,52px 64px 0 #3B2A20,56px 64px 0 #3B2A20,60px 64px 0 #9BD3F0,64px 64px 0 #3B2A20,20px 68px 0 #3B2A20,24px 68px 0 #DDE6E8,28px 68px 0 #DDE6E8,32px 68px 0 #DDE6E8,36px 68px 0 #DDE6E8,40px 68px 0 #DDE6E8,44px 68px 0 #DDE6E8,48px 68px 0 #3B2A20,56px 68px 0 #3B2A20,60px 68px 0 #9BD3F0,64px 68px 0 #3B2A20,20px 72px 0 #3B2A20,24px 72px 0 #2C4266,28px 72px 0 #2C4266,32px 72px 0 #2C4266,36px 72px 0 #2C4266,40px 72px 0 #2C4266,44px 72px 0 #2C4266,48px 72px 0 #3B2A20,56px 72px 0 #3B2A20,60px 72px 0 #9BD3F0,64px 72px 0 #3B2A20,20px 76px 0 #3B2A20,24px 76px 0 #4A5A7A,28px 76px 0 #4A5A7A,32px 76px 0 #4A5A7A,36px 76px 0 #4A5A7A,40px 76px 0 #4A5A7A,44px 76px 0 #4A5A7A,48px 76px 0 #3B2A20,60px 76px 0 #3B2A20,20px 80px 0 #3B2A20,24px 80px 0 #4A5A7A,28px 80px 0 #4A5A7A,32px 80px 0 #3B2A20,36px 80px 0 #3B2A20,40px 80px 0 #4A5A7A,44px 80px 0 #4A5A7A,48px 80px 0 #3B2A20,20px 84px 0 #3B2A20,24px 84px 0 #4A5A7A,28px 84px 0 #4A5A7A,32px 84px 0 #3B2A20,36px 84px 0 #3B2A20,40px 84px 0 #4A5A7A,44px 84px 0 #4A5A7A,48px 84px 0 #3B2A20,20px 88px 0 #3B2A20,24px 88px 0 #4A5A7A,28px 88px 0 #4A5A7A,32px 88px 0 #3B2A20,36px 88px 0 #3B2A20,40px 88px 0 #4A5A7A,44px 88px 0 #4A5A7A,48px 88px 0 #3B2A20,16px 92px 0 #3B2A20,20px 92px 0 #5C3A1E,24px 92px 0 #5C3A1E,28px 92px 0 #5C3A1E,32px 92px 0 #3B2A20,36px 92px 0 #3B2A20,40px 92px 0 #5C3A1E,44px 92px 0 #5C3A1E,48px 92px 0 #5C3A1E,52px 92px 0 #3B2A20,16px 96px 0 #3B2A20,20px 96px 0 #3B2A20,24px 96px 0 #3B2A20,28px 96px 0 #3B2A20,32px 96px 0 #3B2A20,36px 96px 0 #3B2A20,40px 96px 0 #3B2A20,44px 96px 0 #3B2A20,48px 96px 0 #3B2A20,52px 96px 0 #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 796px; top: 266px; width: 4px; height: 4px; box-shadow: 24px 8px 0 #3B2A20,28px 8px 0 #3B2A20,32px 8px 0 #3B2A20,36px 8px 0 #3B2A20,40px 8px 0 #3B2A20,44px 8px 0 #3B2A20,20px 12px 0 #3B2A20,24px 12px 0 #F2C230,28px 12px 0 #F2C230,32px 12px 0 #FFFFFF,36px 12px 0 #F2C230,40px 12px 0 #F2C230,44px 12px 0 #F2C230,48px 12px 0 #3B2A20,56px 12px 0 #3B2A20,60px 12px 0 #3B2A20,64px 12px 0 #3B2A20,16px 16px 0 #3B2A20,20px 16px 0 #F2C230,24px 16px 0 #F2C230,28px 16px 0 #F2C230,32px 16px 0 #F2C230,36px 16px 0 #F2C230,40px 16px 0 #F2C230,44px 16px 0 #F2C230,48px 16px 0 #F2C230,52px 16px 0 #3B2A20,56px 16px 0 #3B2A20,60px 16px 0 #8B5A2B,64px 16px 0 #3B2A20,12px 20px 0 #3B2A20,16px 20px 0 #C99A1A,20px 20px 0 #C99A1A,24px 20px 0 #C99A1A,28px 20px 0 #C99A1A,32px 20px 0 #C99A1A,36px 20px 0 #C99A1A,40px 20px 0 #C99A1A,44px 20px 0 #C99A1A,48px 20px 0 #C99A1A,52px 20px 0 #C99A1A,56px 20px 0 #3B2A20,60px 20px 0 #8B5A2B,64px 20px 0 #3B2A20,16px 24px 0 #3B2A20,20px 24px 0 #F2C09A,24px 24px 0 #F2C09A,28px 24px 0 #F2C09A,32px 24px 0 #F2C09A,36px 24px 0 #F2C09A,40px 24px 0 #F2C09A,44px 24px 0 #F2C09A,48px 24px 0 #F2C09A,52px 24px 0 #3B2A20,56px 24px 0 #3B2A20,60px 24px 0 #8B5A2B,64px 24px 0 #3B2A20,16px 28px 0 #3B2A20,20px 28px 0 #F2C09A,24px 28px 0 #3B2A20,28px 28px 0 #F2C09A,32px 28px 0 #F2C09A,36px 28px 0 #F2C09A,40px 28px 0 #F2C09A,44px 28px 0 #3B2A20,48px 28px 0 #F2C09A,52px 28px 0 #3B2A20,56px 28px 0 #3B2A20,60px 28px 0 #8B5A2B,64px 28px 0 #3B2A20,16px 32px 0 #3B2A20,20px 32px 0 #F2C09A,24px 32px 0 #F2C09A,28px 32px 0 #F2C09A,32px 32px 0 #F2C09A,36px 32px 0 #F2C09A,40px 32px 0 #F2C09A,44px 32px 0 #F2C09A,48px 32px 0 #F2C09A,52px 32px 0 #3B2A20,56px 32px 0 #3B2A20,60px 32px 0 #8B5A2B,64px 32px 0 #3B2A20,16px 36px 0 #3B2A20,20px 36px 0 #F2C09A,24px 36px 0 #EE9A8A,28px 36px 0 #F2C09A,32px 36px 0 #F2C09A,36px 36px 0 #F2C09A,40px 36px 0 #F2C09A,44px 36px 0 #EE9A8A,48px 36px 0 #F2C09A,52px 36px 0 #3B2A20,56px 36px 0 #3B2A20,60px 36px 0 #8B5A2B,64px 36px 0 #3B2A20,20px 40px 0 #3B2A20,24px 40px 0 #F2C09A,28px 40px 0 #F2C09A,32px 40px 0 #F2C09A,36px 40px 0 #F2C09A,40px 40px 0 #F2C09A,44px 40px 0 #F2C09A,48px 40px 0 #3B2A20,56px 40px 0 #3B2A20,60px 40px 0 #8B5A2B,64px 40px 0 #3B2A20,24px 44px 0 #3B2A20,28px 44px 0 #3B2A20,32px 44px 0 #3B2A20,36px 44px 0 #3B2A20,40px 44px 0 #3B2A20,44px 44px 0 #3B2A20,56px 44px 0 #3B2A20,60px 44px 0 #8B5A2B,64px 44px 0 #3B2A20,20px 48px 0 #3B2A20,24px 48px 0 #9AA0A6,28px 48px 0 #9AA0A6,32px 48px 0 #DDE6E8,36px 48px 0 #DDE6E8,40px 48px 0 #9AA0A6,44px 48px 0 #9AA0A6,48px 48px 0 #3B2A20,56px 48px 0 #3B2A20,60px 48px 0 #8B5A2B,64px 48px 0 #3B2A20,16px 52px 0 #3B2A20,20px 52px 0 #9AA0A6,24px 52px 0 #9AA0A6,28px 52px 0 #9AA0A6,32px 52px 0 #DDE6E8,36px 52px 0 #DDE6E8,40px 52px 0 #9AA0A6,44px 52px 0 #9AA0A6,48px 52px 0 #9AA0A6,52px 52px 0 #3B2A20,56px 52px 0 #3B2A20,60px 52px 0 #8B5A2B,64px 52px 0 #3B2A20,12px 56px 0 #3B2A20,16px 56px 0 #F2C09A,20px 56px 0 #3B2A20,24px 56px 0 #9AA0A6,28px 56px 0 #9AA0A6,32px 56px 0 #DDE6E8,36px 56px 0 #DDE6E8,40px 56px 0 #9AA0A6,44px 56px 0 #9AA0A6,48px 56px 0 #3B2A20,52px 56px 0 #F2C09A,56px 56px 0 #F2C09A,60px 56px 0 #8B5A2B,64px 56px 0 #3B2A20,12px 60px 0 #3B2A20,16px 60px 0 #F2C09A,20px 60px 0 #3B2A20,24px 60px 0 #73797F,28px 60px 0 #9AA0A6,32px 60px 0 #DDE6E8,36px 60px 0 #DDE6E8,40px 60px 0 #9AA0A6,44px 60px 0 #73797F,48px 60px 0 #3B2A20,52px 60px 0 #F2C09A,56px 60px 0 #F2C09A,60px 60px 0 #8B5A2B,64px 60px 0 #3B2A20,12px 64px 0 #3B2A20,16px 64px 0 #3B2A20,20px 64px 0 #3B2A20,24px 64px 0 #9AA0A6,28px 64px 0 #9AA0A6,32px 64px 0 #9AA0A6,36px 64px 0 #9AA0A6,40px 64px 0 #9AA0A6,44px 64px 0 #9AA0A6,48px 64px 0 #3B2A20,52px 64px 0 #3B2A20,56px 64px 0 #B8BEC4,60px 64px 0 #B8BEC4,64px 64px 0 #3B2A20,20px 68px 0 #3B2A20,24px 68px 0 #DDE6E8,28px 68px 0 #DDE6E8,32px 68px 0 #DDE6E8,36px 68px 0 #DDE6E8,40px 68px 0 #DDE6E8,44px 68px 0 #DDE6E8,48px 68px 0 #3B2A20,52px 68px 0 #3B2A20,56px 68px 0 #B8BEC4,60px 68px 0 #B8BEC4,64px 68px 0 #3B2A20,20px 72px 0 #3B2A20,24px 72px 0 #73797F,28px 72px 0 #73797F,32px 72px 0 #73797F,36px 72px 0 #73797F,40px 72px 0 #73797F,44px 72px 0 #73797F,48px 72px 0 #3B2A20,52px 72px 0 #3B2A20,56px 72px 0 #B8BEC4,60px 72px 0 #B8BEC4,64px 72px 0 #3B2A20,20px 76px 0 #3B2A20,24px 76px 0 #4A5A7A,28px 76px 0 #4A5A7A,32px 76px 0 #4A5A7A,36px 76px 0 #4A5A7A,40px 76px 0 #4A5A7A,44px 76px 0 #4A5A7A,48px 76px 0 #3B2A20,52px 76px 0 #3B2A20,56px 76px 0 #B8BEC4,60px 76px 0 #B8BEC4,64px 76px 0 #3B2A20,20px 80px 0 #3B2A20,24px 80px 0 #4A5A7A,28px 80px 0 #4A5A7A,32px 80px 0 #3B2A20,36px 80px 0 #3B2A20,40px 80px 0 #4A5A7A,44px 80px 0 #4A5A7A,48px 80px 0 #3B2A20,52px 80px 0 #3B2A20,56px 80px 0 #3B2A20,60px 80px 0 #3B2A20,64px 80px 0 #3B2A20,20px 84px 0 #3B2A20,24px 84px 0 #4A5A7A,28px 84px 0 #4A5A7A,32px 84px 0 #3B2A20,36px 84px 0 #3B2A20,40px 84px 0 #4A5A7A,44px 84px 0 #4A5A7A,48px 84px 0 #3B2A20,20px 88px 0 #3B2A20,24px 88px 0 #4A5A7A,28px 88px 0 #4A5A7A,32px 88px 0 #3B2A20,36px 88px 0 #3B2A20,40px 88px 0 #4A5A7A,44px 88px 0 #4A5A7A,48px 88px 0 #3B2A20,16px 92px 0 #3B2A20,20px 92px 0 #5C3A1E,24px 92px 0 #5C3A1E,28px 92px 0 #5C3A1E,32px 92px 0 #3B2A20,36px 92px 0 #3B2A20,40px 92px 0 #5C3A1E,44px 92px 0 #5C3A1E,48px 92px 0 #5C3A1E,52px 92px 0 #3B2A20,16px 96px 0 #3B2A20,20px 96px 0 #3B2A20,24px 96px 0 #3B2A20,28px 96px 0 #3B2A20,32px 96px 0 #3B2A20,36px 96px 0 #3B2A20,40px 96px 0 #3B2A20,44px 96px 0 #3B2A20,48px 96px 0 #3B2A20,52px 96px 0 #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 916px; top: 284px; width: 4px; height: 4px; box-shadow: 24px 8px 0 #3B2A20,28px 8px 0 #3B2A20,32px 8px 0 #3B2A20,36px 8px 0 #3B2A20,40px 8px 0 #3B2A20,44px 8px 0 #3B2A20,20px 12px 0 #3B2A20,24px 12px 0 #F4F1E8,28px 12px 0 #F4F1E8,32px 12px 0 #FFFFFF,36px 12px 0 #F4F1E8,40px 12px 0 #F4F1E8,44px 12px 0 #F4F1E8,48px 12px 0 #3B2A20,16px 16px 0 #3B2A20,20px 16px 0 #F4F1E8,24px 16px 0 #F4F1E8,28px 16px 0 #F4F1E8,32px 16px 0 #F4F1E8,36px 16px 0 #F4F1E8,40px 16px 0 #F4F1E8,44px 16px 0 #F4F1E8,48px 16px 0 #F4F1E8,52px 16px 0 #3B2A20,12px 20px 0 #3B2A20,16px 20px 0 #CFC8B8,20px 20px 0 #CFC8B8,24px 20px 0 #CFC8B8,28px 20px 0 #CFC8B8,32px 20px 0 #CFC8B8,36px 20px 0 #CFC8B8,40px 20px 0 #CFC8B8,44px 20px 0 #CFC8B8,48px 20px 0 #CFC8B8,52px 20px 0 #CFC8B8,56px 20px 0 #3B2A20,16px 24px 0 #3B2A20,20px 24px 0 #F2C09A,24px 24px 0 #F2C09A,28px 24px 0 #F2C09A,32px 24px 0 #F2C09A,36px 24px 0 #F2C09A,40px 24px 0 #F2C09A,44px 24px 0 #F2C09A,48px 24px 0 #F2C09A,52px 24px 0 #3B2A20,16px 28px 0 #3B2A20,20px 28px 0 #F2C09A,24px 28px 0 #3B2A20,28px 28px 0 #F2C09A,32px 28px 0 #F2C09A,36px 28px 0 #F2C09A,40px 28px 0 #F2C09A,44px 28px 0 #3B2A20,48px 28px 0 #F2C09A,52px 28px 0 #3B2A20,16px 32px 0 #3B2A20,20px 32px 0 #F2C09A,24px 32px 0 #F2C09A,28px 32px 0 #F2C09A,32px 32px 0 #F2C09A,36px 32px 0 #F2C09A,40px 32px 0 #F2C09A,44px 32px 0 #F2C09A,48px 32px 0 #F2C09A,52px 32px 0 #3B2A20,16px 36px 0 #3B2A20,20px 36px 0 #F2C09A,24px 36px 0 #EE9A8A,28px 36px 0 #F2C09A,32px 36px 0 #F2C09A,36px 36px 0 #F2C09A,40px 36px 0 #F2C09A,44px 36px 0 #EE9A8A,48px 36px 0 #F2C09A,52px 36px 0 #3B2A20,20px 40px 0 #3B2A20,24px 40px 0 #F2C09A,28px 40px 0 #F2C09A,32px 40px 0 #F2C09A,36px 40px 0 #F2C09A,40px 40px 0 #F2C09A,44px 40px 0 #F2C09A,48px 40px 0 #3B2A20,24px 44px 0 #3B2A20,28px 44px 0 #3B2A20,32px 44px 0 #3B2A20,36px 44px 0 #3B2A20,40px 44px 0 #3B2A20,44px 44px 0 #3B2A20,56px 44px 0 #B8BEC4,20px 48px 0 #3B2A20,24px 48px 0 #5BB65F,28px 48px 0 #5BB65F,32px 48px 0 #DDE6E8,36px 48px 0 #DDE6E8,40px 48px 0 #5BB65F,44px 48px 0 #5BB65F,48px 48px 0 #3B2A20,52px 48px 0 #3B2A20,56px 48px 0 #B8BEC4,60px 48px 0 #3B2A20,64px 48px 0 #3B2A20,16px 52px 0 #3B2A20,20px 52px 0 #5BB65F,24px 52px 0 #5BB65F,28px 52px 0 #5BB65F,32px 52px 0 #DDE6E8,36px 52px 0 #DDE6E8,40px 52px 0 #5BB65F,44px 52px 0 #5BB65F,48px 52px 0 #3B2A20,52px 52px 0 #F4E4BC,56px 52px 0 #F4E4BC,60px 52px 0 #F4E4BC,64px 52px 0 #3B2A20,12px 56px 0 #3B2A20,16px 56px 0 #F2C09A,20px 56px 0 #3B2A20,24px 56px 0 #5BB65F,28px 56px 0 #5BB65F,32px 56px 0 #DDE6E8,36px 56px 0 #DDE6E8,40px 56px 0 #5BB65F,44px 56px 0 #5BB65F,48px 56px 0 #3B2A20,52px 56px 0 #3B2A20,56px 56px 0 #3B2A20,60px 56px 0 #3B2A20,64px 56px 0 #3B2A20,12px 60px 0 #3B2A20,16px 60px 0 #F2C09A,20px 60px 0 #3B2A20,24px 60px 0 #3E8C42,28px 60px 0 #5BB65F,32px 60px 0 #DDE6E8,36px 60px 0 #DDE6E8,40px 60px 0 #5BB65F,44px 60px 0 #3E8C42,48px 60px 0 #3B2A20,52px 60px 0 #F4E4BC,56px 60px 0 #F4E4BC,60px 60px 0 #F4E4BC,64px 60px 0 #3B2A20,12px 64px 0 #3B2A20,16px 64px 0 #3B2A20,20px 64px 0 #3B2A20,24px 64px 0 #5BB65F,28px 64px 0 #5BB65F,32px 64px 0 #5BB65F,36px 64px 0 #5BB65F,40px 64px 0 #5BB65F,44px 64px 0 #5BB65F,48px 64px 0 #3B2A20,52px 64px 0 #3B2A20,56px 64px 0 #3B2A20,60px 64px 0 #F4E4BC,64px 64px 0 #3B2A20,20px 68px 0 #3B2A20,24px 68px 0 #DDE6E8,28px 68px 0 #DDE6E8,32px 68px 0 #DDE6E8,36px 68px 0 #DDE6E8,40px 68px 0 #DDE6E8,44px 68px 0 #DDE6E8,48px 68px 0 #3B2A20,52px 68px 0 #F4E4BC,56px 68px 0 #F4E4BC,60px 68px 0 #F4E4BC,64px 68px 0 #3B2A20,20px 72px 0 #3B2A20,24px 72px 0 #3E8C42,28px 72px 0 #3E8C42,32px 72px 0 #3E8C42,36px 72px 0 #3E8C42,40px 72px 0 #3E8C42,44px 72px 0 #3E8C42,48px 72px 0 #3B2A20,52px 72px 0 #3B2A20,56px 72px 0 #3B2A20,60px 72px 0 #3B2A20,64px 72px 0 #3B2A20,20px 76px 0 #3B2A20,24px 76px 0 #4A5A7A,28px 76px 0 #4A5A7A,32px 76px 0 #4A5A7A,36px 76px 0 #4A5A7A,40px 76px 0 #4A5A7A,44px 76px 0 #4A5A7A,48px 76px 0 #3B2A20,20px 80px 0 #3B2A20,24px 80px 0 #4A5A7A,28px 80px 0 #4A5A7A,32px 80px 0 #3B2A20,36px 80px 0 #3B2A20,40px 80px 0 #4A5A7A,44px 80px 0 #4A5A7A,48px 80px 0 #3B2A20,20px 84px 0 #3B2A20,24px 84px 0 #4A5A7A,28px 84px 0 #4A5A7A,32px 84px 0 #3B2A20,36px 84px 0 #3B2A20,40px 84px 0 #4A5A7A,44px 84px 0 #4A5A7A,48px 84px 0 #3B2A20,20px 88px 0 #3B2A20,24px 88px 0 #4A5A7A,28px 88px 0 #4A5A7A,32px 88px 0 #3B2A20,36px 88px 0 #3B2A20,40px 88px 0 #4A5A7A,44px 88px 0 #4A5A7A,48px 88px 0 #3B2A20,16px 92px 0 #3B2A20,20px 92px 0 #5C3A1E,24px 92px 0 #5C3A1E,28px 92px 0 #5C3A1E,32px 92px 0 #3B2A20,36px 92px 0 #3B2A20,40px 92px 0 #5C3A1E,44px 92px 0 #5C3A1E,48px 92px 0 #5C3A1E,52px 92px 0 #3B2A20,16px 96px 0 #3B2A20,20px 96px 0 #3B2A20,24px 96px 0 #3B2A20,28px 96px 0 #3B2A20,32px 96px 0 #3B2A20,36px 96px 0 #3B2A20,40px 96px 0 #3B2A20,44px 96px 0 #3B2A20,48px 96px 0 #3B2A20,52px 96px 0 #3B2A20">
</div>
<div style="position: absolute; left: 440px; top: 392px; width: 96px; text-align: center; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">철근공</div>
<div style="position: absolute; left: 560px; top: 374px; width: 96px; text-align: center; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">형틀목수</div>
<div style="position: absolute; left: 672px; top: 362px; width: 96px; text-align: center; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">현장소장(나)</div>
<div style="position: absolute; left: 784px; top: 374px; width: 96px; text-align: center; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">타설팀</div>
<div style="position: absolute; left: 904px; top: 392px; width: 96px; text-align: center; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">안전관리자</div>
<div style="position: absolute; left: 600px; top: 150px; width: 240px; padding: 12px; box-sizing: border-box; background: #FFFFFF; border: 3px solid #3B2A20; font-size: 16px; line-height: 20px; text-align: center">오늘도 무사고!<br>다짐을 하나 골라 주세요<div aria-hidden="true" style="position: absolute; left: 108px; bottom: -12px; width: 12px; height: 9px; background: #FFFFFF; border-left: 3px solid #3B2A20; border-right: 3px solid #3B2A20; border-bottom: 3px solid #3B2A20">
</div>
</div>
<div style="position: absolute; left: 420px; top: 24px; width: 600px; height: 96px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420">
<div style="position: absolute; left: 6px; top: 6px; width: 582px; height: 78px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div style="position: absolute; left: 0px; top: 12px; width: 576px; text-align: center; font-size: 32px; line-height: 32px; color: #3B2A20; white-space: nowrap">아침 TBM</div>
<div style="position: absolute; left: 0px; top: 52px; width: 576px; text-align: center; font-size: 16px; line-height: 16px; color: #5C3A1E; white-space: nowrap">작업 전 안전점검 회의 · 판 시작 10초</div>
</div>
</div>
<div style="position: absolute; left: 24px; top: 24px; width: 282px; height: 93px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420">
<div style="position: absolute; left: 6px; top: 6px; width: 264px; height: 75px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div style="position: absolute; left: 9px; top: 9px; font-size: 16px; line-height: 16px; color: #5C3A1E; white-space: nowrap">${esc(v.siteName)}</div>
<div style="position: absolute; left: 9px; top: 33px; font-size: 32px; line-height: 32px; color: #3B2A20; white-space: nowrap">${esc(v.daysText)}</div>
</div>
</div>
<div style="position: absolute; left: 1116px; top: 150px; width: 300px; height: 84px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998; transform: rotate(-2deg)">
<div style="position: absolute; left: 12px; top: 12px; font-size: 16px; line-height: 16px; color: #8B3A1E; white-space: nowrap">현장 말 한 줄</div>
<div style="position: absolute; left: 12px; top: 36px; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">${esc(v.slang)}</div>
<div style="position: absolute; left: 12px; top: 56px; font-size: 16px; line-height: 16px; color: #5C3A1E; white-space: nowrap">(도감에 자동 저장)</div>
</div>
<button type="button" data-act="pledge:0" aria-label="${esc(v.p[0].aria)}" style="position: absolute; left: 108px; top: 528px; width: 360px; height: 228px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420; text-align: left; outline: 4px solid #7BD389; outline-offset: 4px; animation: pulse 0.8s steps(2) infinite"><span style="display: block; position: absolute; left: 9px; top: 9px; width: 342px; height: 210px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998"><span aria-hidden="true" style="display: block; position: absolute; left: 12px; top: 6px; width: 6px; height: 6px; box-shadow: 18px 12px 0 #3B2A20,24px 12px 0 #3B2A20,30px 12px 0 #3B2A20,36px 12px 0 #3B2A20,12px 18px 0 #3B2A20,18px 18px 0 #E35D5B,24px 18px 0 #E35D5B,30px 18px 0 #FFFFFF,36px 18px 0 #E35D5B,42px 18px 0 #3B2A20,6px 24px 0 #3B2A20,12px 24px 0 #E35D5B,18px 24px 0 #E35D5B,24px 24px 0 #E35D5B,30px 24px 0 #E35D5B,36px 24px 0 #E35D5B,42px 24px 0 #E35D5B,48px 24px 0 #3B2A20,6px 30px 0 #3B2A20,12px 30px 0 #E35D5B,18px 30px 0 #E35D5B,24px 30px 0 #E35D5B,30px 30px 0 #E35D5B,36px 30px 0 #E35D5B,42px 30px 0 #B83E3C,48px 30px 0 #3B2A20,6px 36px 0 #3B2A20,12px 36px 0 #B83E3C,18px 36px 0 #B83E3C,24px 36px 0 #B83E3C,30px 36px 0 #B83E3C,36px 36px 0 #B83E3C,42px 36px 0 #B83E3C,48px 36px 0 #3B2A20,6px 42px 0 #3B2A20,12px 42px 0 #3B2A20,18px 42px 0 #3B2A20,24px 42px 0 #3B2A20,30px 42px 0 #3B2A20,36px 42px 0 #3B2A20,42px 42px 0 #3B2A20,48px 42px 0 #3B2A20"></span><span style="display: block; position: absolute; left: 84px; top: 15px; font-size: 32px; line-height: 32px; color: #3B2A20; white-space: nowrap">${esc(v.p[0].name)}</span><span style="display: block; position: absolute; left: 84px; top: 57px; width: 240px; margin: 0; font-size: 16px; line-height: 20px; color: #23602A; white-space: normal; word-break: keep-all">${esc(v.p[0].text)}</span><span aria-hidden="true" style="display: block; position: absolute; left: 12px; top: 114px; width: 312px; height: 3px; background: #E0C998"></span><span style="display: block; position: absolute; left: 12px; top: 129px; font-size: 16px; line-height: 16px; color: #8B3A1E; white-space: nowrap">현장에서는</span><span style="display: block; position: absolute; left: 12px; top: 151px; width: 318px; margin: 0; font-size: 16px; line-height: 20px; color: #5C3A1E; white-space: normal; word-break: keep-all">${esc(v.p[0].field)}</span></span><span style="display: block; position: absolute; left: 246px; top: -18px; width: 96px; height: 30px; box-sizing: border-box; background: #5BB65F; border: 3px solid #3B2A20"><span style="display: block; position: absolute; left: 0px; top: 4px; width: 90px; text-align: center; font-size: 16px; line-height: 16px; color: #FFFFFF; white-space: nowrap; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">선택</span></span></button>
<button type="button" data-act="pledge:1" aria-label="${esc(v.p[1].aria)}" style="position: absolute; left: 540px; top: 528px; width: 360px; height: 228px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420; text-align: left; outline: 4px solid #7BD389; outline-offset: 4px; animation: pulse 0.8s steps(2) infinite"><span style="display: block; position: absolute; left: 9px; top: 9px; width: 342px; height: 210px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998"><span style="display: block; position: absolute; left: 12px; top: 30px; width: 54px; height: 21px; box-sizing: border-box; background: #E8D2A0; border: 3px solid #3B2A20"></span><span style="display: block; position: absolute; left: 18px; top: 15px; width: 42px; height: 18px; box-sizing: border-box; background: #D9C08A; border: 3px solid #3B2A20"></span><span style="display: block; position: absolute; left: 9px; top: 51px; width: 60px; height: 9px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20"></span><span style="display: block; position: absolute; left: 84px; top: 15px; font-size: 32px; line-height: 32px; color: #3B2A20; white-space: nowrap">${esc(v.p[1].name)}</span><span style="display: block; position: absolute; left: 84px; top: 57px; width: 240px; margin: 0; font-size: 16px; line-height: 20px; color: #23602A; white-space: normal; word-break: keep-all">${esc(v.p[1].text)}</span><span aria-hidden="true" style="display: block; position: absolute; left: 12px; top: 114px; width: 312px; height: 3px; background: #E0C998"></span><span style="display: block; position: absolute; left: 12px; top: 129px; font-size: 16px; line-height: 16px; color: #8B3A1E; white-space: nowrap">현장에서는</span><span style="display: block; position: absolute; left: 12px; top: 151px; width: 318px; margin: 0; font-size: 16px; line-height: 20px; color: #5C3A1E; white-space: normal; word-break: keep-all">${esc(v.p[1].field)}</span></span><span style="display: block; position: absolute; left: 246px; top: -18px; width: 96px; height: 30px; box-sizing: border-box; background: #5BB65F; border: 3px solid #3B2A20"><span style="display: block; position: absolute; left: 0px; top: 4px; width: 90px; text-align: center; font-size: 16px; line-height: 16px; color: #FFFFFF; white-space: nowrap; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">선택</span></span></button>
<button type="button" data-act="pledge:2" aria-label="${esc(v.p[2].aria)}" style="position: absolute; left: 972px; top: 528px; width: 360px; height: 228px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420; text-align: left; outline: 4px solid #7BD389; outline-offset: 4px; animation: pulse 0.8s steps(2) infinite"><span style="display: block; position: absolute; left: 9px; top: 9px; width: 342px; height: 210px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998"><span aria-hidden="true" style="display: block; position: absolute; left: 12px; top: 9px; width: 3px; height: 3px; box-shadow: 36px 6px 0 #3B2A20,39px 6px 0 #3B2A20,42px 6px 0 #3B2A20,33px 9px 0 #3B2A20,36px 9px 0 #B8BEC4,39px 9px 0 #B8BEC4,42px 9px 0 #3B2A20,30px 12px 0 #3B2A20,33px 12px 0 #B8BEC4,36px 12px 0 #B8BEC4,39px 12px 0 #3B2A20,27px 15px 0 #3B2A20,30px 15px 0 #B8BEC4,33px 15px 0 #B8BEC4,36px 15px 0 #3B2A20,24px 18px 0 #3B2A20,27px 18px 0 #B8BEC4,30px 18px 0 #B8BEC4,33px 18px 0 #3B2A20,21px 21px 0 #3B2A20,24px 21px 0 #B8BEC4,27px 21px 0 #B8BEC4,30px 21px 0 #3B2A20,6px 24px 0 #3B2A20,9px 24px 0 #3B2A20,12px 24px 0 #3B2A20,15px 24px 0 #3B2A20,18px 24px 0 #3B2A20,21px 24px 0 #3B2A20,24px 24px 0 #3B2A20,27px 24px 0 #3B2A20,30px 24px 0 #3B2A20,33px 24px 0 #3B2A20,36px 24px 0 #3B2A20,39px 24px 0 #3B2A20,42px 24px 0 #3B2A20,45px 24px 0 #3B2A20,6px 27px 0 #3B2A20,9px 27px 0 #F2C230,12px 27px 0 #F2C230,15px 27px 0 #F2C230,18px 27px 0 #F2C230,21px 27px 0 #F2C230,24px 27px 0 #F2C230,27px 27px 0 #F2C230,30px 27px 0 #3B2A20,33px 27px 0 #9BD3F0,36px 27px 0 #9BD3F0,39px 27px 0 #9BD3F0,42px 27px 0 #9BD3F0,45px 27px 0 #3B2A20,6px 30px 0 #3B2A20,9px 30px 0 #F2C230,12px 30px 0 #F2C230,15px 30px 0 #F2C230,18px 30px 0 #F2C230,21px 30px 0 #F2C230,24px 30px 0 #F2C230,27px 30px 0 #F2C230,30px 30px 0 #3B2A20,33px 30px 0 #9BD3F0,36px 30px 0 #FFFFFF,39px 30px 0 #9BD3F0,42px 30px 0 #9BD3F0,45px 30px 0 #3B2A20,6px 33px 0 #3B2A20,9px 33px 0 #F2C230,12px 33px 0 #C99A1A,15px 33px 0 #F2C230,18px 33px 0 #F2C230,21px 33px 0 #F2C230,24px 33px 0 #F2C230,27px 33px 0 #F2C230,30px 33px 0 #F2C230,33px 33px 0 #F2C230,36px 33px 0 #F2C230,39px 33px 0 #F2C230,42px 33px 0 #F2C230,45px 33px 0 #3B2A20,6px 36px 0 #3B2A20,9px 36px 0 #3B2A20,12px 36px 0 #3B2A20,15px 36px 0 #3B2A20,18px 36px 0 #3B2A20,21px 36px 0 #3B2A20,24px 36px 0 #3B2A20,27px 36px 0 #3B2A20,30px 36px 0 #3B2A20,33px 36px 0 #3B2A20,36px 36px 0 #3B2A20,39px 36px 0 #3B2A20,42px 36px 0 #3B2A20,45px 36px 0 #3B2A20,9px 39px 0 #3B2A20,12px 39px 0 #2E2E2E,15px 39px 0 #2E2E2E,18px 39px 0 #3B2A20,33px 39px 0 #3B2A20,36px 39px 0 #2E2E2E,39px 39px 0 #2E2E2E,42px 39px 0 #3B2A20,9px 42px 0 #3B2A20,12px 42px 0 #3B2A20,15px 42px 0 #3B2A20,18px 42px 0 #3B2A20,33px 42px 0 #3B2A20,36px 42px 0 #3B2A20,39px 42px 0 #3B2A20,42px 42px 0 #3B2A20"></span><span style="display: block; position: absolute; left: 84px; top: 15px; font-size: 32px; line-height: 32px; color: #3B2A20; white-space: nowrap">${esc(v.p[2].name)}</span><span style="display: block; position: absolute; left: 84px; top: 57px; width: 240px; margin: 0; font-size: 16px; line-height: 20px; color: #23602A; white-space: normal; word-break: keep-all">${esc(v.p[2].text)}</span><span aria-hidden="true" style="display: block; position: absolute; left: 12px; top: 114px; width: 312px; height: 3px; background: #E0C998"></span><span style="display: block; position: absolute; left: 12px; top: 129px; font-size: 16px; line-height: 16px; color: #8B3A1E; white-space: nowrap">현장에서는</span><span style="display: block; position: absolute; left: 12px; top: 151px; width: 318px; margin: 0; font-size: 16px; line-height: 20px; color: #5C3A1E; white-space: normal; word-break: keep-all">${esc(v.p[2].field)}</span></span><span style="display: block; position: absolute; left: 246px; top: -18px; width: 96px; height: 30px; box-sizing: border-box; background: #5BB65F; border: 3px solid #3B2A20"><span style="display: block; position: absolute; left: 0px; top: 4px; width: 90px; text-align: center; font-size: 16px; line-height: 16px; color: #FFFFFF; white-space: nowrap; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">선택</span></span></button>
<div style="position: absolute; left: 0px; top: 774px; width: 1440px; text-align: center; font-size: 16px; line-height: 16px; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">고른 다짐은 이번 판 내내 적용돼요 · 고르면 바로 대전 화면으로</div>
</div>`;

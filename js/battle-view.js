// 대전 화면 그림판: 도트 디자인 시안 ②의 마크업을 옮긴 것.
// v는 battle.js가 만든 화면 값, esc는 글자 안전 처리 함수. 누를 수 있는 곳은 data-act 값으로 구분한다.
var JG = globalThis.JG = globalThis.JG || {};

JG.battleView = (v, esc) => `<div style="position: relative; width: 1440px; height: 810px; overflow: hidden; font-family: 'Galmuri11', monospace; font-size: 16px; line-height: 16px; color: #3B2A20; -webkit-font-smoothing: none; font-smooth: never; background: ${esc(v.sky)}">
<div aria-hidden="true" style="position: absolute; left: 57px; top: 147px; width: 3px; height: 3px; box-shadow: 21px 3px 0 #3B2A20,24px 3px 0 #3B2A20,27px 3px 0 #3B2A20,30px 3px 0 #3B2A20,15px 6px 0 #3B2A20,18px 6px 0 #3B2A20,21px 6px 0 #FFFFFF,24px 6px 0 #FFFFFF,27px 6px 0 #FFFFFF,30px 6px 0 #FFFFFF,33px 6px 0 #3B2A20,36px 6px 0 #3B2A20,48px 6px 0 #3B2A20,51px 6px 0 #3B2A20,54px 6px 0 #3B2A20,57px 6px 0 #3B2A20,12px 9px 0 #3B2A20,15px 9px 0 #FFFFFF,18px 9px 0 #FFFFFF,21px 9px 0 #FFFFFF,24px 9px 0 #FFFFFF,27px 9px 0 #FFFFFF,30px 9px 0 #FFFFFF,33px 9px 0 #FFFFFF,36px 9px 0 #FFFFFF,39px 9px 0 #3B2A20,45px 9px 0 #3B2A20,48px 9px 0 #FFFFFF,51px 9px 0 #FFFFFF,54px 9px 0 #FFFFFF,57px 9px 0 #FFFFFF,60px 9px 0 #3B2A20,63px 9px 0 #3B2A20,6px 12px 0 #3B2A20,9px 12px 0 #3B2A20,12px 12px 0 #FFFFFF,15px 12px 0 #FFFFFF,18px 12px 0 #FFFFFF,21px 12px 0 #FFFFFF,24px 12px 0 #FFFFFF,27px 12px 0 #FFFFFF,30px 12px 0 #FFFFFF,33px 12px 0 #FFFFFF,36px 12px 0 #FFFFFF,39px 12px 0 #FFFFFF,42px 12px 0 #3B2A20,45px 12px 0 #FFFFFF,48px 12px 0 #FFFFFF,51px 12px 0 #FFFFFF,54px 12px 0 #FFFFFF,57px 12px 0 #FFFFFF,60px 12px 0 #FFFFFF,63px 12px 0 #FFFFFF,66px 12px 0 #3B2A20,3px 15px 0 #3B2A20,6px 15px 0 #FFFFFF,9px 15px 0 #FFFFFF,12px 15px 0 #FFFFFF,15px 15px 0 #FFFFFF,18px 15px 0 #FFFFFF,21px 15px 0 #FFFFFF,24px 15px 0 #FFFFFF,27px 15px 0 #FFFFFF,30px 15px 0 #FFFFFF,33px 15px 0 #FFFFFF,36px 15px 0 #FFFFFF,39px 15px 0 #FFFFFF,42px 15px 0 #FFFFFF,45px 15px 0 #FFFFFF,48px 15px 0 #FFFFFF,51px 15px 0 #FFFFFF,54px 15px 0 #FFFFFF,57px 15px 0 #FFFFFF,60px 15px 0 #FFFFFF,63px 15px 0 #FFFFFF,66px 15px 0 #FFFFFF,69px 15px 0 #3B2A20,3px 18px 0 #3B2A20,6px 18px 0 #DCE8EE,9px 18px 0 #FFFFFF,12px 18px 0 #FFFFFF,15px 18px 0 #FFFFFF,18px 18px 0 #FFFFFF,21px 18px 0 #FFFFFF,24px 18px 0 #FFFFFF,27px 18px 0 #FFFFFF,30px 18px 0 #FFFFFF,33px 18px 0 #FFFFFF,36px 18px 0 #FFFFFF,39px 18px 0 #FFFFFF,42px 18px 0 #FFFFFF,45px 18px 0 #FFFFFF,48px 18px 0 #FFFFFF,51px 18px 0 #FFFFFF,54px 18px 0 #FFFFFF,57px 18px 0 #FFFFFF,60px 18px 0 #FFFFFF,63px 18px 0 #FFFFFF,66px 18px 0 #DCE8EE,69px 18px 0 #3B2A20,6px 21px 0 #3B2A20,9px 21px 0 #DCE8EE,12px 21px 0 #DCE8EE,15px 21px 0 #DCE8EE,18px 21px 0 #DCE8EE,21px 21px 0 #DCE8EE,24px 21px 0 #DCE8EE,27px 21px 0 #DCE8EE,30px 21px 0 #DCE8EE,33px 21px 0 #DCE8EE,36px 21px 0 #DCE8EE,39px 21px 0 #DCE8EE,42px 21px 0 #DCE8EE,45px 21px 0 #DCE8EE,48px 21px 0 #DCE8EE,51px 21px 0 #DCE8EE,54px 21px 0 #DCE8EE,57px 21px 0 #DCE8EE,60px 21px 0 #DCE8EE,63px 21px 0 #DCE8EE,66px 21px 0 #3B2A20,9px 24px 0 #3B2A20,12px 24px 0 #3B2A20,15px 24px 0 #3B2A20,18px 24px 0 #3B2A20,21px 24px 0 #3B2A20,24px 24px 0 #3B2A20,27px 24px 0 #3B2A20,30px 24px 0 #3B2A20,33px 24px 0 #3B2A20,36px 24px 0 #3B2A20,39px 24px 0 #3B2A20,42px 24px 0 #3B2A20,45px 24px 0 #3B2A20,48px 24px 0 #3B2A20,51px 24px 0 #3B2A20,54px 24px 0 #3B2A20,57px 24px 0 #3B2A20,60px 24px 0 #3B2A20,63px 24px 0 #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 297px; top: 51px; width: 3px; height: 3px; box-shadow: 21px 3px 0 #3B2A20,24px 3px 0 #3B2A20,27px 3px 0 #3B2A20,30px 3px 0 #3B2A20,15px 6px 0 #3B2A20,18px 6px 0 #3B2A20,21px 6px 0 #FFFFFF,24px 6px 0 #FFFFFF,27px 6px 0 #FFFFFF,30px 6px 0 #FFFFFF,33px 6px 0 #3B2A20,36px 6px 0 #3B2A20,48px 6px 0 #3B2A20,51px 6px 0 #3B2A20,54px 6px 0 #3B2A20,57px 6px 0 #3B2A20,12px 9px 0 #3B2A20,15px 9px 0 #FFFFFF,18px 9px 0 #FFFFFF,21px 9px 0 #FFFFFF,24px 9px 0 #FFFFFF,27px 9px 0 #FFFFFF,30px 9px 0 #FFFFFF,33px 9px 0 #FFFFFF,36px 9px 0 #FFFFFF,39px 9px 0 #3B2A20,45px 9px 0 #3B2A20,48px 9px 0 #FFFFFF,51px 9px 0 #FFFFFF,54px 9px 0 #FFFFFF,57px 9px 0 #FFFFFF,60px 9px 0 #3B2A20,63px 9px 0 #3B2A20,6px 12px 0 #3B2A20,9px 12px 0 #3B2A20,12px 12px 0 #FFFFFF,15px 12px 0 #FFFFFF,18px 12px 0 #FFFFFF,21px 12px 0 #FFFFFF,24px 12px 0 #FFFFFF,27px 12px 0 #FFFFFF,30px 12px 0 #FFFFFF,33px 12px 0 #FFFFFF,36px 12px 0 #FFFFFF,39px 12px 0 #FFFFFF,42px 12px 0 #3B2A20,45px 12px 0 #FFFFFF,48px 12px 0 #FFFFFF,51px 12px 0 #FFFFFF,54px 12px 0 #FFFFFF,57px 12px 0 #FFFFFF,60px 12px 0 #FFFFFF,63px 12px 0 #FFFFFF,66px 12px 0 #3B2A20,3px 15px 0 #3B2A20,6px 15px 0 #FFFFFF,9px 15px 0 #FFFFFF,12px 15px 0 #FFFFFF,15px 15px 0 #FFFFFF,18px 15px 0 #FFFFFF,21px 15px 0 #FFFFFF,24px 15px 0 #FFFFFF,27px 15px 0 #FFFFFF,30px 15px 0 #FFFFFF,33px 15px 0 #FFFFFF,36px 15px 0 #FFFFFF,39px 15px 0 #FFFFFF,42px 15px 0 #FFFFFF,45px 15px 0 #FFFFFF,48px 15px 0 #FFFFFF,51px 15px 0 #FFFFFF,54px 15px 0 #FFFFFF,57px 15px 0 #FFFFFF,60px 15px 0 #FFFFFF,63px 15px 0 #FFFFFF,66px 15px 0 #FFFFFF,69px 15px 0 #3B2A20,3px 18px 0 #3B2A20,6px 18px 0 #DCE8EE,9px 18px 0 #FFFFFF,12px 18px 0 #FFFFFF,15px 18px 0 #FFFFFF,18px 18px 0 #FFFFFF,21px 18px 0 #FFFFFF,24px 18px 0 #FFFFFF,27px 18px 0 #FFFFFF,30px 18px 0 #FFFFFF,33px 18px 0 #FFFFFF,36px 18px 0 #FFFFFF,39px 18px 0 #FFFFFF,42px 18px 0 #FFFFFF,45px 18px 0 #FFFFFF,48px 18px 0 #FFFFFF,51px 18px 0 #FFFFFF,54px 18px 0 #FFFFFF,57px 18px 0 #FFFFFF,60px 18px 0 #FFFFFF,63px 18px 0 #FFFFFF,66px 18px 0 #DCE8EE,69px 18px 0 #3B2A20,6px 21px 0 #3B2A20,9px 21px 0 #DCE8EE,12px 21px 0 #DCE8EE,15px 21px 0 #DCE8EE,18px 21px 0 #DCE8EE,21px 21px 0 #DCE8EE,24px 21px 0 #DCE8EE,27px 21px 0 #DCE8EE,30px 21px 0 #DCE8EE,33px 21px 0 #DCE8EE,36px 21px 0 #DCE8EE,39px 21px 0 #DCE8EE,42px 21px 0 #DCE8EE,45px 21px 0 #DCE8EE,48px 21px 0 #DCE8EE,51px 21px 0 #DCE8EE,54px 21px 0 #DCE8EE,57px 21px 0 #DCE8EE,60px 21px 0 #DCE8EE,63px 21px 0 #DCE8EE,66px 21px 0 #3B2A20,9px 24px 0 #3B2A20,12px 24px 0 #3B2A20,15px 24px 0 #3B2A20,18px 24px 0 #3B2A20,21px 24px 0 #3B2A20,24px 24px 0 #3B2A20,27px 24px 0 #3B2A20,30px 24px 0 #3B2A20,33px 24px 0 #3B2A20,36px 24px 0 #3B2A20,39px 24px 0 #3B2A20,42px 24px 0 #3B2A20,45px 24px 0 #3B2A20,48px 24px 0 #3B2A20,51px 24px 0 #3B2A20,54px 24px 0 #3B2A20,57px 24px 0 #3B2A20,60px 24px 0 #3B2A20,63px 24px 0 #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 957px; top: 219px; width: 3px; height: 3px; box-shadow: 21px 3px 0 #3B2A20,24px 3px 0 #3B2A20,27px 3px 0 #3B2A20,30px 3px 0 #3B2A20,15px 6px 0 #3B2A20,18px 6px 0 #3B2A20,21px 6px 0 #FFFFFF,24px 6px 0 #FFFFFF,27px 6px 0 #FFFFFF,30px 6px 0 #FFFFFF,33px 6px 0 #3B2A20,36px 6px 0 #3B2A20,48px 6px 0 #3B2A20,51px 6px 0 #3B2A20,54px 6px 0 #3B2A20,57px 6px 0 #3B2A20,12px 9px 0 #3B2A20,15px 9px 0 #FFFFFF,18px 9px 0 #FFFFFF,21px 9px 0 #FFFFFF,24px 9px 0 #FFFFFF,27px 9px 0 #FFFFFF,30px 9px 0 #FFFFFF,33px 9px 0 #FFFFFF,36px 9px 0 #FFFFFF,39px 9px 0 #3B2A20,45px 9px 0 #3B2A20,48px 9px 0 #FFFFFF,51px 9px 0 #FFFFFF,54px 9px 0 #FFFFFF,57px 9px 0 #FFFFFF,60px 9px 0 #3B2A20,63px 9px 0 #3B2A20,6px 12px 0 #3B2A20,9px 12px 0 #3B2A20,12px 12px 0 #FFFFFF,15px 12px 0 #FFFFFF,18px 12px 0 #FFFFFF,21px 12px 0 #FFFFFF,24px 12px 0 #FFFFFF,27px 12px 0 #FFFFFF,30px 12px 0 #FFFFFF,33px 12px 0 #FFFFFF,36px 12px 0 #FFFFFF,39px 12px 0 #FFFFFF,42px 12px 0 #3B2A20,45px 12px 0 #FFFFFF,48px 12px 0 #FFFFFF,51px 12px 0 #FFFFFF,54px 12px 0 #FFFFFF,57px 12px 0 #FFFFFF,60px 12px 0 #FFFFFF,63px 12px 0 #FFFFFF,66px 12px 0 #3B2A20,3px 15px 0 #3B2A20,6px 15px 0 #FFFFFF,9px 15px 0 #FFFFFF,12px 15px 0 #FFFFFF,15px 15px 0 #FFFFFF,18px 15px 0 #FFFFFF,21px 15px 0 #FFFFFF,24px 15px 0 #FFFFFF,27px 15px 0 #FFFFFF,30px 15px 0 #FFFFFF,33px 15px 0 #FFFFFF,36px 15px 0 #FFFFFF,39px 15px 0 #FFFFFF,42px 15px 0 #FFFFFF,45px 15px 0 #FFFFFF,48px 15px 0 #FFFFFF,51px 15px 0 #FFFFFF,54px 15px 0 #FFFFFF,57px 15px 0 #FFFFFF,60px 15px 0 #FFFFFF,63px 15px 0 #FFFFFF,66px 15px 0 #FFFFFF,69px 15px 0 #3B2A20,3px 18px 0 #3B2A20,6px 18px 0 #DCE8EE,9px 18px 0 #FFFFFF,12px 18px 0 #FFFFFF,15px 18px 0 #FFFFFF,18px 18px 0 #FFFFFF,21px 18px 0 #FFFFFF,24px 18px 0 #FFFFFF,27px 18px 0 #FFFFFF,30px 18px 0 #FFFFFF,33px 18px 0 #FFFFFF,36px 18px 0 #FFFFFF,39px 18px 0 #FFFFFF,42px 18px 0 #FFFFFF,45px 18px 0 #FFFFFF,48px 18px 0 #FFFFFF,51px 18px 0 #FFFFFF,54px 18px 0 #FFFFFF,57px 18px 0 #FFFFFF,60px 18px 0 #FFFFFF,63px 18px 0 #FFFFFF,66px 18px 0 #DCE8EE,69px 18px 0 #3B2A20,6px 21px 0 #3B2A20,9px 21px 0 #DCE8EE,12px 21px 0 #DCE8EE,15px 21px 0 #DCE8EE,18px 21px 0 #DCE8EE,21px 21px 0 #DCE8EE,24px 21px 0 #DCE8EE,27px 21px 0 #DCE8EE,30px 21px 0 #DCE8EE,33px 21px 0 #DCE8EE,36px 21px 0 #DCE8EE,39px 21px 0 #DCE8EE,42px 21px 0 #DCE8EE,45px 21px 0 #DCE8EE,48px 21px 0 #DCE8EE,51px 21px 0 #DCE8EE,54px 21px 0 #DCE8EE,57px 21px 0 #DCE8EE,60px 21px 0 #DCE8EE,63px 21px 0 #DCE8EE,66px 21px 0 #3B2A20,9px 24px 0 #3B2A20,12px 24px 0 #3B2A20,15px 24px 0 #3B2A20,18px 24px 0 #3B2A20,21px 24px 0 #3B2A20,24px 24px 0 #3B2A20,27px 24px 0 #3B2A20,30px 24px 0 #3B2A20,33px 24px 0 #3B2A20,36px 24px 0 #3B2A20,39px 24px 0 #3B2A20,42px 24px 0 #3B2A20,45px 24px 0 #3B2A20,48px 24px 0 #3B2A20,51px 24px 0 #3B2A20,54px 24px 0 #3B2A20,57px 24px 0 #3B2A20,60px 24px 0 #3B2A20,63px 24px 0 #3B2A20">
</div>
<div aria-hidden="true">
<div style="position: absolute; left: 852px; top: 42px; width: 24px; height: 258px; background: #F2C230; border-left: 3px solid #3B2A20; border-right: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 852px; top: 54px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 63px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 78px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 87px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 102px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 111px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 126px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 135px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 150px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 159px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 174px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 183px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 198px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 207px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 222px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 231px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 246px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 255px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 270px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 279px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 852px; top: 294px; width: 24px; height: 3px; background: #3B2A20">
</div>
<div style="position: absolute; left: 861px; top: 303px; width: 6px; height: 6px; background: #C99A1A">
</div>
<div style="position: absolute; left: 576px; top: 24px; width: 516px; height: 18px; background: #F2C230; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 588px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 606px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 624px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 642px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 660px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 678px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 696px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 714px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 732px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 750px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 768px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 786px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 804px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 822px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 840px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 858px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 876px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 894px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 912px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 930px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 948px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 966px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 984px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 1002px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 1020px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 1038px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 1056px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 1074px; top: 30px; width: 6px; height: 6px; background: #3B2A20">
</div>
<div style="position: absolute; left: 1020px; top: 42px; width: 54px; height: 30px; background: #9AA0A6; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 846px; top: 42px; width: 36px; height: 27px; background: #F2C230; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 852px; top: 48px; width: 15px; height: 9px; background: #9BD3F0">
</div>
<div style="position: absolute; left: 837px; top: 291px; width: 54px; height: 9px; background: #7E858C; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
</div>
<div aria-hidden="true" style="position: absolute; left: 777px; top: 42px; width: 27px; height: 9px; background: #7E858C; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
${v.bays.map(b => `
<div aria-hidden="true" style="position: absolute; left: ${esc(b.l)}px; top: ${esc(b.t)}px; width: 3px; height: 3px; box-shadow: ${esc(b.shadow)}">
</div>
`).join('')}
${v.showNext ? `
<div aria-hidden="true" style="position: absolute; left: ${esc(v.nextL)}px; top: ${esc(v.nextT)}px; width: 48px; height: 48px; box-sizing: border-box; border: 3px dashed #FFE08A; animation: blink 0.6s steps(2) infinite">
</div>
` : ''}
${v.showRoof ? `
<div aria-hidden="true">
<div style="position: absolute; left: 618px; top: ${esc(v.roofTop)}px; width: 204px; height: 21px; box-sizing: border-box; background: #9AA0A6; border: 3px solid #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 699px; top: ${esc(v.flagTop)}px; width: 3px; height: 3px; box-shadow: 3px 3px 0 #3B2A20,3px 6px 0 #3B2A20,6px 6px 0 #E35D5B,9px 6px 0 #E35D5B,12px 6px 0 #E35D5B,15px 6px 0 #E35D5B,18px 6px 0 #3B2A20,3px 9px 0 #3B2A20,6px 9px 0 #E35D5B,9px 9px 0 #E35D5B,12px 9px 0 #E35D5B,15px 9px 0 #E35D5B,18px 9px 0 #E35D5B,21px 9px 0 #3B2A20,3px 12px 0 #3B2A20,6px 12px 0 #E35D5B,9px 12px 0 #E35D5B,12px 12px 0 #E35D5B,15px 12px 0 #E35D5B,18px 12px 0 #3B2A20,3px 15px 0 #3B2A20,3px 18px 0 #3B2A20,3px 21px 0 #3B2A20,3px 24px 0 #3B2A20">
</div>
</div>
` : ''}
<div aria-hidden="true" style="position: absolute; left: 789px; top: 51px; width: 3px; height: ${esc(v.hookH)}px; background: #3B2A20">
</div>
<div aria-hidden="true" style="position: absolute; left: 771px; top: ${esc(v.palletTop)}px; width: 39px; height: 21px; background: #C0603C; border: 3px solid #3B2A20; box-sizing: border-box; box-shadow: inset 0 -6px 0 #9A4A2E">
</div>
<button type="button" data-act="${esc(v.hitBuilding)}" aria-label="${esc(v.bldAria)}" style="position: absolute; left: 612px; top: ${esc(v.bldTop)}px; width: 216px; height: ${esc(v.bldH)}px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: transparent; border: 3px solid ${esc(v.bldBorder)}; animation: ${esc(v.bldAnim)}; outline: ${esc(v.bldOutline)}; outline-offset: 3px"></button>
${v.rain ? `
<div aria-hidden="true" style="position: absolute; left: 0px; top: 0px; width: 1440px; height: 336px; pointer-events: none; animation: rain 0.45s steps(3) infinite">
<div style="position: absolute; left: 363px; top: 225px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 834px; top: 48px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 567px; top: 231px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 726px; top: 240px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 891px; top: 24px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 930px; top: 3px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1395px; top: 180px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 396px; top: 210px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 357px; top: 72px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1101px; top: 180px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 828px; top: 210px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 729px; top: 150px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 981px; top: 57px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 354px; top: 243px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 231px; top: 198px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 597px; top: 282px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 21px; top: 255px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1191px; top: 24px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 243px; top: 291px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 906px; top: 15px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 462px; top: 297px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 45px; top: 102px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 726px; top: 228px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1104px; top: 147px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1095px; top: 162px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 606px; top: 279px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1230px; top: 219px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 681px; top: 51px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1347px; top: 138px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 147px; top: 12px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 207px; top: 189px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 333px; top: 99px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1032px; top: 165px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1194px; top: 240px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1311px; top: 114px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 645px; top: 192px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1278px; top: 147px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 879px; top: 132px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 819px; top: 222px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 624px; top: 222px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 354px; top: 129px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1047px; top: 9px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1314px; top: 105px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 930px; top: 255px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1068px; top: 60px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1071px; top: 123px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 831px; top: 219px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 873px; top: 39px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1095px; top: 249px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 324px; top: 243px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1275px; top: 219px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 408px; top: 108px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 189px; top: 24px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 738px; top: 243px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 741px; top: 33px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 528px; top: 24px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 630px; top: 57px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 30px; top: 111px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 654px; top: 294px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 636px; top: 45px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 66px; top: 231px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 942px; top: 291px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 69px; top: 144px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1101px; top: 225px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 507px; top: 210px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1353px; top: 105px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 774px; top: 90px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 54px; top: 117px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 9px; top: 27px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 165px; top: 228px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 822px; top: 12px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 303px; top: 156px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 447px; top: 234px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 402px; top: 57px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1059px; top: 15px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1332px; top: 129px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 480px; top: 138px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 210px; top: 144px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 576px; top: 174px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
<div style="position: absolute; left: 1335px; top: 198px; width: 3px; height: 12px; background: #E3F2FA; opacity: 0.75">
</div>
</div>
` : ''}
<div aria-hidden="true" style="position: absolute; left: 412px; top: 204px; width: 9px; height: 96px; background: #6B4420; border-left: 3px solid #3B2A20; border-right: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 288px; top: 96px; width: 260px; height: 108px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420">
<div style="position: absolute; left: 6px; top: 6px; width: 242px; height: 90px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div style="position: absolute; left: 9px; top: 9px; font-size: 16px; line-height: 16px; color: #5C3A1E; white-space: nowrap">${esc(v.condLabel)}</div>
<div style="position: absolute; left: 9px; top: 31px; font-size: 32px; line-height: 32px; color: #3B2A20; white-space: nowrap">${esc(v.condName)}</div>
<div style="position: absolute; left: 9px; top: 69px; font-size: 16px; line-height: 16px; color: #8B3A1E; white-space: nowrap">${esc(v.condText)}</div>
</div>
</div>
<div aria-hidden="true" style="position: absolute; left: 462px; top: 288px; width: 6px; height: 12px; background: #6B4420">
</div>
<div aria-hidden="true" style="position: absolute; left: 576px; top: 288px; width: 6px; height: 12px; background: #6B4420">
</div>
<div style="position: absolute; left: 444px; top: 207px; width: 156px; height: 84px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420">
<div style="position: absolute; left: 6px; top: 6px; width: 138px; height: 66px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div style="position: absolute; left: 6px; top: 6px; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">${esc(v.siteName)}</div>
<div style="position: absolute; left: 6px; top: 24px; font-size: 16px; line-height: 16px; color: #8B3A1E; white-space: nowrap">벽돌 ${esc(v.bricks)}/${esc(v.totalBricks)}칸</div>
<div style="position: absolute; left: 6px; top: 42px; font-size: 16px; line-height: 16px; color: #3E5C8A; white-space: nowrap">${esc(v.floorText)}</div>
</div>
</div>
<div style="position: absolute; left: 24px; top: 24px; width: 240px; height: 84px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420">
<div style="position: absolute; left: 6px; top: 6px; width: 222px; height: 66px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div style="position: absolute; left: 9px; top: 9px; font-size: 32px; line-height: 32px; color: #3B2A20; white-space: nowrap">${esc(v.turnText)}</div>
<div style="position: absolute; left: 9px; top: 45px; font-size: 16px; line-height: 16px; color: #5C3A1E; white-space: nowrap">하늘: ${esc(v.skyName)}</div>
</div>
</div>
<div aria-hidden="true" style="position: absolute; left: 885px; top: 147px; width: 18px; height: 12px; background: #F4E4BC; border-top: 3px solid #3B2A20; border-bottom: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 900px; top: 96px; width: 192px; height: 102px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div style="position: absolute; left: 9px; top: 9px; font-size: 16px; line-height: 16px; color: #5C3A1E; white-space: nowrap">다음 턴 예고</div>
<div aria-hidden="true" style="position: absolute; left: 6px; top: 30px; width: 3px; height: 3px; box-shadow: ${esc(v.fcShadow)}">
</div>
<div style="position: absolute; left: 63px; top: 42px; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">${esc(v.fcName)}</div>
<div style="position: absolute; left: 63px; top: 62px; font-size: 16px; line-height: 16px; color: #8B3A1E; white-space: nowrap">${esc(v.fcStat)}</div>
</div>
<div style="position: absolute; left: 1104px; top: 24px; width: 312px; height: 276px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420">
<div style="position: absolute; left: 0px; top: 3px; width: 306px; height: 27px; font-size: 16px; line-height: 27px; text-align: center; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">현장 안내</div>
<div style="position: absolute; left: 6px; top: 33px; width: 294px; height: 228px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<p style="position: absolute; left: 9px; top: 9px; width: 270px; margin: 0; font-size: 16px; line-height: 20px; white-space: normal; word-break: keep-all">${esc(v.msg)}</p>
</div>
</div>
<div aria-hidden="true">
<div style="position: absolute; left: 0px; top: 300px; width: 1440px; height: 12px; background: #8BC34A; box-shadow: inset 0 -6px 0 #6FA83A">
</div>
<div style="position: absolute; left: 495px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 498px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 231px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 234px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 606px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 609px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 999px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1002px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 72px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 75px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 111px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 114px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1260px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1263px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 822px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 825px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 144px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 147px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 561px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 564px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 894px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 897px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 87px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 90px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1395px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1398px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 777px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 780px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 327px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 330px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 57px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 60px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 132px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 135px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 666px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 669px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 642px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 645px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 105px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 108px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 369px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 372px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 138px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 141px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 846px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 849px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 651px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 654px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 90px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 93px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1269px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1272px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 867px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 870px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 189px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 192px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 342px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 345px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 966px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 969px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 963px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 966px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 894px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 897px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 93px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 96px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 885px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 888px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 897px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 900px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 609px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 612px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 75px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 78px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 339px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 342px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 69px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 72px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 855px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 858px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1317px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1320px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 204px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 207px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 444px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 447px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 642px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 645px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 219px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 222px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 828px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 831px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 180px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 183px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 876px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 879px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 471px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 474px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 858px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 861px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1251px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1254px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1047px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1050px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 276px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 279px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 156px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 159px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 891px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 894px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 876px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 879px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 981px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 984px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 288px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 291px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 570px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 573px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 147px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 150px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 840px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 843px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1092px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1095px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 96px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 99px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 864px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 867px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 90px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 93px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 948px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 951px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 315px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 318px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 762px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 765px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 1044px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 1047px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
<div style="position: absolute; left: 816px; top: 294px; width: 3px; height: 6px; background: #6FA83A">
</div>
<div style="position: absolute; left: 819px; top: 297px; width: 3px; height: 3px; background: #8BC34A">
</div>
</div>
<div aria-hidden="true">
<div style="position: absolute; left: 954px; top: 408px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1290px; top: 489px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1383px; top: 372px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 720px; top: 405px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 879px; top: 405px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 624px; top: 417px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 243px; top: 603px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 948px; top: 549px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 201px; top: 312px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1188px; top: 393px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 444px; top: 432px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 279px; top: 576px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 456px; top: 318px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 252px; top: 366px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 507px; top: 426px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 99px; top: 429px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 738px; top: 579px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 738px; top: 492px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 393px; top: 318px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 27px; top: 522px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 576px; top: 534px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 69px; top: 582px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 180px; top: 600px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 528px; top: 507px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1191px; top: 489px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1320px; top: 423px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 138px; top: 390px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1410px; top: 366px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1419px; top: 579px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1053px; top: 432px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1224px; top: 342px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 741px; top: 372px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 921px; top: 516px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 363px; top: 594px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 699px; top: 561px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 84px; top: 555px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 513px; top: 633px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1122px; top: 528px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 162px; top: 375px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 228px; top: 333px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 216px; top: 486px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 747px; top: 576px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 420px; top: 423px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1383px; top: 366px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1260px; top: 516px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1332px; top: 441px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 753px; top: 414px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1206px; top: 615px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1164px; top: 429px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1281px; top: 498px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 522px; top: 561px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 726px; top: 522px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1029px; top: 417px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1254px; top: 504px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 420px; top: 558px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 537px; top: 633px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 558px; top: 438px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 303px; top: 633px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 432px; top: 576px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 261px; top: 546px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 957px; top: 522px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 300px; top: 372px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 336px; top: 603px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 723px; top: 396px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1368px; top: 363px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 276px; top: 495px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 636px; top: 489px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1017px; top: 546px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 363px; top: 585px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 537px; top: 465px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1329px; top: 354px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 843px; top: 546px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 453px; top: 519px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 540px; top: 624px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 627px; top: 624px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 216px; top: 372px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 303px; top: 363px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1260px; top: 564px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 165px; top: 435px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 966px; top: 528px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 663px; top: 396px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 735px; top: 582px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1311px; top: 372px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 762px; top: 408px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 489px; top: 429px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 219px; top: 495px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1011px; top: 549px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 450px; top: 327px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 18px; top: 495px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1434px; top: 492px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 750px; top: 414px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 450px; top: 501px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 24px; top: 603px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 432px; top: 516px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1122px; top: 513px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 537px; top: 450px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 3px; top: 408px; width: 3px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1362px; top: 573px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 657px; top: 609px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1317px; top: 633px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 600px; top: 573px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 714px; top: 630px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1284px; top: 312px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 993px; top: 609px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 219px; top: 375px; width: 9px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 507px; top: 516px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 897px; top: 519px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1125px; top: 399px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1215px; top: 336px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1107px; top: 474px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1077px; top: 498px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1293px; top: 357px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1092px; top: 363px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 228px; top: 381px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1230px; top: 372px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 66px; top: 525px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1143px; top: 339px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 876px; top: 531px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1347px; top: 549px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 663px; top: 345px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 750px; top: 447px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 210px; top: 579px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 873px; top: 552px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 402px; top: 336px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1278px; top: 600px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1239px; top: 402px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1131px; top: 459px; width: 6px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1095px; top: 318px; width: 3px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 879px; top: 567px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1326px; top: 357px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 597px; top: 489px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 165px; top: 615px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 81px; top: 636px; width: 9px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 1044px; top: 615px; width: 3px; height: 3px; background: #C68E55">
</div>
<div style="position: absolute; left: 126px; top: 567px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 213px; top: 579px; width: 6px; height: 3px; background: #B07A47">
</div>
<div style="position: absolute; left: 1281px; top: 402px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1428px; top: 546px; width: 9px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 579px; top: 363px; width: 6px; height: 3px; background: #E6B47E">
</div>
<div style="position: absolute; left: 1233px; top: 552px; width: 6px; height: 3px; background: #B07A47">
</div>
</div>
${v.rain ? `
<div aria-hidden="true">
<div style="position: absolute; left: 252px; top: 612px; width: 54px; height: 9px; background: #9CC7DC; box-shadow: 0 3px 0 #7FB0C8">
</div>
<div style="position: absolute; left: 261px; top: 615px; width: 12px; height: 3px; background: #E3F2FA">
</div>
<div style="position: absolute; left: 1188px; top: 606px; width: 72px; height: 9px; background: #9CC7DC; box-shadow: 0 3px 0 #7FB0C8">
</div>
<div style="position: absolute; left: 1197px; top: 609px; width: 12px; height: 3px; background: #E3F2FA">
</div>
<div style="position: absolute; left: 612px; top: 318px; width: 42px; height: 9px; background: #9CC7DC; box-shadow: 0 3px 0 #7FB0C8">
</div>
<div style="position: absolute; left: 621px; top: 321px; width: 12px; height: 3px; background: #E3F2FA">
</div>
</div>
` : ''}
${v.probZones.map(z => `
<button type="button" data-act="${esc(z.click)}" aria-label="${esc(z.aria)}" style="position: absolute; left: ${esc(z.x)}px; top: 318px; width: 180px; height: 132px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: ${esc(z.bg)}; border: ${esc(z.border)}; outline: ${esc(z.outline)}; outline-offset: 3px; animation: ${esc(z.anim)}">${z.occupied ? `<span aria-hidden="true" style="display: block; position: absolute; left: 9px; top: ${esc(z.spriteTop)}px; width: 3px; height: 3px; box-shadow: ${esc(z.shadow)}; animation: ${esc(z.bob)}"></span><span style="display: block; position: absolute; left: 66px; top: 12px; font-size: 16px; line-height: 16px; white-space: nowrap; text-align: left">${esc(z.name)}</span><span style="display: block; position: absolute; left: 66px; top: 36px; font-size: 16px; line-height: 16px; white-space: nowrap; text-align: left; color: ${esc(z.tagColor)}">${esc(z.tag)}</span><span style="display: block; position: absolute; left: 66px; top: 84px; width: 46px; height: 30px; box-sizing: border-box; background: #F2994A; border: 3px solid #3B2A20"><span aria-hidden="true" style="display: block; position: absolute; left: 0px; top: 2px; width: 2px; height: 2px; box-shadow: 2px 2px 0 #3B2A20,4px 2px 0 #3B2A20,6px 2px 0 #3B2A20,8px 2px 0 #3B2A20,10px 2px 0 #3B2A20,12px 2px 0 #3B2A20,14px 2px 0 #3B2A20,2px 4px 0 #3B2A20,4px 4px 0 #B8BEC4,6px 4px 0 #B8BEC4,8px 4px 0 #B8BEC4,10px 4px 0 #B8BEC4,12px 4px 0 #B8BEC4,14px 4px 0 #3B2A20,2px 6px 0 #3B2A20,4px 6px 0 #B8BEC4,6px 6px 0 #B8BEC4,8px 6px 0 #B8BEC4,10px 6px 0 #B8BEC4,12px 6px 0 #7E858C,14px 6px 0 #3B2A20,2px 8px 0 #3B2A20,4px 8px 0 #3B2A20,6px 8px 0 #3B2A20,8px 8px 0 #8B5A2B,10px 8px 0 #3B2A20,12px 8px 0 #3B2A20,14px 8px 0 #3B2A20,8px 10px 0 #3B2A20,10px 10px 0 #8B5A2B,12px 10px 0 #3B2A20,8px 12px 0 #3B2A20,10px 12px 0 #8B5A2B,12px 12px 0 #3B2A20,8px 14px 0 #3B2A20,10px 14px 0 #8B5A2B,12px 14px 0 #3B2A20,8px 16px 0 #3B2A20,10px 16px 0 #3B2A20,12px 16px 0 #3B2A20"></span><span style="display: block; position: absolute; right: 4px; top: 4px; font-size: 16px; line-height: 16px; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">${esc(z.atk)}</span></span><span style="display: block; position: absolute; left: 120px; top: 84px; width: 46px; height: 30px; box-sizing: border-box; background: #E35D5B; border: 3px solid #3B2A20"><span aria-hidden="true" style="display: block; position: absolute; left: 0px; top: 2px; width: 2px; height: 2px; box-shadow: 6px 4px 0 #3B2A20,8px 4px 0 #3B2A20,10px 4px 0 #3B2A20,12px 4px 0 #3B2A20,4px 6px 0 #3B2A20,6px 6px 0 #E35D5B,8px 6px 0 #E35D5B,10px 6px 0 #FFFFFF,12px 6px 0 #E35D5B,14px 6px 0 #3B2A20,2px 8px 0 #3B2A20,4px 8px 0 #E35D5B,6px 8px 0 #E35D5B,8px 8px 0 #E35D5B,10px 8px 0 #E35D5B,12px 8px 0 #E35D5B,14px 8px 0 #E35D5B,16px 8px 0 #3B2A20,2px 10px 0 #3B2A20,4px 10px 0 #E35D5B,6px 10px 0 #E35D5B,8px 10px 0 #E35D5B,10px 10px 0 #E35D5B,12px 10px 0 #E35D5B,14px 10px 0 #B83E3C,16px 10px 0 #3B2A20,2px 12px 0 #3B2A20,4px 12px 0 #B83E3C,6px 12px 0 #B83E3C,8px 12px 0 #B83E3C,10px 12px 0 #B83E3C,12px 12px 0 #B83E3C,14px 12px 0 #B83E3C,16px 12px 0 #3B2A20,2px 14px 0 #3B2A20,4px 14px 0 #3B2A20,6px 14px 0 #3B2A20,8px 14px 0 #3B2A20,10px 14px 0 #3B2A20,12px 14px 0 #3B2A20,14px 14px 0 #3B2A20,16px 14px 0 #3B2A20"></span><span style="display: block; position: absolute; right: 4px; top: 4px; font-size: 16px; line-height: 16px; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">${esc(z.hp)}</span></span>` : ''}
${z.empty ? `<span style="display: block; position: absolute; left: 0px; top: 54px; width: 174px; text-align: center; font-size: 16px; line-height: 16px; color: ${esc(z.emptyColor)}">${esc(z.emptyText)}</span>` : ''}</button>
${z.hasBubble ? `
<div style="position: absolute; left: ${esc(z.bx)}px; top: 282px; pointer-events: none; padding: 6px 9px; background: #FFFFFF; border: 3px solid #3B2A20; font-size: 16px; line-height: 16px; white-space: nowrap">${esc(z.bubble)}<div aria-hidden="true" style="position: absolute; left: 18px; bottom: -9px; width: 9px; height: 6px; background: #FFFFFF; border-left: 3px solid #3B2A20; border-right: 3px solid #3B2A20; border-bottom: 3px solid #3B2A20">
</div>
</div>
` : ''}
`).join('')}
${v.myZones.map(z => `
<button type="button" data-act="${esc(z.click)}" aria-label="${esc(z.aria)}" style="position: absolute; left: ${esc(z.x)}px; top: 462px; width: 180px; height: 132px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: ${esc(z.bg)}; border: ${esc(z.border)}; outline: ${esc(z.outline)}; outline-offset: 3px; animation: ${esc(z.anim)}">${z.occupied ? `<span aria-hidden="true" style="display: block; position: absolute; left: 9px; top: ${esc(z.spriteTop)}px; width: 3px; height: 3px; box-shadow: ${esc(z.shadow)}; animation: ${esc(z.bob)}"></span><span style="display: block; position: absolute; left: 66px; top: 12px; font-size: 16px; line-height: 16px; white-space: nowrap; text-align: left">${esc(z.name)}</span><span style="display: block; position: absolute; left: 66px; top: 36px; font-size: 16px; line-height: 16px; white-space: nowrap; text-align: left; color: ${esc(z.tagColor)}">${esc(z.tag)}</span><span style="display: block; position: absolute; left: 66px; top: 84px; width: 46px; height: 30px; box-sizing: border-box; background: #F2994A; border: 3px solid #3B2A20"><span aria-hidden="true" style="display: block; position: absolute; left: 0px; top: 2px; width: 2px; height: 2px; box-shadow: 2px 2px 0 #3B2A20,4px 2px 0 #3B2A20,6px 2px 0 #3B2A20,8px 2px 0 #3B2A20,10px 2px 0 #3B2A20,12px 2px 0 #3B2A20,14px 2px 0 #3B2A20,2px 4px 0 #3B2A20,4px 4px 0 #B8BEC4,6px 4px 0 #B8BEC4,8px 4px 0 #B8BEC4,10px 4px 0 #B8BEC4,12px 4px 0 #B8BEC4,14px 4px 0 #3B2A20,2px 6px 0 #3B2A20,4px 6px 0 #B8BEC4,6px 6px 0 #B8BEC4,8px 6px 0 #B8BEC4,10px 6px 0 #B8BEC4,12px 6px 0 #7E858C,14px 6px 0 #3B2A20,2px 8px 0 #3B2A20,4px 8px 0 #3B2A20,6px 8px 0 #3B2A20,8px 8px 0 #8B5A2B,10px 8px 0 #3B2A20,12px 8px 0 #3B2A20,14px 8px 0 #3B2A20,8px 10px 0 #3B2A20,10px 10px 0 #8B5A2B,12px 10px 0 #3B2A20,8px 12px 0 #3B2A20,10px 12px 0 #8B5A2B,12px 12px 0 #3B2A20,8px 14px 0 #3B2A20,10px 14px 0 #8B5A2B,12px 14px 0 #3B2A20,8px 16px 0 #3B2A20,10px 16px 0 #3B2A20,12px 16px 0 #3B2A20"></span><span style="display: block; position: absolute; right: 4px; top: 4px; font-size: 16px; line-height: 16px; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">${esc(z.atk)}</span></span><span style="display: block; position: absolute; left: 120px; top: 84px; width: 46px; height: 30px; box-sizing: border-box; background: #E35D5B; border: 3px solid #3B2A20"><span aria-hidden="true" style="display: block; position: absolute; left: 0px; top: 2px; width: 2px; height: 2px; box-shadow: 6px 4px 0 #3B2A20,8px 4px 0 #3B2A20,10px 4px 0 #3B2A20,12px 4px 0 #3B2A20,4px 6px 0 #3B2A20,6px 6px 0 #E35D5B,8px 6px 0 #E35D5B,10px 6px 0 #FFFFFF,12px 6px 0 #E35D5B,14px 6px 0 #3B2A20,2px 8px 0 #3B2A20,4px 8px 0 #E35D5B,6px 8px 0 #E35D5B,8px 8px 0 #E35D5B,10px 8px 0 #E35D5B,12px 8px 0 #E35D5B,14px 8px 0 #E35D5B,16px 8px 0 #3B2A20,2px 10px 0 #3B2A20,4px 10px 0 #E35D5B,6px 10px 0 #E35D5B,8px 10px 0 #E35D5B,10px 10px 0 #E35D5B,12px 10px 0 #E35D5B,14px 10px 0 #B83E3C,16px 10px 0 #3B2A20,2px 12px 0 #3B2A20,4px 12px 0 #B83E3C,6px 12px 0 #B83E3C,8px 12px 0 #B83E3C,10px 12px 0 #B83E3C,12px 12px 0 #B83E3C,14px 12px 0 #B83E3C,16px 12px 0 #3B2A20,2px 14px 0 #3B2A20,4px 14px 0 #3B2A20,6px 14px 0 #3B2A20,8px 14px 0 #3B2A20,10px 14px 0 #3B2A20,12px 14px 0 #3B2A20,14px 14px 0 #3B2A20,16px 14px 0 #3B2A20"></span><span style="display: block; position: absolute; right: 4px; top: 4px; font-size: 16px; line-height: 16px; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">${esc(z.hp)}</span></span>` : ''}
${z.empty ? `<span style="display: block; position: absolute; left: 0px; top: 54px; width: 174px; text-align: center; font-size: 16px; line-height: 16px; color: ${esc(z.emptyColor)}">${esc(z.emptyText)}</span>` : ''}</button>
${z.hasBubble ? `
<div style="position: absolute; left: ${esc(z.bx)}px; top: 426px; pointer-events: none; padding: 6px 9px; background: #FFFFFF; border: 3px solid #3B2A20; font-size: 16px; line-height: 16px; white-space: nowrap">${esc(z.bubble)}<div aria-hidden="true" style="position: absolute; left: 18px; bottom: -9px; width: 9px; height: 6px; background: #FFFFFF; border-left: 3px solid #3B2A20; border-right: 3px solid #3B2A20; border-bottom: 3px solid #3B2A20">
</div>
</div>
` : ''}
`).join('')}
<div style="position: absolute; left: 24px; top: 330px; width: 294px; height: 114px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420">
<div style="position: absolute; left: 0px; top: 3px; width: 288px; height: 24px; font-size: 16px; line-height: 24px; text-align: center; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">오늘의 TBM</div>
<div style="position: absolute; left: 6px; top: 30px; width: 276px; height: 72px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div style="position: absolute; left: 9px; top: 9px; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">${esc(v.pledgeName)}</div>
<p style="position: absolute; left: 9px; top: 31px; width: 252px; margin: 0; font-size: 16px; line-height: 18px; color: #3E5C8A; white-space: normal; word-break: keep-all">${esc(v.shieldText)}</p>
</div>
</div>
<div style="position: absolute; left: 48px; top: 492px; width: 96px; height: 30px; box-sizing: border-box; background: #D9C08A; border: 3px solid #3B2A20; box-shadow: inset 0 -6px 0 #BFA06A">
</div>
<div style="position: absolute; left: 72px; top: 468px; width: 96px; height: 30px; box-sizing: border-box; background: #E8D2A0; border: 3px solid #3B2A20; box-shadow: inset 0 -6px 0 #CDB07A">
</div>
<div style="position: absolute; left: 120px; top: 492px; width: 96px; height: 30px; box-sizing: border-box; background: #D9C08A; border: 3px solid #3B2A20; box-shadow: inset 0 -6px 0 #BFA06A">
</div>
<div style="position: absolute; left: 42px; top: 522px; width: 180px; height: 15px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20">
</div>
<div style="position: absolute; left: 42px; top: 537px; width: 12px; height: 12px; box-sizing: border-box; background: #6B4420">
</div>
<div style="position: absolute; left: 126px; top: 537px; width: 12px; height: 12px; box-sizing: border-box; background: #6B4420">
</div>
<div style="position: absolute; left: 210px; top: 537px; width: 12px; height: 12px; box-sizing: border-box; background: #6B4420">
</div>
<div style="position: absolute; left: 234px; top: 492px; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">자재 더미</div>
<div style="position: absolute; left: 234px; top: 512px; font-size: 16px; line-height: 16px; color: #5C3A1E; white-space: nowrap">${esc(v.deckText)}</div>
<button type="button" data-act="${esc(v.order)}" style="position: absolute; left: 1110px; top: 330px; width: 306px; height: 114px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -6px 0 #6B4420; opacity: ${esc(v.orderOpacity)}"><span style="display: block; font-size: 32px; line-height: 32px; color: #FFFFFF; text-shadow: 2px 0 #3B2A20, -2px 0 #3B2A20, 0 2px #3B2A20, 0 -2px #3B2A20, 2px 2px #3B2A20, -2px 2px #3B2A20, 2px -2px #3B2A20, -2px -2px #3B2A20">작업지시</span><span style="display: block; margin-top: 12px; font-size: 16px; line-height: 16px; color: #FFE08A; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">코인 2 · 작업팀 공격 +1</span></button>
<button type="button" data-act="${esc(v.restart)}" style="position: absolute; left: 1110px; top: 462px; width: 306px; height: 48px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998; font-size: 16px; line-height: 16px">처음부터 다시 하기</button>
<div style="position: absolute; left: 1110px; top: 528px; width: 306px; height: 66px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div aria-hidden="true" style="position: absolute; left: 9px; top: 9px; width: 18px; height: 12px; border: 3px solid #7BD389; box-sizing: border-box">
</div>
<div style="position: absolute; left: 36px; top: 9px; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">지금 할 수 있는 행동</div>
<div aria-hidden="true" style="position: absolute; left: 9px; top: 36px; width: 18px; height: 12px; border: 3px solid #E85D3A; box-sizing: border-box">
</div>
<div style="position: absolute; left: 36px; top: 36px; font-size: 16px; line-height: 16px; color: #3B2A20; white-space: nowrap">현장 문제 (치워야 함)</div>
</div>
<div style="position: absolute; left: 0px; top: 640px; width: 1440px; height: 170px; box-sizing: border-box; background: #8B5A2B; border-top: 6px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F">
</div>
<div aria-hidden="true">
<div style="position: absolute; left: 0px; top: 690px; width: 1440px; height: 3px; background: #6B4420">
</div>
<div style="position: absolute; left: 0px; top: 738px; width: 1440px; height: 3px; background: #6B4420">
</div>
<div style="position: absolute; left: 0px; top: 786px; width: 1440px; height: 3px; background: #6B4420">
</div>
</div>
<div style="position: absolute; left: 36px; top: 652px; width: 204px; height: 144px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div style="position: absolute; left: 3px; top: 0px; width: 192px; height: 30px; background: #E35D5B; border-bottom: 3px solid #3B2A20; box-sizing: border-box; font-size: 16px; line-height: 27px; text-align: center; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">공기 (내 체력)</div>
<div aria-hidden="true" style="position: absolute; left: 39px; top: -9px; width: 9px; height: 18px; background: #7E858C; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div aria-hidden="true" style="position: absolute; left: 150px; top: -9px; width: 9px; height: 18px; background: #7E858C; border: 3px solid #3B2A20; box-sizing: border-box">
</div>
<div style="position: absolute; left: 0px; top: 42px; width: 198px; text-align: center; font-size: 48px; line-height: 48px; color: ${esc(v.daysColor)}">${esc(v.daysText)}</div>
<div style="position: absolute; left: 0px; top: 102px; width: 198px; text-align: center; font-size: 16px; line-height: 16px; color: #5C3A1E; white-space: nowrap">남은 날짜</div>
</div>
<div style="position: absolute; left: 1116px; top: 652px; width: 288px; height: 60px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420">
<div style="position: absolute; left: 9px; top: 6px; font-size: 16px; line-height: 16px; color: #FFFFFF; white-space: nowrap; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">공사비</div>
${v.coins.map(k => `
<div aria-hidden="true" style="position: absolute; left: ${esc(k.l)}px; top: 27px; width: 3px; height: 3px; box-shadow: ${esc(k.shadow)}">
</div>
`).join('')}
<div style="position: absolute; left: 186px; top: 15px; font-size: 32px; line-height: 32px; color: #FFFFFF; white-space: nowrap; text-shadow: 2px 0 #3B2A20, -2px 0 #3B2A20, 0 2px #3B2A20, 0 -2px #3B2A20, 2px 2px #3B2A20, -2px 2px #3B2A20, 2px -2px #3B2A20, -2px -2px #3B2A20">${esc(v.coinText)}</div>
</div>
<button type="button" data-act="${esc(v.endTurn)}" style="position: absolute; left: 1116px; top: 720px; width: 288px; height: 78px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: #5BB65F; border: 3px solid #3B2A20; box-shadow: inset 0 -6px 0 #3E8C42, inset 0 3px 0 #8FD493; outline: ${esc(v.endOutline)}; outline-offset: 3px; animation: ${esc(v.endAnim)}; font-size: 32px; line-height: 32px; color: #FFFFFF; text-shadow: 2px 0 #3B2A20, -2px 0 #3B2A20, 0 2px #3B2A20, 0 -2px #3B2A20, 2px 2px #3B2A20, -2px 2px #3B2A20, 2px -2px #3B2A20, -2px -2px #3B2A20">턴 종료 ▶</button>
${v.hand.map(c => `
<button type="button" data-act="${esc(c.click)}" aria-label="${esc(c.aria)}" style="position: absolute; left: ${esc(c.x)}px; top: ${esc(c.y)}px; width: 144px; height: 192px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 0 0 6px ${esc(c.frame)}; outline: ${esc(c.outline)}; outline-offset: 3px; animation: ${esc(c.anim)}; opacity: ${esc(c.opacity)}; text-align: center"><span style="display: block; position: absolute; left: 6px; top: 6px; width: 126px; height: 27px; background: ${esc(c.band)}; font-size: 16px; line-height: 27px; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">${esc(c.name)}</span><span aria-hidden="true" style="display: block; position: absolute; left: ${esc(c.artX)}px; top: ${esc(c.artY)}px; width: 3px; height: 3px; box-shadow: ${esc(c.shadow)}"></span><span style="display: block; position: absolute; left: 9px; top: 114px; width: 120px; font-size: 16px; line-height: 16px; white-space: normal; word-break: keep-all">${esc(c.text)}</span><span aria-hidden="true" style="display: block; position: absolute; left: -19px; top: -19px; width: 4px; height: 4px; box-shadow: 12px 4px 0 #3B2A20,16px 4px 0 #3B2A20,20px 4px 0 #3B2A20,24px 4px 0 #3B2A20,8px 8px 0 #3B2A20,12px 8px 0 #F7C948,16px 8px 0 #F7C948,20px 8px 0 #F7C948,24px 8px 0 #F7C948,28px 8px 0 #3B2A20,4px 12px 0 #3B2A20,8px 12px 0 #F7C948,12px 12px 0 #FFFFFF,16px 12px 0 #F7C948,20px 12px 0 #F7C948,24px 12px 0 #F7C948,28px 12px 0 #D9A520,32px 12px 0 #3B2A20,4px 16px 0 #3B2A20,8px 16px 0 #F7C948,12px 16px 0 #FFFFFF,16px 16px 0 #F7C948,20px 16px 0 #F7C948,24px 16px 0 #F7C948,28px 16px 0 #D9A520,32px 16px 0 #3B2A20,4px 20px 0 #3B2A20,8px 20px 0 #F7C948,12px 20px 0 #F7C948,16px 20px 0 #F7C948,20px 20px 0 #F7C948,24px 20px 0 #F7C948,28px 20px 0 #D9A520,32px 20px 0 #3B2A20,4px 24px 0 #3B2A20,8px 24px 0 #F7C948,12px 24px 0 #F7C948,16px 24px 0 #F7C948,20px 24px 0 #F7C948,24px 24px 0 #D9A520,28px 24px 0 #D9A520,32px 24px 0 #3B2A20,8px 28px 0 #3B2A20,12px 28px 0 #D9A520,16px 28px 0 #D9A520,20px 28px 0 #D9A520,24px 28px 0 #D9A520,28px 28px 0 #3B2A20,12px 32px 0 #3B2A20,16px 32px 0 #3B2A20,20px 32px 0 #3B2A20,24px 32px 0 #3B2A20"></span><span style="display: block; position: absolute; left: -15px; top: -15px; width: 32px; height: 32px; font-size: 16px; line-height: 32px">${esc(c.cost)}</span>${c.isCrew ? `<span style="display: block; position: absolute; left: 6px; top: 153px; width: 46px; height: 30px; box-sizing: border-box; background: #F2994A; border: 3px solid #3B2A20"><span aria-hidden="true" style="display: block; position: absolute; left: 0px; top: 2px; width: 2px; height: 2px; box-shadow: 2px 2px 0 #3B2A20,4px 2px 0 #3B2A20,6px 2px 0 #3B2A20,8px 2px 0 #3B2A20,10px 2px 0 #3B2A20,12px 2px 0 #3B2A20,14px 2px 0 #3B2A20,2px 4px 0 #3B2A20,4px 4px 0 #B8BEC4,6px 4px 0 #B8BEC4,8px 4px 0 #B8BEC4,10px 4px 0 #B8BEC4,12px 4px 0 #B8BEC4,14px 4px 0 #3B2A20,2px 6px 0 #3B2A20,4px 6px 0 #B8BEC4,6px 6px 0 #B8BEC4,8px 6px 0 #B8BEC4,10px 6px 0 #B8BEC4,12px 6px 0 #7E858C,14px 6px 0 #3B2A20,2px 8px 0 #3B2A20,4px 8px 0 #3B2A20,6px 8px 0 #3B2A20,8px 8px 0 #8B5A2B,10px 8px 0 #3B2A20,12px 8px 0 #3B2A20,14px 8px 0 #3B2A20,8px 10px 0 #3B2A20,10px 10px 0 #8B5A2B,12px 10px 0 #3B2A20,8px 12px 0 #3B2A20,10px 12px 0 #8B5A2B,12px 12px 0 #3B2A20,8px 14px 0 #3B2A20,10px 14px 0 #8B5A2B,12px 14px 0 #3B2A20,8px 16px 0 #3B2A20,10px 16px 0 #3B2A20,12px 16px 0 #3B2A20"></span><span style="display: block; position: absolute; right: 4px; top: 4px; font-size: 16px; line-height: 16px; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">${esc(c.atk)}</span></span><span style="display: block; position: absolute; left: 86px; top: 153px; width: 46px; height: 30px; box-sizing: border-box; background: #E35D5B; border: 3px solid #3B2A20"><span aria-hidden="true" style="display: block; position: absolute; left: 0px; top: 2px; width: 2px; height: 2px; box-shadow: 6px 4px 0 #3B2A20,8px 4px 0 #3B2A20,10px 4px 0 #3B2A20,12px 4px 0 #3B2A20,4px 6px 0 #3B2A20,6px 6px 0 #E35D5B,8px 6px 0 #E35D5B,10px 6px 0 #FFFFFF,12px 6px 0 #E35D5B,14px 6px 0 #3B2A20,2px 8px 0 #3B2A20,4px 8px 0 #E35D5B,6px 8px 0 #E35D5B,8px 8px 0 #E35D5B,10px 8px 0 #E35D5B,12px 8px 0 #E35D5B,14px 8px 0 #E35D5B,16px 8px 0 #3B2A20,2px 10px 0 #3B2A20,4px 10px 0 #E35D5B,6px 10px 0 #E35D5B,8px 10px 0 #E35D5B,10px 10px 0 #E35D5B,12px 10px 0 #E35D5B,14px 10px 0 #B83E3C,16px 10px 0 #3B2A20,2px 12px 0 #3B2A20,4px 12px 0 #B83E3C,6px 12px 0 #B83E3C,8px 12px 0 #B83E3C,10px 12px 0 #B83E3C,12px 12px 0 #B83E3C,14px 12px 0 #B83E3C,16px 12px 0 #3B2A20,2px 14px 0 #3B2A20,4px 14px 0 #3B2A20,6px 14px 0 #3B2A20,8px 14px 0 #3B2A20,10px 14px 0 #3B2A20,12px 14px 0 #3B2A20,14px 14px 0 #3B2A20,16px 14px 0 #3B2A20"></span><span style="display: block; position: absolute; right: 4px; top: 4px; font-size: 16px; line-height: 16px; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">${esc(c.hp)}</span></span>` : ''}
${c.isSpell ? `<span style="display: block; position: absolute; left: 6px; top: 159px; width: 126px; height: 24px; background: #5B8DEF; font-size: 16px; line-height: 24px; color: #FFFFFF; text-shadow: 1px 0 #3B2A20, -1px 0 #3B2A20, 0 1px #3B2A20, 0 -1px #3B2A20, 1px 1px #3B2A20, -1px 1px #3B2A20, 1px -1px #3B2A20, -1px -1px #3B2A20">공법</span>` : ''}</button>
`).join('')}
${v.isOver ? `
<div style="position: absolute; left: 0px; top: 0px; width: 1440px; height: 810px; background: rgba(59, 42, 32, 0.6)">
</div>
<div style="position: absolute; left: 420px; top: 180px; width: 600px; height: 360px; box-sizing: border-box; background: #8B5A2B; border: 3px solid #3B2A20; box-shadow: inset 0 3px 0 #A8743F, inset 0 -3px 0 #6B4420">
<div style="position: absolute; left: 9px; top: 9px; width: 576px; height: 336px; box-sizing: border-box; background: #F4E4BC; border: 3px solid #3B2A20; box-shadow: inset 0 -3px 0 #E0C998">
<div style="position: absolute; left: 0px; top: 36px; width: 570px; text-align: center; font-size: 48px; line-height: 48px">${esc(v.overTitle)}</div>
<div style="position: absolute; left: 0px; top: 108px; width: 570px; text-align: center; font-size: 48px; line-height: 48px; color: #F7C948; text-shadow: 2px 0 #3B2A20, -2px 0 #3B2A20, 0 2px #3B2A20, 0 -2px #3B2A20, 2px 2px #3B2A20, -2px 2px #3B2A20, 2px -2px #3B2A20, -2px -2px #3B2A20">${esc(v.stars)}</div>
<div style="position: absolute; left: 0px; top: 180px; width: 570px; text-align: center; font-size: 16px; line-height: 20px">${esc(v.overText)}</div>
<button type="button" data-act="${esc(v.restart)}" style="position: absolute; left: 165px; top: 246px; width: 240px; height: 60px; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; box-sizing: border-box; background: #5BB65F; border: 3px solid #3B2A20; box-shadow: inset 0 -6px 0 #3E8C42; font-size: 32px; line-height: 32px; color: #FFFFFF; text-shadow: 2px 0 #3B2A20, -2px 0 #3B2A20, 0 2px #3B2A20, 0 -2px #3B2A20, 2px 2px #3B2A20, -2px 2px #3B2A20, 2px -2px #3B2A20, -2px -2px #3B2A20">다시 하기</button>
</div>
</div>
` : ''}
</div>`;

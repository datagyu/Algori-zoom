(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({ number:"4202", title:"요리사", autoplayMs:540, defaultSampleId:"one",
    samples:[
      {id:"one",label:"샘플 1",value:"1\n4\n0 5 3 8\n4 0 4 1\n2 5 0 3\n7 2 3 0"},
      {id:"two",label:"샘플 2",value:"1\n4\n0 7 1 1\n7 0 6 2\n1 1 0 2\n10 1 9 0"},
      {id:"three",label:"샘플 3",value:"1\n6\n0 37 26 52 77 20\n32 0 15 26 75 16\n54 33 0 79 37 90\n92 10 66 0 92 3\n64 7 89 89 0 21\n80 49 94 68 5 0"},
      {id:"all",label:"전체 샘플",value:"10\n4\n0 5 3 8\n4 0 4 1\n2 5 0 3\n7 2 3 0\n4\n0 7 1 1\n7 0 6 2\n1 1 0 2\n10 1 9 0\n6\n0 37 26 52 77 20\n32 0 15 26 75 16\n54 33 0 79 37 90\n92 10 66 0 92 3\n64 7 89 89 0 21\n80 49 94 68 5 0\n6\n0 73 30 81 27 94\n98 0 91 9 97 24\n51 100 0 35 41 98\n26 26 96 0 26 90\n73 37 39 57 0 16\n90 88 97 9 95 0\n8\n0 410 87 281 463 41 192 191\n65 0 93 26 402 367 22 222\n90 408 0 108 179 457 248 369\n151 466 13 0 189 426 405 376\n219 207 351 256 0 361 73 207\n381 453 11 113 165 0 164 499\n121 325 328 428 459 386 0 146\n286 98 334 430 230 263 252 0\n10\n0 229 257 895 817 917 144 864 51 242\n795 0 519 281 868 100 653 995 722 756\n190 106 0 547 996 469 195 734 928 629\n897 72 601 0 905 823 551 590 934 727\n612 255 431 453 0 126 303 926 731 96\n913 385 951 218 399 0 510 726 343 457\n174 790 862 336 367 311 0 646 436 806\n578 842 294 863 436 614 602 0 951 462\n655 791 752 672 228 444 611 833 0 64\n517 115 573 42 250 879 58 79 372 0\n10\n0 56 720 377 134 665 214 238 313 92\n446 0 600 840 363 581 393 620 94 135\n699 515 0 353 340 569 186 185 138 28\n473 706 797 0 896 37 241 690 928 117\n945 336 416 765 0 711 504 609 387 934\n218 712 229 75 179 0 187 473 713 726\n948 369 811 401 853 728 0 185 880 310\n219 507 998 961 638 810 68 0 776 679\n748 650 779 20 471 338 443 91 0 465\n441 504 159 579 302 783 208 994 531 0\n12\n0 3211 3086 1220 779 4353 3575 1412 835 2640 1242 1161\n2510 0 3944 1817 1688 3226 2665 2764 802 1751 2815 526\n2488 862 0 2517 345 2722 4315 1895 1877 3422 3824 4862\n1192 2602 2931 0 129 3018 3317 2726 3682 4594 1407 3432\n2031 4662 48 3043 0 209 2467 485 587 3179 2498 669\n3854 4648 2878 454 2295 0 757 504 146 1292 3235 3190\n4502 2314 702 3389 4671 3909 0 2430 2461 2023 1363 3879\n4468 2095 58 3309 1448 2893 1290 0 2763 2130 2112 3787\n1423 1713 4999 3973 3580 2411 3599 257 0 2806 3186 463\n883 4270 3521 680 4171 564 4301 4748 3399 0 1824 3130\n356 2745 4925 590 3370 1712 2737 2588 3552 2367 0 3724\n3861 39 4639 132 916 4257 2545 642 377 1951 858 0\n14\n0 6759 419 8099 7845 4710 3475 1397 7405 1244 7354 5647 6006 1387\n9802 0 3077 7064 1529 8966 8596 7348 8761 2943 104 750 4492 1211\n4172 5855 0 517 2715 5271 7893 4242 8841 18 8665 1687 1297 6508\n4298 5555 3509 0 8500 8064 7627 7653 8585 1695 9449 1831 5509 340\n5791 3397 9348 3097 0 440 4476 7285 9915 4417 2600 2457 1809 3043\n6905 4642 5300 1361 9838 0 1778 4926 512 4994 824 4156 4972 1487\n1165 4974 721 3975 2272 3028 0 1127 3052 2649 6005 4245 1092 3540\n2283 1097 7528 8376 1825 530 1123 0 641 8386 3981 9362 9051 1898\n3693 8834 2530 1077 2396 5337 8038 6168 0 1344 8333 5492 987 679\n9557 3610 3592 7376 3677 7215 5463 1592 6974 0 59 6715 8573 3622\n5372 1217 9520 9330 5338 2435 1624 4886 2286 1058 0 3007 6893 1602\n6361 5073 673 521 7996 4491 7009 2596 6194 220 9300 0 5746 1411\n6673 9617 9615 2690 1211 3784 2154 3673 3699 8440 2745 1195 0 8535\n5812 4670 7352 2441 263 6531 4064 4587 9550 7000 7277 7927 5908 0\n16\n0 12448 6851 12839 10088 11824 6821 10119 6108 6930 2380 10216 7905 6444 2390 13248\n11368 0 11404 10531 2955 11818 17228 11793 6034 5489 5239 13543 9421 4753 19679 8599\n11592 10967 0 1947 6713 11855 11304 13892 14691 1644 6715 17167 4385 15498 10846 15865\n4737 16986 3146 0 19413 13972 13814 16926 5396 16933 6318 3673 6204 10758 8606 223\n7210 2397 2096 8026 0 10205 3378 10634 8898 12625 5730 17013 18007 5278 16817 16818\n12569 1682 5908 321 156 0 4689 4500 2968 14162 9031 7341 6294 19644 2559 8275\n9134 9855 5450 3346 11592 14520 0 18028 11507 11108 14128 6344 5943 8042 1684 12742\n7304 10662 13463 8644 19785 6461 4825 0 12040 6947 16847 17924 5905 1833 3255 19220\n12302 14705 10055 6367 2225 3402 8514 13397 0 8717 13344 11467 17329 1117 6963 8024\n433 12431 14312 5853 2467 2072 14751 1814 15040 0 17667 2599 1486 7260 15956 4840\n12085 9224 8723 9544 15535 18215 5885 12911 10004 3055 0 4132 14774 11105 6251 9114\n469 17345 5205 6913 11125 9119 14786 18919 10343 7059 9720 0 7474 14729 777 11395\n10814 8066 7548 4719 3677 8709 2094 18512 10888 7842 14726 8472 0 14194 10911 5674\n18825 15832 9303 6789 7976 8462 7447 5103 8639 5585 590 11623 1578 0 11490 10290\n3762 11425 4275 1606 14768 14576 11508 15692 16910 4994 19442 11410 2866 4541 0 7425\n6081 10373 12081 14518 10808 14188 1748 7938 16635 5209 1288 93 16247 8093 4349 0"}
    ],
    sourceSteps:[
      {text:"if len(A) == N//2:",types:"complete evaluate"},
      {text:"if j not in A:",types:"buildB"},
      {text:"A_Sum += (recipe[A[i]][A[j]] + recipe[A[j]][A[i]])",types:"pairA"},
      {text:"B_Sum += (recipe[B[i]][B[j]] + recipe[B[j]][B[i]])",types:"pairB"},
      {text:"diff = abs(A_Sum - B_Sum)",types:"diff"},
      {text:"if ans > diff:",types:"compareAns"},
      {text:"ans = diff",types:"updateAns"},
      {text:"for i in range(start, N):",types:"loop"},
      {text:"A.append(i)",types:"choose"},
      {text:"dfs(i+1)",types:"recurse"},
      {text:"A.pop()",types:"backtrack"},
      {text:"dfs(0)",types:"startDfs"},
      {text:"print('#{} {}'.format(tc, ans))",types:"output"}
    ]
  });
  const els=Core.getByIds(["sourceCode","codeView","mobileCodeView","codeViewport","mobileCodeViewport","resetBtn","prevBtn","nextBtn","playBtn","replayBtn","skipBtn","speedRange","speedLabel","timeline","mobileTimeline","stepLabel","mobileTimelineStatus","mobilePlayBtn","mobilePrevBtn","mobileNextBtn","codeLineLabel","mobileCodeStatus","board","mobileBoard","boardLabel","phaseLabel","mobilePhase","startValue","iValue","depthValue","aSumValue","bSumValue","ansValue","explainText","mobileCoord","mobileExplanation","mobileStateMeta","mobileStart","mobileDepth","mobileDiff","mobileAns","groupView","mobileGroupView","pairView","mobilePairView","detailMeta","diffView","outputView","mobileOutputView","inputArea","applyBtn","sampleButtons","inputError"]);
  const state={steps:[],stepIndex:0,timer:null,speed:1,selectedSample:PROBLEM.defaultSampleId}; let desktopLines,mobileLines,stepLines;

  function parseInput(text){
    const t=text.trim().split(/\s+/).filter(Boolean).map(Number); if(!t.length||t.some(Number.isNaN)) throw new Error("숫자로 된 입력을 확인해주세요.");
    let c=0,T=t[c++],cases=[]; if(!Number.isInteger(T)||T<1||T>50) throw new Error("T는 1~50 사이여야 합니다.");
    for(let tc=0;tc<T;tc++){
      const N=t[c++]; if(!Number.isInteger(N)||N<2||N>16||N%2!==0) throw new Error(`#${tc+1}의 N은 2~16 사이의 짝수여야 합니다.`);
      const recipe=[]; for(let r=0;r<N;r++){const row=[];for(let col=0;col<N;col++){if(c>=t.length)throw new Error(`#${tc+1}의 시너지 표 값이 부족합니다.`);const v=t[c++];if(!Number.isInteger(v)||v<0)throw new Error("시너지 값은 0 이상의 정수여야 합니다.");row.push(v);}recipe.push(row);} cases.push({N,recipe});
    } if(c!==t.length) throw new Error("입력 끝에 사용되지 않은 값이 있습니다."); return cases;
  }

  function buildSteps(cases){
    const steps=[]; let output="";
    const push=d=>steps.push({...d,A:[...(d.A||[])],B:[...(d.B||[])],pairA:d.pairA?[...d.pairA]:null,pairB:d.pairB?[...d.pairB]:null,output});
    cases.forEach((item,ci)=>{
      const N=item.N,recipe=item.recipe,detailed=N<=8; let A=[],ans=Infinity,leafCount=0;
      const base=(phase,message,extra={})=>push({tc:ci+1,N,recipe,A,B:[],start:0,i:null,A_Sum:0,B_Sum:0,diff:null,ans,phase,message,detailed,...extra});
      base("startDfs",`#${ci+1}: A 음식에 들어갈 ${N/2}개의 식재료를 DFS 조합으로 선택합니다.`);
      function dfs(start){
        if(A.length===N/2){
          leafCount++; const B=[]; for(let j=0;j<N;j++) if(!A.includes(j)) B.push(j);
          if(detailed) push({tc:ci+1,N,recipe,A,B,start,i:null,A_Sum:0,B_Sum:0,diff:null,ans,phase:"complete",message:`A가 ${N/2}개 선택되어 하나의 조합이 완성되었습니다.`,detailed,output});
          if(detailed) push({tc:ci+1,N,recipe,A,B,start,i:null,A_Sum:0,B_Sum:0,diff:null,ans,phase:"buildB",message:`A에 없는 식재료를 B로 모읍니다: ${B.map(v=>v+1).join(", ")}`,detailed,output});
          let A_Sum=0,B_Sum=0;
          for(let x=0;x<N/2;x++) for(let y=x+1;y<N/2;y++){
            const a1=A[x],a2=A[y],b1=B[x],b2=B[y];
            const ca=recipe[a1][a2]+recipe[a2][a1]; A_Sum+=ca;
            if(detailed) push({tc:ci+1,N,recipe,A,B,start,i:null,A_Sum,B_Sum,diff:null,ans,phase:"pairA",message:`A: 식재료 ${a1+1}·${a2+1}의 양방향 시너지 ${recipe[a1][a2]} + ${recipe[a2][a1]} = ${ca}를 더합니다.`,pairA:[a1,a2],contribA:ca,detailed,output});
            const cb=recipe[b1][b2]+recipe[b2][b1]; B_Sum+=cb;
            if(detailed) push({tc:ci+1,N,recipe,A,B,start,i:null,A_Sum,B_Sum,diff:null,ans,phase:"pairB",message:`B: 식재료 ${b1+1}·${b2+1}의 양방향 시너지 ${recipe[b1][b2]} + ${recipe[b2][b1]} = ${cb}를 더합니다.`,pairB:[b1,b2],contribB:cb,detailed,output});
          }
          const diff=Math.abs(A_Sum-B_Sum),improve=ans>diff;
          if(detailed) push({tc:ci+1,N,recipe,A,B,start,i:null,A_Sum,B_Sum,diff,ans,phase:"diff",message:`|${A_Sum} - ${B_Sum}| = ${diff}로 두 음식의 맛 차이를 계산합니다.`,detailed,output});
          if(detailed) push({tc:ci+1,N,recipe,A,B,start,i:null,A_Sum,B_Sum,diff,ans,phase:"compareAns",message:`현재 ans(${Number.isFinite(ans)?ans:"∞"})와 diff(${diff})를 비교합니다.`,detailed,output});
          if(improve){ans=diff; push({tc:ci+1,N,recipe,A,B,start,i:null,A_Sum,B_Sum,diff,ans,phase:detailed?"updateAns":"evaluate",message:`더 작은 차이를 찾았습니다. ans를 ${ans}로 갱신합니다.${detailed?"":` (요약 모드 · ${leafCount}번째 완성 조합)`}`,detailed,improved:true,output});}
          else if(!detailed && leafCount<=2) push({tc:ci+1,N,recipe,A,B,start,i:null,A_Sum,B_Sum,diff,ans,phase:"evaluate",message:`완성 조합의 차이는 ${diff}입니다. 현재 ans ${ans}보다 작지 않아 유지합니다.`,detailed,output});
          return;
        }
        for(let i=start;i<N;i++){
          if(detailed) push({tc:ci+1,N,recipe,A,B:[],start,i,A_Sum:0,B_Sum:0,diff:null,ans,phase:"loop",message:`start=${start}에서 후보 식재료 ${i+1}을 확인합니다.`,detailed,output});
          A.push(i);
          if(detailed || A.length<=2) push({tc:ci+1,N,recipe,A,B:[],start,i,A_Sum:0,B_Sum:0,diff:null,ans,phase:"choose",message:`식재료 ${i+1}을 A에 추가합니다: [${A.map(v=>v+1).join(", ")}]`,detailed,output});
          if(detailed) push({tc:ci+1,N,recipe,A,B:[],start:i+1,i,A_Sum:0,B_Sum:0,diff:null,ans,phase:"recurse",message:`dfs(${i+1})로 다음 식재료를 선택하러 들어갑니다.`,detailed,output});
          dfs(i+1);
          const removed=A.pop();
          if(detailed || A.length<2) push({tc:ci+1,N,recipe,A,B:[],start,i:removed,A_Sum:0,B_Sum:0,diff:null,ans,phase:"backtrack",message:`식재료 ${removed+1}을 A에서 빼고 이전 선택으로 돌아갑니다.`,detailed,output});
        }
      }
      dfs(0); output+=`#${ci+1} ${ans}
`;
      push({tc:ci+1,N,recipe,A:[],B:[],start:0,i:null,A_Sum:0,B_Sum:0,diff:null,ans,phase:"output",message:`#${ci+1}의 최소 맛 차이 ${ans}를 출력합니다.`,detailed,output});
    }); return steps;
  }

  const names={startDfs:"DFS 시작",loop:"후보 확인",choose:"A에 선택",recurse:"재귀 호출",complete:"조합 완성",buildB:"B 구성",pairA:"A 시너지",pairB:"B 시너지",diff:"차이 계산",compareAns:"ans 비교",updateAns:"ans 갱신",evaluate:"조합 평가",backtrack:"백트래킹",output:"출력"};
  function h(v){return Core.escapeHtml(v)}
  function board(container,s){
    const ASet=new Set(s.A),BSet=new Set(s.B); const pairA=s.pairA||[],pairB=s.pairB||[];
    const ingredients=Array.from({length:s.N},(_,k)=>{let cls="ingredient";if(ASet.has(k))cls+=" a";if(BSet.has(k))cls+=" b";if(k===s.i)cls+=" current";if(s.phase==="loop"&&k===s.i)cls+=" candidate";return `<div class="${cls}">${k+1}<small>${ASet.has(k)?"A":BSet.has(k)?"B":"대기"}</small></div>`}).join("");
    let table='<table class="synergy-table"><thead><tr><th>↘</th>';for(let c=0;c<s.N;c++)table+=`<th class="${ASet.has(c)?"a-head":BSet.has(c)?"b-head":""}">${c+1}</th>`;table+='</tr></thead><tbody>';
    for(let r=0;r<s.N;r++){table+=`<tr><th class="${ASet.has(r)?"a-head":BSet.has(r)?"b-head":""}">${r+1}</th>`;for(let c=0;c<s.N;c++){let cls="";if(pairA.length===2&&((r===pairA[0]&&c===pairA[1])||(r===pairA[1]&&c===pairA[0])))cls="a-pair";if(pairB.length===2&&((r===pairB[0]&&c===pairB[1])||(r===pairB[1]&&c===pairB[0])))cls="b-pair";table+=`<td class="${cls}">${s.recipe[r][c]}</td>`}table+='</tr>'}table+='</tbody></table>';
    container.innerHTML=`<div class="chef-board"><div class="ingredient-row">${ingredients}</div><p class="chef-legend">파랑: A 음식 · 보라: B 음식 · 금색 테두리: 현재 후보 · 표의 강조 셀: 현재 계산 중인 양방향 시너지</p><div class="matrix-wrap">${table}</div></div>`;
  }
  function groups(container,s){const chips=g=>g.length?g.map(v=>`<span class="group-chip">${v+1}</span>`).join(""):'<span class="group-empty">아직 없음</span>';container.innerHTML=`<div class="group-box a"><h3>A 음식 · ${s.A.length} / ${s.N/2}</h3><div class="group-chips">${chips(s.A)}</div></div><div class="group-box b"><h3>B 음식 · ${s.B.length} / ${s.N/2}</h3><div class="group-chips">${chips(s.B)}</div></div>`}
  function pairs(container,s){const out=[];if(s.pairA)out.push(`<span class="pair-chip a">A ${s.pairA[0]+1}↔${s.pairA[1]+1} · +<strong>${s.contribA}</strong></span>`);if(s.pairB)out.push(`<span class="pair-chip b">B ${s.pairB[0]+1}↔${s.pairB[1]+1} · +<strong>${s.contribB}</strong></span>`);container.innerHTML=out.join("")||'<span class="group-empty">완성된 조합에서 식재료 쌍의 시너지를 계산합니다.</span>'}
  function highlight(lines,n){lines.forEach((line,k)=>line.classList.toggle("active",k===n));}
  function renderD(s){const ln=stepLines.get(s.phase);highlight(desktopLines,ln);board(els.board,s);groups(els.groupView,s);pairs(els.pairView,s);els.codeLineLabel.textContent=ln?`LINE ${ln}`:names[s.phase];els.boardLabel.textContent=`#${s.tc} · N=${s.N} · ${s.detailed?"상세":"요약"}`;els.phaseLabel.textContent=names[s.phase];els.startValue.textContent=s.start??"—";els.iValue.textContent=s.i==null?"—":s.i;els.depthValue.textContent=s.A.length;els.aSumValue.textContent=s.A_Sum??0;els.bSumValue.textContent=s.B_Sum??0;els.ansValue.textContent=Number.isFinite(s.ans)?s.ans:"∞";els.explainText.textContent=s.message;els.detailMeta.textContent=`A ${s.A.length}개 · B ${s.B.length}개`;els.diffView.textContent=s.diff==null?`A_Sum = ${s.A_Sum??0} · B_Sum = ${s.B_Sum??0} · ans = ${Number.isFinite(s.ans)?s.ans:"∞"}`:`|${s.A_Sum} - ${s.B_Sum}| = ${s.diff} · ans = ${s.ans}`;els.diffView.classList.toggle("improve",!!s.improved);els.outputView.textContent=s.output||"아직 출력이 없습니다.";}
  function renderM(s){const ln=stepLines.get(s.phase);highlight(mobileLines,ln);board(els.mobileBoard,s);groups(els.mobileGroupView,s);pairs(els.mobilePairView,s);els.mobileCodeStatus.textContent=ln?`LINE ${ln}`:names[s.phase];els.mobilePhase.textContent=names[s.phase];els.mobileCoord.textContent=`A ${s.A.length} / B ${s.B.length}`;els.mobileExplanation.textContent=s.message;els.mobileStateMeta.textContent=s.detailed?"상세 시각화":"요약 시각화";els.mobileStart.textContent=s.start??"—";els.mobileDepth.textContent=s.A.length;els.mobileDiff.textContent=s.diff??"—";els.mobileAns.textContent=Number.isFinite(s.ans)?s.ans:"∞";els.mobileOutputView.textContent=s.output||"아직 출력이 없습니다.";}
  function sync(){const e=!state.steps.length;els.prevBtn.disabled=els.mobilePrevBtn.disabled=e||state.stepIndex===0;els.nextBtn.disabled=els.mobileNextBtn.disabled=e||state.stepIndex===state.steps.length-1;[els.playBtn,els.replayBtn,els.resetBtn,els.skipBtn,els.timeline,els.mobileTimeline,els.mobilePlayBtn].forEach(x=>x.disabled=e)}
  function render({follow=true}={}){const s=state.steps[state.stepIndex];if(!s)return;renderD(s);renderM(s);els.timeline.value=els.mobileTimeline.value=state.stepIndex;els.stepLabel.textContent=els.mobileTimelineStatus.textContent=`${state.stepIndex+1} / ${state.steps.length}`;sync();if(follow){const ln=stepLines.get(s.phase);if(ln){Core.centerInsideViewport(els.codeViewport,desktopLines.get(ln),{horizontal:false});Core.centerInsideViewport(els.mobileCodeViewport,mobileLines.get(ln),{horizontal:false});}}}
  function stop(){if(state.timer!==null)clearTimeout(state.timer);state.timer=null;Core.updatePlaybackControls(els.playBtn,false)} function go(i,o={}){if(!state.steps.length)return;state.stepIndex=Core.clamp(i,0,state.steps.length-1);render(o)} function move(d){stop();go(state.stepIndex+d)} function sched(){state.timer=setTimeout(()=>{if(state.stepIndex>=state.steps.length-1){stop();return}go(state.stepIndex+1);if(state.stepIndex>=state.steps.length-1)stop();else sched()},PROBLEM.autoplayMs/state.speed)} function start(){if(!state.steps.length)return;stop();if(state.stepIndex>=state.steps.length-1)go(0);Core.updatePlaybackControls(els.playBtn,true);sched()} function reset(){stop();go(0)}
  function sampleButtons(){els.sampleButtons.replaceChildren();PROBLEM.samples.forEach(s=>{const b=document.createElement("button");b.type="button";b.className="btn";b.textContent=s.label;b.dataset.sample=s.id;b.classList.toggle("selected",state.selectedSample===s.id);els.sampleButtons.append(b)})}
  function apply(text,id=null){stop();try{state.steps=buildSteps(parseInput(text));state.stepIndex=0;state.selectedSample=id;els.inputError.textContent="";els.timeline.max=els.mobileTimeline.max=Math.max(0,state.steps.length-1);sampleButtons();render()}catch(e){state.selectedSample=null;els.inputError.textContent=e.message;sampleButtons()}}
  const markup=Core.createCodeMarkup(els.sourceCode,PROBLEM.sourceSteps,{wrap:false,editor:true});els.codeView.innerHTML=els.mobileCodeView.innerHTML=markup;desktopLines=Core.createLineMap(els.codeView);mobileLines=Core.createLineMap(els.mobileCodeView);stepLines=Core.createStepLineMap(els.codeView);
  els.prevBtn.onclick=()=>move(-1);els.nextBtn.onclick=()=>move(1);els.mobilePrevBtn.onclick=()=>move(-1);els.mobileNextBtn.onclick=()=>move(1);els.mobilePlayBtn.onclick=()=>els.playBtn.click();els.playBtn.onclick=()=>state.timer===null?start():stop();els.resetBtn.onclick=reset;els.replayBtn.onclick=()=>{reset();start()};els.skipBtn.onclick=()=>{stop();go(state.steps.length-1)};els.speedRange.oninput=()=>{state.speed=Number(els.speedRange.value);els.speedLabel.textContent=`${Core.formatDecimal(state.speed)}×`;if(state.timer!==null){clearTimeout(state.timer);sched()}};[els.timeline,els.mobileTimeline].forEach(x=>x.oninput=e=>{stop();go(Number(e.target.value))});els.applyBtn.onclick=()=>apply(els.inputArea.value);els.inputArea.oninput=()=>{state.selectedSample=null;sampleButtons()};els.sampleButtons.onclick=e=>{const b=e.target.closest("button[data-sample]");if(!b)return;const s=PROBLEM.samples.find(v=>v.id===b.dataset.sample);if(!s)return;els.inputArea.value=s.value;apply(s.value,s.id)};const d=PROBLEM.samples.find(s=>s.id===PROBLEM.defaultSampleId);sampleButtons();els.inputArea.value=d.value;apply(d.value,d.id);
})();

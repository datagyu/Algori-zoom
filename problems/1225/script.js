(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    platform:"SWEA", number:"1225", level:"D3", title:"암호생성기", autoplayMs:620, defaultSampleId:"one",
    sourceSteps:[
      {text:"password = list(map(int, input().split()))",types:"password",occurrence:1},
      {text:"decrease = 0",types:"decreaseInit",occurrence:1},
      {text:"while password[-1] != 0:",types:"while fastForward",occurrence:1},
      {text:"decrease += 1",types:"decreaseUp",occurrence:1},
      {text:"if decrease == 6:",types:"resetCheck",occurrence:1},
      {text:"decrease = 1",types:"cycleReset",occurrence:1},
      {text:"next_number = password.pop(0) - decrease",types:"pop",occurrence:1},
      {text:"if next_number > 0:",types:"positiveCheck",occurrence:1},
      {text:"password.append(next_number)",types:"append",occurrence:1},
      {text:"password.append(0)",types:"zeroAppend",occurrence:1},
      {text:"break",types:"stop",occurrence:1},
      {text:"print('#{}'.format(tc), *password)",types:"output",occurrence:1}
    ],
    samples:[
      {id:"one",label:"공식 예제 1번 · 큐 흐름",value:"1\n9550 9556 9550 9553 9558 9551 9551 9551"},
      {id:"all",label:"첨부 예제 전체",value:"1\n9550 9556 9550 9553 9558 9551 9551 9551\n2\n2419 2418 2423 2415 2422 2419 2420 2415\n3\n7834 7840 7840 7835 7841 7835 7835 7838\n4\n4088 4087 4090 4089 4093 4085 4090 4084\n5\n2945 2946 2950 2948 2942 2943 2948 2947\n6\n670 667 669 671 670 670 668 671\n7\n8869 8869 8873 8875 8870 8872 8871 8873\n8\n1709 1707 1712 1712 1714 1710 1706 1712\n9\n10239 10248 10242 10240 10242 10242 10245 10235\n10\n6580 6579 6574 6580 6583 6580 6577 6581"}
    ]
  });

  const samples=PROBLEM.samples, defaultSample=samples[0];
  const els=Core.getByIds(["sourceCode","resetBtn","prevBtn","nextBtn","playBtn","replayBtn","skipBtn","speedRange","speedLabel","stepLabel","timeline","codeLineLabel","codeViewport","codeView","boardLabel","boardViewport","board","phaseLabel","currentValue","decreaseValue","nextNumberValue","iterationValue","checkValue","lastValue","explainText","cycleView","cycleLabel","outputView","inputArea","applyBtn","sampleButtons","inputError","mobileCoord","mobileCodeStatus","mobileCodeViewport","mobileCodeView","mobilePhase","mobileBoardViewport","mobileBoard","mobileCycleView","mobileExplanation","mobileStateMeta","mobileCurrent","mobileDecrease","mobileNextNumber","mobileIteration","mobileLast","mobileOutputView","mobilePrevBtn","mobileTimeline","mobileTimelineStatus","mobileNextBtn"]);
  const state={cases:[],steps:[],stepIndex:0,timer:null,speed:1,selectedSample:defaultSample.id,codeLines:null,mobileCodeLines:null};
  let stepLineMap;

  function renderCode(){
    const markup=Core.createCodeMarkup(els.sourceCode,PROBLEM.sourceSteps,{wrap:false,editor:true});
    els.codeView.innerHTML=markup;els.mobileCodeView.innerHTML=markup;
    state.codeLines=Core.createLineMap(els.codeView);state.mobileCodeLines=Core.createLineMap(els.mobileCodeView);stepLineMap=Core.createStepLineMap(els.codeView);
  }

  function parseInput(text){
    const lines=text.trim().split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
    if(!lines.length||lines.length%2!==0)throw new Error("각 테스트 케이스는 번호 1줄 + 숫자 8개 1줄로 입력해주세요.");
    const cases=[];
    for(let i=0;i<lines.length;i+=2){
      if(!/^\d+$/.test(lines[i]))throw new Error("테스트 케이스 번호는 정수여야 합니다.");
      const tc=Number(lines[i]);
      const values=lines[i+1].split(/\s+/);
      if(values.length!==8||values.some(v=>!/^\d+$/.test(v)))throw new Error(`#${tc}의 데이터는 양의 정수 8개여야 합니다.`);
      const password=values.map(Number);
      if(password.some(v=>v<0||v>2147483647))throw new Error("숫자는 0 이상 integer 범위 안이어야 합니다.");
      cases.push({tc,password});
    }
    if(cases.length>10)throw new Error("최대 10개의 테스트 케이스를 입력할 수 있습니다.");
    return{cases};
  }

  function buildSteps(){
    const steps=[];let output="";
    state.cases.forEach((data,index)=>{
      let password=[...data.password],decrease=0,current=null,nextNumber=null,iteration=0,check="준비",appended=null,skipped=0;
      const push=(phase,message,extra={})=>steps.push({tc:data.tc,password:[...password],decrease,current,nextNumber,iteration,check,appended,phase,line:stepLineMap.get(phase),message,output,...extra});
      push("password","8개의 숫자를 큐처럼 사용할 password 리스트에 저장합니다.");
      push("decreaseInit","decrease를 0으로 시작합니다. 반복문에 들어갈 때마다 1씩 증가합니다.");

      while(password[password.length-1]!==0){
        const nextDecrease=decrease+1===6?1:decrease+1;
        const willTerminate=password[0]-nextDecrease<=0;
        const shouldDetail=iteration<5||Math.max(...password)<=20||willTerminate;

        if(shouldDetail&&skipped>0){
          check=`${skipped}회 반복 요약`;
          push("fastForward",`값이 큰 구간에서 같은 큐 연산이 ${skipped}회 반복되었습니다. 마지막 암호가 만들어지는 구간부터 다시 한 단계씩 확인합니다.`,{fastForward:true});
          skipped=0;
        }

        iteration+=1;
        if(shouldDetail){check="마지막 값이 0이 아님";push("while",`password[-1]은 ${password[password.length-1]}이므로 반복을 계속합니다.`);}

        decrease+=1;
        if(shouldDetail){check=`decrease = ${decrease}`;push("decreaseUp",`decrease를 1 증가시켜 ${decrease}이 되었습니다.`);}

        if(decrease===6){
          if(shouldDetail){check="6이므로 새 사이클";push("resetCheck","decrease가 6이 되어 1~5 사이클을 다시 시작해야 합니다.");}
          decrease=1;
          if(shouldDetail){check="decrease = 1";push("cycleReset","decrease를 1로 되돌려 새 사이클을 시작합니다.");}
        }else if(shouldDetail){check="1~5 범위";push("resetCheck",`decrease가 ${decrease}이므로 그대로 사용합니다.`);}

        current=password.shift();
        nextNumber=current-decrease;
        appended=null;
        if(shouldDetail){check=`${current} - ${decrease} = ${nextNumber}`;push("pop",`FRONT의 ${current}을 꺼내 ${decrease}를 감소시켜 next_number=${nextNumber}을 만듭니다.`,{popped:true});}

        if(nextNumber>0){
          if(shouldDetail){check="next_number > 0";push("positiveCheck",`${nextNumber}은 0보다 크므로 큐의 맨 뒤로 다시 보냅니다.`);}
          password.push(nextNumber);appended=nextNumber;
          if(shouldDetail){check=`append(${nextNumber})`;push("append",`${nextNumber}을 password의 맨 뒤에 append합니다.`,{appendedNow:true});}
        }else{
          if(shouldDetail){check="next_number <= 0";push("positiveCheck",`${nextNumber}은 0 이하이므로 0을 넣고 암호 생성을 종료합니다.`);}
          password.push(0);appended=0;
          if(shouldDetail){check="append(0)";push("zeroAppend","0을 큐의 맨 뒤에 넣습니다. 이제 완성된 암호의 마지막 값은 0입니다.",{appendedNow:true,zero:true});}
          if(shouldDetail){check="break";push("stop","0이 만들어졌으므로 반복문을 즉시 종료합니다.",{zero:true});}
          break;
        }

        if(!shouldDetail)skipped+=1;
      }

      if(skipped>0){check=`${skipped}회 반복 요약`;push("fastForward",`중간의 동일한 큐 연산 ${skipped}회를 요약했습니다.`,{fastForward:true});}
      current=null;nextNumber=null;appended=null;check="암호 완성";
      output+=`#${data.tc} ${password.join(" ")}\n`;
      push("output",`#${data.tc}의 8자리 암호를 출력합니다.`);
    });
    state.steps=steps;
  }

  function renderQueue(container,step){
    container.replaceChildren();
    if(step.popped&&step.current!=null){
      const current=document.createElement("div");current.className="number-card current";current.innerHTML=`${step.current}<small>꺼낸 값</small>`;container.appendChild(current);
    }
    step.password.forEach((value,index)=>{
      const card=document.createElement("div");card.className="number-card";
      if(index===0&&!step.popped)card.classList.add("front");
      if(step.appendedNow&&index===step.password.length-1)card.classList.add("appended");
      if(value===0&&index===step.password.length-1)card.classList.add("zero");
      card.innerHTML=`${value}<small>${index===0?"index 0":"index "+index}</small>`;container.appendChild(card);
    });
  }

  function renderCycle(container,step){
    container.replaceChildren();
    for(let n=1;n<=5;n++){
      const chip=document.createElement("div");chip.className="cycle-chip";chip.textContent=`-${n}`;
      if(step.decrease===n)chip.classList.add("active");
      container.appendChild(chip);
    }
  }

  function highlight(lines,n){lines.forEach((line,number)=>line.classList.toggle("active",number===n));}

  function render({follow=true}={}){
    const step=state.steps[state.stepIndex];if(!step)return;
    highlight(state.codeLines,step.line);highlight(state.mobileCodeLines,step.line);
    renderQueue(els.board,step);renderQueue(els.mobileBoard,step);renderCycle(els.cycleView,step);renderCycle(els.mobileCycleView,step);
    const current=step.current??"—",next=step.nextNumber??"—",last=step.password.length?step.password[step.password.length-1]:"—";
    els.codeLineLabel.textContent=`LINE ${step.line}`;els.boardLabel.textContent=`#${step.tc} · 8 numbers`;els.phaseLabel.textContent=step.phase.toUpperCase();
    els.currentValue.textContent=current;els.decreaseValue.textContent=step.decrease;els.nextNumberValue.textContent=next;els.iterationValue.textContent=step.iteration;els.checkValue.textContent=step.check;els.lastValue.textContent=last;els.explainText.textContent=step.message;els.cycleLabel.textContent=step.decrease?`현재 -${step.decrease}`:"1 → 2 → 3 → 4 → 5";els.outputView.textContent=step.output||"아직 출력이 없습니다.";
    els.mobileCoord.textContent=`#${step.tc} · QUEUE`;els.mobileCodeStatus.textContent=`LINE ${step.line}`;els.mobilePhase.textContent=step.phase.toUpperCase();els.mobileExplanation.textContent=step.message;els.mobileStateMeta.textContent=step.check;els.mobileCurrent.textContent=current;els.mobileDecrease.textContent=step.decrease;els.mobileNextNumber.textContent=next;els.mobileIteration.textContent=step.iteration;els.mobileLast.textContent=last;els.mobileOutputView.textContent=step.output||"아직 출력이 없습니다.";
    els.timeline.value=state.stepIndex;els.mobileTimeline.value=state.stepIndex;els.stepLabel.textContent=`${state.stepIndex+1} / ${state.steps.length}`;els.mobileTimelineStatus.textContent=`${state.stepIndex+1} / ${state.steps.length}`;
    els.prevBtn.disabled=els.mobilePrevBtn.disabled=state.stepIndex===0;els.nextBtn.disabled=els.mobileNextBtn.disabled=state.stepIndex===state.steps.length-1;
    if(follow){Core.centerInsideViewport(els.codeViewport,state.codeLines.get(step.line),{horizontal:false});Core.centerInsideViewport(els.mobileCodeViewport,state.mobileCodeLines.get(step.line),{horizontal:false});}
  }

  function stopPlayback(){if(state.timer)clearTimeout(state.timer);state.timer=null;Core.updatePlaybackControls(els.playBtn,false);}
  function goTo(i,o={}){state.stepIndex=Core.clamp(i,0,state.steps.length-1);render(o);}
  function move(d){stopPlayback();goTo(state.stepIndex+d,{follow:true});}
  function scheduleNext(){state.timer=setTimeout(()=>{if(state.stepIndex>=state.steps.length-1){stopPlayback();return;}goTo(state.stepIndex+1,{follow:true});state.stepIndex>=state.steps.length-1?stopPlayback():scheduleNext();},PROBLEM.autoplayMs/state.speed);}
  function startPlayback(){stopPlayback();if(state.stepIndex>=state.steps.length-1)goTo(0);Core.updatePlaybackControls(els.playBtn,true);scheduleNext();}
  function togglePlayback(){state.timer?stopPlayback():startPlayback();}
  function reset(){stopPlayback();goTo(0,{follow:true});}
  function renderSampleButtons(){els.sampleButtons.replaceChildren();samples.forEach(sample=>{const b=document.createElement("button");b.type="button";b.className="btn";b.textContent=sample.label;b.dataset.sample=sample.id;b.classList.toggle("selected",state.selectedSample===sample.id);els.sampleButtons.appendChild(b);});}
  function applyText(text,sampleId=null){stopPlayback();try{Object.assign(state,parseInput(text),{selectedSample:sampleId,stepIndex:0});els.inputError.textContent="";buildSteps();const max=Math.max(0,state.steps.length-1);els.timeline.max=els.mobileTimeline.max=max;renderSampleButtons();render({follow:true});}catch(error){els.inputError.textContent=error.message;}}

  els.prevBtn.addEventListener("click",()=>move(-1));els.nextBtn.addEventListener("click",()=>move(1));document.getElementById("mobilePlayBtn").addEventListener("click",()=>els.playBtn.click());els.mobilePrevBtn.addEventListener("click",()=>move(-1));els.mobileNextBtn.addEventListener("click",()=>move(1));els.resetBtn.addEventListener("click",reset);els.replayBtn.addEventListener("click",()=>{reset();startPlayback();});els.skipBtn.addEventListener("click",()=>{stopPlayback();goTo(state.steps.length-1,{follow:true});});els.playBtn.addEventListener("click",togglePlayback);els.speedRange.addEventListener("input",()=>{state.speed=Number(els.speedRange.value);els.speedLabel.textContent=`${Core.formatDecimal(state.speed)}×`;if(state.timer){clearTimeout(state.timer);scheduleNext();}});[els.timeline,els.mobileTimeline].forEach(t=>t.addEventListener("input",e=>{stopPlayback();goTo(Number(e.target.value),{follow:true});}));els.applyBtn.addEventListener("click",()=>applyText(els.inputArea.value));els.inputArea.addEventListener("input",()=>{state.selectedSample=null;renderSampleButtons();});els.sampleButtons.addEventListener("click",e=>{const b=e.target.closest("button[data-sample]");if(!b)return;const sample=samples.find(s=>s.id===b.dataset.sample);if(!sample)return;els.inputArea.value=sample.value;applyText(sample.value,sample.id);});

  renderCode();els.inputArea.value=defaultSample.value;applyText(defaultSample.value,defaultSample.id);
})();

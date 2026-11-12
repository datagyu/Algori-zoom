(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = {
    number: "2382", autoplayMs: 550, defaultSampleId: "one",
    sourceSteps: [
      ["worms = [list(map(int, input().split())) for _ in range(K)]","init"],
      ["for hour in range(1, M + 1):","hour"],
      ["board = {}","clear"],
      ["for r, c, n, d in worms:","select"],
      ["nr = r + delta[d][0]","row"],
      ["nc = c + delta[d][1]","col"],
      ["if nr == 0 or nr == N - 1 or nc == 0 or nc == N - 1:","edge"],
      ["n //= 2","halve"],
      ["d = reverse[d]","reverse"],
      ["if n == 0:","zero"],
      ["if (nr, nc) not in board:","position"],
      ["board[(nr, nc)] = [n, n, d]","first"],
      ["board[(nr, nc)][0] += n","merge"],
      ["if n > board[(nr, nc)][1]:","compare"],
      ["board[(nr, nc)][1] = n","maximum"],
      ["board[(nr, nc)][2] = d","direction"],
      ["worms = []","prepare"],
      ["worms.append([r, c, total, d])","update"],
      ["ans = sum(w[2] for w in worms)","sum"],
      ["print(f'#{tc} {ans}')","output"],
    ].map(([text,types])=>({text,types})),
    samples:[
      {id:"one",label:"샘플 1",value:"1\n7 6 4\n2 1 12 4\n2 3 8 3\n5 5 10 2\n4 3 6 1"},
      {id:"two",label:"샘플 2",value:"1\n5 3 3\n1 1 10 1\n1 3 14 3\n3 2 8 1"},
      {id:"all",label:"전체 샘플",value:"2\n7 6 4\n2 1 12 4\n2 3 8 3\n5 5 10 2\n4 3 6 1\n5 3 3\n1 1 10 1\n1 3 14 3\n3 2 8 1"},
    ],
  };
  const ids = ["sourceCode","codeView","mobileCodeView","codeViewport","mobileCodeViewport",
    "codeLineLabel","mobileCodeStatus","boardViewport","mobileBoardViewport","board","mobileBoard","boardLabel",
    "phaseLabel","mobilePhase","hourValue","movedValue","posValue","microbeValue","totalValue","maxValue",
    "groupValue","answerValue","explainText","entryText","mobileEntryText","outputView","mobileOutputView",
    "mobileCoord","mobileExplanation","mobileStateMeta","mobilePos","mobileMicrobe","mobileTotal","mobileMax","mobileAnswer",
    "resetBtn","prevBtn","nextBtn","playBtn","replayBtn","skipBtn","speedRange","speedLabel",
    "timeline","stepLabel","mobileTimeline","mobileTimelineStatus","mobilePrevBtn","mobileNextBtn",
    "inputArea","applyBtn","sampleButtons","inputError"];
  const els=Core.getByIds(ids);
  const state={steps:[],index:0,timer:null,speed:1,selectedSample:"one",renderedCase:null,desktopCells:[],mobileCells:[]};
  const arrow=["","↑","↓","←","→"], delta=[[0,0],[-1,0],[1,0],[0,-1],[0,1]], reverse=[0,2,1,4,3];
  let codeLines,mobileCodeLines,stepLineMap;
  function parseInput(text){
    const tokens=text.trim().split(/\s+/);
    if(!text.trim()||tokens.some(x=>! /^\d+$/.test(x)))throw Error("입력은 양의 정수만 사용하세요.");
    const data=tokens.map(Number);let p=0;
    const T=data[p++];if(!Number.isInteger(T)||T<1||T>5)throw Error("테스트케이스는 1~5개를 지원합니다.");
    const cases=[];
    for(let tc=1;tc<=T;tc++){
      const [N,M,K]=data.slice(p,p+3);p+=3;
      if(![N,M,K].every(Number.isSafeInteger)||N<5||N>20||M<1||M>25||K<1||K>30)
        throw Error("#"+tc+": 시각화 제한은 N 5~20, M 1~25, K 1~30입니다.");
      const worms=[],occupied=new Set();
      for(let k=0;k<K;k++){
        const [r,c,n,d]=data.slice(p,p+4);p+=4;
        if(![r,c,n,d].every(Number.isSafeInteger)||r<1||r>=N-1||c<1||c>=N-1||n<1||n>10000||d<1||d>4)
          throw Error("#"+tc+": 군집 "+(k+1)+"의 위치·미생물 수·방향을 확인하세요.");
        const key=r+","+c;if(occupied.has(key))throw Error("#"+tc+": 시작 군집 위치가 중복되었습니다.");
        occupied.add(key);worms.push({r,c,n,d});
      }
      cases.push({N,M,worms});
    }
    if(p!==data.length)throw Error("입력값 개수가 T와 K에 맞지 않습니다.");
    return cases;
  }
  function buildSteps(cases){
    const steps=[];let output="";
    const copy=groups=>groups.map(g=>({...g}));
    cases.forEach(({N,M,worms:initial},index)=>{
      let worms=copy(initial);
      const emit=(phase,message,board=new Map(),pending=[],focus=null,meta={})=>{
        if(steps.length>=24000)throw Error("실행 단계가 너무 많습니다. 테스트케이스를 나누거나 M과 K를 줄여주세요.");
        const staged=[...board.entries()].map(([key,value])=>({r:Number(key.split(",")[0]),c:Number(key.split(",")[1]),...value}));
        const visible=[...copy(pending),...staged];
        steps.push({
          tc:index+1,N,M,hour:meta.hour??0,phase,message,line:stepLineMap.get(phase),pending:copy(pending),
          board:staged.map(g=>({...g})),focus,meta:{...meta},visibleCount:visible.length,
          visibleTotal:visible.reduce((sum,g)=>sum+g.n,0),output
        });
      };
      emit("init", "초기 worms에 각 군집의 위치(r,c), 수(n), 방향(d)을 저장합니다.",new Map(),worms);
      for(let hour=1;hour<=M;hour++){
        const board=new Map(),pending=copy(worms);
        emit("hour", hour+"시간째 이동을 시작합니다.",board,pending,null,{hour});
        emit("clear", "새로운 board={}를 만들어 이전 시간과 이번 시간의 이동 결과를 분리합니다.",board,pending,null,{hour});
        for(let i=0;i<worms.length;i++){
          const g=worms[i];let {r,c,n,d}=g,nr=r,nc=c;
          const meta={hour,moved:(i+1)+"/"+worms.length,n,d,origin:[r,c]};
          emit("select", "군집 "+(i+1)+"을 선택합니다. 현재 "+n+"마리 "+arrow[d]+" 방향입니다.",board,pending,[r,c],meta);
          nr=r+delta[d][0];
          emit("row", "다음 행 nr = "+r+" + ("+delta[d][0]+") = "+nr,board,pending,[r,c],{...meta,nr,nc});
          nc=c+delta[d][1];
          emit("col", "다음 열 nc = "+c+" + ("+delta[d][1]+") = "+nc,board,pending,[nr,nc],{...meta,nr,nc});
          const isEdge=nr===0||nr===N-1||nc===0||nc===N-1;
          emit("edge",isEdge?"가장자리입니다. 미생물 수를 절반으로 만들고 방향을 반전합니다.":"일반 칸이므로 수와 방향을 유지합니다.",board,pending,[nr,nc],{...meta,nr,nc});
          if(isEdge){
            const before=n;n=Math.floor(n/2);
            emit("halve",before+" // 2 = "+n+"마리",board,pending,[nr,nc],{...meta,n,nr,nc});
            d=reverse[d];
            emit("reverse","방향을 "+arrow[g.d]+" → "+arrow[d]+"로 반전합니다.",board,pending,[nr,nc],{...meta,n,d,nr,nc});
          }
          pending.shift();
          if(n===0){
            emit("zero","미생물이 0마리가 되어 사라집니다.",board,pending,[nr,nc],{...meta,n,d,nr,nc});
            continue;
          }
          const key=nr+","+nc,old=board.get(key);
          emit("position",old?"이미 같은 칸에 군집이 있습니다. 합체합니다.":"이 칸에 도착한 첫 군집입니다.",board,pending,[nr,nc],{...meta,n,d,nr,nc});
          if(!old){
            board.set(key,{n,maxCount:n,d,merged:false});
            emit("first","board[("+nr+", "+nc+")] = ["+n+", "+n+", "+d+"]",board,pending,[nr,nc],{...meta,n,d,nr,nc,total:n,maxCount:n});
          }else{
            old.n+=n;old.merged=true;
            emit("merge","미생물을 합산해 total = "+old.n+"마리입니다. 방향 기준 최대 수는 아직 "+old.maxCount+"입니다.",board,pending,[nr,nc],{...meta,n,d,nr,nc,total:old.n,maxCount:old.maxCount});
            const larger=n>old.maxCount;
            emit("compare","방금 도착한 군집 "+n+" > 기존 max_count "+old.maxCount+" ? "+(larger?"참":"거짓"),board,pending,[nr,nc],{...meta,n,d,nr,nc,total:old.n,maxCount:old.maxCount});
            if(larger){
              old.maxCount=n;
              emit("maximum","새로 들어온 군집이 가장 큽니다. max_count = "+n,board,pending,[nr,nc],{...meta,n,d,nr,nc,total:old.n,maxCount:old.maxCount});
              old.d=d;
              emit("direction","합쳐진 군집의 이동 방향을 "+arrow[d]+"로 바꿉니다.",board,pending,[nr,nc],{...meta,n,d,nr,nc,total:old.n,maxCount:old.maxCount});
            }
          }
        }
        emit("prepare",hour+"시간의 모든 이동과 합체가 끝났습니다. worms를 새로 만듭니다.",board,[],null,{hour});
        worms=[...board.entries()].map(([key,g])=>({r:Number(key.split(",")[0]),c:Number(key.split(",")[1]),n:g.n,d:g.d}));
        emit("update", "board에서 "+worms.length+"개 군집을 다음 시간의 worms로 복사합니다.",new Map(),worms,null,{hour});
      }
      const answer=worms.reduce((sum,g)=>sum+g.n,0);
      emit("sum",M+"시간 후 모든 군집의 미생물 수 합계는 "+answer+"입니다.",new Map(),worms,null,{hour:M,total:answer});
      output+="#"+(index+1)+" "+answer+"\n";
      emit("output","#"+(index+1)+" "+answer+" 출력 완료",new Map(),worms,null,{hour:M,total:answer});
    });
    return steps;
  }
  function renderCode(){
    const markup=Core.createCodeMarkup(els.sourceCode,PROBLEM.sourceSteps,{wrap:false,editor:true});
    els.codeView.innerHTML=els.mobileCodeView.innerHTML=markup;
    codeLines=Core.createLineMap(els.codeView);
    mobileCodeLines=Core.createLineMap(els.mobileCodeView);
    stepLineMap=Core.createStepLineMap(els.codeView);
  }
  function makeCells(root,N){
    root.style.gridTemplateColumns="repeat("+N+", minmax(0, auto))";
    root.replaceChildren();
    const result=[];
    for(let r=0;r<N;r++){
      const row=[];
      for(let c=0;c<N;c++){
        const cell=document.createElement("div");
        cell.className="microbe-cell"+(r===0||c===0||r===N-1||c===N-1?" edge":"");
        cell.setAttribute("aria-label",r+"행 "+c+"열");
        root.append(cell);row.push(cell);
      }
      result.push(row);
    }
    return result;
  }
  function renderGrid(cells,step){
    const values=new Map(),flag=new Map();
    const add=(group,type)=>{
      const key=group.r+","+group.c,old=values.get(key);
      if(old){old.n+=group.n;old.many=true;}else values.set(key,{n:group.n,d:group.d,many:false});
      flag.set(key,type==="arrived"?"arrived":flag.get(key)||"pending");
    };
    step.pending.forEach(g=>add(g,"pending"));
    step.board.forEach(g=>{add(g,"arrived");if(g.merged)values.get(g.r+","+g.c).many=true;});
    for(let r=0;r<step.N;r++)for(let c=0;c<step.N;c++){
      const cell=cells[r][c],key=r+","+c,g=values.get(key),focus=step.focus?.[0]===r&&step.focus?.[1]===c;
      cell.classList.toggle("pending",flag.get(key)==="pending");
      cell.classList.toggle("arrived",flag.get(key)==="arrived");
      cell.classList.toggle("focus",focus);
      cell.classList.toggle("merged",!!g?.many);
      cell.replaceChildren();
      if(g){
        const count=document.createElement("strong");count.textContent=g.n;
        const dir=document.createElement("small");dir.textContent=g.many?"합체":arrow[g.d];
        cell.append(count,dir);
      }
      cell.title=g?"("+r+","+c+") · "+g.n+"마리":("("+r+","+c+")");
    }
  }
  function render({follow=true}={}){
    const step=state.steps[state.index];if(!step)return;
    if(state.renderedCase!==step.tc){
      state.desktopCells=makeCells(els.board,step.N);
      state.mobileCells=makeCells(els.mobileBoard,step.N);
      state.renderedCase=step.tc;
    }
    renderGrid(state.desktopCells,step);renderGrid(state.mobileCells,step);
    for(const lines of [codeLines,mobileCodeLines])for(const [line,el] of lines)el.classList.toggle("active",line===step.line);
    const m=step.meta,selected=step.focus&&step.board.find(g=>g.r===step.focus[0]&&g.c===step.focus[1]);
    const entry=selected?"board[("+selected.r+", "+selected.c+")] = [total "+selected.n+", max_count "+selected.maxCount+", 방향 "+arrow[selected.d]+"]":"board에 기록된 군집 "+step.board.length+"개 · 아직 이동하지 않은 군집 "+step.pending.length+"개";
    els.entryText.textContent=els.mobileEntryText.textContent=entry;
    els.boardLabel.textContent="#"+step.tc+" · "+step.N+"×"+step.N;
    els.codeLineLabel.textContent=els.mobileCodeStatus.textContent="LINE "+step.line;
    els.phaseLabel.textContent=els.mobilePhase.textContent=step.phase.toUpperCase();
    const pos=m.nr===undefined?"—":"("+m.nr+", "+m.nc+")";
    const nd=m.n===undefined?"—":m.n+" · "+arrow[m.d];
    const values={hourValue:step.hour+"/"+step.M,movedValue:m.moved??"—",posValue:pos,microbeValue:nd,totalValue:m.total??selected?.n??"—",
      maxValue:m.maxCount??selected?.maxCount??"—",groupValue:step.visibleCount,answerValue:step.visibleTotal};
    for(const [id,value] of Object.entries(values))els[id].textContent=value;
    els.mobilePos.textContent=pos;els.mobileMicrobe.textContent=nd;els.mobileTotal.textContent=values.totalValue;els.mobileMax.textContent=values.maxValue;
    els.mobileAnswer.textContent=step.visibleTotal;
    els.mobileCoord.textContent="#"+step.tc+" · "+step.hour+"시간";
    els.mobileStateMeta.textContent="군집 "+step.visibleCount+"개";
    els.explainText.textContent=els.mobileExplanation.textContent=step.message;
    els.outputView.textContent=els.mobileOutputView.textContent=step.output||"아직 출력이 없습니다.";
    els.timeline.value=els.mobileTimeline.value=state.index;
    els.stepLabel.textContent=els.mobileTimelineStatus.textContent=(state.index+1)+" / "+state.steps.length;
    els.prevBtn.disabled=els.mobilePrevBtn.disabled=state.index===0;
    els.nextBtn.disabled=els.mobileNextBtn.disabled=state.index===state.steps.length-1;
    if(follow){
      const mobile=matchMedia("(max-width:760px)").matches;
      Core.centerInsideViewport(mobile?els.mobileCodeViewport:els.codeViewport,(mobile?mobileCodeLines:codeLines).get(step.line),{horizontal:false});
      if(step.focus)Core.centerInsideViewport(mobile?els.mobileBoardViewport:els.boardViewport,(mobile?state.mobileCells:state.desktopCells)[step.focus[0]][step.focus[1]]);
    }
  }
  function stop(){if(state.timer!==null)clearTimeout(state.timer);state.timer=null;Core.updatePlaybackControls(els.playBtn,false);}
  function go(index){state.index=Core.clamp(index,0,state.steps.length-1);render();}
  function nextTick(){state.timer=setTimeout(()=>{
    if(state.index>=state.steps.length-1){stop();return;}
    go(state.index+1);
    if(state.index>=state.steps.length-1)stop();else nextTick();
  },PROBLEM.autoplayMs/state.speed);}
  function play(){stop();if(state.index>=state.steps.length-1)go(0);Core.updatePlaybackControls(els.playBtn,true);nextTick();}
  function renderSamples(){
    els.sampleButtons.replaceChildren();
    for(const sample of PROBLEM.samples){
      const btn=document.createElement("button");btn.type="button";btn.className="btn";
      btn.dataset.sample=sample.id;btn.textContent=sample.label;
      btn.classList.toggle("selected",state.selectedSample===sample.id);
      els.sampleButtons.append(btn);
    }
  }
  function apply(text,id=null){
    stop();
    try{
      const cases=parseInput(text),steps=buildSteps(cases);
      state.steps=steps;state.index=0;state.renderedCase=null;state.selectedSample=id;
      els.timeline.max=els.mobileTimeline.max=steps.length-1;
      els.inputError.textContent="";renderSamples();render();
    }catch(e){els.inputError.textContent=e.message;}
  }
  els.prevBtn.addEventListener("click",()=>{stop();go(state.index-1);});
  els.nextBtn.addEventListener("click",()=>{stop();go(state.index+1);});
  els.mobilePrevBtn.addEventListener("click",()=>els.prevBtn.click());
  els.mobileNextBtn.addEventListener("click",()=>els.nextBtn.click());
  document.getElementById("mobilePlayBtn").addEventListener("click",()=>els.playBtn.click());
  els.playBtn.addEventListener("click",()=>state.timer===null?play():stop());
  els.resetBtn.addEventListener("click",()=>{stop();go(0);});
  els.replayBtn.addEventListener("click",play);
  els.skipBtn.addEventListener("click",()=>{stop();go(state.steps.length-1);});
  els.speedRange.addEventListener("input",()=>{state.speed=Number(els.speedRange.value);els.speedLabel.textContent=Core.formatDecimal(state.speed)+"×";
    if(state.timer!==null){clearTimeout(state.timer);nextTick();}
  });
  for(const timeline of [els.timeline,els.mobileTimeline])timeline.addEventListener("input",e=>{stop();go(Number(e.target.value));});
  els.applyBtn.addEventListener("click",()=>apply(els.inputArea.value));
  els.inputArea.addEventListener("input",()=>{state.selectedSample=null;renderSamples();});
  els.sampleButtons.addEventListener("click",e=>{
    const btn=e.target.closest("button[data-sample]");if(!btn)return;
    const sample=PROBLEM.samples.find(x=>x.id===btn.dataset.sample);if(!sample)return;
    els.inputArea.value=sample.value;apply(sample.value,sample.id);
  });
  renderCode();
  els.inputArea.value=PROBLEM.samples[0].value;
  apply(PROBLEM.samples[0].value,PROBLEM.samples[0].id);
})();
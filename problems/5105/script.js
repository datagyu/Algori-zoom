(() => {
  const Core=window.AlgoriZoomCore;
  const PROBLEM=Object.freeze({platform:"SWEA",number:"5105",level:"D3",title:"미로의 거리",autoplayMs:560,defaultSampleId:"one",
    sourceSteps:[
      {text:"maze = [list(map(int, input())) for _ in range(N)]",types:"maze",occurrence:1},
      {text:"if maze[i][j] == 2:",types:"findStart",occurrence:1},
      {text:"start = [i, j]",types:"findStart",occurrence:1},
      {text:"queue.append([start[0], start[1], 0])",types:"enqueueStart",occurrence:1},
      {text:"while queue:",types:"while",occurrence:1},
      {text:"current = queue.pop(0)",types:"pop",occurrence:1},
      {text:"r, c, distance = current",types:"current",occurrence:1},
      {text:"for dr, dc in direction:",types:"direction",occurrence:1},
      {text:"nr = r + dr",types:"next",occurrence:1},
      {text:"if (0 <= nr < N) and (0 <= nc < N):",types:"bounds",occurrence:1},
      {text:"if maze[nr][nc] == 0:",types:"path",occurrence:1},
      {text:"queue.append([nr, nc, distance + 1])",types:"enqueue",occurrence:1},
      {text:"maze[nr][nc] = 1",types:"visit",occurrence:1},
      {text:"elif maze[nr][nc] == 3:",types:"goal",occurrence:1},
      {text:"ans = distance",types:"answer",occurrence:1},
      {text:"print('#{} {}'.format(tc,ans))",types:"output",occurrence:1}
    ],
    samples:[
      {id:"one",label:"샘플 1 · BFS 흐름",value:"1\n5\n13101\n10101\n10101\n10101\n10021"},
      {id:"all",label:"첨부 예제 전체",value:"3\n5\n13101\n10101\n10101\n10101\n10021\n5\n10031\n10111\n10101\n10101\n12001\n5\n00013\n01110\n21000\n01111\n00000"}
    ]
  });
  const samples=PROBLEM.samples,defaultSample=samples[0];
  const els=Core.getByIds(["sourceCode","resetBtn","prevBtn","nextBtn","playBtn","replayBtn","skipBtn","speedRange","speedLabel","stepLabel","timeline","codeLineLabel","codeViewport","codeView","boardLabel","boardViewport","board","phaseLabel","currentValue","distanceValue","nextValue","queueLengthValue","checkValue","answerValue","explainText","queueView","queueLabel","outputView","inputArea","applyBtn","sampleButtons","inputError","mobileCoord","mobileCodeStatus","mobileCodeViewport","mobileCodeView","mobilePhase","mobileBoardViewport","mobileBoard","mobileQueueView","mobileExplanation","mobileStateMeta","mobileCurrent","mobileDistance","mobileNext","mobileQueueLength","mobileAnswer","mobileOutputView","mobilePrevBtn","mobileTimeline","mobileTimelineStatus","mobileNextBtn"]);
  const state={cases:[],steps:[],stepIndex:0,timer:null,speed:1,selectedSample:defaultSample.id,codeLines:null,mobileCodeLines:null};let stepLineMap;
  function renderCode(){const markup=Core.createCodeMarkup(els.sourceCode,PROBLEM.sourceSteps,{wrap:false,editor:true});els.codeView.innerHTML=markup;els.mobileCodeView.innerHTML=markup;state.codeLines=Core.createLineMap(els.codeView);state.mobileCodeLines=Core.createLineMap(els.mobileCodeView);stepLineMap=Core.createStepLineMap(els.codeView);}
  function parseInput(text){
    const lines=text.trim().split(/\r?\n/).map(v=>v.trim()).filter(Boolean);if(!lines.length||!/^\d+$/.test(lines[0]))throw new Error("첫 줄의 테스트 케이스 수 T를 확인해주세요.");
    const T=Number(lines[0]);if(T<1||T>50)throw new Error("T는 1 이상 50 이하입니다.");let cursor=1,cases=[];
    for(let tc=0;tc<T;tc++){if(cursor>=lines.length||!/^\d+$/.test(lines[cursor]))throw new Error("각 케이스의 N을 확인해주세요.");const N=Number(lines[cursor++]);if(N<5||N>100)throw new Error("N은 5 이상 100 이하입니다.");const maze=[];let starts=0,goals=0;
      for(let r=0;r<N;r++){if(cursor>=lines.length||!new RegExp(`^[0-3]{${N}}$`).test(lines[cursor]))throw new Error(`N=${N}이면 미로 각 줄은 0~3으로 된 ${N}자리여야 합니다.`);const row=[...lines[cursor++]].map(Number);starts+=row.filter(v=>v===2).length;goals+=row.filter(v=>v===3).length;maze.push(row);}
      if(starts!==1||goals!==1)throw new Error("각 미로에는 출발점 2와 도착점 3이 각각 하나씩 있어야 합니다.");cases.push({N,maze});
    }if(cursor!==lines.length)throw new Error("T와 입력된 테스트 케이스 수를 확인해주세요.");return{cases};
  }
  function buildSteps(){
    const steps=[];let output="";
    state.cases.forEach((data,index)=>{
      const {N}=data,original=data.maze.map(row=>[...row]),maze=data.maze.map(row=>[...row]);let start=null,destination=null;
      for(let i=0;i<N;i++)for(let j=0;j<N;j++){if(maze[i][j]===2)start=[i,j];else if(maze[i][j]===3)destination=[i,j];}
      let queue=[],current=null,next=null,distance=null,ans=0,check="준비",visited=new Map(),found=false;
      const key=(r,c)=>`${r},${c}`;visited.set(key(start[0],start[1]),0);
      const push=(phase,message,extra={})=>steps.push({N,tc:index+1,original:original.map(row=>[...row]),maze:maze.map(row=>[...row]),queue:queue.map(q=>[...q]),current:current&&[...current],next:next&&[...next],distance,ans,check,visited:new Map(visited),destination:[...destination],phase,line:stepLineMap.get(phase),message,output,...extra});
      push("maze","미로를 읽습니다. 0은 통로, 1은 벽, 2는 출발점, 3은 도착점입니다.");
      push("findStart",`출발점 2의 위치 (${start[0]}, ${start[1]})를 찾았습니다.`,{focus:start});
      queue.push([start[0],start[1],0]);check="출발점 enqueue";push("enqueueStart","출발점을 거리 0과 함께 큐에 넣습니다. 이제 가까운 칸부터 탐색합니다.",{queued:start});
      const direction=[[-1,0],[1,0],[0,-1],[0,1]];
      while(queue.length&&!found){
        check="queue가 비어있지 않음";push("while",`큐에 ${queue.length}개 위치가 있으므로 BFS를 계속합니다.`);
        current=queue.shift();distance=current[2];next=null;check="pop(0)";push("pop",`큐의 맨 앞 (${current[0]}, ${current[1]}, 거리 ${distance})를 꺼냅니다.`);
        push("current",`현재 위치는 (${current[0]}, ${current[1]}), 현재까지 지나온 통로 칸 수는 ${distance}입니다.`);
        for(const [dr,dc] of direction){
          check=`델타 (${dr}, ${dc})`;push("direction",`현재 위치에서 델타 (${dr}, ${dc}) 방향을 확인합니다.`);
          const nr=current[0]+dr,nc=current[1]+dc;next=[nr,nc];push("next",`다음 후보 좌표는 (${nr}, ${nc})입니다.`);
          const inside=0<=nr&&nr<N&&0<=nc&&nc<N;check=inside?"범위 안":"범위 밖";push("bounds",inside?`(${nr}, ${nc})는 미로 범위 안입니다.`:`(${nr}, ${nc})는 미로 밖이므로 건너뜁니다.`);
          if(!inside)continue;
          if(maze[nr][nc]===0){
            check="이동 가능한 0";push("path",`(${nr}, ${nc})는 통로 0입니다. 큐에 넣을 수 있습니다.`);
            queue.push([nr,nc,distance+1]);visited.set(key(nr,nc),distance+1);check=`enqueue · 거리 ${distance+1}`;push("enqueue",`(${nr}, ${nc})를 거리 ${distance+1}과 함께 큐의 뒤에 넣습니다.`,{queued:[nr,nc]});
            maze[nr][nc]=1;check="방문 처리";push("visit","방금 큐에 넣은 칸을 1로 바꿔 같은 칸이 중복으로 큐에 들어가는 것을 막습니다.",{visitedNow:[nr,nc]});
          }else if(maze[nr][nc]===3){
            check="목적지 3 발견";push("goal",`(${nr}, ${nc})에서 목적지 3을 발견했습니다. BFS이므로 처음 발견한 경로가 최소 거리입니다.`,{foundGoal:[nr,nc]});
            ans=distance;found=true;check=`ans = ${ans}`;push("answer",`도착 직전까지 지나온 통로 칸 수 ${distance}를 ans에 저장합니다.`,{foundGoal:[nr,nc]});break;
          }else{check="벽 또는 방문한 칸";push("path",`(${nr}, ${nc})는 벽이거나 이미 방문한 칸이라 큐에 넣지 않습니다.`);}
        }
      }
      current=null;next=null;distance=null;check=found?"최단 거리 출력":"경로 없음 · 0 출력";output+=`#${index+1} ${ans}\n`;push("output",found?`최소 통로 칸 수 ${ans}를 출력합니다.`:"도착점에 갈 수 없으므로 0을 출력합니다.");
    });state.steps=steps;
  }
  function renderMaze(container,step){
    container.replaceChildren();container.style.gridTemplateColumns=`repeat(${step.N},1fr)`;
    for(let r=0;r<step.N;r++)for(let c=0;c<step.N;c++){const cell=document.createElement("div"),v=step.original[r][c];cell.className="maze-cell";if(v===1)cell.classList.add("wall");if(v===2)cell.classList.add("start");if(v===3)cell.classList.add("goal");if(step.visited.has(`${r},${c}`)&&v===0)cell.classList.add("visited");if(step.queue.some(q=>q[0]===r&&q[1]===c))cell.classList.add("queued");if(step.current&&step.current[0]===r&&step.current[1]===c)cell.classList.add("current");if(step.next&&step.next[0]===r&&step.next[1]===c)cell.classList.add("next");if(step.foundGoal&&step.foundGoal[0]===r&&step.foundGoal[1]===c)cell.classList.add("found");cell.textContent=v===1?"1":v===2?"2":v===3?"3":"";const d=step.visited.get(`${r},${c}`);if(d!=null&&v!==1){const small=document.createElement("span");small.className="cell-distance";small.textContent=d;cell.appendChild(small);}container.appendChild(cell);}
  }
  function renderQueue(container,step){container.replaceChildren();if(!step.queue.length){const p=document.createElement("p");p.className="queue-empty";p.textContent="큐가 비어 있습니다.";container.appendChild(p);return;}step.queue.forEach((q,i)=>{const item=document.createElement("div");item.className="queue-item"+(i===0?" front":"");item.innerHTML=`(${q[0]}, ${q[1]})<small>distance ${q[2]}</small>`;container.appendChild(item);});}
  function highlight(lines,n){lines.forEach((line,number)=>line.classList.toggle("active",number===n));}
  function render({follow=true}={}){
    const step=state.steps[state.stepIndex];if(!step)return;highlight(state.codeLines,step.line);highlight(state.mobileCodeLines,step.line);renderMaze(els.board,step);renderMaze(els.mobileBoard,step);renderQueue(els.queueView,step);renderQueue(els.mobileQueueView,step);
    const cur=step.current?`(${step.current[0]}, ${step.current[1]})`:"—",next=step.next?`(${step.next[0]}, ${step.next[1]})`:"—";
    els.codeLineLabel.textContent=`LINE ${step.line}`;els.boardLabel.textContent=`#${step.tc} · N=${step.N}`;els.phaseLabel.textContent=step.phase.toUpperCase();els.currentValue.textContent=cur;els.distanceValue.textContent=step.distance??"—";els.nextValue.textContent=next;els.queueLengthValue.textContent=step.queue.length;els.checkValue.textContent=step.check;els.answerValue.textContent=step.ans;els.explainText.textContent=step.message;els.queueLabel.textContent=step.queue.length?`FRONT → ${step.queue.length}개 대기`:"QUEUE EMPTY";els.outputView.textContent=step.output||"아직 출력이 없습니다.";
    els.mobileCoord.textContent=`#${step.tc} · N=${step.N}`;els.mobileCodeStatus.textContent=`LINE ${step.line}`;els.mobilePhase.textContent=step.phase.toUpperCase();els.mobileExplanation.textContent=step.message;els.mobileStateMeta.textContent=step.check;els.mobileCurrent.textContent=cur;els.mobileDistance.textContent=step.distance??"—";els.mobileNext.textContent=next;els.mobileQueueLength.textContent=step.queue.length;els.mobileAnswer.textContent=step.ans;els.mobileOutputView.textContent=step.output||"아직 출력이 없습니다.";
    els.timeline.value=state.stepIndex;els.mobileTimeline.value=state.stepIndex;els.stepLabel.textContent=`${state.stepIndex+1} / ${state.steps.length}`;els.mobileTimelineStatus.textContent=`${state.stepIndex+1} / ${state.steps.length}`;els.prevBtn.disabled=els.mobilePrevBtn.disabled=state.stepIndex===0;els.nextBtn.disabled=els.mobileNextBtn.disabled=state.stepIndex===state.steps.length-1;
    if(follow){Core.centerInsideViewport(els.codeViewport,state.codeLines.get(step.line),{horizontal:false});Core.centerInsideViewport(els.mobileCodeViewport,state.mobileCodeLines.get(step.line),{horizontal:false});}
  }
  function stopPlayback(){if(state.timer)clearTimeout(state.timer);state.timer=null;Core.updatePlaybackControls(els.playBtn,false)}function goTo(i,o={}){state.stepIndex=Core.clamp(i,0,state.steps.length-1);render(o)}function move(d){stopPlayback();goTo(state.stepIndex+d,{follow:true})}function scheduleNext(){state.timer=setTimeout(()=>{if(state.stepIndex>=state.steps.length-1){stopPlayback();return}goTo(state.stepIndex+1,{follow:true});state.stepIndex>=state.steps.length-1?stopPlayback():scheduleNext()},PROBLEM.autoplayMs/state.speed)}function startPlayback(){stopPlayback();if(state.stepIndex>=state.steps.length-1)goTo(0);Core.updatePlaybackControls(els.playBtn,true);scheduleNext()}function togglePlayback(){state.timer?stopPlayback():startPlayback()}function reset(){stopPlayback();goTo(0,{follow:true})}
  function renderSampleButtons(){els.sampleButtons.replaceChildren();samples.forEach(sample=>{const b=document.createElement("button");b.type="button";b.className="btn";b.textContent=sample.label;b.dataset.sample=sample.id;b.classList.toggle("selected",state.selectedSample===sample.id);els.sampleButtons.appendChild(b)})}
  function applyText(text,sampleId=null){stopPlayback();try{Object.assign(state,parseInput(text),{selectedSample:sampleId,stepIndex:0});els.inputError.textContent="";buildSteps();const max=Math.max(0,state.steps.length-1);els.timeline.max=els.mobileTimeline.max=max;renderSampleButtons();render({follow:true})}catch(error){els.inputError.textContent=error.message}}
  els.prevBtn.addEventListener("click",()=>move(-1));els.nextBtn.addEventListener("click",()=>move(1));document.getElementById("mobilePlayBtn").addEventListener("click",()=>els.playBtn.click());els.mobilePrevBtn.addEventListener("click",()=>move(-1));els.mobileNextBtn.addEventListener("click",()=>move(1));els.resetBtn.addEventListener("click",reset);els.replayBtn.addEventListener("click",()=>{reset();startPlayback()});els.skipBtn.addEventListener("click",()=>{stopPlayback();goTo(state.steps.length-1,{follow:true})});els.playBtn.addEventListener("click",togglePlayback);els.speedRange.addEventListener("input",()=>{state.speed=Number(els.speedRange.value);els.speedLabel.textContent=`${Core.formatDecimal(state.speed)}×`;if(state.timer){clearTimeout(state.timer);scheduleNext()}});[els.timeline,els.mobileTimeline].forEach(t=>t.addEventListener("input",e=>{stopPlayback();goTo(Number(e.target.value),{follow:true})}));els.applyBtn.addEventListener("click",()=>applyText(els.inputArea.value));els.inputArea.addEventListener("input",()=>{state.selectedSample=null;renderSampleButtons()});els.sampleButtons.addEventListener("click",e=>{const b=e.target.closest("button[data-sample]");if(!b)return;const sample=samples.find(s=>s.id===b.dataset.sample);if(!sample)return;els.inputArea.value=sample.value;applyText(sample.value,sample.id)});
  renderCode();els.inputArea.value=defaultSample.value;applyText(defaultSample.value,defaultSample.id);
})();

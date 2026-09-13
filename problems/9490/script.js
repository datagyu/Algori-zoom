(() => {
 const Core=window.AlgoriZoomCore;
 const PROBLEM={"number":"9490","title":"풍선팡","autoplayMs":350,"defaultSampleId":"one","sourceSteps":[{"text":"max_pang = 0","types":"init"},{"text":"dr = [0, 1, 0, -1]","types":"dr"},{"text":"dc = [1, 0, -1, 0]","types":"dc"},{"text":"for r in range(N):","types":"row"},{"text":"for c in range(M):","types":"col"},{"text":"c_pang = balloons[r][c]","types":"center"},{"text":"for i in range(4):","types":"direction"},{"text":"for j in range(1, balloons[r][c]+1):","types":"distance"},{"text":"nr = r + dr[i]*j","types":"next-row"},{"text":"nc = c + dc[i]*j","types":"next-col"},{"text":"if (0 <= nr < N) and (0 <= nc < M):","types":"bounds"},{"text":"c_pang += balloons[nr][nc]","types":"add"},{"text":"if max_pang < c_pang:","types":"best-check"},{"text":"max_pang = c_pang","types":"best"},{"text":"print('#{} {}'.format(tc, max_pang))","types":"output"}],"samples":[{"id":"one","label":"첨부 예제 1 · 3×5","value":"1\n3 5\n2 1 1 2 2\n2 2 1 2 2\n2 2 1 1 2"},{"id":"sample2","label":"첨부 예제 2 · 5×5","value":"1\n5 5\n3 4 1 2 3\n3 4 1 3 2\n2 3 2 4 1\n1 4 4 1 3\n2 2 3 4 4"},{"id":"sample3","label":"첨부 예제 3 · 5×8","value":"1\n5 8\n1 3 4 4 4 4 3 3\n4 1 2 4 3 1 4 4\n4 1 4 4 1 4 2 1\n3 2 4 2 1 1 2 1\n4 4 1 4 4 2 2 2"},{"id":"all","label":"첨부 예제 전체","value":"3\n3 5\n2 1 1 2 2 \n2 2 1 2 2 \n2 2 1 1 2 \n5 5\n3 4 1 2 3 \n3 4 1 3 2 \n2 3 2 4 1 \n1 4 4 1 3 \n2 2 3 4 4 \n5 8\n1 3 4 4 4 4 3 3 \n4 1 2 4 3 1 4 4 \n4 1 4 4 1 4 2 1 \n3 2 4 2 1 1 2 1 \n4 4 1 4 4 2 2 2"}]};
  const samples = PROBLEM.samples;
  const defaultSample = samples.find(
    (sample) => sample.id === PROBLEM.defaultSampleId,
  );

  const els = Core.getByIds([
    "sourceCode", "rowValue", "colValue", "nextRowValue", "nextColValue", "dirValue", "bestPath", "mobileBestPath",
    "outputView",
    "mobileOutputView",
    "codeViewport",
    "codeView",
    "codeLineLabel",
    "boardViewport",
    "board",
    "boardLabel",
    "phaseLabel",
    "crValue",
    "ccValue",
    "nrValue",
    "ncValue",
    "numValue",
    "directionValue",
    "explainText",
    "prevBtn",
    "playBtn",
    "resetBtn",
    "replayBtn",
    "speedRange",
    "speedLabel",
    "skipBtn",
    "nextBtn",
    "timeline",
    "stepLabel",
    "inputArea",
    "applyBtn",
    "sampleButtons",
    "inputError",
    "mobileCoord",
    "mobileCodeStatus",
    "mobileCodeViewport",
    "mobileCodeView",
    "mobileBoardViewport",
    "mobileBoard",
    "mobilePhase",
    "mobileExplanation",
    "mobileStateMeta",
    "mobileCr",
    "mobileCc",
    "mobileNr",
    "mobileNc",
    "mobileDirection",
    "mobilePrevBtn",
    "mobileNextBtn",
    "mobileTimeline",
    "mobileTimelineStatus",
  ]);

  const state = {
    N: null,
    cases: [],
    renderedCase: null,
    board: [],
    steps: [],
    stepIndex: 0,
    timer: null,
    speed: 1,
    selectedSample: defaultSample.id,
    cells: [],
    mobileCells: [],
    codeLines: [],
    mobileCodeLines: [],
  };

  let stepLineMap;

  function renderCode() {
    const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps, {
      wrap: false,
      editor: true,
    });
    els.codeView.innerHTML = markup;
    els.mobileCodeView.innerHTML = markup;
    state.codeLines = Core.createLineMap(els.codeView);
    stepLineMap = Core.createStepLineMap(els.codeView);
    state.mobileCodeLines = Core.createLineMap(els.mobileCodeView);
  }



  function parseInput(text) {
    const tokens=text.trim().split(/\s+/);
    if(!text.trim()||tokens.some(t=>!/^\d+$/.test(t))) throw new Error('T, N, M과 꽃가루 수를 정수로 입력해주세요.');
    const values=tokens.map(Number); let pos=0; const T=values[pos++];
    if(!Number.isSafeInteger(T)||T<1||T>10) throw new Error('시각화는 예제 1~10개를 지원합니다.');
    const cases=[];
    for(let tc=1;tc<=T;tc++) {
      const N=values[pos++], M=values[pos++];
      if(!Number.isInteger(N)||!Number.isInteger(M)||N<3||N>100||M<3||M>100) throw new Error('#'+tc+': N과 M은 3~100입니다.');
      const flat=values.slice(pos,pos+N*M);
      if(flat.length!==N*M) throw new Error('#'+tc+': 꽃가루 수 '+N*M+'개가 필요합니다.');
      if(flat.some(h=>!Number.isSafeInteger(h)||h<1||h>100)) throw new Error('#'+tc+': 시각화의 꽃가루 수는 1~100입니다.');
      cases.push(Array.from({length:N},(_,r)=>flat.slice(r*M,(r+1)*M)));pos+=N*M;
    }
    if(pos!==values.length) throw new Error('T와 배열 크기를 확인해주세요. 남는 입력이 있습니다.');
    return {cases};
  }
  function buildSteps(cases) {
    const steps=[], dr=[0,1,0,-1], dc=[1,0,-1,0], directions=['오른쪽','아래','왼쪽','위'];
    let output='';
    cases.forEach((board,index)=>{
      const N=board.length,M=board[0].length;
      let r=null,c=null,nr=null,nc=null,i=null,j=null,c_pang=0,max_pang=0,bestCenter=null;
      const push=(phase,message)=>{
        if(steps.length>=250000) throw new Error('실행 단계가 250,000개를 넘습니다. 배열 크기나 예제 수를 줄여주세요.');
        steps.push({line:stepLineMap.get(phase),phase,message,N,M,tc:index+1,board,r,c,nr,nc,i,j,c_pang,max_pang,bestCenter,output});
      };
      push('init','최대 꽃가루 합 max_pang을 0으로 초기화합니다.');
      push('dr','dr = [0, 1, 0, -1]: 오른쪽·아래·왼쪽·위의 행 변화입니다.');
      push('dc','dc = [1, 0, -1, 0]: 같은 순서의 열 변화입니다.');
      for(let row=0;row<N;row++) {
        r=row;push('row','행 r = '+r+'를 선택합니다.');
        for(let col=0;col<M;col++) {
          c=col;push('col','중심 풍선 ('+r+', '+c+')을 선택합니다.');
          c_pang=board[r][c];nr=null;nc=null;i=null;j=null;
          push('center','중심의 꽃가루 '+c_pang+'개로 시작합니다. 네 방향의 탐색 거리는 '+board[r][c]+'로 고정됩니다.');
          for(let dir=0;dir<4;dir++) {
            i=dir;j=null;push('direction','i = '+i+': '+directions[i]+' 방향을 검사합니다.');
            for(let distance=1;distance<=board[r][c];distance++) {
              j=distance;push('distance','중심에서 '+directions[i]+'으로 '+j+'칸 떨어진 위치를 계산합니다.');
              nr=r+dr[i]*j;push('next-row','nr = '+r+' + ('+dr[i]+') × '+j+' = '+nr);
              nc=c+dc[i]*j;push('next-col','nc = '+c+' + ('+dc[i]+') × '+j+' = '+nc);
              const inside=nr>=0&&nr<N&&nc>=0&&nc<M;
              push('bounds','('+nr+', '+nc+')는 배열 '+(inside?'안입니다. 꽃가루 '+board[nr][nc]+'개를 더할 수 있습니다.':'밖입니다. 합산하지 않습니다.'));
              if(inside) {const before=c_pang;c_pang+=board[nr][nc];push('add',before+' + '+board[nr][nc]+' = '+c_pang+'. 추가 풍선에서 연쇄 폭발은 일어나지 않습니다.');}
            }
          }
          push('best-check','max_pang '+max_pang+' < c_pang '+c_pang+': '+(max_pang<c_pang?'참':'거짓'));
          if(max_pang<c_pang) {max_pang=c_pang;bestCenter=[r,c];push('best','최대 합을 '+max_pang+'로 갱신합니다. 중심은 ('+r+', '+c+')입니다.');}
        }
      }
      output+='#'+(index+1)+' '+max_pang+'\n';push('output','모든 풍선을 검사했습니다. 최대 꽃가루 합은 '+max_pang+'입니다.');
    });
    return steps;
  }
  function renderBoardInto(container) {
    container.style.gridTemplateColumns='repeat('+state.board[0].length+', 42px)';container.replaceChildren();
    return state.board.map((row,r)=>row.map((value,c)=>{
      const cell=document.createElement('div');cell.className='pang-cell';cell.textContent=value;
      cell.setAttribute('aria-label',r+'행 '+c+'열 꽃가루 '+value+'개');container.append(cell);return cell;
    }));
  }
  function updateBoard(cache,step) {
    const settled=['best-check','best','output'].includes(step.phase),scanning=['next-col','bounds','add'].includes(step.phase);
    const active=!['init','dr','dc','row','col'].includes(step.phase),range=step.board[step.r]?.[step.c]??0;
    for(let r=0;r<step.N;r++) for(let c=0;c<step.M;c++) {
      const cell=cache[r][c],dy=r-step.r,dx=c-step.c,distance=Math.abs(dy)+Math.abs(dx);
      const direction=dy===0?(dx>0?0:2):(dy>0?1:3),cross=(dy===0||dx===0)&&distance<=range;
      const added=active&&cross&&(distance===0||settled||(step.i!==null&&(direction<step.i||(direction===step.i&&step.j!==null&&(distance<step.j||(distance===step.j&&step.phase==='add'))))));
      const best=step.bestCenter,inBest=best&&(r===best[0]||c===best[1])&&Math.abs(r-best[0])+Math.abs(c-best[1])<=step.board[best[0]][best[1]];
      cell.classList.toggle('on-route',Boolean(added));cell.classList.toggle('best-route',Boolean(inBest));
      cell.classList.toggle('current',active&&step.r===r&&step.c===c);cell.classList.toggle('inspecting',scanning&&step.nr===r&&step.nc===c);
    }
  }
  function render({follow=true}={}) {
    const step=state.steps[state.stepIndex];if(!step)return;
    if(state.renderedCase!==step.tc) {state.N=step.N;state.board=step.board;state.renderedCase=step.tc;state.cells=renderBoardInto(els.board);state.mobileCells=renderBoardInto(els.mobileBoard);}
    for(const [lines,board] of [[state.codeLines,state.cells],[state.mobileCodeLines,state.mobileCells]]) {lines.forEach((line,n)=>line.classList.toggle('active',n===step.line));updateBoard(board,step);}
    els.boardLabel.textContent='#'+step.tc+' · '+step.N+' × '+step.M;
    els.codeLineLabel.textContent=els.mobileCodeStatus.textContent='LINE '+step.line;
    els.phaseLabel.textContent=els.mobilePhase.textContent=step.phase==='output'?'완료':'탐색 중';
    const values={crValue:step.r,ccValue:step.c,nrValue:step.nr,ncValue:step.nc,numValue:step.c_pang,directionValue:step.max_pang,rowValue:step.N,colValue:step.M,nextRowValue:step.j,nextColValue:step.board[step.r]?.[step.c],dirValue:step.i};
    for(const [id,value] of Object.entries(values))els[id].textContent=value??'—';
    els.mobileCr.textContent=step.r??'—';els.mobileCc.textContent=step.c??'—';els.mobileNr.textContent=step.nr??'—';els.mobileNc.textContent=step.nc??'—';els.mobileDirection.textContent=step.max_pang;
    els.mobileCoord.textContent='#'+step.tc+' · 중심 ('+(step.r??'—')+', '+(step.c??'—')+')';els.mobileStateMeta.textContent='꽃가루 합 '+step.c_pang;
    els.explainText.textContent=els.mobileExplanation.textContent=step.message;els.outputView.textContent=els.mobileOutputView.textContent=step.output||'아직 출력이 없습니다.';
    els.bestPath.textContent=els.mobileBestPath.textContent=step.bestCenter?'중심 ('+step.bestCenter.join(', ')+') · 거리 '+step.board[step.bestCenter[0]][step.bestCenter[1]]+' · 꽃가루 '+step.max_pang+'개':'아직 모든 방향을 검사한 중심이 없습니다.';
    els.timeline.value=els.mobileTimeline.value=state.stepIndex;els.stepLabel.textContent=els.mobileTimelineStatus.textContent=(state.stepIndex+1)+' / '+state.steps.length;
    els.prevBtn.disabled=els.mobilePrevBtn.disabled=state.stepIndex===0;els.nextBtn.disabled=els.mobileNextBtn.disabled=state.stepIndex===state.steps.length-1;
    if(follow) {const mobile=matchMedia('(max-width:760px)').matches;Core.centerInsideViewport(mobile?els.mobileCodeViewport:els.codeViewport,(mobile?state.mobileCodeLines:state.codeLines).get(step.line),{horizontal:false});Core.centerInsideViewport(mobile?els.mobileBoardViewport:els.boardViewport,(mobile?state.mobileCells:state.cells)[step.r]?.[step.c]);}
  }

  function stopPlayback() {
    if (state.timer) clearTimeout(state.timer);
    state.timer = null;
    Core.updatePlaybackControls(els.playBtn, false);
  }

  function goTo(index, options = {}) {
    state.stepIndex = Core.clamp(index, 0, state.steps.length - 1);
    render(options);
  }

  function move(delta) {
    stopPlayback();
    goTo(state.stepIndex + delta, { follow: true });
  }

  function togglePlayback() {
    if (state.timer) {
      stopPlayback();
      return;
    }

    startPlayback();
  }

  function startPlayback() {
    stopPlayback();
    if (state.stepIndex >= state.steps.length - 1) goTo(0);
    Core.updatePlaybackControls(els.playBtn, true);
    scheduleNext();
  }

  function scheduleNext() {
    state.timer = setTimeout(() => {
      if (state.stepIndex >= state.steps.length - 1) {
        stopPlayback();
        return;
      }
      goTo(state.stepIndex + 1, { follow: true });
      if (state.stepIndex >= state.steps.length - 1) stopPlayback();
      else scheduleNext();
    }, PROBLEM.autoplayMs / state.speed);
  }

  function reset() {
    stopPlayback();
    goTo(0, { follow: true });
  }
  function skipToEnd() {
    stopPlayback();
    goTo(state.steps.length - 1, { follow: true });
  }

  function renderSampleButtons() {
    els.sampleButtons.replaceChildren();

    for (const sample of samples) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn";
      button.textContent = sample.label;
      button.dataset.sample = sample.id;
      button.classList.toggle("selected", state.selectedSample === sample.id);
      els.sampleButtons.appendChild(button);
    }
  }

  function applyText(text, sampleId = null) {
    stopPlayback();

    try {
      const parsed = parseInput(text);
      const steps = buildSteps(parsed.cases);
      Object.assign(state, parsed, { steps, selectedSample: sampleId, stepIndex: 0 });
      els.inputError.textContent = "";

      state.renderedCase = null;


      const timelineMax = Math.max(0, state.steps.length - 1);
      els.timeline.max = timelineMax;
      els.mobileTimeline.max = timelineMax;

      renderSampleButtons();
      render({ follow: true });
    } catch (error) {
      els.inputError.textContent = error.message;
    }
  }

  els.prevBtn.addEventListener("click", () => move(-1));
  els.nextBtn.addEventListener("click", () => move(1));
  document.getElementById("mobilePlayBtn").addEventListener("click", () => els.playBtn.click());
  els.mobilePrevBtn.addEventListener("click", () => move(-1));
  els.mobileNextBtn.addEventListener("click", () => move(1));
  els.resetBtn.addEventListener("click", reset);
  els.replayBtn.addEventListener("click", () => {
    reset();
    startPlayback();
  });
  els.speedRange.addEventListener("input", () => {
    state.speed = Number(els.speedRange.value);
    els.speedLabel.textContent = `${Core.formatDecimal(state.speed)}×`;
    if (state.timer) {
      clearTimeout(state.timer);
      scheduleNext();
    }
  });
  els.skipBtn.addEventListener("click", skipToEnd);
  els.playBtn.addEventListener("click", togglePlayback);

  for (const timeline of [els.timeline, els.mobileTimeline]) {
    timeline.addEventListener("input", (event) => {
      stopPlayback();
      goTo(Number(event.target.value), { follow: true });
    });
  }

  els.applyBtn.addEventListener("click", () => applyText(els.inputArea.value));
  els.inputArea.addEventListener("input", () => {
    state.selectedSample = null;
    renderSampleButtons();
  });
  els.sampleButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sample]");
    if (!button) return;

    const sample = samples.find((item) => item.id === button.dataset.sample);
    if (!sample) return;

    els.inputArea.value = sample.value;
    applyText(sample.value, sample.id);
  });

  renderCode();
  els.inputArea.value = defaultSample.value;
  applyText(defaultSample.value, defaultSample.id);
})();

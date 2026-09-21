(() => {
 const Core=window.AlgoriZoomCore;
 const PROBLEM = Object.freeze({"platform":"SWEA","number":"12712","title":"파리퇴치3","autoplayMs":350,"defaultSampleId":"one","sourceSteps":[{"text":"max_fly = 0","types":"init"},{"text":"dr = [0, -1, 0, 1]","types":"dr","occurrence":1},{"text":"dc = [-1, 0, 1, 0]","types":"dc","occurrence":1},{"text":"for r in range(N):","types":"row","occurrence":1},{"text":"for c in range(N):","types":"col","occurrence":1},{"text":"fly_sum = window[r][c]","types":"center","occurrence":1},{"text":"for i in range(4):","types":"direction","occurrence":1},{"text":"for j in range(1,M):","types":"distance","occurrence":1},{"text":"nr = r + dr[i]*j","types":"next-row","occurrence":1},{"text":"nc = c + dc[i]*j","types":"next-col","occurrence":1},{"text":"if (0 <= nr < N) and (0 <= nc < N):","types":"bounds","occurrence":1},{"text":"fly_sum += window[nr][nc]","types":"add","occurrence":1},{"text":"if max_fly < fly_sum:","types":"best-check","occurrence":1},{"text":"max_fly = fly_sum","types":"best","occurrence":1},{"text":"dr = [-1, -1, 1, 1]","types":"x-dr","occurrence":1},{"text":"dc = [-1, 1, 1, -1]","types":"x-dc","occurrence":1},{"text":"for r in range(N):","types":"x-row","occurrence":2},{"text":"for c in range(N):","types":"x-col","occurrence":2},{"text":"fly_sum = window[r][c]","types":"x-center","occurrence":2},{"text":"for i in range(4):","types":"x-direction","occurrence":2},{"text":"for j in range(1,M):","types":"x-distance","occurrence":2},{"text":"nr = r + dr[i]*j","types":"x-next-row","occurrence":2},{"text":"nc = c + dc[i]*j","types":"x-next-col","occurrence":2},{"text":"if (0 <= nr < N) and (0 <= nc < N):","types":"x-bounds","occurrence":2},{"text":"fly_sum += window[nr][nc]","types":"x-add","occurrence":2},{"text":"if max_fly < fly_sum:","types":"x-best-check","occurrence":2},{"text":"max_fly = fly_sum","types":"x-best","occurrence":2},{"text":"print('#{} {}'.format(tc, max_fly))","types":"output"}],"samples":[{"id":"one","label":"샘플 1","value":"1\n5 2\n1 3 3 6 7\n8 13 9 12 8\n4 16 11 12 6\n2 4 1 23 2\n9 13 4 7 3"},{"id":"two","label":"샘플 2","value":"1\n6 3\n29 21 26 9 5 8\n21 19 8 0 21 19\n9 24 2 11 4 24\n19 29 1 0 21 19\n10 29 6 18 4 3\n29 11 15 3 3 29"},{"id":"all","label":"전체 샘플","value":"2\r\n5 2\r\n1 3 3 6 7\r\n8 13 9 12 8\r\n4 16 11 12 6\r\n2 4 1 23 2\r\n9 13 4 7 3\r\n6 3\r\n29 21 26 9 5 8\r\n21 19 8 0 21 19\r\n9 24 2 11 4 24\r\n19 29 1 0 21 19\r\n10 29 6 18 4 3\r\n29 11 15 3 3 29"}]});
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
    if(!text.trim()||tokens.some(t=>!/^\d+$/.test(t))) throw new Error('T, N, M과 파리 수를 정수로 입력해주세요.');
    const values=tokens.map(Number); let pos=0; const T=values[pos++];
    if(!Number.isSafeInteger(T)||T<1||T>10) throw new Error('시각화는 예제 1~10개를 지원합니다.');
    const cases=[];
    for(let tc=1;tc<=T;tc++) {
      const N=values[pos++], M=values[pos++];
      if(!Number.isInteger(N)||!Number.isInteger(M)||N<5||N>15||M<2||M>N) throw new Error('#'+tc+': N은 5~15, M은 2~N입니다.');
      const flat=values.slice(pos,pos+N*N);
      if(flat.length!==N*N) throw new Error('#'+tc+': 파리 수 '+N*N+'개가 필요합니다.');
      if(flat.some(h=>!Number.isSafeInteger(h)||h<0||h>30)) throw new Error('#'+tc+': 시각화의 파리 수는 0~30입니다.');
      cases.push({M,board:Array.from({length:N},(_,r)=>flat.slice(r*N,(r+1)*N))});pos+=N*N;
    }
    if(pos!==values.length) throw new Error('T와 배열 크기를 확인해주세요. 남는 입력이 있습니다.');
    return {cases};
  }
  const SPRAYS = [
    {name: '+', dr: [0,-1,0,1], dc: [-1,0,1,0], directions: ['왼쪽','위','오른쪽','아래']},
    {name: '×', dr: [-1,-1,1,1], dc: [-1,1,1,-1], directions: ['왼쪽 위','오른쪽 위','오른쪽 아래','왼쪽 아래']},
  ];
  function buildSteps(cases) {
    const steps = [];
    let output = '';
    cases.forEach(({board,M},index) => {
      const N = board.length;
      let r=null,c=null,nr=null,nc=null,i=null,j=null,fly_sum=0,max_fly=0,bestCenter=null,bestMode=null,mode=0;
      const push = (phase,message) => {
        if (steps.length >= 250000) throw new Error('실행 단계가 250,000개를 넘습니다. 배열 크기나 예제 수를 줄여주세요.');
        const type = mode === 1 && phase !== 'output' ? 'x-'+phase : phase;
        steps.push({line:stepLineMap.get(type),phase,message,N,M,tc:index+1,board,r,c,nr,nc,i,j,fly_sum,max_fly,bestCenter,bestMode,mode,output});
      };
      push('init','최대 파리 수 max_fly를 0으로 초기화합니다.');
      for (mode=0;mode<2;mode++) {
        const {name,dr,dc,directions} = SPRAYS[mode];
        r=c=nr=nc=i=j=null; fly_sum=0;
        push('dr',name+' 분사의 행 변화 dr = ['+dr.join(', ')+']. '+(mode?'앞서 구한 최댓값을 유지합니다.':''));
        push('dc',name+' 분사의 열 변화 dc = ['+dc.join(', ')+'].');
        for (let row=0;row<N;row++) {
          r=row;c=nr=nc=i=j=null;push('row','행 r = '+r+'를 선택합니다.');
          for (let col=0;col<N;col++) {
            c=col;nr=nc=i=j=null;push('col',name+' 분사의 중심 ('+r+', '+c+')을 선택합니다.');
            fly_sum=board[r][c];
            push('center','중심의 파리 '+fly_sum+'마리로 시작합니다. 각 방향으로 '+(M-1)+'칸을 검사합니다.');
            for (let dir=0;dir<4;dir++) {
              i=dir;j=nr=nc=null;push('direction','i = '+i+': '+directions[i]+' 방향을 검사합니다.');
              for (let distance=1;distance<M;distance++) {
                j=distance;nr=nc=null;push('distance',directions[i]+'으로 '+j+'칸 떨어진 위치를 계산합니다.');
                nr=r+dr[i]*j;push('next-row','nr = '+r+' + ('+dr[i]+') × '+j+' = '+nr);
                nc=c+dc[i]*j;push('next-col','nc = '+c+' + ('+dc[i]+') × '+j+' = '+nc);
                const inside=nr>=0&&nr<N&&nc>=0&&nc<N;
                push('bounds','('+nr+', '+nc+')는 배열 '+(inside?'안입니다. 파리 '+board[nr][nc]+'마리를 더합니다.':'밖입니다. 합산하지 않습니다.'));
                if (inside) {const before=fly_sum;fly_sum+=board[nr][nc];push('add',before+' + '+board[nr][nc]+' = '+fly_sum);}
              }
            }
            push('best-check','max_fly '+max_fly+' < fly_sum '+fly_sum+': '+(max_fly<fly_sum?'참':'거짓'));
            if (max_fly<fly_sum) {max_fly=fly_sum;bestCenter=[r,c];bestMode=mode;push('best',name+' 중심 ('+r+', '+c+')에서 최댓값 '+max_fly+'마리로 갱신합니다.');}
          }
        }
      }
      mode=1;output+='#'+(index+1)+' '+max_fly+'\n';
      push('output','+와 × 분사를 모두 검사했습니다. 최대 파리 수는 '+max_fly+'마리입니다.');
    });
    return steps;
  }
  function renderBoardInto(container) {
    container.style.gridTemplateColumns='repeat('+state.board[0].length+', 42px)';container.replaceChildren();
    return state.board.map((row,r)=>row.map((value,c)=>{
      const cell=document.createElement('div');cell.className='fly-cell';cell.textContent=value;
      cell.setAttribute('aria-label',r+'행 '+c+'열 파리 '+value+'개');container.append(cell);return cell;
    }));
  }
  function rayAt(r,c,center,mode,M) {
    if (!center) return null;
    const dy=r-center[0],dx=c-center[1];
    if (!dy&&!dx) return {distance:0,direction:-1};
    const distance=Math.max(Math.abs(dy),Math.abs(dx));
    if (distance>=M) return null;
    const spray=SPRAYS[mode];
    const direction=spray.dr.findIndex((dr,i)=>dy===dr*distance&&dx===spray.dc[i]*distance);
    return direction<0?null:{distance,direction};
  }
  function updateBoard(cache,step) {
    const settled=['best-check','best','output'].includes(step.phase);
    const active=!['init','dr','dc','row','col'].includes(step.phase);
    const scanning=['next-col','bounds','add'].includes(step.phase);
    for(let r=0;r<step.N;r++) for(let c=0;c<step.N;c++) {
      const cell=cache[r][c], ray=rayAt(r,c,[step.r,step.c],step.mode,step.M);
      const added=active&&ray&&(ray.distance===0||settled||(step.i!==null&&(ray.direction<step.i||(ray.direction===step.i&&step.j!==null&&(ray.distance<step.j||(ray.distance===step.j&&step.phase==='add'))))));
      cell.classList.toggle('on-route',Boolean(added));
      cell.classList.toggle('best-route',Boolean(rayAt(r,c,step.bestCenter,step.bestMode,step.M)));
      cell.classList.toggle('current',active&&step.r===r&&step.c===c);
      cell.classList.toggle('inspecting',scanning&&step.nr===r&&step.nc===c);
    }
  }
  function render({follow=true}={}) {
    const step=state.steps[state.stepIndex];if(!step)return;
    if(state.renderedCase!==step.tc) {state.N=step.N;state.board=step.board;state.renderedCase=step.tc;state.cells=renderBoardInto(els.board);state.mobileCells=renderBoardInto(els.mobileBoard);}
    for(const [lines,board] of [[state.codeLines,state.cells],[state.mobileCodeLines,state.mobileCells]]) {lines.forEach((line,n)=>line.classList.toggle('active',n===step.line));updateBoard(board,step);}
    els.boardLabel.textContent='#'+step.tc+' · '+step.N+' × '+step.N+' · M='+step.M;
    els.codeLineLabel.textContent=els.mobileCodeStatus.textContent='LINE '+step.line;
    els.phaseLabel.textContent=els.mobilePhase.textContent=step.phase==='output'?'완료':SPRAYS[step.mode].name+' 탐색';
    const values={crValue:step.r,ccValue:step.c,nrValue:step.nr,ncValue:step.nc,numValue:step.fly_sum,directionValue:step.max_fly,rowValue:step.N,colValue:step.M,nextRowValue:step.j,nextColValue:step.board[step.r]?.[step.c],dirValue:step.i};
    for(const [id,value] of Object.entries(values))els[id].textContent=value??'—';
    els.mobileCr.textContent=step.r??'—';els.mobileCc.textContent=step.c??'—';els.mobileNr.textContent=step.nr??'—';els.mobileNc.textContent=step.nc??'—';els.mobileDirection.textContent=step.max_fly;
    els.mobileCoord.textContent='#'+step.tc+' · 중심 ('+(step.r??'—')+', '+(step.c??'—')+')';els.mobileStateMeta.textContent=SPRAYS[step.mode].name+' · M='+step.M+' · 파리 합 '+step.fly_sum;
    els.explainText.textContent=els.mobileExplanation.textContent=step.message;els.outputView.textContent=els.mobileOutputView.textContent=step.output||'아직 출력이 없습니다.';
    els.bestPath.textContent=els.mobileBestPath.textContent=step.bestCenter?SPRAYS[step.bestMode].name+' 중심 ('+step.bestCenter.join(', ')+') · 거리 '+(step.M-1)+' · 파리 '+step.max_fly+'마리':step.phase==='output'?'모든 칸이 0이므로 어느 중심에서도 0마리입니다.':'아직 최댓값이 갱신되지 않았습니다.';
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

(() => {
 const Core=window.AlgoriZoomCore;
 const PROBLEM={number:"25052",title:"등산로",autoplayMs:350,defaultSampleId:"one",sourceSteps:[{"text":"max_count = 0","types":"init"},{"text":"dr = [0, -1, 0, 1]","types":"dr"},{"text":"dc = [-1, 0, 1, 0]","types":"dc"},{"text":"for r in range(N):","types":"row"},{"text":"for c in range(N): #행과 열 순회하면서 위치 설정","types":"col"},{"text":"cr = r","types":"start-row"},{"text":"cc = c","types":"start-col"},{"text":"count = 1","types":"count-init"},{"text":"while True:","types":"while"},{"text":"next_r, next_c = cr, cc","types":"candidate-init"},{"text":"for i in range(4):","types":"direction"},{"text":"nr = cr + dr[i]","types":"next-row"},{"text":"nc = cc + dc[i]","types":"next-col"},{"text":"if (0 <= nr < N) and (0 <= nc < N):","types":"bounds"},{"text":"if mt[nr][nc] < mt[next_r][next_c]:","types":"compare"},{"text":"next_r, next_c = nr, nc","types":"candidate"},{"text":"if (next_r == cr) and (next_c == cc):","types":"stop-check"},{"text":"break","types":"break"},{"text":"cr, cc = next_r, next_c","types":"move"},{"text":"count += 1","types":"count"},{"text":"if max_count < count:","types":"best-check"},{"text":"max_count = count","types":"best"},{"text":"print('#{} {}'.format(tc, max_count))","types":"output"}],samples:[{"id":"one","label":"첨부 예제 1 · N=3","value":"1\n3\n7 3 4\n5 8 2\n1 9 6"},{"id":"sample2","label":"첨부 예제 2 · N=4","value":"1\n4\n1 2 3 4\n12 13 14 5\n11 16 15 6\n10 9 8 7"},{"id":"sample3","label":"첨부 예제 3 · N=5","value":"1\n5\n25 14 6 24 5\n11 8 16 17 1\n12 3 2 22 15\n19 7 21 9 18\n10 4 13 23 20"},{"id":"all","label":"첨부 예제 전체","value":"3\n3\n7 3 4\n5 8 2\n1 9 6\n4\n1 2 3 4\n12 13 14 5\n11 16 15 6\n10 9 8 7\n5\n25 14 6 24 5\n11 8 16 17 1\n12 3 2 22 15\n19 7 21 9 18\n10 4 13 23 20"}]};
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
    const tokens = text.trim().split(/\s+/);
    if (!text.trim() || tokens.some(t => !/^\d+$/.test(t))) throw new Error("T, N과 높이를 정수로 입력해주세요.");
    const values = tokens.map(Number);
    let pos = 0;
    const T = values[pos++];
    if (!Number.isSafeInteger(T) || T < 1 || T > 10) throw new Error("시각화는 지도 1~10개를 지원합니다.");
    const cases = [];
    for (let tc = 1; tc <= T; tc++) {
      const N = values[pos++];
      if (!Number.isInteger(N) || N < 3 || N > 10) throw new Error(`#${tc}: N은 3~10입니다.`);
      const flat = values.slice(pos, pos + N * N);
      if (flat.length !== N * N) throw new Error(`#${tc}: 높이 ${N * N}개가 필요합니다.`);
      if (flat.some(h => !Number.isInteger(h) || h < 1 || h > N * N)) throw new Error(`#${tc}: 높이는 1~${N * N}입니다.`);
      if (new Set(flat).size !== flat.length) throw new Error(`#${tc}: 각 칸의 높이는 서로 달라야 합니다.`);
      cases.push(Array.from({length:N}, (_,r) => flat.slice(r*N, (r+1)*N)));
      pos += N*N;
    }
    if (pos !== values.length) throw new Error("T와 지도 개수를 확인해주세요. 남는 입력이 있습니다.");
    return { cases };
  }

  function buildSteps(cases) {
    const steps = [];
    const dr = [0, -1, 0, 1], dc = [-1, 0, 1, 0];
    const directions = ["왼쪽", "위", "오른쪽", "아래"];
    let output = "";
    cases.forEach((board, index) => {
      const N = board.length;
      let r=null,c=null,cr=null,cc=null,nr=null,nc=null,next_r=null,next_c=null,i=null,count=0,max_count=0;
      let route=[], bestRoute=[];
      const push = (phase,message) => {
        if (steps.length >= 250000) throw new Error("실행 단계가 많습니다. 지도를 나누어 입력해주세요.");
        steps.push({line:stepLineMap.get(phase),phase,message,N,tc:index+1,board,r,c,cr,cc,nr,nc,next_r,next_c,i,count,max_count,route,bestRoute,output});
      };
      push("init","모든 칸을 출발점으로 검사합니다. 경로 길이는 출발 칸을 포함합니다.");
      push("dr","dr = [0, -1, 0, 1]: 왼쪽·위·오른쪽·아래의 행 변화입니다.");
      push("dc","dc = [-1, 0, 1, 0]: 같은 순서의 열 변화입니다.");
      for(r=0;r<N;r++){
        push("row",`출발 행 r = ${r}를 선택합니다.`);
        for(c=0;c<N;c++){
          route=[];
          push("col",`출발점 (${r}, ${c})에서 새 경로를 탐색합니다.`);
          cr=r; push("start-row",`cr = r = ${r}`);
          cc=c; route=[[cr,cc]]; push("start-col",`cc = c = ${c}`);
          count=1; push("count-init","출발 칸을 포함하여 count = 1로 시작합니다.");
          while(true){
            push("while","현재 위치에서 더 낮은 이웃을 찾습니다.");
            next_r=cr;next_c=cc;
            push("candidate-init",`이동 후보를 현재 칸 (${cr}, ${cc})으로 초기화합니다.`);
            for(i=0;i<4;i++){
              push("direction",`i = ${i}: ${directions[i]} 방향을 검사합니다.`);
              nr=cr+dr[i]; push("next-row",`nr = ${cr} + (${dr[i]}) = ${nr}`);
              nc=cc+dc[i]; push("next-col",`nc = ${cc} + (${dc[i]}) = ${nc}`);
              const inside=nr>=0&&nr<N&&nc>=0&&nc<N;
              push("bounds",inside?`(${nr}, ${nc})는 지도 안입니다.`:`(${nr}, ${nc})는 지도 밖입니다. 높이를 읽지 않습니다.`);
              if(inside){
                const lower=board[nr][nc]<board[next_r][next_c];
                push("compare",`높이 ${board[nr][nc]} < 후보 높이 ${board[next_r][next_c]}: ${lower?"참":"거짓"}`);
                if(lower){next_r=nr;next_c=nc;push("candidate",`더 낮은 (${next_r}, ${next_c})을 이동 후보로 갱신합니다.`);}
              }
            }
            i=3;
            const stopped=next_r===cr&&next_c===cc;
            push("stop-check",stopped?"더 낮은 이웃이 없어 현재 위치와 후보가 같습니다.":"가장 낮은 이웃을 찾았습니다. 그 칸으로 이동합니다.");
            if(stopped){push("break",`더 이동할 수 없어 길이 ${count}로 경로를 마칩니다.`);break;}
            cr=next_r;cc=next_c;route=[...route,[cr,cc]];
            push("move",`현재 좌표를 (${cr}, ${cc})로 옮깁니다.`);
            count++;push("count",`방문 칸 수 count = ${count}`);
          }
          push("best-check",`최장 길이 ${max_count} < 현재 길이 ${count}: ${max_count<count?"참":"거짓"}`);
          if(max_count<count){max_count=count;bestRoute=route;push("best",`최장 길이를 ${max_count}로 갱신합니다.`);}
        }
        c=N-1;
      }
      r=N-1;
      output+=`#${index+1} ${max_count}\n`;
      push("output",`모든 출발점을 검사했습니다. 최장 등산로는 ${max_count}칸입니다.`);
    });
    return steps;
  }

  function renderBoardInto(container) {
    container.style.gridTemplateColumns = `repeat(${state.N}, 42px)`;
    container.replaceChildren();
    return Array.from({length:state.N},(_,r)=>Array.from({length:state.N},(_,c)=>{
      const cell=document.createElement("div");
      cell.className="hike-cell";
      cell.textContent=state.board[r][c];
      cell.setAttribute("aria-label",`${r}행 ${c}열 높이 ${state.board[r][c]}`);
      container.append(cell);
      return cell;
    }));
  }
  function updateBoard(cache,step) {
    const inspecting=["next-col","bounds","compare","candidate"].includes(step.phase);
    for(let r=0;r<step.N;r++) for(let c=0;c<step.N;c++){
      const cell=cache[r][c];
      cell.classList.toggle("on-route",step.route.some(p=>p[0]===r&&p[1]===c));
      cell.classList.toggle("best-route",step.bestRoute.some(p=>p[0]===r&&p[1]===c));
      cell.classList.toggle("current",step.cr===r&&step.cc===c);
      cell.classList.toggle("candidate",step.next_r===r&&step.next_c===c);
      cell.classList.toggle("inspecting",inspecting&&step.nr===r&&step.nc===c);
    }
  }
  function render({follow=true}={}) {
    const step=state.steps[state.stepIndex]; if(!step)return;
    if(state.renderedCase!==step.tc){
      state.N=step.N; state.board=step.board; state.renderedCase=step.tc;
      state.cells=renderBoardInto(els.board);state.mobileCells=renderBoardInto(els.mobileBoard);
    }
    for(const [lines,board] of [[state.codeLines,state.cells],[state.mobileCodeLines,state.mobileCells]]){
      lines.forEach((line,n)=>line.classList.toggle("active",n===step.line));
      updateBoard(board,step);
    }
    els.boardLabel.textContent=`#${step.tc} · ${step.N} × ${step.N}`;
    els.codeLineLabel.textContent=els.mobileCodeStatus.textContent=`LINE ${step.line}`;
    els.phaseLabel.textContent=els.mobilePhase.textContent=step.phase==="output"?"완료":"탐색 중";
    const values={crValue:step.cr,ccValue:step.cc,nrValue:step.nr,ncValue:step.nc,numValue:step.count,directionValue:step.max_count,
      rowValue:step.r,colValue:step.c,nextRowValue:step.next_r,nextColValue:step.next_c,dirValue:step.i};
    for(const [id,value] of Object.entries(values))els[id].textContent=value??"—";
    els.mobileCr.textContent=step.cr??"—";els.mobileCc.textContent=step.cc??"—";
    els.mobileNr.textContent=step.nr??"—";els.mobileNc.textContent=step.nc??"—";
    els.mobileDirection.textContent=step.max_count;
    els.mobileCoord.textContent=`#${step.tc} · 출발 (${step.r??"—"}, ${step.c??"—"})`;
    els.mobileStateMeta.textContent=`현재 길이 ${step.count}칸`;
    els.explainText.textContent=els.mobileExplanation.textContent=step.message;
    els.outputView.textContent=els.mobileOutputView.textContent=step.output||"아직 출력이 없습니다.";
    const routeText=step.bestRoute.length?step.bestRoute.map(([r,c])=>`(${r},${c})`).join(" → "):"아직 완성된 경로가 없습니다.";
    els.bestPath.textContent=els.mobileBestPath.textContent=routeText;
    els.timeline.value=els.mobileTimeline.value=state.stepIndex;
    els.stepLabel.textContent=els.mobileTimelineStatus.textContent=`${state.stepIndex+1} / ${state.steps.length}`;
    els.prevBtn.disabled=els.mobilePrevBtn.disabled=state.stepIndex===0;
    els.nextBtn.disabled=els.mobileNextBtn.disabled=state.stepIndex===state.steps.length-1;
    if(follow){
      const mobile=matchMedia("(max-width:760px)").matches;
      Core.centerInsideViewport(mobile?els.mobileCodeViewport:els.codeViewport,(mobile?state.mobileCodeLines:state.codeLines).get(step.line),{horizontal:false});
      Core.centerInsideViewport(mobile?els.mobileBoardViewport:els.boardViewport,(mobile?state.mobileCells:state.cells)[step.cr]?.[step.cc]);
    }
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

(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    platform: "SWEA", number: "1226", level: "D4", title: "미로1", autoplayMs: 460, defaultSampleId: "one",
    sourceSteps: [
      { text: "maze = [list(map(int, input())) for _ in range(16)]", types: "maze", occurrence: 1 },
      { text: "if maze[i][j] == 2:", types: "findStart", occurrence: 1 },
      { text: "start = [i, j]", types: "findStart", occurrence: 1 },
      { text: "queue.append([start[0], start[1]])", types: "enqueueStart", occurrence: 1 },
      { text: "direction = [(-1, 0), (1, 0), (0, -1), (0, 1)]", types: "directionReady", occurrence: 1 },
      { text: "ans = 0", types: "answerInit", occurrence: 1 },
      { text: "while queue and ans == 0:", types: "while", occurrence: 1 },
      { text: "current = queue.pop(0)", types: "pop", occurrence: 1 },
      { text: "r, c = current", types: "current", occurrence: 1 },
      { text: "for dr, dc in direction:", types: "direction", occurrence: 1 },
      { text: "nr = r + dr", types: "next", occurrence: 1 },
      { text: "if (0 <= nr < 16) and (0 <= nc < 16):", types: "bounds", occurrence: 1 },
      { text: "if maze[nr][nc] == 0:", types: "path", occurrence: 1 },
      { text: "queue.append([nr, nc])", types: "enqueue", occurrence: 1 },
      { text: "maze[nr][nc] = 1", types: "visit", occurrence: 1 },
      { text: "elif maze[nr][nc] == 3:", types: "goal", occurrence: 1 },
      { text: "ans = 1", types: "answer", occurrence: 1 },
      { text: "break", types: "break", occurrence: 1 },
      { text: "print('#{} {}'.format(tc, ans))", types: "output", occurrence: 1 },
    ],
    samples: [
      { id: "one", label: "테스트케이스 1 · BFS 흐름", value: "1\n1111111111111111\n1210000000100011\n1010101110101111\n1000100010100011\n1111111010101011\n1000000010101011\n1011111110111011\n1010000010001011\n1010101111101011\n1010100010001011\n1010111010111011\n1010001000100011\n1011101111101011\n1000100000001311\n1111111111111111\n1111111111111111" },
      { id: "all", label: "첨부 예제 10개 전체", value: "1\n1111111111111111\n1210000000100011\n1010101110101111\n1000100010100011\n1111111010101011\n1000000010101011\n1011111110111011\n1010000010001011\n1010101111101011\n1010100010001011\n1010111010111011\n1010001000100011\n1011101111101011\n1000100000001311\n1111111111111111\n1111111111111111\n2\n1111111111111111\n1200000010000011\n1011111011111011\n1000001010000011\n1110101010111011\n1010101010100011\n1011111010111111\n1000001010000011\n1011101011111011\n1010101010000011\n1010101010111111\n1010100000130011\n1010111111111011\n1000000000000011\n1111111111111111\n1111111111111111\n3\n1111111111111111\n1210001000100011\n1010101010101011\n1000100010101011\n1011111110101011\n1000001010101011\n1111101010101011\n1010001000001011\n1010111111111011\n1010000000100011\n1011111110101111\n1000001010100011\n1011101010111011\n1000100000130011\n1111111111111111\n1111111111111111\n4\n1111111111111111\n1200100000000011\n1011101110111011\n1000001010101011\n1111111011101011\n1000100010000011\n1010101010111111\n1010001010001011\n1011111011101011\n1000100010100011\n1110101110111111\n1010100000130011\n1010111111111011\n1000000000000011\n1111111111111111\n1111111111111111\n5\n1111111111111111\n1210000000100011\n1010111011101011\n1010100010001011\n1011101010111011\n1000001010001011\n1111111011111011\n1000100010000011\n1011101010111011\n1010001000001011\n1010101011111111\n1010101000000011\n1010101110111011\n1000100010001311\n1111111111111111\n1111111111111111\n6\n1111111111111111\n1210001010000011\n1010101010111111\n1010100000100011\n1010111111101011\n1000100000001011\n1110101111111011\n1000100000001011\n1011101111101011\n1000101000101011\n1110101010111011\n1010100010100011\n1010111110101111\n1000000000100311\n1111111111111111\n1111111111111111\n7\n1111111111111111\n1210000000000011\n1011101111111011\n1000101010000011\n1110101010111011\n1000001000101011\n1010111111101111\n1010100000100011\n1011101110101111\n1000001000100011\n1111111011111011\n1000100010001011\n1010101110111011\n1010001300000011\n1111111111111111\n1111111111111111\n8\n1111111111111111\n1200000010000011\n1111111010111011\n1000000010001011\n1011111111111011\n1010000000000011\n1010111111101011\n1010000000001011\n1010111011111011\n1000100010001011\n1111111011101011\n1000001000100011\n1110111110101011\n1000000000101311\n1111111111111111\n1111111111111111\n9\n1111111111111111\n1200000000001011\n1011111111101011\n1000000010001011\n1111111010111011\n1000100010000011\n1011101111111011\n1010001000001011\n1010111011101011\n1010000010101311\n1011111110101111\n1000100000100011\n1011101011111011\n1000001000000011\n1111111111111111\n1111111111111111\n10\n1111111111111111\n1200001000100011\n1111101110101011\n1000100010001011\n1011101111101111\n1000100000000011\n1110111111101011\n1000000010001011\n1110111011101011\n1010001000001011\n1010101111111011\n1000101010000011\n1010101010101111\n1010100000100311\n1111111111111111\n1111111111111111" },
    ],
  });

  const samples = PROBLEM.samples;
  const defaultSample = samples[0];
  const els = Core.getByIds([
    "sourceCode","resetBtn","prevBtn","nextBtn","playBtn","replayBtn","skipBtn","speedRange","speedLabel","stepLabel","timeline",
    "codeLineLabel","codeViewport","codeView","boardLabel","boardViewport","board","phaseLabel","currentValue","nextValue","queueLengthValue",
    "checkValue","visitedValue","answerValue","explainText","queueView","queueLabel","outputView","inputArea","applyBtn","sampleButtons","inputError",
    "mobileCoord","mobileCodeStatus","mobileCodeViewport","mobileCodeView","mobilePhase","mobileBoardViewport","mobileBoard","mobileQueueView","mobileExplanation",
    "mobileStateMeta","mobileCurrent","mobileNext","mobileQueueLength","mobileVisited","mobileAnswer","mobileOutputView","mobilePrevBtn","mobileTimeline","mobileTimelineStatus","mobileNextBtn"
  ]);
  const state = { cases: [], steps: [], stepIndex: 0, timer: null, speed: 1, selectedSample: defaultSample.id, codeLines: null, mobileCodeLines: null };
  let stepLineMap;

  function renderCode() {
    const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps, { wrap: false, editor: true });
    els.codeView.innerHTML = markup;
    els.mobileCodeView.innerHTML = markup;
    state.codeLines = Core.createLineMap(els.codeView);
    state.mobileCodeLines = Core.createLineMap(els.mobileCodeView);
    stepLineMap = Core.createStepLineMap(els.codeView);
  }

  function parseInput(text) {
    const lines = text.trim().split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) throw new Error("테스트케이스 번호와 16줄의 미로를 입력해주세요.");
    if (lines.length % 17 !== 0) throw new Error("각 테스트케이스는 번호 1줄 + 미로 16줄, 총 17줄이어야 합니다.");
    const cases = [];
    for (let cursor = 0; cursor < lines.length; cursor += 17) {
      if (!/^\d+$/.test(lines[cursor])) throw new Error("각 테스트케이스의 첫 줄에는 케이스 번호가 있어야 합니다.");
      const tc = Number(lines[cursor]);
      const maze = [];
      let starts = 0;
      let goals = 0;
      for (let r = 0; r < 16; r++) {
        const rowText = lines[cursor + 1 + r];
        if (!/^[0-3]{16}$/.test(rowText)) throw new Error(`테스트케이스 ${tc}: 미로는 0~3으로 된 16자리 문자열 16줄이어야 합니다.`);
        const row = [...rowText].map(Number);
        starts += row.filter((value) => value === 2).length;
        goals += row.filter((value) => value === 3).length;
        maze.push(row);
      }
      if (starts !== 1 || goals !== 1) throw new Error(`테스트케이스 ${tc}: 출발점 2와 도착점 3이 각각 하나씩 있어야 합니다.`);
      cases.push({ tc, maze });
    }
    return { cases };
  }

  function buildSteps() {
    const steps = [];
    let output = "";
    state.cases.forEach((data) => {
      const original = data.maze.map((row) => [...row]);
      const maze = data.maze.map((row) => [...row]);
      let start = null;
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
          if (maze[i][j] === 2) start = [i, j];
        }
      }

      const queue = [];
      const visited = new Set();
      let current = null;
      let next = null;
      let ans = 0;
      let check = "준비";
      let foundGoal = null;
      const key = (r, c) => `${r},${c}`;
      const push = (phase, message, extra = {}) => steps.push({
        tc: data.tc, original: original.map((row) => [...row]), maze: maze.map((row) => [...row]), queue: queue.map((item) => [...item]),
        visited: new Set(visited), current: current && [...current], next: next && [...next], ans, check,
        foundGoal: foundGoal && [...foundGoal], phase, line: stepLineMap.get(phase), message, output, ...extra,
      });

      push("maze", "16×16 미로를 읽습니다. 0은 길, 1은 벽, 2는 출발점, 3은 도착점입니다.");
      check = `start = (${start[0]}, ${start[1]})`;
      push("findStart", `출발점 2의 위치 (${start[0]}, ${start[1]})를 찾았습니다.`, { focus: start });
      queue.push([...start]);
      check = "출발점 enqueue";
      push("enqueueStart", "출발점을 큐에 넣습니다. 이제 먼저 들어온 좌표부터 탐색합니다.");
      const direction = [[-1,0],[1,0],[0,-1],[0,1]];
      check = "상·하·좌·우 4방향";
      push("directionReady", "상, 하, 좌, 우 네 방향을 델타로 준비합니다.");
      ans = 0;
      check = "ans = 0";
      push("answerInit", "아직 도착점에 도달하지 않았으므로 ans는 0입니다.");

      while (queue.length && ans === 0) {
        check = `queue ${queue.length}개 · ans 0`;
        push("while", "큐가 비어 있지 않고 ans가 0이므로 BFS를 계속합니다.");
        current = queue.shift();
        next = null;
        check = "pop(0)";
        push("pop", `큐의 맨 앞 좌표 (${current[0]}, ${current[1]})를 꺼냅니다.`);
        check = `r=${current[0]}, c=${current[1]}`;
        push("current", `현재 위치를 r=${current[0]}, c=${current[1]}로 나눠 저장합니다.`);

        for (const [dr, dc] of direction) {
          check = `델타 (${dr}, ${dc})`;
          push("direction", `현재 위치에서 델타 (${dr}, ${dc}) 방향을 확인합니다.`);
          const nr = current[0] + dr;
          const nc = current[1] + dc;
          next = [nr, nc];
          push("next", `다음 후보 좌표는 (${nr}, ${nc})입니다.`);
          const inside = 0 <= nr && nr < 16 && 0 <= nc && nc < 16;
          check = inside ? "범위 안" : "범위 밖";
          push("bounds", inside ? `(${nr}, ${nc})는 미로 범위 안입니다.` : `(${nr}, ${nc})는 미로 밖이므로 건너뜁니다.`);
          if (!inside) continue;

          if (maze[nr][nc] === 0) {
            check = "이동 가능한 길 0";
            push("path", `(${nr}, ${nc})는 아직 방문하지 않은 길 0입니다.`);
            queue.push([nr, nc]);
            check = "enqueue";
            push("enqueue", `(${nr}, ${nc})를 큐의 뒤에 넣습니다.`);
            maze[nr][nc] = 1;
            visited.add(key(nr, nc));
            check = "방문 처리 0 → 1";
            push("visit", "큐에 넣은 길을 1로 바꿔 같은 칸이 다시 큐에 들어가는 것을 막습니다.");
          } else if (maze[nr][nc] === 3) {
            foundGoal = [nr, nc];
            check = "도착점 3 발견";
            push("goal", `(${nr}, ${nc})에서 도착점 3을 발견했습니다.`, { foundGoal: [nr, nc] });
            ans = 1;
            check = "ans = 1";
            push("answer", "도착 가능한 길을 찾았으므로 ans를 1로 바꿉니다.", { foundGoal: [nr, nc] });
            check = "현재 방향 탐색 종료";
            push("break", "목적지를 찾았으므로 현재 for문을 즉시 빠져나옵니다.", { foundGoal: [nr, nc] });
            break;
          } else {
            check = "벽 또는 방문한 칸";
            push("path", `(${nr}, ${nc})는 벽이거나 이미 방문한 칸이라 큐에 넣지 않습니다.`);
          }
        }
      }

      current = null;
      next = null;
      check = ans === 1 ? "도달 가능" : "도달 불가";
      output += `#${data.tc} ${ans}\n`;
      push("output", ans === 1 ? "도착점에 갈 수 있으므로 1을 출력합니다." : "큐가 모두 비었지만 도착점을 찾지 못해 0을 출력합니다.");
    });
    state.steps = steps;
  }

  function renderMaze(container, step) {
    container.replaceChildren();
    container.style.gridTemplateColumns = "repeat(16, 1fr)";
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        const value = step.original[r][c];
        const cell = document.createElement("div");
        cell.className = "maze-cell";
        if (value === 1) cell.classList.add("wall");
        if (value === 2) cell.classList.add("start");
        if (value === 3) cell.classList.add("goal");
        if (step.visited.has(`${r},${c}`) && value === 0) cell.classList.add("visited");
        if (step.queue.some((item) => item[0] === r && item[1] === c)) cell.classList.add("queued");
        if (step.current && step.current[0] === r && step.current[1] === c) cell.classList.add("current");
        if (step.next && step.next[0] === r && step.next[1] === c) cell.classList.add("next");
        if (step.foundGoal && step.foundGoal[0] === r && step.foundGoal[1] === c) cell.classList.add("found");
        cell.textContent = value === 2 ? "2" : value === 3 ? "3" : "";
        container.appendChild(cell);
      }
    }
  }

  function renderQueue(container, step) {
    container.replaceChildren();
    if (!step.queue.length) {
      const empty = document.createElement("p");
      empty.className = "queue-empty";
      empty.textContent = "큐가 비어 있습니다.";
      container.appendChild(empty);
      return;
    }
    step.queue.forEach((item, index) => {
      const node = document.createElement("div");
      node.className = `queue-item${index === 0 ? " front" : ""}`;
      node.textContent = `(${item[0]}, ${item[1]})`;
      container.appendChild(node);
    });
  }

  function highlight(lines, number) { lines.forEach((line, key) => line.classList.toggle("active", key === number)); }

  function render({ follow = true } = {}) {
    const step = state.steps[state.stepIndex];
    if (!step) return;
    highlight(state.codeLines, step.line);
    highlight(state.mobileCodeLines, step.line);
    renderMaze(els.board, step);
    renderMaze(els.mobileBoard, step);
    renderQueue(els.queueView, step);
    renderQueue(els.mobileQueueView, step);

    const current = step.current ? `(${step.current[0]}, ${step.current[1]})` : "—";
    const next = step.next ? `(${step.next[0]}, ${step.next[1]})` : "—";
    els.codeLineLabel.textContent = `LINE ${step.line}`;
    els.boardLabel.textContent = `#${step.tc} · 16 × 16`;
    els.phaseLabel.textContent = step.phase.toUpperCase();
    els.currentValue.textContent = current;
    els.nextValue.textContent = next;
    els.queueLengthValue.textContent = step.queue.length;
    els.checkValue.textContent = step.check;
    els.visitedValue.textContent = step.visited.size;
    els.answerValue.textContent = step.ans;
    els.explainText.textContent = step.message;
    els.queueLabel.textContent = step.queue.length ? `FRONT → ${step.queue.length}개 대기` : "QUEUE EMPTY";
    els.outputView.textContent = step.output || "아직 출력이 없습니다.";

    els.mobileCoord.textContent = `#${step.tc} · 16×16`;
    els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.mobilePhase.textContent = step.phase.toUpperCase();
    els.mobileExplanation.textContent = step.message;
    els.mobileStateMeta.textContent = step.check;
    els.mobileCurrent.textContent = current;
    els.mobileNext.textContent = next;
    els.mobileQueueLength.textContent = step.queue.length;
    els.mobileVisited.textContent = step.visited.size;
    els.mobileAnswer.textContent = step.ans;
    els.mobileOutputView.textContent = step.output || "아직 출력이 없습니다.";

    els.timeline.value = state.stepIndex;
    els.mobileTimeline.value = state.stepIndex;
    els.stepLabel.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = state.stepIndex === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = state.stepIndex === state.steps.length - 1;
    if (follow) {
      Core.centerInsideViewport(els.codeViewport, state.codeLines.get(step.line), { horizontal: false });
      Core.centerInsideViewport(els.mobileCodeViewport, state.mobileCodeLines.get(step.line), { horizontal: false });
    }
  }

  function stopPlayback(){if(state.timer)clearTimeout(state.timer);state.timer=null;Core.updatePlaybackControls(els.playBtn,false);}
  function goTo(index,options={}){state.stepIndex=Core.clamp(index,0,state.steps.length-1);render(options);}
  function move(delta){stopPlayback();goTo(state.stepIndex+delta,{follow:true});}
  function scheduleNext(){state.timer=setTimeout(()=>{if(state.stepIndex>=state.steps.length-1){stopPlayback();return;}goTo(state.stepIndex+1,{follow:true});state.stepIndex>=state.steps.length-1?stopPlayback():scheduleNext();},PROBLEM.autoplayMs/state.speed);}
  function startPlayback(){stopPlayback();if(state.stepIndex>=state.steps.length-1)goTo(0);Core.updatePlaybackControls(els.playBtn,true);scheduleNext();}
  function togglePlayback(){state.timer?stopPlayback():startPlayback();}
  function reset(){stopPlayback();goTo(0,{follow:true});}
  function renderSampleButtons(){els.sampleButtons.replaceChildren();samples.forEach((sample)=>{const button=document.createElement("button");button.type="button";button.className="btn";button.textContent=sample.label;button.dataset.sample=sample.id;button.classList.toggle("selected",state.selectedSample===sample.id);els.sampleButtons.appendChild(button);});}
  function applyText(text,sampleId=null){stopPlayback();try{Object.assign(state,parseInput(text),{selectedSample:sampleId,stepIndex:0});els.inputError.textContent="";buildSteps();const max=Math.max(0,state.steps.length-1);els.timeline.max=els.mobileTimeline.max=max;renderSampleButtons();render({follow:true});}catch(error){els.inputError.textContent=error.message;}}

  els.prevBtn.addEventListener("click",()=>move(-1));
  els.nextBtn.addEventListener("click",()=>move(1));
  document.getElementById("mobilePlayBtn").addEventListener("click",()=>els.playBtn.click());
  els.mobilePrevBtn.addEventListener("click",()=>move(-1));
  els.mobileNextBtn.addEventListener("click",()=>move(1));
  els.resetBtn.addEventListener("click",reset);
  els.replayBtn.addEventListener("click",()=>{reset();startPlayback();});
  els.skipBtn.addEventListener("click",()=>{stopPlayback();goTo(state.steps.length-1,{follow:true});});
  els.playBtn.addEventListener("click",togglePlayback);
  els.speedRange.addEventListener("input",()=>{state.speed=Number(els.speedRange.value);els.speedLabel.textContent=`${Core.formatDecimal(state.speed)}×`;if(state.timer){clearTimeout(state.timer);scheduleNext();}});
  [els.timeline,els.mobileTimeline].forEach((timeline)=>timeline.addEventListener("input",(event)=>{stopPlayback();goTo(Number(event.target.value),{follow:true});}));
  els.applyBtn.addEventListener("click",()=>applyText(els.inputArea.value));
  els.inputArea.addEventListener("input",()=>{state.selectedSample=null;renderSampleButtons();});
  els.sampleButtons.addEventListener("click",(event)=>{const button=event.target.closest("button[data-sample]");if(!button)return;const sample=samples.find((item)=>item.id===button.dataset.sample);if(!sample)return;els.inputArea.value=sample.value;applyText(sample.value,sample.id);});

  renderCode();
  els.inputArea.value = defaultSample.value;
  applyText(defaultSample.value, defaultSample.id);
})();

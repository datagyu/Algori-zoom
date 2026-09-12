(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    platform: "SWEA",
    number: "1954",
    level: "D2",
    title: "달팽이 숫자",
    autoplayMs: 550,
    defaultSampleId: "one",
    sourceSteps: [
      {
            "text": "arr = list([0]*N for _ in range(N))",
            "types": "init"
      },
      {
            "text": "current = 0",
            "types": "ready"
      },
      {
            "text": "for num in range(1, N**2 + 1):",
            "types": "loop"
      },
      {
            "text": "arr[cr][cc] = num",
            "types": "write"
      },
      {
            "text": "nr = cr + dr[current]",
            "types": "next-row",
            "occurrence": 1
      },
      {
            "text": "nc = cc + dc[current]",
            "types": "next-col",
            "occurrence": 1
      },
      {
            "text": "if not ((0 <= nr < N) and (0 <= nc < N)) or arr[nr][nc] != 0:",
            "types": "check"
      },
      {
            "text": "current = (current + 1) % 4",
            "types": "turn"
      },
      {
            "text": "nr = cr + dr[current]",
            "types": "turn-row",
            "occurrence": 2
      },
      {
            "text": "nc = cc + dc[current]",
            "types": "turn-col",
            "occurrence": 2
      },
      {
            "text": "cr, cc = nr, nc",
            "types": "move"
      },
      {
            "text": "print(f'#{tc}')",
            "types": "header"
      },
      {
            "text": "print(*row)",
            "types": "output"
      }
],
    limits: { minSize: 1, maxSize: 10, maxCases: 10 },
    samples: [
      {
            "id": "one",
            "label": "샘플 1 · N=3",
            "value": "3"
      },
      {
            "id": "two",
            "label": "샘플 2 · N=4",
            "value": "4"
      },
      {
            "id": "all",
            "label": "첨부 예제 · N=1~10",
            "value": "10\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10"
      }
],
  });
  const samples = PROBLEM.samples;
  const defaultSample = samples.find(
    (sample) => sample.id === PROBLEM.defaultSampleId,
  );

  const els = Core.getByIds([
    "sourceCode",
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
    if (!text.trim() || tokens.some((token) => !/^\d+$/.test(token))) {
      throw new Error("N 또는 T와 각 N을 정수로 입력해주세요.");
    }
    const values = tokens.map(Number);
    const cases = values.length === 1 ? values : values.slice(1);
    if (values.length > 1 && (values[0] !== cases.length || values[0] > PROBLEM.limits.maxCases)) {
      throw new Error("첫 줄 T와 테스트 케이스 개수를 맞춰주세요. 최대 10개까지 지원합니다.");
    }
    if (cases.some((N) => !Number.isInteger(N) || N < PROBLEM.limits.minSize || N > PROBLEM.limits.maxSize)) {
      throw new Error("N은 1 이상 10 이하의 정수입니다.");
    }
    return { cases };
  }

  function buildSteps() {
    const steps = [];
    const dr = [0, 1, 0, -1];
    const dc = [1, 0, -1, 0];
    const directions = ["오른쪽 →", "아래 ↓", "왼쪽 ←", "위 ↑"];
    let output = "";
    state.cases.forEach((N, index) => {
      const board = Array.from({ length: N }, () => Array(N).fill(0));
      let cr = 0, cc = 0, nr = null, nc = null, current = 0, num = null;
      const push = (phase, message) => steps.push({
        line: stepLineMap.get(phase), phase: phase.toUpperCase(), message,
        N, tc: index + 1, board: board.map((row) => row.slice()),
        cr, cc, nr, nc, current, num, direction: `${current} · ${directions[current]}`, output,
      });
      push("init", `테스트 케이스 #${index + 1}: ${N}×${N} 배열을 0으로 만듭니다.`);
      push("ready", "cr=0, cc=0에서 시작합니다. dr=[0,1,0,-1], dc=[1,0,-1,0], current=0은 오른쪽입니다.");
      for (num = 1; num <= N * N; num += 1) {
        push("loop", `이번에 기록할 숫자는 ${num}입니다.`);
        board[cr][cc] = num;
        push("write", `arr[${cr}][${cc}]에 ${num}을 기록합니다.`);
        nr = cr + dr[current];
        push("next-row", `nr = ${cr} + (${dr[current]}) = ${nr}`);
        nc = cc + dc[current];
        push("next-col", `nc = ${cc} + (${dc[current]}) = ${nc}`);
        const outside = nr < 0 || nr >= N || nc < 0 || nc >= N;
        const blocked = outside || board[nr][nc] !== 0;
        push("check", outside ? `(${nr}, ${nc})는 배열 밖입니다. or의 뒤쪽 배열 접근은 실행하지 않습니다.` : blocked ? `arr[${nr}][${nc}]는 이미 ${board[nr][nc]}입니다. 방향을 바꿉니다.` : `(${nr}, ${nc})는 범위 안의 빈 칸입니다. 방향을 유지합니다.`);
        if (blocked) {
          current = (current + 1) % 4;
          push("turn", `current = (current + 1) % 4 → ${current}. ${directions[current]} 방향으로 회전합니다.`);
          nr = cr + dr[current];
          push("turn-row", `새 방향으로 nr = ${nr}를 계산합니다.`);
          nc = cc + dc[current];
          push("turn-col", `새 방향으로 nc = ${nc}를 계산합니다.`);
        }
        cr = nr; cc = nc;
        push("move", num === N * N ? "마지막 숫자까지 기록했습니다. 원본 코드대로 좌표를 갱신하지만 더 이상 배열에 기록하지 않습니다." : `현재 좌표를 (${cr}, ${cc})로 옮깁니다.`);
      }
      num = N * N;
      output += `#${index + 1}\n`;
      push("header", `#${index + 1}을 출력합니다.`);
      board.forEach((row, rowIndex) => {
        output += row.join(" ") + "\n";
        push("output", `${rowIndex + 1}번째 행을 출력합니다.${rowIndex === N - 1 ? " 이 테스트 케이스가 완료되었습니다." : ""}`);
      });
    });
    state.steps = steps;
  }

  function renderBoardInto(container) {
    container.style.gridTemplateColumns = `repeat(${state.N}, max-content)`;
    container.replaceChildren();

    const cache = Array.from({ length: state.N }, () => Array(state.N));
    const fragment = document.createDocumentFragment();

    for (let row = 0; row < state.N; row += 1) {
      for (let col = 0; col < state.N; col += 1) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = state.board[row][col];
        fragment.appendChild(cell);
        cache[row][col] = cell;
      }
    }

    container.appendChild(fragment);
    return cache;
  }

  function renderBoards() {
    state.cells = renderBoardInto(els.board);
    state.mobileCells = renderBoardInto(els.mobileBoard);
    els.boardLabel.textContent = `#${state.renderedCase} · N=${state.N}`;
  }

  function updateBoard(cache, step) {
    for (let row = 0; row < step.N; row += 1) {
      for (let col = 0; col < step.N; col += 1) {
        const cell = cache[row][col];
        cell.textContent = step.board[row][col] || "·";
        cell.classList.toggle("filled", step.board[row][col] !== 0);
        cell.classList.toggle("current", row === step.cr && col === step.cc && !["HEADER", "OUTPUT"].includes(step.phase));
        cell.classList.toggle("candidate", row === step.nr && col === step.nc && ["NEXT-COL", "CHECK", "TURN", "TURN-ROW", "TURN-COL"].includes(step.phase));
      }
    }
  }

  function activeBoardCell(cache, step) {
    return cache[step.cr]?.[step.cc] ?? null;
  }

  function followStep(step) {
    Core.centerInsideViewport(
      els.codeViewport,
      state.codeLines.get(step.line),
      { horizontal: false, vertical: true },
    );
    Core.centerInsideViewport(
      els.mobileCodeViewport,
      state.mobileCodeLines.get(step.line),
      { horizontal: false, vertical: true },
    );
    Core.centerInsideViewport(
      els.boardViewport,
      activeBoardCell(state.cells, step),
      { horizontal: true, vertical: true },
    );
    Core.centerInsideViewport(
      els.mobileBoardViewport,
      activeBoardCell(state.mobileCells, step),
      { horizontal: true, vertical: true },
    );
  }

  function updateCodeHighlight(lines, lineNumber) {
    lines.forEach((line, index) => {
      line.classList.toggle("active", index === lineNumber);
    });
  }

  function render({ follow = true } = {}) {
    const step = state.steps[state.stepIndex];
    if (!step) return;

    if (state.renderedCase !== step.tc || state.N !== step.N) {
      state.N = step.N;
      state.board = step.board;
      state.renderedCase = step.tc;
      renderBoards();
    }
    renderDesktop(step);
    renderMobile(step);
    els.timeline.value = state.stepIndex;
    els.stepLabel.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.prevBtn.disabled = state.stepIndex === 0;
    els.nextBtn.disabled = state.stepIndex === state.steps.length - 1;

    if (follow) followStep(step);
  }

  function renderDesktop(step) {
    updateCodeHighlight(state.codeLines, step.line);
    updateBoard(state.cells, step);
    els.codeLineLabel.textContent = `LINE ${step.line}`;
    els.phaseLabel.textContent = step.phase;
    els.crValue.textContent = step.cr;
    els.ccValue.textContent = step.cc;
    els.nrValue.textContent = step.nr ?? "—";
    els.ncValue.textContent = step.nc ?? "—";
    els.numValue.textContent = step.num ?? "—";
    els.directionValue.textContent = step.direction;
    els.explainText.textContent = step.message;
    els.outputView.textContent = step.output || "아직 출력이 없습니다.";
  }

  function renderMobile(step) {
    updateCodeHighlight(state.mobileCodeLines, step.line);
    updateBoard(state.mobileCells, step);
    els.mobileCoord.textContent = `#${step.tc} · N=${step.N} · cr=${step.cr} · cc=${step.cc}`;
    els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.mobilePhase.textContent = step.phase;
    els.mobileExplanation.textContent = step.message;
    els.mobileStateMeta.textContent = `num ${step.num ?? "—"}`;
    els.mobileCr.textContent = step.cr;
    els.mobileCc.textContent = step.cc;
    els.mobileNr.textContent = step.nr ?? "—";
    els.mobileNc.textContent = step.nc ?? "—";
    els.mobileDirection.textContent = step.direction;
    els.mobileOutputView.textContent = step.output || "아직 출력이 없습니다.";
    els.mobileTimeline.value = state.stepIndex;
    els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.mobilePrevBtn.disabled = state.stepIndex === 0;
    els.mobileNextBtn.disabled = state.stepIndex === state.steps.length - 1;
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
      Object.assign(state, parsed, { selectedSample: sampleId, stepIndex: 0 });
      els.inputError.textContent = "";

      state.renderedCase = null;
      buildSteps();

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

(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    platform: "SWEA",
    number: "2001",
    level: "D2",
    title: "파리 퇴치",
    autoplayMs: 550,
    defaultSampleId: "one",
    sourceSteps: [
      { text: "for i in range(N-M+1):", types: "move-i" },
      { text: "for j in range(N-M+1):", types: "move-j" },
      { text: "total = 0", types: "reset" },
      { text: "for r in range(M):", types: "row" },
      { text: "for c in range(M):", types: "cell" },
      { text: "total += board[i+r][j+c]", types: "add" },
      { text: "if max_value < total:", types: "compare" },
      { text: "max_value = total", types: "update" },
      { text: "print(f'#{test_case} {max_value}')", types: "done" },
    ],
    limits: { minSize: 5, maxSize: 15, minWindow: 2, maxFlies: 30 },
    samples: [
      {
        id: "one",
        label: "샘플 1",
        value: `5 2\n1 3 3 6 7\n8 13 9 12 8\n4 16 11 12 6\n2 4 1 23 2\n9 13 4 7 3`,
      },
      {
        id: "two",
        label: "샘플 2",
        value: `6 3\n29 21 26 9 5 8\n21 19 8 0 21 19\n9 24 2 11 4 24\n19 29 1 0 21 19\n10 29 6 18 4 3\n29 11 15 3 3 29`,
      },
    ],
  });
  const samples = PROBLEM.samples;
  const defaultSample = samples.find(
    (sample) => sample.id === PROBLEM.defaultSampleId,
  );

  const els = Core.getByIds([
    "sourceCode",
    "codeViewport",
    "codeView",
    "codeLineLabel",
    "boardViewport",
    "board",
    "boardLabel",
    "phaseLabel",
    "iValue",
    "jValue",
    "rValue",
    "cValue",
    "totalValue",
    "maxValue",
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
    "mobileI",
    "mobileJ",
    "mobileR",
    "mobileC",
    "mobileMaxValue",
    "mobilePrevBtn",
    "mobileNextBtn",
    "mobileTimeline",
    "mobileTimelineStatus",
  ]);

  const state = {
    N: null,
    M: null,
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
    const lines = text
      .trim()
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) throw new Error("입력을 확인해주세요.");

    const [firstLine, ...boardLines] = lines;
    const first = firstLine.split(/\s+/).map(Number);
    if (first.length !== 2 || first.some(Number.isNaN)) {
      throw new Error("첫 줄에는 N과 M을 입력해주세요.");
    }

    const [N, M] = first;
    if (
      !Number.isInteger(N) ||
      N < PROBLEM.limits.minSize ||
      N > PROBLEM.limits.maxSize
    )
      throw new Error("N은 5 이상 15 이하입니다.");
    if (!Number.isInteger(M) || M < PROBLEM.limits.minWindow || M > N)
      throw new Error("M은 2 이상 N 이하입니다.");
    if (boardLines.length !== N)
      throw new Error(`보드는 정확히 ${N}줄이어야 합니다.`);

    const board = boardLines.map((line, row) => {
      const values = line.split(/\s+/).map(Number);
      if (values.length !== N || values.some(Number.isNaN)) {
        throw new Error(`${row + 1}번째 행은 숫자 ${N}개가 필요합니다.`);
      }
      if (
        values.some(
          (value) =>
            !Number.isInteger(value) ||
            value < 0 ||
            value > PROBLEM.limits.maxFlies,
        )
      ) {
        throw new Error("각 영역의 파리 수는 0 이상 30 이하입니다.");
      }
      return values;
    });

    return { N, M, board };
  }

  function createStep(phase, values, message) {
    return {
      line: stepLineMap.get(phase.toLowerCase().replaceAll(" ", "-")),
      phase,
      message,
      ...values,
    };
  }

  function buildSteps() {
    const steps = [];
    let maxValue = 0;
    let best = null;
    const lastStart = state.N - state.M;

    for (let i = 0; i <= lastStart; i += 1) {
      steps.push(
        createStep(
          "MOVE I",
          { i, j: 0, r: null, c: null, total: 0, maxValue, best },
          `i = ${i}. 파리채의 시작 행을 선택합니다.`,
        ),
      );

      for (let j = 0; j <= lastStart; j += 1) {
        let total = 0;

        steps.push(
          createStep(
            "MOVE J",
            { i, j, r: null, c: null, total, maxValue, best },
            `파리채를 (${i}, ${j}) 위치에 놓습니다.`,
          ),
        );
        steps.push(
          createStep(
            "RESET",
            { i, j, r: null, c: null, total, maxValue, best },
            "새 위치의 합을 구하기 위해 total을 0으로 초기화합니다.",
          ),
        );

        for (let r = 0; r < state.M; r += 1) {
          steps.push(
            createStep(
              "ROW",
              { i, j, r, c: null, total, maxValue, best },
              `파리채 내부 r = ${r} 행을 확인합니다.`,
            ),
          );

          for (let c = 0; c < state.M; c += 1) {
            steps.push(
              createStep(
                "CELL",
                { i, j, r, c, total, maxValue, best },
                `파리채 내부 (${r}, ${c}) 칸을 선택합니다.`,
              ),
            );

            const boardRow = i + r;
            const boardCol = j + c;
            const value = state.board[boardRow][boardCol];
            total += value;

            steps.push(
              createStep(
                "ADD",
                { i, j, r, c, total, maxValue, best },
                `board[${boardRow}][${boardCol}] = ${value}를 더해 total = ${total}.`,
              ),
            );
          }
        }

        steps.push(
          createStep(
            "COMPARE",
            { i, j, r: null, c: null, total, maxValue, best },
            `${maxValue} < ${total} 인지 비교합니다.`,
          ),
        );

        if (maxValue < total) {
          maxValue = total;
          best = { i, j };
          steps.push(
            createStep(
              "UPDATE",
              { i, j, r: null, c: null, total, maxValue, best },
              `더 큰 합을 찾았습니다. max_value = ${maxValue}.`,
            ),
          );
        }
      }
    }

    steps.push(
      createStep(
        "DONE",
        { i: null, j: null, r: null, c: null, total: null, maxValue, best },
        `모든 위치를 확인했습니다. 정답은 ${maxValue}입니다.`,
      ),
    );

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
    els.boardLabel.textContent = `N=${state.N} · M=${state.M}`;
  }

  function isInsideWindow(row, col, top, left) {
    return (
      top != null &&
      left != null &&
      row >= top &&
      row < top + state.M &&
      col >= left &&
      col < left + state.M
    );
  }

  function updateBoard(cache, step) {
    for (let row = 0; row < state.N; row += 1) {
      for (let col = 0; col < state.N; col += 1) {
        const cell = cache[row][col];
        cell.classList.toggle(
          "swatter",
          isInsideWindow(row, col, step.i, step.j),
        );
        cell.classList.toggle(
          "best",
          Boolean(
            step.best && isInsideWindow(row, col, step.best.i, step.best.j),
          ),
        );
        cell.classList.remove("current");
      }
    }

    if (step.r != null && step.c != null) {
      cache[step.i + step.r]?.[step.j + step.c]?.classList.add("current");
    }
  }

  function activeBoardCell(cache, step) {
    if (step.i == null || step.j == null) return null;
    const row = step.r == null ? step.i : step.i + step.r;
    const col = step.c == null ? step.j : step.j + step.c;
    return cache[row]?.[col] ?? null;
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
    els.iValue.textContent = step.i ?? "-";
    els.jValue.textContent = step.j ?? "-";
    els.rValue.textContent = step.r ?? "-";
    els.cValue.textContent = step.c ?? "-";
    els.totalValue.textContent = step.total ?? "-";
    els.maxValue.textContent = step.maxValue;
    els.explainText.textContent = step.message;
  }

  function renderMobile(step) {
    updateCodeHighlight(state.mobileCodeLines, step.line);
    updateBoard(state.mobileCells, step);
    els.mobileCoord.textContent = `i = ${step.i ?? "—"} · j = ${step.j ?? "—"}`;
    els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.mobilePhase.textContent = step.phase;
    els.mobileExplanation.textContent = step.message;
    els.mobileStateMeta.textContent = `total ${step.total ?? "—"}`;
    els.mobileI.textContent = step.i ?? "—";
    els.mobileJ.textContent = step.j ?? "—";
    els.mobileR.textContent = step.r ?? "—";
    els.mobileC.textContent = step.c ?? "—";
    els.mobileMaxValue.textContent = step.maxValue;
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
    if (state.stepIndex >= state.steps.length - 1) state.stepIndex = 0;
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
      scheduleNext();
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

      renderBoards();
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

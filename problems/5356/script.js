(() => {
  /*
   * SWEA 5356 · 의석이의 세로로 말해요
   *
   * 구조 원칙
   * 1) PROBLEM: 이 문제에만 필요한 규칙/샘플
   * 2) buildSteps(): Python 실행 흐름을 step 데이터로 변환
   * 3) render(): 같은 step을 데스크톱/모바일에 표시
   * 4) 공통 스크롤/문자열 보조 기능은 assets/visualizer-core.js 사용
   */

  const Core = window.AlgoriZoomCore;
  const { clamp, formatDecimal, createLineMap, centerInsideViewport } = Core;

  // -----------------------------------------------------------------------------
  // 1. 문제 설정
  // -----------------------------------------------------------------------------

  const PROBLEM = Object.freeze({
    platform: "SWEA",
    number: "5356",
    level: "D3",
    title: "의석이의 세로로 말해요",
    sourceSteps: [
      { text: "for c in range(15):", occurrence: 1, types: "col" },
      { text: "for r in range(5):", occurrence: 1, types: "row" },
      { text: "if (len(board[r]) > c):", occurrence: 1, types: "check skip" },
      { text: "result.append(board[r][c])", occurrence: 1, types: "append" },
    ],
    rows: 5,
    cols: 15,
    stepsPerCell: 3, // row → check → append/skip
    autoplayMs: 850,
    mobileQuery: "(max-width: 760px)",
    defaultSampleId: "two",
    samples: [
      {
        id: "one",
        label: "샘플 1",
        value: "ABCDE\nabcde\n01234\nFGHIJ\nfghij",
      },
      {
        id: "two",
        label: "샘플 2",
        value: "AABCDD\nafzz\n09121\na8EWg6\nP5h3kx",
      },
    ],
  });

  const stepsPerCol = () => 1 + PROBLEM.rows * PROBLEM.stepsPerCell;
  const isMobile = () => window.matchMedia(PROBLEM.mobileQuery).matches;
  const sampleById = (id) =>
    PROBLEM.samples.find((sample) => sample.id === id) ?? null;

  // -----------------------------------------------------------------------------
  // 2. DOM과 상태
  // -----------------------------------------------------------------------------

  const els = Core.getByIds([
    "sourceCode",
    "desktopCodeViewport",
    "desktopBoardViewport",
    "board",
    "colHeaders",
    "coordLabel",
    "phaseLabel",
    "stepLabel",
    "explanation",
    "conditionBox",
    "conditionDetail",
    "varC",
    "varR",
    "varRow",
    "varLen",
    "varValue",
    "result",
    "resultCount",
    "chapterNav",
    "timelineRange",
    "timelineStatus",
    "resetBtn",
    "prevBtn",
    "nextBtn",
    "playBtn",
    "replayBtn",
    "skipBtn",
    "speedRange",
    "speedLabel",
    "customInput",
    "applyInputBtn",
    "sampleButtons",
    "mobileCodeViewport",
    "mobileBoardViewport",
    "mobileBoardCanvas",
    "mobileCoord",
    "mobilePhase",
    "mobileCondition",
    "mobileExplanation",
    "mobileCodeStatus",
    "mobileResult",
    "mobileResultCount",
    "mobileTimeline",
    "mobileTimelineStatus",
    "mobilePrevBtn",
    "mobileNextBtn",
  ]);

  const defaultSample =
    sampleById(PROBLEM.defaultSampleId) ?? PROBLEM.samples[0];

  const state = {
    board: [...defaultSample.value.split("\n")],
    steps: [],
    visitEvents: [],
    stepIndex: -1,
    renderedStepIndex: -1,
    playing: false,
    timer: null,
    lastResultKey: "",
  };

  const cache = {
    sourceLineByStepType: new Map(),
    desktopCodeLines: new Map(),
    mobileCodeLines: new Map(),
    desktopCells: [],
    mobileCells: [],
    desktopRows: [],
    mobileRows: [],
    desktopCols: [],
    mobileCols: [],
    chapters: [],
    transientClasses: [],
  };

  // -----------------------------------------------------------------------------
  // 3. 초기 화면 구성
  // -----------------------------------------------------------------------------

  function mountSourceCode() {
    const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps);
    els.desktopCodeViewport.innerHTML = markup;
    els.mobileCodeViewport.innerHTML = markup;
    cache.sourceLineByStepType = Core.createStepLineMap(
      els.desktopCodeViewport,
    );
    cache.desktopCodeLines = createLineMap(els.desktopCodeViewport);
    cache.mobileCodeLines = createLineMap(els.mobileCodeViewport);
  }

  function applyLayoutVariables() {
    document.documentElement.style.setProperty("--board-cols", PROBLEM.cols);
  }

  function buildSampleButtons() {
    els.sampleButtons.replaceChildren();

    for (const sample of PROBLEM.samples) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn";
      button.dataset.sampleId = sample.id;
      button.textContent = sample.label;
      els.sampleButtons.append(button);
    }
  }

  function buildSteps() {
    const steps = [];
    const visitEvents = [];
    let result = "";

    for (let c = 0; c < PROBLEM.cols; c += 1) {
      steps.push(createStep("col", c, null, result));

      for (let r = 0; r < PROBLEM.rows; r += 1) {
        const exists = state.board[r].length > c;
        steps.push(createStep("row", c, r, result, exists));
        steps.push(createStep("check", c, r, result, exists));

        if (exists) {
          const value = state.board[r][c];
          result += value;
          steps.push(createStep("append", c, r, result, true, value));
          visitEvents.push({ stepIndex: steps.length - 1, r, c });
        } else {
          steps.push(createStep("skip", c, r, result, false));
        }
      }
    }

    state.steps = steps;
    state.visitEvents = visitEvents;
    syncTimelineLimits();
  }

  function createStep(type, c, r, result, exists = null, value = null) {
    return {
      type,
      sourceLine: cache.sourceLineByStepType.get(type) ?? null,
      c,
      r,
      result,
      exists,
      value,
    };
  }

  function buildBoards() {
    buildDesktopBoard();
    buildMobileBoard();
    state.renderedStepIndex = -1;
  }

  function buildDesktopBoard() {
    els.colHeaders.innerHTML = `<span></span>${Array.from(
      { length: PROBLEM.cols },
      (_, c) => `<span data-col="${c}">c=${c}</span>`,
    ).join("")}`;

    els.board.innerHTML = state.board
      .map((row, r) => {
        const cells = Array.from({ length: PROBLEM.cols }, (_, c) => {
          const value = row[c];
          return `<div class="cell ${value === undefined ? "empty" : ""}" data-r="${r}" data-c="${c}">${value ?? "·"}</div>`;
        }).join("");
        return `<div class="board-row" data-row="${r}"><span class="row-label">r=${r}</span>${cells}</div>`;
      })
      .join("");

    cache.desktopRows = [...els.board.querySelectorAll(".board-row")];
    cache.desktopCols = [...els.colHeaders.querySelectorAll("[data-col]")];
    cache.desktopCells = createCellMatrix(
      els.board.querySelectorAll("[data-r][data-c]"),
      "r",
      "c",
    );
  }

  function buildMobileBoard() {
    const parts = [`<div class="mobile-board-corner">ROW</div>`];

    for (let c = 0; c < PROBLEM.cols; c += 1) {
      parts.push(
        `<div class="mobile-board-col" data-mobile-col="${c}">c=${c}</div>`,
      );
    }

    for (let r = 0; r < PROBLEM.rows; r += 1) {
      parts.push(
        `<div class="mobile-board-row-label" data-mobile-row="${r}">r=${r}</div>`,
      );
      for (let c = 0; c < PROBLEM.cols; c += 1) {
        const value = state.board[r][c];
        parts.push(
          `<div class="mobile-board-cell ${value === undefined ? "empty" : ""}" data-mobile-r="${r}" data-mobile-c="${c}">${value ?? "·"}</div>`,
        );
      }
    }

    els.mobileBoardCanvas.innerHTML = parts.join("");
    cache.mobileRows = [
      ...els.mobileBoardCanvas.querySelectorAll("[data-mobile-row]"),
    ];
    cache.mobileCols = [
      ...els.mobileBoardCanvas.querySelectorAll("[data-mobile-col]"),
    ];
    cache.mobileCells = createCellMatrix(
      els.mobileBoardCanvas.querySelectorAll("[data-mobile-r][data-mobile-c]"),
      "mobileR",
      "mobileC",
    );
  }

  function createCellMatrix(nodes, rowKey, colKey) {
    const matrix = Array.from({ length: PROBLEM.rows }, () =>
      Array(PROBLEM.cols),
    );
    for (const node of nodes) {
      matrix[Number(node.dataset[rowKey])][Number(node.dataset[colKey])] = node;
    }
    return matrix;
  }

  function buildChapterNav() {
    const maxLength = Math.max(...state.board.map((row) => row.length));

    els.chapterNav.innerHTML = Array.from({ length: PROBLEM.cols }, (_, c) => {
      const meaningful = c < maxLength;
      const hasSkip = meaningful && state.board.some((row) => row.length <= c);
      return `<button
      type="button"
      class="chapter ${meaningful ? "" : "idle"} ${hasSkip ? "has-skip" : ""}"
      data-step-index="${c * stepsPerCol()}"
      title="c=${c}${hasSkip ? " · 빈 칸 검사 있음" : ""}"
    >c=${c}</button>`;
    }).join("");

    cache.chapters = [...els.chapterNav.querySelectorAll(".chapter")];
  }

  function syncTimelineLimits() {
    const total = state.steps.length;
    for (const timeline of [els.timelineRange, els.mobileTimeline]) {
      timeline.max = total;
      timeline.value = 0;
    }
    els.timelineStatus.textContent = `STEP 0 / ${total}`;
    els.mobileTimelineStatus.textContent = `0 / ${total}`;
    els.stepLabel.textContent = `STEP 0 / ${total}`;
  }

  // -----------------------------------------------------------------------------
  // 4. 렌더링
  // -----------------------------------------------------------------------------

  function render({ align = false } = {}) {
    const step = currentStep();
    const visibleStep = state.stepIndex + 1;

    syncVisitedState(state.renderedStepIndex, state.stepIndex);
    clearTransientHighlights();
    renderControls(visibleStep);
    renderDesktop(step);
    renderMobile(step);
    renderResult(step);
    state.renderedStepIndex = state.stepIndex;

    if (align && step) requestAnimationFrame(() => alignActiveViews(step));
  }

  function currentStep() {
    return state.stepIndex >= 0 ? state.steps[state.stepIndex] : null;
  }

  function renderControls(visibleStep) {
    const total = state.steps.length;
    const atStart = state.stepIndex < 0;
    const atEnd = state.stepIndex >= total - 1;

    els.stepLabel.textContent = `STEP ${visibleStep} / ${total}`;
    els.timelineRange.value = visibleStep;
    els.timelineStatus.textContent = `STEP ${visibleStep} / ${total}`;
    els.mobileTimeline.value = visibleStep;
    els.mobileTimelineStatus.textContent = `${visibleStep} / ${total}`;

    els.prevBtn.disabled = atStart;
    els.mobilePrevBtn.disabled = atStart;
    els.nextBtn.disabled = atEnd;
    els.mobileNextBtn.disabled = atEnd;
    els.resetBtn.disabled = atStart;
  }

  function renderDesktop(step) {
    if (!step) {
      renderDesktopReady();
      return;
    }

    addTransient(cache.desktopCodeLines.get(step.sourceLine), "active");
    addTransient(cache.desktopCols[step.c], "active-col");
    addTransient(cache.chapters[step.c], "active");
    if (step.r !== null) addTransient(cache.desktopRows[step.r], "active-row");
    markCurrentBoardState(cache.desktopCells, step);

    els.coordLabel.textContent = `c = ${step.c} · r = ${step.r ?? "—"}`;
    els.phaseLabel.textContent = step.type.toUpperCase();
    els.explanation.textContent = explain(step);
    renderVariables(step);
    renderCondition(step);
  }

  function renderDesktopReady() {
    els.coordLabel.textContent = "c = — · r = —";
    els.phaseLabel.textContent = "READY";
    els.explanation.textContent = "다음 버튼을 눌러 시작합니다.";
    els.conditionBox.className = "condition-box neutral";
    els.conditionDetail.textContent = "아직 검사하지 않았습니다.";

    for (const node of [
      els.varC,
      els.varR,
      els.varRow,
      els.varLen,
      els.varValue,
    ]) {
      node.textContent = "—";
    }
  }

  function renderMobile(step) {
    const sourceLine = step?.sourceLine ?? null;
    const result = step?.result ?? "";

    els.mobileCoord.textContent = step
      ? `c = ${step.c} · r = ${step.r ?? "—"}`
      : "c = — · r = —";
    els.mobilePhase.textContent = step?.type.toUpperCase() ?? "READY";
    els.mobileCodeStatus.textContent = sourceLine
      ? `LINE ${sourceLine}`
      : "READY";
    els.mobileExplanation.textContent = step
      ? explain(step)
      : "다음 버튼을 눌러 시작합니다.";
    els.mobileCondition.textContent = mobileConditionText(step);
    els.mobileResult.textContent = result || "—";
    els.mobileResultCount.textContent = `${result.length} chars`;

    addTransient(cache.mobileCodeLines.get(sourceLine), "active");
    if (step) {
      addTransient(cache.mobileCols[step.c], "active");
      if (step.r !== null) addTransient(cache.mobileRows[step.r], "active");
      markCurrentBoardState(cache.mobileCells, step);
    }
  }

  function renderVariables(step) {
    els.varC.textContent = step.c;
    els.varR.textContent = step.r ?? "—";

    if (step.r === null) {
      els.varRow.textContent = "—";
      els.varLen.textContent = "—";
      els.varValue.textContent = "—";
      return;
    }

    const row = state.board[step.r];
    els.varRow.textContent = `[${[...row].map((ch) => `'${ch}'`).join(", ")}]`;
    els.varLen.textContent = row.length;
    els.varValue.textContent =
      row[step.c] === undefined ? "없음" : `'${row[step.c]}'`;
  }

  function renderCondition(step) {
    if (!["check", "append", "skip"].includes(step.type)) {
      els.conditionBox.className = "condition-box neutral";
      els.conditionDetail.textContent = "아직 조건식을 검사하지 않습니다.";
      return;
    }

    const length = state.board[step.r].length;
    const passed = length > step.c;
    els.conditionBox.className = `condition-box ${passed ? "good" : "bad"}`;
    els.conditionDetail.textContent = `${length} > ${step.c} → ${passed ? "True" : "False"}`;
  }

  function renderResult(step) {
    const value = step?.result ?? "";
    const latest = step?.type === "append";
    const resultKey = `${value}|${latest}`;
    if (resultKey === state.lastResultKey) return;
    state.lastResultKey = resultKey;

    els.result.replaceChildren();
    if (!value) {
      const empty = document.createElement("span");
      empty.className = "empty-result";
      empty.textContent = "비어 있음";
      els.result.append(empty);
      els.resultCount.textContent = "0 chars";
      return;
    }

    const fragment = document.createDocumentFragment();
    [...value].forEach((char, index) => {
      const span = document.createElement("span");
      span.className = `result-char ${latest && index === value.length - 1 ? "latest" : ""}`;
      span.textContent = char;
      fragment.append(span);
    });
    els.result.append(fragment);
    els.resultCount.textContent = `${value.length} chars`;
  }

  function clearTransientHighlights() {
    for (const [node, className] of cache.transientClasses)
      node.classList.remove(className);
    cache.transientClasses = [];
  }

  function addTransient(node, className) {
    if (!node) return;
    node.classList.add(className);
    cache.transientClasses.push([node, className]);
  }

  function markCurrentBoardState(cells, step) {
    for (let r = 0; r < PROBLEM.rows; r += 1) {
      addTransient(cells[r][step.c], "active-column");
    }

    if (step.r !== null) {
      addTransient(
        cells[step.r][step.c],
        step.exists === false ? "missing-current" : "current",
      );
    }
  }

  // visited는 매 STEP마다 전체 board를 다시 훑지 않고, 이동 구간에 포함된 append만 갱신합니다.
  function syncVisitedState(previousIndex, nextIndex) {
    if (previousIndex === nextIndex || state.visitEvents.length === 0) return;

    const previousCut = upperBoundVisitEvent(previousIndex);
    const nextCut = upperBoundVisitEvent(nextIndex);

    if (nextCut > previousCut) {
      for (let i = previousCut; i < nextCut; i += 1)
        setVisited(state.visitEvents[i], true);
    } else {
      for (let i = nextCut; i < previousCut; i += 1)
        setVisited(state.visitEvents[i], false);
    }
  }

  function upperBoundVisitEvent(stepIndex) {
    let low = 0;
    let high = state.visitEvents.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (state.visitEvents[mid].stepIndex <= stepIndex) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  function setVisited({ r, c }, active) {
    cache.desktopCells[r][c]?.classList.toggle("visited", active);
    cache.mobileCells[r][c]?.classList.toggle("visited", active);
  }

  function explain(step) {
    switch (step.type) {
      case "col":
        return `c = ${step.c}. 새 세로 열을 선택합니다.`;
      case "row":
        return `r = ${step.r}. board[${step.r}][${step.c}] 위치로 이동합니다.`;
      case "check":
        return `길이 ${state.board[step.r].length} > c(${step.c})인지 확인합니다.`;
      case "append":
        return `'${step.value}'를 result에 추가합니다.`;
      default:
        return "해당 위치가 없어 건너뜁니다.";
    }
  }

  function mobileConditionText(step) {
    if (!step) return "시작 전";
    if (!["check", "append", "skip"].includes(step.type))
      return `c = ${step.c} 열 탐색`;

    const length = state.board[step.r].length;
    return `${length} > ${step.c} → ${length > step.c ? "True" : "False"}`;
  }

  // -----------------------------------------------------------------------------
  // 5. 코드/board 자동 추적
  // -----------------------------------------------------------------------------

  function alignActiveViews(step) {
    if (isMobile()) {
      centerInsideViewport(
        els.mobileCodeViewport,
        cache.mobileCodeLines.get(step.sourceLine),
      );
      centerInsideViewport(els.mobileBoardViewport, mobileBoardTarget(step), {
        horizontal: true,
        vertical: step.r !== null,
      });
      return;
    }

    centerInsideViewport(
      els.desktopCodeViewport,
      cache.desktopCodeLines.get(step.sourceLine),
    );
    centerInsideViewport(els.desktopBoardViewport, desktopBoardTarget(step), {
      horizontal: true,
      vertical: step.r !== null,
    });
  }

  function desktopBoardTarget(step) {
    return step.r === null
      ? cache.desktopCols[step.c]
      : cache.desktopCells[step.r][step.c];
  }

  function mobileBoardTarget(step) {
    return step.r === null
      ? cache.mobileCols[step.c]
      : cache.mobileCells[step.r][step.c];
  }

  // -----------------------------------------------------------------------------
  // 6. 재생과 이동
  // -----------------------------------------------------------------------------

  function goTo(nextIndex, { align = true, stop = true } = {}) {
    if (stop) stopPlayback();
    state.stepIndex = clamp(nextIndex, -1, state.steps.length - 1);
    render({ align });
  }

  function move(delta) {
    goTo(state.stepIndex + delta);
  }

  function stopPlayback() {
    state.playing = false;
    clearTimeout(state.timer);
    state.timer = null;
    Core.updatePlaybackControls(els.playBtn, false);
  }

  function startPlayback({ restart = false } = {}) {
    stopPlayback();
    if (restart || state.stepIndex >= state.steps.length - 1)
      state.stepIndex = -1;
    state.playing = true;
    Core.updatePlaybackControls(els.playBtn, true);
    scheduleNext();
  }

  function scheduleNext() {
    if (!state.playing) return;
    if (state.stepIndex >= state.steps.length - 1) {
      stopPlayback();
      return;
    }

    const delay = PROBLEM.autoplayMs / Number(els.speedRange.value);
    state.timer = setTimeout(() => {
      goTo(state.stepIndex + 1, { align: true, stop: false });
      scheduleNext();
    }, delay);
  }

  function skipToEnd() {
    goTo(state.steps.length - 1);
  }

  function reset() {
    goTo(-1, { align: false });
  }

  // -----------------------------------------------------------------------------
  // 7. 입력과 샘플
  // -----------------------------------------------------------------------------

  function applyBoard(lines) {
    const cleaned = lines.map((line) => line.trim());
    const error = validateBoard(cleaned);
    if (error) {
      document.getElementById("inputError").textContent = error;
      return false;
    }

    document.getElementById("inputError").textContent = "";
    state.board = cleaned;
    state.lastResultKey = "";
    buildSteps();
    buildBoards();
    buildChapterNav();
    reset();
    return true;
  }

  function validateBoard(lines) {
    if (lines.length !== PROBLEM.rows)
      return `정확히 ${PROBLEM.rows}줄을 입력해주세요.`;
    if (lines.some((line) => line.length < 1 || line.length > PROBLEM.cols)) {
      return `각 줄은 1~${PROBLEM.cols}글자여야 합니다.`;
    }
    if (lines.some((line) => !/^[A-Za-z0-9]+$/.test(line))) {
      return "영문 대소문자와 숫자만 사용할 수 있습니다.";
    }
    return "";
  }

  function setActiveSample(sampleId = null) {
    for (const button of els.sampleButtons.querySelectorAll(
      "[data-sample-id]",
    )) {
      button.classList.toggle(
        "sample-active",
        button.dataset.sampleId === sampleId,
      );
    }
  }

  function detectActiveSample(lines) {
    const value = lines.join("\n");
    return PROBLEM.samples.find((sample) => sample.value === value)?.id ?? null;
  }

  function selectSample(sampleId) {
    const sample = sampleById(sampleId);
    if (!sample) return;
    els.customInput.value = sample.value;
    if (applyBoard(sample.value.split("\n"))) setActiveSample(sample.id);
  }

  // -----------------------------------------------------------------------------
  // 8. 이벤트
  // -----------------------------------------------------------------------------

  els.resetBtn.addEventListener("click", reset);
  els.prevBtn.addEventListener("click", () => move(-1));
  els.nextBtn.addEventListener("click", () => move(1));
  document.getElementById("mobilePlayBtn").addEventListener("click", () => els.playBtn.click());
  els.mobilePrevBtn.addEventListener("click", () => move(-1));
  els.mobileNextBtn.addEventListener("click", () => move(1));

  els.playBtn.addEventListener("click", () => {
    if (state.playing) stopPlayback();
    else startPlayback();
  });
  els.replayBtn.addEventListener("click", () =>
    startPlayback({ restart: true }),
  );
  els.skipBtn.addEventListener("click", skipToEnd);

  els.speedRange.addEventListener("input", () => {
    els.speedLabel.textContent = `${formatDecimal(els.speedRange.value)}×`;
    if (state.playing) {
      clearTimeout(state.timer);
      scheduleNext();
    }
  });

  for (const timeline of [els.timelineRange, els.mobileTimeline]) {
    timeline.addEventListener("input", () => goTo(Number(timeline.value) - 1));
  }

  els.chapterNav.addEventListener("click", (event) => {
    const chapter = event.target.closest("[data-step-index]");
    if (chapter) goTo(Number(chapter.dataset.stepIndex));
  });

  els.sampleButtons.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sample-id]");
    if (button) selectSample(button.dataset.sampleId);
  });

  els.applyInputBtn.addEventListener("click", () => {
    const lines = els.customInput.value.split(/\r?\n/);
    if (applyBoard(lines))
      setActiveSample(detectActiveSample(lines.map((line) => line.trim())));
  });

  els.customInput.addEventListener("input", () => setActiveSample(null));

  // -----------------------------------------------------------------------------
  // 9. 시작
  // -----------------------------------------------------------------------------

  applyLayoutVariables();
  mountSourceCode();
  buildSampleButtons();
  els.customInput.value = defaultSample.value;
  buildSteps();
  buildBoards();
  buildChapterNav();
  setActiveSample(defaultSample.id);
  render();
})();

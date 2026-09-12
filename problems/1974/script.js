(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({"platform": "SWEA", "number": "1974", "level": "D2", "title": "스도쿠 검증", "autoplayMs": 120, "defaultSampleId": "one", "samples": [{"id": "one", "label": "샘플 1 · 정상", "value": "1\n7 3 6 4 2 9 5 8 1\n5 8 9 1 6 7 3 2 4\n2 1 4 5 8 3 6 9 7\n8 4 7 9 3 6 1 5 2\n1 5 3 8 4 2 9 7 6\n9 6 2 7 5 1 8 4 3\n4 2 1 3 9 8 7 6 5\n3 9 5 6 7 4 2 1 8\n6 7 8 2 1 5 4 3 9"}, {"id": "two", "label": "샘플 2 · 중복", "value": "1\n7 3 6 4 8 9 2 5 1\n8 5 2 7 3 1 6 9 4\n9 1 4 5 6 2 7 3 8\n4 9 7 2 5 6 8 1 3\n5 6 3 1 8 7 9 4 2\n2 8 1 9 4 3 5 6 7\n6 7 5 3 2 4 1 8 9\n1 4 9 6 7 8 3 2 5\n3 2 8 1 9 5 4 7 6"}, {"id": "all", "label": "첨부 예제 전체 · 10개", "value": "10\n7 3 6 4 2 9 5 8 1\n5 8 9 1 6 7 3 2 4\n2 1 4 5 8 3 6 9 7\n8 4 7 9 3 6 1 5 2\n1 5 3 8 4 2 9 7 6\n9 6 2 7 5 1 8 4 3\n4 2 1 3 9 8 7 6 5\n3 9 5 6 7 4 2 1 8\n6 7 8 2 1 5 4 3 9\n7 3 6 4 8 9 2 5 1\n8 5 2 7 3 1 6 9 4\n9 1 4 5 6 2 7 3 8\n4 9 7 2 5 6 8 1 3\n5 6 3 1 8 7 9 4 2\n2 8 1 9 4 3 5 6 7\n6 7 5 3 2 4 1 8 9\n1 4 9 6 7 8 3 2 5\n3 2 8 1 9 5 4 7 6\n2 4 6 7 5 3 1 9 8\n7 5 8 1 9 4 2 3 6\n3 9 1 2 6 8 7 5 4\n5 8 2 3 4 6 9 7 1\n1 6 3 9 7 2 4 8 5\n9 7 4 8 1 5 6 2 3\n4 2 7 5 8 1 3 6 9\n6 3 5 4 2 9 8 1 7\n8 1 9 6 3 7 5 4 2\n8 4 5 2 9 6 1 3 7\n1 3 6 7 5 8 4 9 2\n9 7 2 1 3 4 6 5 8\n2 9 7 4 6 3 8 5 1\n4 6 1 5 8 2 9 7 3\n5 8 3 9 7 1 2 4 6\n3 2 8 6 4 5 7 1 9\n7 1 4 3 2 9 6 8 5\n6 5 9 8 1 7 3 2 4\n4 5 7 1 6 3 8 2 9\n6 3 9 8 2 7 5 4 1\n7 9 3 4 8 5 1 6 2\n1 8 2 5 4 9 6 3 7\n8 6 1 7 9 2 3 5 4\n5 2 4 6 3 1 7 9 8\n3 7 6 9 1 4 2 8 5\n2 4 5 3 7 8 9 1 6\n9 1 8 2 5 6 4 7 3\n1 5 2 3 8 6 9 4 7\n4 8 3 2 7 9 1 5 6\n7 6 9 1 5 4 8 2 3\n2 1 8 6 4 7 5 3 9\n6 9 7 5 3 8 2 1 4\n5 3 4 9 1 2 6 7 8\n9 7 1 4 6 5 3 8 2\n8 2 5 7 9 3 4 6 1\n3 4 6 8 2 1 7 9 5\n1 5 8 6 7 2 3 4 9\n7 2 9 3 4 8 5 1 6\n6 3 4 5 1 9 7 2 8\n8 9 2 1 2 5 6 7 4\n3 7 6 8 9 4 2 5 1\n5 4 1 7 3 6 8 9 3\n2 8 7 9 6 1 4 3 5\n4 1 5 2 8 3 9 6 7\n9 6 3 4 5 7 1 8 2\n1 2 4 9 3 6 7 8 5\n7 8 6 2 4 5 3 9 1\n3 9 5 1 7 8 2 4 6\n5 1 9 4 6 2 8 7 3\n4 6 7 8 9 3 5 1 2\n8 3 2 5 1 7 9 6 4\n9 7 3 6 5 4 1 2 8\n6 5 8 7 2 1 4 3 9\n2 4 1 3 8 9 6 5 7\n5 9 3 8 4 1 7 6 2\n2 1 8 7 6 3 4 9 5\n7 6 4 9 2 5 1 3 8\n4 3 6 5 9 2 8 1 7\n1 8 5 4 3 7 9 2 6\n9 2 7 1 8 6 5 4 3\n3 4 1 6 5 8 2 7 9\n6 5 9 2 7 4 3 8 1\n8 7 2 3 1 9 6 5 4\n7 1 4 5 8 9 2 3 6\n8 5 2 3 6 4 7 1 9\n3 6 9 1 7 2 8 5 4\n2 3 1 9 4 6 5 7 8\n6 8 5 7 3 2 9 4 1\n9 4 7 8 1 5 3 6 2\n1 7 8 6 9 3 4 2 5\n4 2 3 1 5 8 6 9 7\n5 9 6 4 2 7 1 8 3"}], "sourceSteps": [{"text": "result = 1", "types": "init", "occurrence": 1}, {"text": "if (c != i) and (pz[r][c] == pz[r][i]):", "types": "row-check", "occurrence": 1}, {"text": "result = 0", "types": "row-duplicate", "occurrence": 1}, {"text": "if (r!= i) and (pz[r][c] == pz[i][c]):", "types": "col-check", "occurrence": 1}, {"text": "result = 0", "types": "col-duplicate", "occurrence": 2}, {"text": "box = []", "types": "box-start", "occurrence": 1}, {"text": "if pz[r][c] not in box:", "types": "box-check", "occurrence": 1}, {"text": "box.append(pz[r][c])", "types": "box-add", "occurrence": 1}, {"text": "if len(box) != 9:", "types": "box-result", "occurrence": 1}, {"text": "result = 0", "types": "box-invalid", "occurrence": 3}, {"text": "print(f'#{tc} {result}')", "types": "output", "occurrence": 1}]});
  const samples = PROBLEM.samples;
  const defaultSample = samples.find(
    (sample) => sample.id === PROBLEM.defaultSampleId,
  );

  const els = Core.getByIds([
    "sourceCode", "boxValues", "mobileBoxValues",
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
    if (!text.trim() || tokens.some(token => !/^\d+$/.test(token))) throw new Error("T와 배열을 정수로 입력해주세요.");
    const values = tokens.map(Number), count = values[0];
    if (!Number.isInteger(count) || count < 1 || count > 10 || values.length !== 1 + count * 81) throw new Error("첫 숫자 T(1~10)와 각 테스트의 81개 숫자를 확인해주세요.");
    if (values.slice(1).some(value => value < 1 || value > 9)) throw new Error("스도쿠 숫자는 1 이상 9 이하입니다.");
    return { cases: Array.from({length: count}, (_, tc) => Array.from({length: 9}, (_, r) => values.slice(1 + tc * 81 + r * 9, 1 + tc * 81 + (r + 1) * 9))) };
  }

  function buildSteps() {
    const steps = [];
    let output = "";
    state.cases.forEach((board, index) => {
      let cr = null, cc = null, nr = null, nc = null, result = 1;
      let direction = "행", box = [], boxRow = null, boxCol = null, duplicate = false;
      const push = (phase, message) => steps.push({
        line: stepLineMap.get(phase), phase: phase.toUpperCase(), message,
        N: 9, tc: index + 1, board, cr, cc, nr, nc, num: result,
        direction, box: box.slice(), boxRow, boxCol, duplicate, output,
      });
      push("init", `#${index + 1}: result=1로 시작합니다. 중복을 발견하면 0으로 바꾸고 나머지 검사도 계속합니다.`);
      for (cr = 0; cr < 9; cr++) for (cc = 0; cc < 9; cc++) for (nc = 0; nc < 9; nc++) {
        nr = cr; duplicate = cc !== nc && board[cr][cc] === board[nr][nc];
        push("row-check", cc === nc ? "c == i이므로 자기 자신은 비교에서 제외합니다." : `행 ${cr}: ${board[cr][cc]}와 ${board[nr][nc]} 비교 → ${duplicate ? "중복" : "서로 다름"}`);
        if (duplicate) { result = 0; push("row-duplicate", "같은 행에 중복이 있어 result=0으로 설정합니다."); }
      }
      direction = "열";
      for (cc = 0; cc < 9; cc++) for (cr = 0; cr < 9; cr++) for (nr = 0; nr < 9; nr++) {
        nc = cc; duplicate = cr !== nr && board[cr][cc] === board[nr][nc];
        push("col-check", cr === nr ? "r == i이므로 자기 자신은 비교에서 제외합니다." : `열 ${cc}: ${board[cr][cc]}와 ${board[nr][nc]} 비교 → ${duplicate ? "중복" : "서로 다름"}`);
        if (duplicate) { result = 0; push("col-duplicate", "같은 열에 중복이 있어 result=0으로 설정합니다."); }
      }
      direction = "3×3"; nr = nc = null;
      for (boxRow of [0, 3, 6]) for (boxCol of [0, 3, 6]) {
        box = []; cr = boxRow; cc = boxCol; duplicate = false;
        push("box-start", `시작 좌표 (${boxRow}, ${boxCol})의 영역을 검사합니다. box를 비웁니다.`);
        for (cr = boxRow; cr < boxRow + 3; cr++) for (cc = boxCol; cc < boxCol + 3; cc++) {
          const value = board[cr][cc]; duplicate = box.includes(value);
          push("box-check", `${value}${duplicate ? "는 이미 box에 있어 추가하지 않습니다." : "는 box에 없어 추가합니다."}`);
          if (!duplicate) { box.push(value); push("box-add", `box에 ${value}를 추가했습니다. 서로 다른 숫자 ${box.length}개입니다.`); }
        }
        cr = cc = null; duplicate = false;
        push("box-result", `len(box)=${box.length}: ${box.length === 9 ? "1~9가 모두 한 번씩 있습니다." : "9개 미만이므로 중복이 있습니다."}`);
        if (box.length !== 9) { result = 0; push("box-invalid", "3×3 영역의 숫자가 중복되어 result=0으로 설정합니다."); }
      }
      boxRow = boxCol = null; direction = "완료";
      output += `#${index + 1} ${result}\n`;
      push("output", result ? "모든 행·열·3×3 영역이 조건을 만족하여 1을 출력합니다." : "중복이 발견되어 0을 출력합니다.");
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
        cell.classList.toggle("box-right", col === 2 || col === 5);
        cell.classList.toggle("box-bottom", row === 2 || row === 5);
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
        cell.classList.toggle("current", row === step.cr && col === step.cc);
        cell.classList.toggle("candidate", row === step.nr && col === step.nc);
        cell.classList.toggle("duplicate", step.duplicate && ((row === step.cr && col === step.cc) || (row === step.nr && col === step.nc)));
        cell.classList.toggle("region", step.direction === "행" ? row === step.cr : step.direction === "열" ? col === step.cc : step.boxRow !== null && step.boxCol !== null && row >= step.boxRow && row < step.boxRow + 3 && col >= step.boxCol && col < step.boxCol + 3);
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
    els.crValue.textContent = step.cr ?? "—";
    els.ccValue.textContent = step.cc ?? "—";
    els.nrValue.textContent = step.nr ?? "—";
    els.ncValue.textContent = step.nc ?? "—";
    els.numValue.textContent = step.num ?? "—";
    els.directionValue.textContent = step.direction;
    els.boxValues.textContent = `box = [${step.box.join(", ")}]`;
    els.explainText.textContent = step.message;
    els.outputView.textContent = step.output || "아직 출력이 없습니다.";
  }

  function renderMobile(step) {
    updateCodeHighlight(state.mobileCodeLines, step.line);
    updateBoard(state.mobileCells, step);
    els.mobileCoord.textContent = `#${step.tc} · r=${step.cr ?? "—"} · c=${step.cc ?? "—"}`;
    els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.mobilePhase.textContent = step.phase;
    els.mobileBoxValues.textContent = `box = [${step.box.join(", ")}]`;
    els.mobileExplanation.textContent = step.message;
    els.mobileStateMeta.textContent = `result ${step.num}`;
    els.mobileCr.textContent = step.cr ?? "—";
    els.mobileCc.textContent = step.cc ?? "—";
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


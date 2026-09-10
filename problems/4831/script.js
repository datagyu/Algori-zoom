(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({ platform: "SWEA", number: "4831", level: "D3", title: "전기버스", autoplayMs: 550, defaultSampleId: "one",
sourceSteps: [{"text": "charge = 0", "types": "init", "occurrence": 1}, {"text": "current = 0", "types": "ready", "occurrence": 1}, {"text": "while current + K < N:", "types": "while", "occurrence": 1}, {"text": "next_stop = current", "types": "candidate", "occurrence": 1}, {"text": "for stop in bus_stop:", "types": "scan", "occurrence": 1}, {"text": "if current < stop <= current + K:", "types": "check", "occurrence": 1}, {"text": "next_stop = stop", "types": "select", "occurrence": 1}, {"text": "if next_stop == current:", "types": "blocked", "occurrence": 1}, {"text": "charge = 0", "types": "fail", "occurrence": 2}, {"text": "break", "types": "break", "occurrence": 1}, {"text": "current = next_stop", "types": "move", "occurrence": 1}, {"text": "charge += 1", "types": "charge", "occurrence": 1}, {"text": "print(f'#{test_case} {charge}')", "types": "output", "occurrence": 1}],
samples: [{"id": "one", "label": "샘플 1 · 도착 가능", "value": "1\n3 10 5\n1 3 5 7 9"}, {"id": "two", "label": "샘플 2 · 도착 불가", "value": "1\n3 10 5\n1 3 7 8 9"}, {"id": "all", "label": "첨부 예제 전체", "value": "3\n3 10 5\n1 3 5 7 9\n3 10 5\n1 3 7 8 9\n5 20 5\n4 7 9 14 17"}] });
  const samples = PROBLEM.samples;
  const defaultSample = samples[0];
  const els = Core.getByIds(["sourceCode", "resetBtn", "prevBtn", "nextBtn", "playBtn", "replayBtn", "skipBtn", "speedRange", "speedLabel", "stepLabel", "timeline", "codeLineLabel", "codeViewport", "codeView", "boardLabel", "boardViewport", "board", "phaseLabel", "currentValue", "nextStopValue", "stopValue", "rangeValue", "chargeValue", "statusValue", "explainText", "outputView", "inputArea", "applyBtn", "sampleButtons", "inputError", "mobileCoord", "mobileCodeStatus", "mobileCodeViewport", "mobileCodeView", "mobilePhase", "mobileBoardViewport", "mobileBoard", "mobileExplanation", "mobileStateMeta", "mobileCurrent", "mobileNextStop", "mobileStop", "mobileCharge", "mobileStatus", "mobileOutputView", "mobilePrevBtn", "mobileTimeline", "mobileTimelineStatus", "mobileNextBtn"]);
  const state = { cases: [], steps: [], stepIndex: 0, timer: null, speed: 1, selectedSample: defaultSample.id, renderedCase: null, cells: [], mobileCells: [] };
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
    const tokens = text.trim().split(/\s+/);
    if (!text.trim() || tokens.some(t => !/^\d+$/.test(t))) throw new Error("입력은 양의 정수로 작성해주세요.");
    const values = tokens.map(Number);
    const T = values[0];
    if (T < 1 || T > 50) throw new Error("T는 1 이상 50 이하입니다.");
    let cursor = 1;
    const cases = [];
    for (let tc = 0; tc < T; tc++) {
      const [K, N, M] = values.slice(cursor, cursor + 3); cursor += 3;
      if (![K,N,M].every(v => Number.isInteger(v) && v >= 1 && v <= 100)) throw new Error("각 케이스의 K, N, M은 1 이상 100 이하입니다.");
      const stations = values.slice(cursor, cursor + M); cursor += M;
      if (stations.length !== M || stations.some((v,i) => v <= 0 || v >= N || (i > 0 && v <= stations[i-1]))) throw new Error("충전소 M개를 1~N-1 범위에서 중복 없이 오름차순으로 입력해주세요.");
      cases.push({ K, N, M, stations });
    }
    if (cursor !== values.length) throw new Error("T와 케이스 수, M과 충전소 수를 확인해주세요.");
    return { cases };
  }
  function buildSteps() {
    const steps = []; let output = "";
    state.cases.forEach((route, index) => {
      const { K, N, stations } = route;
      let current = 0, nextStop = null, stop = null, charge = 0, status = "이동 중";
      const push = (phase, message) => steps.push({ ...route, tc: index + 1, current, nextStop, stop, charge, status, phase, line: stepLineMap.get(phase), message, output });
      push("init", "충전 횟수를 0으로 초기화합니다. 출발지 충전은 횟수에 포함하지 않습니다.");
      push("ready", "0번 정류장에서 출발합니다.");
      while (true) {
        push("while", `${current} + ${K} < ${N} → ${current + K < N ? "참: 중간 충전이 필요합니다." : "거짓: 추가 충전 없이 종점에 도착할 수 있습니다."}`);
        if (current + K >= N) { status = "도착 가능"; break; }
        nextStop = current; stop = null;
        push("candidate", `next_stop을 현재 위치 ${current}로 초기화합니다.`);
        for (const station of stations) {
          stop = station;
          push("scan", `충전소 ${stop}번을 검사합니다.`);
          const reachable = current < stop && stop <= current + K;
          push("check", `${current} < ${stop} <= ${current + K} → ${reachable ? "참" : "거짓"}`);
          if (reachable) { nextStop = stop; push("select", `후보를 ${stop}번으로 갱신합니다. 오름차순이므로 마지막 후보가 가장 먼 충전소입니다.`); }
        }
        push("blocked", `next_stop == current → ${nextStop === current ? "참: 이동 가능한 충전소가 없습니다." : "거짓: 선택한 충전소로 이동합니다."}`);
        if (nextStop === current) {
          charge = 0; status = "도착 불가";
          push("fail", "종점에 도착할 수 없어 기존 충전 횟수와 관계없이 정답을 0으로 바꿉니다.");
          push("break", "break로 while문을 종료합니다."); break;
        }
        current = nextStop;
        push("move", `${current}번 충전소로 이동합니다.`);
        charge++;
        push("charge", `충전 횟수가 ${charge}회가 됩니다.`);
      }
      output += `#${index + 1} ${charge}\n`;
      push("output", `${status}: #${index + 1} ${charge}를 출력합니다.${status === "도착 가능" ? " current는 마지막 충전 위치를 유지합니다." : ""}`);
    });
    state.steps = steps;
  }
  function renderBoardInto(container, step) {
    container.style.gridTemplateColumns = `repeat(${Math.min(step.N + 1, 6)}, max-content)`;
    container.replaceChildren();
    return Array.from({length: step.N + 1}, (_, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerHTML = `<span>${i}</span><small>${i === 0 ? "출발" : i === step.N ? "종점" : step.stations.includes(i) ? "충전소" : "·"}</small>`;
      container.appendChild(cell); return cell;
    });
  }
  function updateBoard(cells, step) {
    cells.forEach((cell, i) => {
      cell.classList.toggle("station", step.stations.includes(i));
      cell.classList.toggle("reachable", i > step.current && i <= step.current + step.K);
      cell.classList.toggle("current", i === step.current);
      cell.classList.toggle("candidate", i === step.nextStop);
      cell.classList.toggle("scanning", i === step.stop && ["scan", "check", "select"].includes(step.phase));
    });
  }
  function highlight(lines, lineNumber) { lines.forEach((line, number) => line.classList.toggle("active", number === lineNumber)); }
  function renderDesktop(step) {
    highlight(state.codeLines, step.line); updateBoard(state.cells, step);
    els.codeLineLabel.textContent = `LINE ${step.line}`;
    els.boardLabel.textContent = `#${step.tc} · K=${step.K} · N=${step.N}`;
    els.phaseLabel.textContent = step.phase.toUpperCase();
    for (const [id,value] of Object.entries({ currentValue: step.current, nextStopValue: step.nextStop, stopValue: step.stop, rangeValue: step.current + step.K, chargeValue: step.charge, statusValue: step.status })) els[id].textContent = value ?? "—";
    els.explainText.textContent = step.message;
    els.outputView.textContent = step.output || "아직 출력이 없습니다.";
  }
  function renderMobile(step) {
    highlight(state.mobileCodeLines, step.line); updateBoard(state.mobileCells, step);
    els.mobileCoord.textContent = `#${step.tc} · K=${step.K} · N=${step.N}`;
    els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.mobilePhase.textContent = step.phase.toUpperCase();
    els.mobileExplanation.textContent = step.message;
    els.mobileStateMeta.textContent = `이동 범위 ≤ ${step.current + step.K}`;
    for (const [id,value] of Object.entries({ mobileCurrent: step.current, mobileNextStop: step.nextStop, mobileStop: step.stop, mobileCharge: step.charge, mobileStatus: step.status })) els[id].textContent = value ?? "—";
    els.mobileOutputView.textContent = step.output || "아직 출력이 없습니다.";
    els.mobileTimeline.value = state.stepIndex;
    els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.mobilePrevBtn.disabled = state.stepIndex === 0;
    els.mobileNextBtn.disabled = state.stepIndex === state.steps.length - 1;
  }
  function render({ follow = true } = {}) {
    const step = state.steps[state.stepIndex]; if (!step) return;
    if (state.renderedCase !== step.tc) {
      state.cells = renderBoardInto(els.board, step);
      state.mobileCells = renderBoardInto(els.mobileBoard, step);
      state.renderedCase = step.tc;
    }
    renderDesktop(step); renderMobile(step);
    els.timeline.value = state.stepIndex;
    els.stepLabel.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.prevBtn.disabled = state.stepIndex === 0;
    els.nextBtn.disabled = state.stepIndex === state.steps.length - 1;
    if (follow) {
      const scanning = ["scan", "check", "select"].includes(step.phase);
      const target = scanning ? step.stop : step.current;
      for (const [viewport, element] of [[els.codeViewport, state.codeLines.get(step.line)], [els.mobileCodeViewport, state.mobileCodeLines.get(step.line)]]) Core.centerInsideViewport(viewport, element, { horizontal: false });
      for (const [viewport, cells] of [[els.boardViewport, state.cells], [els.mobileBoardViewport, state.mobileCells]]) Core.centerInsideViewport(viewport, cells[target]);
    }
  }
  function stopPlayback() {
    if (state.timer) clearTimeout(state.timer);
    state.timer = null;
    els.playBtn.textContent = "▶ 자동 실행";
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
    els.playBtn.textContent = "⏸ 일시정지";
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

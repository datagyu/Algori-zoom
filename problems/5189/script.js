(() => {
  "use strict";
  const Core = window.AlgoriZoomCore;
  const SAMPLE_CASES = [
    "3\n0 18 34\n48 0 55\n18 7 0",
    "4\n0 83 65 97\n82 0 78 6\n19 19 0 82\n6 34 94 0",
    "5\n0 9 26 85 42\n14 0 84 31 27\n58 88 0 16 46\n83 61 94 0 17\n40 71 24 38 0"
  ];
  const PROBLEM = Object.freeze({
    platform: "SWEA", number: "5189", level: "D3", title: "전자카트",
    autoplayMs: 550, defaultSampleId: "one",
    maxFrames: 12000, maxCaseFrames: 2200,
    samples: SAMPLE_CASES.map((value, i) => ({
      id: ["one", "two", "three"][i], label: "샘플 " + (i + 1), value: "1\n" + value
    })).concat({id: "all", label: "전체 샘플", value: "3\n" + SAMPLE_CASES.join("\n")}),
    sourceSteps: [
      {text: "best = 99999999", types: "ready"},
      {text: "def search(current, visit, energy):", types: "enter"},
      {text: "if visit == N - 1:", types: "base"},
      {text: "for i in range(1, N):", types: "candidate"},
      {text: "if not visited[i]:", types: "check"},
      {text: "visited[i] = True", types: "mark"},
      {text: "search(i, visit + 1, energy + field[current][i])", types: "call"},
      {text: "visited[i] = False", types: "unmark"},
      {text: "if best > energy + field[current][0]:", types: "compare"},
      {text: "best = energy + field[current][0]", types: "improve"},
      {text: "return", types: "return"},
      {text: "print('#{} {}'.format(tc, best))", types: "output"}
    ]
  });
  const ids = [
    "sourceCode", "resetBtn", "prevBtn", "nextBtn", "playBtn", "replayBtn", "skipBtn",
    "speedRange", "speedLabel", "stepLabel", "timeline", "codeLineLabel", "codeViewport",
    "codeView", "boardLabel", "boardViewport", "board", "phaseLabel", "currentValue",
    "visitValue", "energyValue", "nextValue", "bestValue", "countValue", "explainText",
    "routeMeta", "routeView", "visitedView", "costView", "stackView", "bestRouteView",
    "outputView", "inputArea", "applyBtn", "sampleButtons", "inputError", "buildStatus",
    "mobileCoord", "mobileCodeStatus", "mobileCodeViewport", "mobileCodeView",
    "mobilePhase", "mobileBoardViewport", "mobileBoard", "mobileExplanation",
    "mobileStateMeta", "mobileCurrent", "mobileVisit", "mobileEnergy", "mobileBest",
    "mobileRouteView", "mobileVisitedView", "mobileCostView", "mobileBestRouteView",
    "mobileStackView", "mobileOutputView", "mobilePlayBtn", "mobilePrevBtn",
    "mobileTimeline", "mobileTimelineStatus", "mobileNextBtn"
  ];
  const els = Core.getByIds(ids);
  const state = {steps: [], stepIndex: 0, timer: null, speed: 1, selectedSample: null,
    buildId: 0, building: false};
  let desktopLines, mobileLines, stepLines;

  function parseInput(text) {
    const lines = text.trim().split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (!text.trim() || !/^\d+$/.test(lines[0])) throw new Error("첫 줄에 테스트케이스 수 T를 입력해주세요.");
    const T = Number(lines[0]);
    if (T < 1 || T > 50) throw new Error("T는 1 이상 50 이하입니다.");
    const cases = [];
    let cursor = 1;
    for (let tc = 1; tc <= T; tc++) {
      if (!/^\d+$/.test(lines[cursor] || "")) throw new Error("#" + tc + "의 N을 확인해주세요.");
      const N = Number(lines[cursor++]);
      if (N < 3 || N > 10) throw new Error("N은 3 이상 10 이하입니다.");
      const field = [];
      for (let r = 0; r < N; r++) {
        const tokens = (lines[cursor++] || "").split(/\s+/);
        if (tokens.length !== N || tokens.some(v => !/^\d+$/.test(v))) {
          throw new Error("#" + tc + "의 비용표 " + (r + 1) + "행에는 정수 " + N + "개가 필요합니다.");
        }
        const row = tokens.map(Number);
        if (row.some((value, c) => c === r ? value !== 0 : value < 1 || value > 100)) {
          throw new Error("비용표의 대각선은 0, 다른 칸은 1~100이어야 합니다.");
        }
        field.push(row);
      }
      cases.push({N, field});
    }
    if (cursor !== lines.length) throw new Error("T와 실제 입력한 테스트케이스 수를 확인해주세요. 남는 입력이 있습니다.");
    return cases;
  }

  // The DFS follows the displayed Python. Snapshots are bounded; computation is not.
  // Periodic yields keep large inputs cancellable and the browser responsive.
  function* explore(data, tc, output, budget) {
    const {N, field} = data;
    const visited = Array(N).fill(false), path = [0];
    let best = 99999999, bestPath = [], completed = 0, recorded = 0, omitted = false, calls = 0;
    const keep = () => {
      if (recorded < budget) return true;
      omitted = true;
      return false;
    };
    const snapshot = (phase, current, visit, energy, i, edge, closed, message) => {
      recorded++;
      return {data, tc, output, phase, current, visit, energy, i, edge, closed, message,
        visited: [...visited], path: [...path], best, bestPath: [...bestPath], completed};
    };
    function* search(current, visit, energy) {
      if (++calls % 32768 === 0) yield null;
      if (keep()) yield snapshot("enter", current, visit, energy, null, null, false,
        "search(" + current + ", " + visit + ", " + energy + ") 호출: " + (current + 1) + "번 장소에서 다음 방문을 정합니다.");
      if (keep()) yield snapshot("base", current, visit, energy, null, null, false,
        visit === N - 1 ? "모든 관리구역을 방문했습니다. 사무실 복귀 비용을 더합니다." : "아직 " + (N - 1 - visit) + "개 관리구역이 남았습니다.");
      if (visit === N - 1) {
        completed++;
        const total = energy + field[current][0];
        if (keep()) yield snapshot("compare", current, visit, energy, null, [current, 0], true,
          energy + " + 복귀 비용 " + field[current][0] + " = " + total + ". 현재 best " + best + "와 비교합니다.");
        if (total < best) {
          best = total;
          bestPath = [...path, 0];
          if (keep()) yield snapshot("improve", current, visit, energy, null, [current, 0], true,
            "더 작은 사용량을 찾았습니다. best를 " + best + "로 갱신합니다.");
        }
        if (keep()) yield snapshot("return", current, visit, energy, null, [current, 0], true,
          "경로 하나의 계산이 끝났습니다. 호출한 함수로 돌아갑니다.");
        return;
      }
      for (let i = 1; i < N; i++) {
        if (keep()) yield snapshot("candidate", current, visit, energy, i, [current, i], false,
          "다음 후보는 " + (i + 1) + "번 장소(인덱스 " + i + ")입니다.");
        if (keep()) yield snapshot("check", current, visit, energy, i, [current, i], false,
          visited[i] ? "visited[" + i + "]가 True이므로 이미 방문한 구역을 건너뜁니다." :
            "visited[" + i + "]가 False이므로 방문할 수 있습니다.");
        if (!visited[i]) {
          visited[i] = true;
          if (keep()) yield snapshot("mark", current, visit, energy, i, [current, i], false,
            "visited[" + i + "] = True. 이번 경로에서는 이 구역을 다시 고르지 않습니다.");
          if (keep()) yield snapshot("call", current, visit, energy, i, [current, i], false,
            "search(" + i + ", " + (visit + 1) + ", " + (energy + field[current][i]) +
            ")로 내려갑니다. 현재 호출의 visit과 energy는 그대로입니다.");
          path.push(i);
          yield* search(i, visit + 1, energy + field[current][i]);
          path.pop();
          visited[i] = false;
          if (keep()) yield snapshot("unmark", current, visit, energy, i, [current, i], false,
            "호출이 끝나 " + (current + 1) + "번으로 돌아왔습니다. visited[" + i +
            "] = False로 복구하고 다음 후보를 시도합니다. 복구는 실제 카트 이동이 아니므로 비용을 더하지 않습니다.");
        }
      }
    }
    yield snapshot("ready", 0, 0, 0, null, null, false,
      "사무실은 1번, 코드 인덱스는 0입니다. 후보는 인덱스 1~" + (N - 1) +
      "이며 visited[0]은 사용하지 않습니다. best를 99999999로 초기화합니다.");
    yield* search(0, 0, 0);
    if (omitted) yield snapshot("summary", 0, 0, 0, null, null, false,
      "이 케이스는 앞 " + budget + "단계를 자세히 표시했습니다. 이후 단계는 요약했으며, " +
      completed.toLocaleString("ko-KR") + "개 경로를 모두 계산한 최소 사용량은 " + best +
      "입니다. 가지치기로 경로를 생략한 것은 아닙니다.");
    output += "#" + tc + " " + best + "\n";
    yield snapshot("output", 0, 0, 0, null, null, false,
      completed.toLocaleString("ko-KR") + "개 경로의 비교가 끝났습니다. 최소 사용량 " + best + "를 출력합니다.");
    return output;
  }

  async function buildSteps(cases, buildId) {
    const steps = [];
    let output = "";
    const budget = Math.min(PROBLEM.maxCaseFrames, Math.floor(PROBLEM.maxFrames / cases.length));
    for (let index = 0; index < cases.length; index++) {
      els.buildStatus.textContent = "경로 계산 중 · #" + (index + 1) + " / " + cases.length;
      const iterator = explore(cases[index], index + 1, output, budget);
      let item;
      let sliceStart = performance.now();
      while (!(item = iterator.next()).done) {
        if (item.value) steps.push(item.value);
        if (item.value === null || performance.now() - sliceStart > 12) {
          await new Promise(resolve => setTimeout(resolve, 0));
          if (state.buildId !== buildId) return null;
          sliceStart = performance.now();
        }
      }
      output = item.value;
    }
    return steps;
  }

  const phaseNames = {ready: "준비", enter: "함수 호출", base: "종료 조건", candidate: "후보 선택",
    check: "방문 확인", mark: "방문 표시", call: "재귀 호출", unmark: "방문 복구",
    compare: "사용량 비교", improve: "최솟값 갱신", return: "호출 복귀", summary: "나머지 탐색 요약", output: "출력"};
  const matrixCache = new WeakMap();
  function renderMatrix(container, step) {
    let view = matrixCache.get(container);
    if (!view || view.data !== step.data) {
      const table = document.createElement("table");
      table.className = "cart-matrix";
      table.innerHTML = "<caption>장소 번호 기준 · 괄호 안은 코드 인덱스</caption>";
      const head = document.createElement("thead"), header = document.createElement("tr");
      header.innerHTML = "<th scope='col'>출발 ↓<br>도착 →</th>";
      for (let c = 0; c < step.data.N; c++) {
        const th = document.createElement("th"); th.scope = "col";
        th.textContent = (c + 1) + " (" + c + ")"; header.append(th);
      }
      head.append(header); table.append(head);
      const body = document.createElement("tbody"), rows = [], cells = [];
      for (let r = 0; r < step.data.N; r++) {
        const tr = document.createElement("tr"), th = document.createElement("th");
        th.scope = "row"; th.textContent = (r === 0 ? "사무실 1" : r + 1) + " (" + r + ")";
        tr.append(th); rows.push(th);
        for (let c = 0; c < step.data.N; c++) {
          const td = document.createElement("td"); td.textContent = step.data.field[r][c];
          td.title = (r + 1) + "번 → " + (c + 1) + "번: " + step.data.field[r][c];
          tr.append(td); cells.push(td);
        }
        body.append(tr);
      }
      table.append(body); container.replaceChildren(table);
      view = {data: step.data, rows, cells}; matrixCache.set(container, view);
    }
    view.rows.forEach((row, r) => row.classList.toggle("current-row", r === step.current));
    view.cells.forEach((cell, index) => {
      const r = Math.floor(index / step.data.N), c = index % step.data.N;
      const active = step.edge && step.edge[0] === r && step.edge[1] === c;
      cell.className = [r === c ? "diagonal" : "", active ? "active-edge" : "",
        active && step.closed ? "return-edge" : ""].filter(Boolean).join(" ");
    });
  }
  function renderRoute(step, route, flags, cost, bestRoute, stack) {
    const shownPath = step.closed ? [...step.path, 0] : step.path;
    route.innerHTML = shownPath.map((place, i) =>
      (i ? '<span class="cart-arrow" aria-hidden="true">→</span>' : "") +
      '<span class="cart-stop' + (place === 0 ? " office" : "") +
      (i === shownPath.length - 1 ? " current" : "") + '">' +
      (place === 0 ? "사무실 1" : place + 1) + "</span>").join("");
    flags.innerHTML = '<span class="cart-visited-label">visited</span>' + step.visited.map((value, i) =>
      '<span class="cart-flag' + (value ? " visited" : "") + '">' +
      i + ": " + (value ? "T" : "F") + (i === 0 ? " (제외)" : "") + "</span>").join("");
    const costs = shownPath.slice(1).map((place, i) => step.data.field[shownPath[i]][place]);
    cost.textContent = costs.length ? costs.join(" + ") + " = " +
      costs.reduce((a, b) => a + b, 0) + (step.closed ? " (사무실 복귀 포함)" : " (현재까지)") : "energy = 0 · 사무실에서 출발";
    bestRoute.textContent = step.bestPath.length ? "지금까지의 최적 경로: " +
      step.bestPath.map(v => v + 1).join(" → ") + " · " + step.best : "최적 경로: 아직 완성된 경로가 없습니다.";
    let energy = 0;
    stack.innerHTML = step.path.map((place, depth) => {
      if (depth) energy += step.data.field[step.path[depth - 1]][place];
      return '<div class="cart-frame"><small>깊이 ' + depth + "</small>search(" +
        place + ", " + depth + ", " + energy + ")</div>";
    }).join("");
  }
  function renderDesktop(step) {
    renderMatrix(els.board, step);
    renderRoute(step, els.routeView, els.visitedView, els.costView, els.bestRouteView, els.stackView);
    els.boardLabel.textContent = "#" + step.tc + " · N=" + step.data.N;
    els.phaseLabel.textContent = phaseNames[step.phase];
    els.currentValue.textContent = step.current;
    els.visitValue.textContent = step.visit;
    els.energyValue.textContent = step.energy;
    els.nextValue.textContent = step.i === null ? "—" : step.i;
    els.bestValue.textContent = step.best;
    els.countValue.textContent = step.completed.toLocaleString("ko-KR");
    els.explainText.textContent = step.message;
    els.routeMeta.textContent = "깊이 " + step.visit + " · 장소 번호로 표시";
    els.outputView.textContent = step.output || "아직 출력이 없습니다.";
  }
  function renderMobile(step) {
    renderMatrix(els.mobileBoard, step);
    renderRoute(step, els.mobileRouteView, els.mobileVisitedView, els.mobileCostView, els.mobileBestRouteView, els.mobileStackView);
    els.mobileCoord.textContent = "#" + step.tc + " · N=" + step.data.N;
    els.mobilePhase.textContent = phaseNames[step.phase];
    els.mobileStateMeta.textContent = "완성한 경로 " + step.completed.toLocaleString("ko-KR") + "개";
    els.mobileCurrent.textContent = step.current;
    els.mobileVisit.textContent = step.visit;
    els.mobileEnergy.textContent = step.energy;
    els.mobileBest.textContent = step.best;
    els.mobileExplanation.textContent = step.message;
    els.mobileOutputView.textContent = step.output || "아직 출력이 없습니다.";
  }
  function render() {
    const step = state.steps[state.stepIndex];
    if (!step) return;
    renderDesktop(step); renderMobile(step);
    const lineNumber = stepLines.get(step.phase);
    for (const [lines, viewport] of [[desktopLines, els.codeViewport], [mobileLines, els.mobileCodeViewport]]) {
      lines.forEach((line, n) => line.classList.toggle("active", n === lineNumber));
      if (viewport.getClientRects().length && lineNumber) Core.centerInsideViewport(viewport, lines.get(lineNumber), {horizontal: false});
    }
    els.codeLineLabel.textContent = els.mobileCodeStatus.textContent = lineNumber ? "LINE " + lineNumber : "탐색 요약";
    els.timeline.value = els.mobileTimeline.value = state.stepIndex;
    els.stepLabel.textContent = els.mobileTimelineStatus.textContent = (state.stepIndex + 1) + " / " + state.steps.length;
    syncControls();
  }
  function syncControls() {
    const blocked = state.building || !state.steps.length;
    for (const id of ["playBtn", "resetBtn", "replayBtn", "skipBtn", "mobilePlayBtn", "timeline", "mobileTimeline"]) els[id].disabled = blocked;
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = blocked || state.stepIndex === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = blocked || state.stepIndex === state.steps.length - 1;
  }
  function stopPlayback() {
    if (state.timer !== null) clearTimeout(state.timer);
    state.timer = null; Core.updatePlaybackControls(els.playBtn, false);
  }
  function goTo(index) {
    if (state.building || !state.steps.length) return;
    state.stepIndex = Core.clamp(index, 0, state.steps.length - 1); render();
  }
  function move(delta) { stopPlayback(); goTo(state.stepIndex + delta); }
  function scheduleNext() {
    state.timer = setTimeout(() => {
      goTo(state.stepIndex + 1);
      if (state.stepIndex === state.steps.length - 1) stopPlayback(); else scheduleNext();
    }, PROBLEM.autoplayMs / state.speed);
  }
  function startPlayback() {
    if (state.building || !state.steps.length) return;
    stopPlayback();
    if (state.stepIndex === state.steps.length - 1) goTo(0);
    Core.updatePlaybackControls(els.playBtn, true); scheduleNext();
  }
  function reset() { stopPlayback(); goTo(0); }
  function renderSampleButtons() {
    els.sampleButtons.replaceChildren();
    PROBLEM.samples.forEach(sample => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "btn";
      button.textContent = sample.label; button.dataset.sample = sample.id;
      button.classList.toggle("selected", state.selectedSample === sample.id);
      els.sampleButtons.append(button);
    });
  }
  async function applyText(text, sampleId = null) {
    stopPlayback();
    const buildId = ++state.buildId;
    state.building = false;
    try {
      const cases = parseInput(text);
      state.building = true; state.selectedSample = sampleId;
      els.inputError.textContent = ""; syncControls(); renderSampleButtons();
      const steps = await buildSteps(cases, buildId);
      if (!steps || state.buildId !== buildId) return;
      state.steps = steps; state.stepIndex = 0; state.building = false;
      els.timeline.max = els.mobileTimeline.max = steps.length - 1;
      els.buildStatus.textContent = steps.some(step => step.phase === "summary") ?
        "계산 완료 · 모든 경로를 계산했습니다. 긴 탐색의 뒷부분은 요약 단계로 표시합니다." : "";
      render();
    } catch (error) {
      if (state.buildId !== buildId) return;
      state.building = false; state.selectedSample = null; els.buildStatus.textContent = "";
      els.inputError.textContent = error.message; renderSampleButtons(); syncControls();
    }
  }

  const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps, {wrap: false, editor: true});
  els.codeView.innerHTML = els.mobileCodeView.innerHTML = markup;
  desktopLines = Core.createLineMap(els.codeView);
  mobileLines = Core.createLineMap(els.mobileCodeView);
  stepLines = Core.createStepLineMap(els.codeView);

  els.prevBtn.addEventListener("click", () => move(-1));
  els.nextBtn.addEventListener("click", () => move(1));
  els.mobilePrevBtn.addEventListener("click", () => move(-1));
  els.mobileNextBtn.addEventListener("click", () => move(1));
  els.mobilePlayBtn.addEventListener("click", () => els.playBtn.click());
  els.playBtn.addEventListener("click", () => state.timer === null ? startPlayback() : stopPlayback());
  els.resetBtn.addEventListener("click", reset);
  els.replayBtn.addEventListener("click", () => { reset(); startPlayback(); });
  els.skipBtn.addEventListener("click", () => { stopPlayback(); goTo(state.steps.length - 1); });
  els.speedRange.addEventListener("input", () => {
    state.speed = Number(els.speedRange.value);
    els.speedLabel.textContent = Core.formatDecimal(state.speed) + "×";
    if (state.timer !== null) { clearTimeout(state.timer); scheduleNext(); }
  });
  [els.timeline, els.mobileTimeline].forEach(timeline => timeline.addEventListener("input", () => {
    stopPlayback(); goTo(Number(timeline.value));
  }));
  els.inputArea.addEventListener("input", () => { state.selectedSample = null; renderSampleButtons(); });
  els.applyBtn.addEventListener("click", () => applyText(els.inputArea.value));
  els.sampleButtons.addEventListener("click", event => {
    const button = event.target.closest("button[data-sample]");
    if (!button) return;
    const sample = PROBLEM.samples.find(item => item.id === button.dataset.sample);
    if (!sample) return;
    els.inputArea.value = sample.value; applyText(sample.value, sample.id);
  });
  const defaultSample = PROBLEM.samples.find(sample => sample.id === PROBLEM.defaultSampleId);
  els.inputArea.value = defaultSample.value;
  applyText(defaultSample.value, defaultSample.id);
})();

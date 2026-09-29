(() => {
  "use strict";
  const Core = window.AlgoriZoomCore;
  const INITIAL = 9999999;
  const SAMPLE_CASES = [
    "3\n1 2 3\n2 3 4\n3 4 5",
    "4\n2 4 1 3\n1 1 7 1\n9 1 7 10\n5 7 2 4",
    "5\n6 7 1 10 2\n10 2 7 5 9\n9 3 2 9 6\n1 6 8 2 9\n8 3 8 2 1"
  ];
  const PROBLEM = Object.freeze({
    platform: "SWEA", number: "5188", level: "D3", title: "최소합",
    autoplayMs: 550, defaultSampleId: "one", maxFrames: 12000, maxCaseFrames: 2200,
    samples: SAMPLE_CASES.map((value, i) => ({
      id: ["one", "two", "three"][i], label: "샘플 " + (i + 1), value: "1\n" + value
    })).concat({id: "all", label: "전체 샘플", value: "3\n" + SAMPLE_CASES.join("\n")}),
    sourceSteps: [
      {text: "best = [[9999999]*N for _ in range(N)]", types: "ready"},
      {text: "dfs(0, 0, board[0][0])", types: "start"},
      {text: "def dfs(r, c, distance):", types: "enter"},
      {text: "if distance >= ans:", types: "checkAns"},
      {text: "return", occurrence: 1, types: "pruneAns"},
      {text: "if distance >= best[r][c]:", types: "checkBest"},
      {text: "return", occurrence: 2, types: "pruneBest"},
      {text: "best[r][c] = distance", types: "remember"},
      {text: "if r == N-1 and c == N-1:", types: "base"},
      {text: "ans = min(ans, distance)", types: "improve"},
      {text: "return", occurrence: 3, types: "finish"},
      {text: "for dr, dc in direction:", types: "candidate"},
      {text: "nr, nc = r + dr, c + dc", types: "neighbor"},
      {text: "if 0 <= nr < N and 0 <= nc < N:", types: "bounds"},
      {text: "dfs(nr, nc, distance + board[nr][nc])", types: "call"},
      {text: "print('#{} {}'.format(tc, ans))", types: "output"}
    ]
  });
  const ids = [
    "sourceCode", "resetBtn", "prevBtn", "nextBtn", "playBtn", "replayBtn", "skipBtn",
    "speedRange", "speedLabel", "stepLabel", "timeline", "codeLineLabel", "codeViewport",
    "codeView", "boardLabel", "boardViewport", "board", "phaseLabel", "currentValue",
    "visitValue", "energyValue", "nextValue", "bestValue", "countValue", "explainText",
    "routeMeta", "routeView", "costView", "stackView", "bestRouteView", "pruneStats",
    "outputView", "inputArea", "applyBtn", "sampleButtons", "inputError", "buildStatus",
    "mobileCoord", "mobileCodeStatus", "mobileCodeViewport", "mobileCodeView",
    "mobilePhase", "mobileBoardViewport", "mobileBoard", "mobileExplanation",
    "mobileStateMeta", "mobileCurrent", "mobileVisit", "mobileEnergy", "mobileBest",
    "mobileRouteView", "mobileCostView", "mobileBestRouteView", "mobileStackView",
    "mobileOutputView", "mobilePlayBtn", "mobilePrevBtn", "mobileTimeline",
    "mobileTimelineStatus", "mobileNextBtn"
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
      if (N < 3 || N > 13) throw new Error("N은 3 이상 13 이하입니다.");
      const board = [];
      for (let r = 0; r < N; r++) {
        const tokens = (lines[cursor++] || "").split(/\s+/);
        if (tokens.length !== N || tokens.some(v => !/^\d+$/.test(v))) {
          throw new Error("#" + tc + "의 격자 " + (r + 1) + "행에는 정수 " + N + "개가 필요합니다.");
        }
        const row = tokens.map(Number);
        if (row.some(value => value < 1 || value > 10)) throw new Error("각 칸의 값은 1 이상 10 이하입니다.");
        board.push(row);
      }
      cases.push({N, board});
    }
    if (cursor !== lines.length) throw new Error("T와 실제 입력한 테스트케이스 수를 확인해주세요. 남는 입력이 있습니다.");
    return cases;
  }

  // Run the user's DFS, including the exact order of both pruning conditions.
  // Only animation frames are capped. Every recursive call still runs.
  function* explore(data, tc, output, budget) {
    const {N, board} = data;
    let best = Array.from({length: N}, () => Array(N).fill(INITIAL));
    let ans = INITIAL, bestPath = [], calls = 0, prunedAns = 0, prunedBest = 0, completed = 0;
    let recorded = 0, omitted = false;
    const path = [];
    const keep = () => {
      if (recorded < budget) return true;
      omitted = true;
      return false;
    };
    const snapshot = (phase, r, c, distance, next, message) => {
      recorded++;
      return {data, tc, output, phase, r, c, distance, next, message, ans, best,
        path: path.map(cell => [...cell]), bestPath, calls, prunedAns, prunedBest, completed};
    };
    function* dfs(r, c, distance) {
      path.push([r, c]);
      calls++;
      if (calls % 256 === 0) yield null;
      if (keep()) yield snapshot("enter", r, c, distance, null,
        "dfs(" + r + ", " + c + ", " + distance + ") 호출. distance에는 현재 칸의 값까지 포함되어 있습니다.");
      if (keep()) yield snapshot("checkAns", r, c, distance, null,
        "distance " + distance + " >= ans " + ans + " → " + (distance >= ans ? "참. 완성된 답보다 작아질 수 없습니다." : "거짓. 같은 칸까지의 기록도 확인합니다."));
      if (distance >= ans) {
        prunedAns++;
        if (keep()) yield snapshot("pruneAns", r, c, distance, null,
          "ans 가지치기: " + distance + " >= " + ans + ". 남은 칸은 모두 양수라 합이 줄어들지 않습니다. best도 갱신하지 않고 return합니다.");
        path.pop();
        return;
      }
      if (keep()) yield snapshot("checkBest", r, c, distance, null,
        "distance " + distance + " >= best[" + r + "][" + c + "] " + best[r][c] + " → " +
        (distance >= best[r][c] ? "참. 같은 칸에 더 좋은 합 또는 같은 합으로 도착한 적이 있습니다." : "거짓. 이 칸의 기록을 갱신합니다."));
      if (distance >= best[r][c]) {
        prunedBest++;
        if (keep()) yield snapshot("pruneBest", r, c, distance, null,
          "best 가지치기: " + distance + " >= " + best[r][c] + ". 이 칸에 같거나 더 작은 합으로 온 기록이 있습니다. 이후 선택지는 같으므로 return합니다.");
        path.pop();
        return;
      }
      const previous = best[r][c];
      // Copy only the updated row so saved steps retain their historical values.
      best = best.slice();
      best[r] = best[r].slice();
      best[r][c] = distance;
      if (keep()) yield snapshot("remember", r, c, distance, null,
        "best[" + r + "][" + c + "]: " + previous + " → " + distance + ". 이 기록은 재귀에서 돌아와도 지우지 않습니다.");
      if (keep()) yield snapshot("base", r, c, distance, null,
        r === N - 1 && c === N - 1 ? "오른쪽 아래 도착점입니다. 완성한 경로의 합으로 ans를 갱신합니다." : "아직 도착점이 아닙니다. 아래, 오른쪽 순서로 이동을 시도합니다.");
      if (r === N - 1 && c === N - 1) {
        completed++;
        const oldAns = ans;
        ans = Math.min(ans, distance);
        bestPath = path.map(cell => [...cell]);
        if (keep()) yield snapshot("improve", r, c, distance, null,
          "ans: " + oldAns + " → " + ans + ". 시작 칸과 도착 칸을 포함한 더 작은 합을 찾았습니다.");
        if (keep()) yield snapshot("finish", r, c, distance, null,
          "이 경로의 탐색이 끝났습니다. return으로 이전 호출로 돌아갑니다.");
        path.pop();
        return;
      }
      for (const [dr, dc] of [[1, 0], [0, 1]]) {
        if (keep()) yield snapshot("candidate", r, c, distance, null,
          "(dr, dc) = (" + dr + ", " + dc + "). " + (dr ? "아래" : "오른쪽") + " 방향을 선택합니다.");
        const nr = r + dr, nc = c + dc;
        const next = [nr, nc], inside = nr < N && nc < N;
        if (keep()) yield snapshot("neighbor", r, c, distance, next,
          "다음 좌표는 (" + nr + ", " + nc + ")입니다. 아직 이동하지 않았습니다.");
        if (keep()) yield snapshot("bounds", r, c, distance, next,
          inside ? "다음 칸이 격자 안에 있습니다. 그 칸의 값을 더해 재귀를 호출합니다." : "다음 좌표가 격자 밖입니다. 재귀 호출 없이 건너뜁니다.");
        if (inside) {
          if (keep()) yield snapshot("call", r, c, distance, next,
            "dfs(" + nr + ", " + nc + ", " + distance + " + " + board[nr][nc] + ") 호출. 현재 호출의 distance는 " + distance + "로 유지됩니다.");
          yield* dfs(nr, nc, distance + board[nr][nc]);
          if (keep()) yield snapshot("resume", r, c, distance, next,
            "(" + r + ", " + c + ")의 호출로 돌아왔습니다. distance는 " + distance + "이며, 갱신된 best와 ans는 유지됩니다. 반복문을 이어갑니다.");
        }
      }
      path.pop();
    }
    yield snapshot("ready", null, null, null, null,
      "ans와 모든 best를 9999999로 초기화합니다. best는 그 칸까지의 기록이고, ans는 도착점까지 완성한 경로의 기록입니다.");
    if (keep()) yield snapshot("start", 0, 0, board[0][0], null,
      "시작 칸의 값 " + board[0][0] + "을 포함해 dfs(0, 0, board[0][0])를 호출합니다.");
    yield* dfs(0, 0, board[0][0]);
    if (omitted) yield snapshot("summary", null, null, null, null,
      "앞 " + budget + "단계 이후의 애니메이션을 요약했습니다. DFS 계산은 끝까지 수행했습니다. 호출 " + calls + "회, ans 가지치기 " + prunedAns + "회, best 가지치기 " + prunedBest + "회. 최소 합은 " + ans + "입니다.");
    output += "#" + tc + " " + ans + "\n";
    yield snapshot("output", null, null, null, null,
      "탐색 완료. 최소 합 " + ans + "를 출력합니다. 격자의 초록색 경로는 ans를 만든 경로입니다.");
    return output;
  }

  async function buildSteps(cases, buildId) {
    const steps = [];
    let output = "";
    const budget = Math.min(PROBLEM.maxCaseFrames, Math.floor(PROBLEM.maxFrames / cases.length));
    for (let index = 0; index < cases.length; index++) {
      els.buildStatus.textContent = "경로 계산 중 · #" + (index + 1) + " / " + cases.length;
      const iterator = explore(cases[index], index + 1, output, budget);
      let item, sliceStart = performance.now();
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

  const phaseNames = {ready: "준비", start: "탐색 시작", enter: "함수 호출", checkAns: "ans 비교",
    pruneAns: "ans 가지치기", checkBest: "best 비교", pruneBest: "best 가지치기", remember: "도착 기록 갱신",
    base: "도착점 확인", improve: "정답 갱신", finish: "호출 종료", candidate: "방향 선택",
    neighbor: "다음 좌표", bounds: "범위 확인", call: "재귀 호출", resume: "호출 복귀", summary: "탐색 요약", output: "출력"};
  const coord = (r, c) => r === null ? "—" : "(" + r + ", " + c + ")";
  const matrixCache = new WeakMap();
  function renderMatrix(container, step) {
    let view = matrixCache.get(container);
    if (!view || view.data !== step.data) {
      const table = document.createElement("table");
      table.className = "sum-matrix";
      table.innerHTML = "<caption>board 값 / best 기록 · —는 초기값 9999999</caption>";
      const head = document.createElement("thead"), header = document.createElement("tr");
      header.innerHTML = "<th scope='col'>r ↓ c →</th>";
      for (let c = 0; c < step.data.N; c++) {
        const th = document.createElement("th"); th.scope = "col"; th.textContent = c; header.append(th);
      }
      head.append(header); table.append(head);
      const body = document.createElement("tbody"), cells = [];
      for (let r = 0; r < step.data.N; r++) {
        const tr = document.createElement("tr"), th = document.createElement("th");
        th.scope = "row"; th.textContent = r; tr.append(th);
        for (let c = 0; c < step.data.N; c++) {
          const td = document.createElement("td");
          const value = document.createElement("strong"), record = document.createElement("small");
          value.textContent = step.data.board[r][c]; td.append(value, record); tr.append(td);
          cells.push({td, record, r, c});
        }
        body.append(tr);
      }
      table.append(body); container.replaceChildren(table);
      view = {data: step.data, cells}; matrixCache.set(container, view);
    }
    const final = step.phase === "output" || step.phase === "summary";
    const shownPath = final ? step.bestPath : step.path;
    const pathSet = new Set(shownPath.map(([r, c]) => r + "," + c));
    view.cells.forEach(({td, record, r, c}) => {
      const current = step.r === r && step.c === c;
      td.className = [pathSet.has(r + "," + c) ? (final ? "optimal" : "path") : "",
        current ? "current" : "", current && step.phase === "pruneAns" ? "prune-ans" : "",
        current && step.phase === "pruneBest" ? "prune-best" : "",
        step.next && step.next[0] === r && step.next[1] === c ? "candidate" : ""].filter(Boolean).join(" ");
      const mark = r === 0 && c === 0 ? " · 시작" : r === step.data.N - 1 && c === step.data.N - 1 ? " · 도착" : "";
      record.textContent = "best " + (step.best[r][c] === INITIAL ? "—" : step.best[r][c]);
      td.title = coord(r, c) + mark + " · board=" + step.data.board[r][c] + " · best=" + step.best[r][c];
      td.setAttribute("aria-label", td.title);
    });
  }
  function renderRoute(step, route, cost, bestRoute, stack) {
    route.innerHTML = step.path.map(([r, c], i) =>
      (i ? '<span class="sum-arrow" aria-hidden="true">→</span>' : "") +
      '<span class="sum-stop' + (i === step.path.length - 1 ? " current" : "") + '">' + coord(r, c) + "</span>").join("");
    if (!step.path.length) route.textContent = step.phase === "ready" ? "아직 호출하지 않았습니다." : "현재 실행 중인 DFS 호출이 없습니다.";
    const costs = step.path.map(([r, c]) => step.data.board[r][c]);
    cost.textContent = costs.length ? costs.join(" + ") + " = " + step.distance + " · 시작 칸 포함" : "";
    bestRoute.textContent = step.bestPath.length ? "ans를 만든 경로: " +
      step.bestPath.map(([r, c]) => coord(r, c)).join(" → ") + " · 합 " + step.ans : "ans: 아직 완성한 경로가 없습니다.";
    let distance = 0;
    stack.innerHTML = step.path.map(([r, c], depth) => {
      distance += step.data.board[r][c];
      return '<div class="sum-frame"><small>깊이 ' + depth + "</small>dfs(" + r + ", " + c + ", " + distance + ")</div>";
    }).join("");
  }
  function renderDesktop(step) {
    renderMatrix(els.board, step);
    renderRoute(step, els.routeView, els.costView, els.bestRouteView, els.stackView);
    els.boardLabel.textContent = "#" + step.tc + " · N=" + step.data.N;
    els.phaseLabel.textContent = phaseNames[step.phase];
    els.currentValue.textContent = coord(step.r, step.c);
    els.visitValue.textContent = step.path.length ? step.path.length - 1 : "—";
    els.energyValue.textContent = step.distance ?? "—";
    els.nextValue.textContent = step.next ? coord(...step.next) : "—";
    els.bestValue.textContent = step.ans;
    els.countValue.textContent = step.r === null ? "—" : step.best[step.r][step.c];
    els.explainText.textContent = step.message;
    els.explainText.dataset.phase = step.phase;
    els.pruneStats.textContent = "호출 " + step.calls + "회 · ans 가지치기 " + step.prunedAns + "회 · best 가지치기 " + step.prunedBest + "회";
    els.routeMeta.textContent = "진행 중인 호출 " + step.path.length + "개";
    els.outputView.textContent = step.output || "아직 출력이 없습니다.";
  }
  function renderMobile(step) {
    renderMatrix(els.mobileBoard, step);
    renderRoute(step, els.mobileRouteView, els.mobileCostView, els.mobileBestRouteView, els.mobileStackView);
    els.mobileCoord.textContent = "#" + step.tc + " · N=" + step.data.N;
    els.mobilePhase.textContent = phaseNames[step.phase];
    els.mobileStateMeta.textContent = "호출 " + step.calls + "회";
    els.mobileCurrent.textContent = coord(step.r, step.c);
    els.mobileVisit.textContent = step.path.length ? step.path.length - 1 : "—";
    els.mobileEnergy.textContent = step.distance ?? "—";
    els.mobileBest.textContent = step.ans;
    els.mobileExplanation.textContent = step.message;
    els.mobileExplanation.dataset.phase = step.phase;
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
    els.codeLineLabel.textContent = els.mobileCodeStatus.textContent = lineNumber ? "LINE " + lineNumber : phaseNames[step.phase];
    els.timeline.value = els.mobileTimeline.value = state.stepIndex;
    els.stepLabel.textContent = els.mobileTimelineStatus.textContent = (state.stepIndex + 1) + " / " + state.steps.length;
    syncControls();
  }
  function syncControls() {
    const blocked = state.building || !state.steps.length;
    for (const id of ["playBtn", "resetBtn", "replayBtn", "skipBtn", "mobilePlayBtn", "timeline", "mobileTimeline"]) els[id].disabled = blocked;
    document.querySelectorAll('[data-jump]').forEach(button => {
      button.disabled = blocked || !state.steps.some((step, i) => i > state.stepIndex && step.phase === button.dataset.jump);
    });
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
        "계산 완료 · 두 가지 가지치기를 적용한 DFS를 끝까지 실행했습니다. 긴 탐색의 뒷부분은 요약 단계로 표시합니다." : "";
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
  document.getElementById("chapterNav").addEventListener("click", event => {
    const button = event.target.closest("button[data-jump]");
    if (!button) return;
    const index = state.steps.findIndex((step, i) => i > state.stepIndex && step.phase === button.dataset.jump);
    if (index >= 0) { stopPlayback(); goTo(index); }
  });
  matchMedia("(max-width: 760px)").addEventListener("change", () => requestAnimationFrame(render));
  const defaultSample = PROBLEM.samples.find(sample => sample.id === PROBLEM.defaultSampleId);
  els.inputArea.value = defaultSample.value;
  applyText(defaultSample.value, defaultSample.id);
})();

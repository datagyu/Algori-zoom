(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    platform: "SWEA",
    number: "5201",
    level: "D3",
    title: "컨테이너 운반",
    autoplayMs: 620,
    defaultSampleId: "all",
    samples: [
      { id: "one", label: "샘플 1", value: "1\n3 2\n1 5 3\n8 3" },
      { id: "two", label: "샘플 2", value: "1\n5 10\n2 12 13 11 18\n17 4 7 20 3 9 7 9 20 5" },
      { id: "three", label: "샘플 3", value: "1\n10 12\n10 13 14 6 19 11 5 20 11 14\n5 18 17 8 9 17 18 4 1 16 15 13" },
      { id: "all", label: "전체 샘플", value: "3\n3 2\n1 5 3\n8 3\n5 10\n2 12 13 11 18\n17 4 7 20 3 9 7 9 20 5\n10 12\n10 13 14 6 19 11 5 20 11 14\n5 18 17 8 9 17 18 4 1 16 15 13" },
    ],
    sourceSteps: [
      { text: "box.sort(reverse=True)", types: "sortBox" },
      { text: "truck.sort(reverse=True)", types: "sortTruck" },
      { text: "weight = 0", types: "init" },
      { text: "while truck:", types: "while" },
      { text: "if not box:", types: "emptyCheck" },
      { text: "break", types: "emptyBreak", occurrence: 1 },
      { text: "c_truck = truck.pop(0)", types: "takeTruck" },
      { text: "for i in range(len(box)):", types: "scan" },
      { text: "if c_truck >= box[i]:", types: "compare" },
      { text: "weight += box.pop(i)", types: "load" },
      { text: "break", types: "matchedBreak", occurrence: 2 },
      { text: "print('#{} {}'.format(tc, weight))", types: "output" },
    ],
  });

  const els = Core.getByIds([
    "sourceCode", "codeView", "mobileCodeView", "codeViewport", "mobileCodeViewport",
    "resetBtn", "prevBtn", "nextBtn", "playBtn", "replayBtn", "skipBtn", "speedRange", "speedLabel",
    "timeline", "mobileTimeline", "stepLabel", "mobileTimelineStatus", "mobilePlayBtn", "mobilePrevBtn", "mobileNextBtn",
    "codeLineLabel", "mobileCodeStatus", "board", "mobileBoard", "boardLabel", "phaseLabel", "mobilePhase",
    "truckValue", "indexValue", "boxValue", "weightValue", "truckCountValue", "boxCountValue", "explainText",
    "mobileCoord", "mobileExplanation", "mobileStateMeta", "mobileTruck", "mobileBox", "mobileWeight", "mobileRemaining",
    "matchView", "mobileMatchView", "matchMeta", "outputView", "mobileOutputView",
    "inputArea", "applyBtn", "sampleButtons", "inputError"
  ]);

  const state = { steps: [], stepIndex: 0, timer: null, speed: 1, selectedSample: PROBLEM.defaultSampleId };
  let desktopLines, mobileLines, stepLines;

  function parseInput(text) {
    const tokens = text.trim().split(/\s+/).filter(Boolean).map(Number);
    if (!tokens.length || tokens.some(Number.isNaN)) throw new Error("숫자로 된 입력을 확인해주세요.");
    let cursor = 0;
    const T = tokens[cursor++];
    if (!Number.isInteger(T) || T < 1 || T > 50) throw new Error("T는 1~50 사이의 정수여야 합니다.");
    const cases = [];
    for (let tc = 0; tc < T; tc++) {
      if (cursor + 1 >= tokens.length) throw new Error(`#${tc + 1}의 N, M이 부족합니다.`);
      const N = tokens[cursor++], M = tokens[cursor++];
      if (!Number.isInteger(N) || !Number.isInteger(M) || N < 1 || N > 100 || M < 1 || M > 100) throw new Error("N과 M은 1~100 사이의 정수여야 합니다.");
      if (cursor + N + M > tokens.length) throw new Error(`#${tc + 1}의 컨테이너 또는 트럭 값이 부족합니다.`);
      const box = tokens.slice(cursor, cursor + N); cursor += N;
      const truck = tokens.slice(cursor, cursor + M); cursor += M;
      if ([...box, ...truck].some(v => !Number.isInteger(v) || v < 1 || v > 50)) throw new Error("컨테이너 무게와 트럭 적재용량은 1~50 사이여야 합니다.");
      cases.push({ N, M, box, truck });
    }
    if (cursor !== tokens.length) throw new Error("입력 끝에 사용되지 않은 값이 있습니다.");
    return cases;
  }

  function buildSteps(cases) {
    const steps = [];
    let output = "";
    const push = (data) => steps.push({ ...data, boxes: [...data.boxes], trucks: [...data.trucks], matches: data.matches.map(v => ({...v})), output });

    cases.forEach((item, caseIndex) => {
      let boxes = [...item.box];
      let trucks = [...item.truck];
      let weight = 0;
      let cTruck = null;
      let i = null;
      let currentBox = null;
      const matches = [];
      const base = (phase, message, extra = {}) => push({ tc: caseIndex + 1, N: item.N, M: item.M, boxes, trucks, weight, cTruck, i, currentBox, matches, phase, message, ...extra });

      boxes.sort((a, b) => b - a);
      base("sortBox", `컨테이너를 무거운 순서로 정렬합니다: ${boxes.join(", ")}`);
      trucks.sort((a, b) => b - a);
      base("sortTruck", `트럭도 적재용량이 큰 순서로 정렬합니다: ${trucks.join(", ")}`);
      base("init", "운반한 화물의 총 중량 weight를 0으로 시작합니다.");

      while (trucks.length) {
        cTruck = null; i = null; currentBox = null;
        base("while", `남은 트럭이 ${trucks.length}대이므로 반복을 계속합니다.`);
        base("emptyCheck", boxes.length ? `남은 컨테이너가 ${boxes.length}개 있으므로 다음 트럭을 사용합니다.` : "남은 컨테이너가 없으므로 더 운반할 수 없습니다.");
        if (!boxes.length) {
          base("emptyBreak", "컨테이너가 모두 운반되었으므로 while문을 종료합니다.");
          break;
        }

        cTruck = trucks.shift();
        base("takeTruck", `가장 적재용량이 큰 남은 트럭 ${cTruck}을 꺼냅니다.`);
        let loaded = false;
        for (i = 0; i < boxes.length; i++) {
          currentBox = boxes[i];
          base("scan", `정렬된 컨테이너에서 ${i}번 위치의 무게 ${currentBox}을 확인합니다.`);
          const fits = cTruck >= currentBox;
          base("compare", `${cTruck} ≥ ${currentBox} → ${fits ? "참. 이 트럭이 실을 수 있는 가장 무거운 컨테이너입니다." : "거짓. 다음으로 가벼운 컨테이너를 확인합니다."}`, { compareResult: fits });
          if (fits) {
            const picked = boxes.splice(i, 1)[0];
            weight += picked;
            matches.push({ truck: cTruck, box: picked });
            currentBox = picked;
            base("load", `컨테이너 ${picked}을 트럭 ${cTruck}에 싣고 weight에 더합니다. weight = ${weight}`, { selectedBox: picked });
            base("matchedBreak", "한 트럭에는 컨테이너 하나만 실을 수 있으므로 for문을 종료하고 다음 트럭으로 넘어갑니다.", { selectedBox: picked });
            loaded = true;
            break;
          }
        }
        if (!loaded) {
          currentBox = null; i = null;
        }
      }

      cTruck = null; i = null; currentBox = null;
      output += `#${caseIndex + 1} ${weight}\n`;
      base("output", `#${caseIndex + 1}의 최대 운반 중량 ${weight}을 출력합니다.`);
    });
    return steps;
  }

  const phaseNames = {
    sortBox: "컨테이너 정렬", sortTruck: "트럭 정렬", init: "초기화", while: "트럭 확인", emptyCheck: "박스 확인",
    emptyBreak: "반복 종료", takeTruck: "트럭 선택", scan: "박스 탐색", compare: "적재 비교", load: "운반 성공", matchedBreak: "다음 트럭", output: "출력"
  };

  function renderBoardInto(container, step) {
    const truckItems = step.trucks.map((value, index) => `<span class="transport-item"><strong>${value}</strong><small>남은 ${index + 1}</small></span>`).join("");
    const activeTruck = step.cTruck === null ? "" : `<span class="transport-item current"><strong>${step.cTruck}</strong><small>현재 트럭</small></span>`;
    const boxItems = step.boxes.map((value, index) => {
      const candidate = step.i === index && ["scan", "compare"].includes(step.phase);
      const rejected = candidate && step.phase === "compare" && step.compareResult === false;
      return `<span class="transport-item${candidate ? " candidate" : ""}${rejected ? " rejected" : ""}"><strong>${value}</strong><small>box[${index}]</small></span>`;
    }).join("");
    const selected = step.selectedBox !== undefined && ["load", "matchedBreak"].includes(step.phase)
      ? `<span class="transport-item selected"><strong>${step.selectedBox}</strong><small>방금 선택</small></span>` : "";
    container.innerHTML = `
      <div class="transport-group"><p class="transport-title"><span>트럭 · 내림차순</span><span>${step.trucks.length}대 남음</span></p><div class="transport-items">${activeTruck}${truckItems || '<span class="match-empty">남은 트럭 없음</span>'}</div></div>
      <div class="transport-group"><p class="transport-title"><span>컨테이너 · 내림차순</span><span>${step.boxes.length}개 남음</span></p><div class="transport-items">${selected}${boxItems || '<span class="match-empty">남은 컨테이너 없음</span>'}</div></div>
      <p class="transport-legend">흰 테두리: 현재 트럭 · 파랑: 확인 중인 컨테이너 · 빨강: 적재 불가 · 초록: 방금 운반한 컨테이너</p>`;
  }

  function renderMatches(container, step) {
    if (!step.matches.length) {
      container.innerHTML = '<span class="match-empty">아직 운반한 컨테이너가 없습니다.</span>';
      return;
    }
    container.innerHTML = step.matches.map((match, index) => `<span class="match-chip">${index + 1}번째 <strong>${match.truck}</strong> 트럭 ← ${match.box} 컨테이너</span>`).join("");
  }

  function highlight(lines, number) {
    lines.forEach((line, n) => line.classList.toggle("active", n === number));
  }

  function renderDesktop(step) {
    const lineNumber = stepLines.get(step.phase);
    highlight(desktopLines, lineNumber);
    renderBoardInto(els.board, step);
    renderMatches(els.matchView, step);
    els.codeLineLabel.textContent = lineNumber ? `LINE ${lineNumber}` : phaseNames[step.phase];
    els.boardLabel.textContent = `#${step.tc} · N=${step.N}, M=${step.M}`;
    els.phaseLabel.textContent = phaseNames[step.phase];
    els.truckValue.textContent = step.cTruck ?? "—";
    els.indexValue.textContent = step.i ?? "—";
    els.boxValue.textContent = step.currentBox ?? "—";
    els.weightValue.textContent = step.weight;
    els.truckCountValue.textContent = step.trucks.length;
    els.boxCountValue.textContent = step.boxes.length;
    els.explainText.textContent = step.message;
    els.matchMeta.textContent = `운반 성공 ${step.matches.length}회 · 누적 ${step.weight}`;
    els.outputView.textContent = step.output || "아직 출력이 없습니다.";
  }

  function renderMobile(step) {
    const lineNumber = stepLines.get(step.phase);
    highlight(mobileLines, lineNumber);
    renderBoardInto(els.mobileBoard, step);
    renderMatches(els.mobileMatchView, step);
    els.mobileCoord.textContent = `#${step.tc} · weight = ${step.weight}`;
    els.mobileCodeStatus.textContent = lineNumber ? `LINE ${lineNumber}` : phaseNames[step.phase];
    els.mobilePhase.textContent = phaseNames[step.phase];
    els.mobileExplanation.textContent = step.message;
    els.mobileStateMeta.textContent = `운반 성공 ${step.matches.length}회`;
    els.mobileTruck.textContent = step.cTruck ?? "—";
    els.mobileBox.textContent = step.currentBox ?? "—";
    els.mobileWeight.textContent = step.weight;
    els.mobileRemaining.textContent = step.boxes.length;
    els.mobileOutputView.textContent = step.output || "아직 출력이 없습니다.";
  }

  function syncControls() {
    const empty = !state.steps.length;
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = empty || state.stepIndex === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = empty || state.stepIndex === state.steps.length - 1;
    for (const element of [els.playBtn, els.replayBtn, els.resetBtn, els.skipBtn, els.timeline, els.mobileTimeline, els.mobilePlayBtn]) element.disabled = empty;
  }

  function render({ follow = true } = {}) {
    const step = state.steps[state.stepIndex];
    if (!step) return;
    renderDesktop(step); renderMobile(step);
    els.timeline.value = els.mobileTimeline.value = state.stepIndex;
    els.stepLabel.textContent = els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    syncControls();
    if (follow) {
      const lineNumber = stepLines.get(step.phase);
      if (lineNumber) {
        Core.centerInsideViewport(els.codeViewport, desktopLines.get(lineNumber), { horizontal: false });
        Core.centerInsideViewport(els.mobileCodeViewport, mobileLines.get(lineNumber), { horizontal: false });
      }
    }
  }

  function stopPlayback() {
    if (state.timer !== null) clearTimeout(state.timer);
    state.timer = null;
    Core.updatePlaybackControls(els.playBtn, false);
  }
  function goTo(index, options = {}) { if (!state.steps.length) return; state.stepIndex = Core.clamp(index, 0, state.steps.length - 1); render(options); }
  function move(delta) { stopPlayback(); goTo(state.stepIndex + delta); }
  function scheduleNext() {
    state.timer = setTimeout(() => {
      if (state.stepIndex >= state.steps.length - 1) { stopPlayback(); return; }
      goTo(state.stepIndex + 1);
      if (state.stepIndex >= state.steps.length - 1) stopPlayback(); else scheduleNext();
    }, PROBLEM.autoplayMs / state.speed);
  }
  function startPlayback() {
    if (!state.steps.length) return;
    stopPlayback();
    if (state.stepIndex >= state.steps.length - 1) goTo(0);
    Core.updatePlaybackControls(els.playBtn, true);
    scheduleNext();
  }
  function reset() { stopPlayback(); goTo(0); }
  function skipToEnd() { stopPlayback(); goTo(state.steps.length - 1); }

  function renderSampleButtons() {
    els.sampleButtons.replaceChildren();
    PROBLEM.samples.forEach(sample => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "btn"; button.textContent = sample.label; button.dataset.sample = sample.id;
      button.classList.toggle("selected", state.selectedSample === sample.id);
      els.sampleButtons.append(button);
    });
  }

  function applyText(text, sampleId = null) {
    stopPlayback();
    try {
      const cases = parseInput(text);
      state.steps = buildSteps(cases); state.stepIndex = 0; state.selectedSample = sampleId;
      els.inputError.textContent = "";
      els.timeline.max = els.mobileTimeline.max = Math.max(0, state.steps.length - 1);
      renderSampleButtons(); render();
    } catch (error) {
      state.selectedSample = null; els.inputError.textContent = error.message; renderSampleButtons();
    }
  }

  const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps, { wrap: false, editor: true });
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
  els.skipBtn.addEventListener("click", skipToEnd);
  els.speedRange.addEventListener("input", () => {
    state.speed = Number(els.speedRange.value); els.speedLabel.textContent = `${Core.formatDecimal(state.speed)}×`;
    if (state.timer !== null) { clearTimeout(state.timer); scheduleNext(); }
  });
  [els.timeline, els.mobileTimeline].forEach(timeline => timeline.addEventListener("input", event => { stopPlayback(); goTo(Number(event.target.value)); }));
  els.applyBtn.addEventListener("click", () => applyText(els.inputArea.value));
  els.inputArea.addEventListener("input", () => { state.selectedSample = null; renderSampleButtons(); });
  els.sampleButtons.addEventListener("click", event => {
    const button = event.target.closest("button[data-sample]"); if (!button) return;
    const sample = PROBLEM.samples.find(item => item.id === button.dataset.sample); if (!sample) return;
    els.inputArea.value = sample.value; applyText(sample.value, sample.id);
  });

  const defaultSample = PROBLEM.samples.find(sample => sample.id === PROBLEM.defaultSampleId);
  renderSampleButtons(); els.inputArea.value = defaultSample.value; applyText(defaultSample.value, defaultSample.id);
})();

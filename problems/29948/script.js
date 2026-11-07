(() => {
  "use strict";

  const Core = window.AlgoriZoomCore;
  const sampleTargets = [1, 10, 10000];
  const PROBLEM = Object.freeze({
    platform: "SWEA",
    number: "29948",
    title: "자연수의 합",
    autoplayMs: 450,
    maxCases: 20,
    maxTarget: 1000000,
    defaultSampleId: "2",
    samples: [
      ...sampleTargets.map((target, index) => ({
        id: String(index + 1),
        label: `샘플 ${index + 1}`,
        value: `1\n${target}`,
      })),
      { id: "all", label: "전체 샘플", value: [sampleTargets.length, ...sampleTargets].join("\n") },
    ],
    sourceSteps: [
      { text: "M = int(input())", types: "input" },
      { text: "total = 0", types: "initTotal" },
      { text: "ans = 0", types: "initAnswer" },
      { text: "while total < M:", types: "check" },
      { text: "ans += 1", types: "increment" },
      { text: "total += ans", types: "add" },
      { text: "print(f'#{tc} {ans}')", types: "output" },
    ],
  });

  const els = Core.getByIds([...document.querySelectorAll("[id]")].map(element => element.id));
  let steps = [];
  let cursor = 0;
  let timer = null;

  function parseInput(raw) {
    const lines = raw.trim().split(/\r?\n/).map(line => line.trim());
    const count = Number(lines[0]);
    if (!/^\d+$/.test(lines[0]) || count < 1 || count > PROBLEM.maxCases) {
      throw new Error(`첫 줄에 테스트케이스 수 T(1~${PROBLEM.maxCases})를 입력해 주세요.`);
    }
    if (lines.length !== count + 1) {
      throw new Error("테스트케이스 수만큼 한 줄에 자연수 M을 하나씩 입력해 주세요.");
    }
    return lines.slice(1).map((line, index) => {
      const target = Number(line);
      if (!/^\d+$/.test(line) || target < 1 || target > PROBLEM.maxTarget) {
        throw new Error(`#${index + 1}의 M은 1~${PROBLEM.maxTarget.toLocaleString("ko-KR")} 사이의 자연수여야 합니다.`);
      }
      return target;
    });
  }

  function buildSteps(targets) {
    const result = [];
    let output = "";

    for (const [index, target] of targets.entries()) {
      const tc = index + 1;
      let total = null;
      let answer = null;
      const push = phase => result.push({ tc, target, total, answer, phase, output });

      push("input");
      total = 0;
      push("initTotal");
      answer = 0;
      push("initAnswer");

      while (total < target) {
        push("check");
        answer += 1;
        push("increment");
        total += answer;
        push("add");
      }
      push("check");
      output += `#${tc} ${answer}\n`;
      push("output");
    }

    return result;
  }

  function describe(step) {
    const { target, total, answer, phase } = step;
    switch (phase) {
      case "input": return ["입력", `목표값 M = ${target}을 읽습니다.`];
      case "initTotal": return ["초기화", "누적합 total을 0으로 초기화합니다."];
      case "initAnswer": return ["초기화", "ans를 0으로 초기화합니다. 다음에 더할 자연수는 1입니다."];
      case "check":
        return total < target
          ? ["조건 확인", `${total} < ${target}이므로 반복을 계속합니다.`]
          : ["조건 확인", `${total} ≥ ${target}이므로 반복을 종료합니다.`];
      case "increment": return ["ans 증가", `다음에 더할 자연수 ans를 ${answer}로 늘립니다.`];
      case "add": return ["누적합 갱신", `이전 누적합 ${total - answer}에 ${answer}를 더해 ${total}이 됩니다.`];
      case "output": return ["완료", `${answer}를 더하기 전의 누적합은 ${total - answer}입니다. ${answer}를 더했을 때 처음으로 M 이상이 되므로 ${answer}를 출력합니다.`];
    }
  }

  function renderBoard({ target, total, answer, phase }) {
    if (total === null) {
      els.board.textContent = els.mobileBoard.textContent = "누적합을 초기화할 차례입니다.";
      return;
    }

    const count = phase === "increment" ? answer - 1 : answer ?? 0;
    const terms = count <= 5
      ? Array.from({ length: count }, (_, index) => index + 1)
      : [1, 2, "…", count - 1, count];
    const sum = terms.length ? `${terms.join(" + ")} = ${total}` : "0";
    const reached = total >= target;
    els.board.innerHTML = els.mobileBoard.innerHTML = `
      <div class="sum-calculation">
        <span>현재 누적합</span>
        <strong>${sum}</strong>
      </div>
      <div class="sum-calculation ${reached ? "sum-reached" : ""}">
        <span>${reached ? "목표 도달" : "목표까지 남은 값"}</span>
        <strong>${reached ? `${total} ≥ ${target}` : `${target} − ${total} = ${target - total}`}</strong>
      </div>`;
  }

  const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps, { wrap: false });
  els.codeView.innerHTML = els.mobileCodeView.innerHTML = markup;
  const desktopLines = Core.createLineMap(els.codeView);
  const mobileLines = Core.createLineMap(els.mobileCodeView);
  const stepLines = Core.createStepLineMap(els.codeView);
  let activeLine = null;

  function render() {
    const step = steps[cursor];
    const line = stepLines.get(step.phase);
    for (const [lines, viewport] of [[desktopLines, els.codeViewport], [mobileLines, els.mobileCodeViewport]]) {
      lines.get(activeLine)?.classList.remove("active");
      const current = lines.get(line);
      current.classList.add("active");
      Core.centerInsideViewport(viewport, current, { horizontal: false });
    }
    activeLine = line;

    const [phase, message] = describe(step);
    renderBoard(step);
    for (const [desktop, mobile, value] of [
      ["targetValue", "mobileTarget", step.target],
      ["answerValue", "mobileAnswer", step.answer ?? "—"],
      ["totalValue", "mobileTotal", step.total ?? "—"],
      ["codeLineLabel", "mobileCodeStatus", `LINE ${line}`],
      ["boardLabel", "mobileCoord", `#${step.tc} · M = ${step.target}`],
      ["phaseLabel", "mobilePhase", phase],
      ["explainText", "mobileExplanation", message],
      ["outputView", "mobileOutputView", step.output || "아직 출력이 없습니다."],
      ["stepLabel", "mobileTimelineStatus", `${cursor + 1} / ${steps.length}`],
    ]) {
      els[desktop].textContent = els[mobile].textContent = value;
    }
    for (const timeline of [els.timeline, els.mobileTimeline]) {
      timeline.max = steps.length - 1;
      timeline.value = cursor;
    }
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = cursor === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = cursor === steps.length - 1;
    if (els.nextBtn.disabled) stopPlayback();
  }

  function goTo(index) {
    cursor = Core.clamp(index, 0, steps.length - 1);
    render();
  }

  function stopPlayback() {
    clearTimeout(timer);
    timer = null;
    Core.updatePlaybackControls(els.playBtn, false);
  }

  function schedule() {
    timer = setTimeout(() => {
      goTo(cursor + 1);
      if (cursor < steps.length - 1) schedule();
    }, PROBLEM.autoplayMs / Number(els.speedRange.value));
  }

  function startPlayback(index = cursor === steps.length - 1 ? 0 : cursor) {
    stopPlayback();
    if (index !== cursor) goTo(index);
    Core.updatePlaybackControls(els.playBtn, true);
    schedule();
  }

  function seek(index) {
    stopPlayback();
    goTo(index);
  }

  const sampleButtons = PROBLEM.samples.map(sample => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn";
    button.textContent = sample.label;
    button.addEventListener("click", () => {
      els.inputArea.value = sample.value;
      applyInput(sample.id);
    });
    return button;
  });
  els.sampleButtons.append(...sampleButtons);

  function selectSample(id) {
    sampleButtons.forEach((button, index) => {
      button.classList.toggle("selected", PROBLEM.samples[index].id === id);
    });
  }

  function applyInput(sampleId = null) {
    stopPlayback();
    let targets;
    try {
      targets = parseInput(els.inputArea.value);
    } catch (error) {
      els.inputError.textContent = error.message;
      return;
    }
    steps = buildSteps(targets);
    els.inputError.textContent = "";
    selectSample(sampleId);
    goTo(0);
  }

  for (const [button, delta] of [[els.prevBtn, -1], [els.mobilePrevBtn, -1], [els.nextBtn, 1], [els.mobileNextBtn, 1]]) {
    button.addEventListener("click", () => seek(cursor + delta));
  }
  els.resetBtn.addEventListener("click", () => seek(0));
  els.replayBtn.addEventListener("click", () => startPlayback(0));
  els.skipBtn.addEventListener("click", () => seek(steps.length - 1));
  els.playBtn.addEventListener("click", () => timer === null ? startPlayback() : stopPlayback());
  els.mobilePlayBtn.addEventListener("click", () => els.playBtn.click());
  els.speedRange.addEventListener("input", () => {
    els.speedLabel.textContent = `${Core.formatDecimal(els.speedRange.value)}×`;
    if (timer !== null) {
      clearTimeout(timer);
      schedule();
    }
  });
  for (const timeline of [els.timeline, els.mobileTimeline]) {
    timeline.addEventListener("input", () => seek(Number(timeline.value)));
  }
  els.applyBtn.addEventListener("click", () => applyInput());
  els.inputArea.addEventListener("input", () => selectSample(null));

  const defaultSample = PROBLEM.samples.find(sample => sample.id === PROBLEM.defaultSampleId);
  els.inputArea.value = defaultSample.value;
  applyInput(defaultSample.id);
})();

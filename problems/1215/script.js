(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({"platform": "SWEA", "number": "1215", "level": "D3", "title": "회문1", "autoplayMs": 550, "defaultSampleId": "one", "samples": [{"id": "one", "label": "첨부 예제 1", "value": "4\nCBBCBAAB\nCCCBABCB\nCAAAACAB\nBACCCCAC\nAABCBBAC\nACAACABC\nBCCBAABC\nABBBCCAA"}, {"id": "edge", "label": "길이 1 · 모든 칸", "value": "1\nABCABCAB\nABCABCAB\nABCABCAB\nABCABCAB\nABCABCAB\nABCABCAB\nABCABCAB\nABCABCAB"}, {"id": "all", "label": "첨부 예제 전체", "value": "4\nCBBCBAAB\nCCCBABCB\nCAAAACAB\nBACCCCAC\nAABCBBAC\nACAACABC\nBCCBAABC\nABBBCCAA\n4\nBCBBCACA\nBCAAACAC\nABACBCCB\nAACBCBCA\nACACBAAA\nACCACCCB\nAACAAABA\nCACCABCB\n3\nBABBBACB\nABCAACCB\nCCACBCBA\nCACACBCA\nCCABACCB\nCCBAAAAA\nBBACBACA\nCBCCBABC\n4\nACBBCCCA\nCCBCBACB\nACBCABAA\nBABCCAAA\nACCCCCBB\nAABBCCBC\nCCABBACA\nCAACBCCC\n7\nAAACACAB\nCCABCCCC\nCABCAAAA\nBBBCBBBA\nABCCACCC\nABACBCBB\nCBABACAB\nBBBBBABB\n3\nABCBCBCA\nABCBCCCB\nABACCCCA\nBBABBBAC\nBBACBCCC\nAAACACCA\nBABCCCBC\nACCBCBCA\n7\nCACBCCBA\nCBCCBCCA\nCCBCBCAB\nBBCCABAA\nCACCBCCC\nBCCACCBB\nCBCCCBBC\nCBACBCBC\n5\nBCBABCBA\nCBBABABC\nBCACBAAA\nBBABACAB\nBCBCCBAC\nCBBCBBBB\nCBBAACAB\nACCBCBCC\n3\nBBBBCCAA\nBCBBCACC\nBBCAAAAB\nABABBABB\nBACAAABA\nABACCBCA\nACCAABCB\nBACCACBA\n5\nBCCCACCB\nCABCACAB\nBAACCCAC\nBBABBABC\nCCABABCA\nCABABACC\nCBACACAB\nCBCCCBAB"}], "sourceSteps": [{"text": "result = 0", "types": "init", "occurrence": 1}, {"text": "for i in range(8):", "types": "outerH", "occurrence": 1}, {"text": "for j in range(8-N+1):", "types": "startH", "occurrence": 1}, {"text": "word = []", "types": "clearH", "occurrence": 1}, {"text": "for k in range(N):", "types": "loopH", "occurrence": 1}, {"text": "word.append(arr[i][j+k])", "types": "appendH", "occurrence": 1}, {"text": "if word == word[::-1]:", "types": "checkH", "occurrence": 1}, {"text": "result += 1", "types": "countH", "occurrence": 1}, {"text": "for j in range(8):", "types": "outerV", "occurrence": 1}, {"text": "for i in range(8-N+1):", "types": "startV", "occurrence": 1}, {"text": "word = []", "types": "clearV", "occurrence": 2}, {"text": "for k in range(N):", "types": "loopV", "occurrence": 2}, {"text": "word.append(arr[i+k][j])", "types": "appendV", "occurrence": 1}, {"text": "if word == word[::-1]:", "types": "checkV", "occurrence": 2}, {"text": "result += 1", "types": "countV", "occurrence": 2}, {"text": "print(f'#{tc} {result}')", "types": "output", "occurrence": 1}]});
  const samples = PROBLEM.samples;
  const defaultSample = samples.find(s => s.id === PROBLEM.defaultSampleId);
  const els = Core.getByIds(["sourceCode", "resetBtn", "prevBtn", "nextBtn", "playBtn", "replayBtn", "skipBtn", "speedRange", "speedLabel", "stepLabel", "timeline", "codeLineLabel", "codeViewport", "codeView", "boardLabel", "boardViewport", "board", "phaseLabel", "rowValue", "colValue", "kValue", "lengthValue", "resultValue", "statusValue", "explainText", "outputView", "inputArea", "applyBtn", "sampleButtons", "inputError", "mobileCoord", "mobileCodeStatus", "mobileCodeViewport", "mobileCodeView", "mobilePhase", "mobileBoardViewport", "mobileBoard", "mobileExplanation", "mobileStateMeta", "mobileRow", "mobileCol", "mobileK", "mobileResult", "mobileStatus", "mobileOutputView", "mobilePrevBtn", "mobileTimeline", "mobileTimelineStatus", "mobileNextBtn"]);
  const state = { cases: [], steps: [], stepIndex: 0, timer: null, speed: 1, selectedSample: defaultSample.id };
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
    const lines = text.trim().split(/\r?\n/).map(s => s.trim());
    if (!text.trim() || lines.length % 9 || lines.length > 90) throw new Error('N과 8줄의 글자판을 한 묶음으로, 1~10개 케이스를 입력해주세요. T는 없습니다.');
    const cases = [];
    for (let pos = 0; pos < lines.length; pos += 9) {
      if (!/^[1-8]$/.test(lines[pos])) throw new Error(`${pos / 9 + 1}번 케이스: N은 1~8입니다.`);
      const arr = lines.slice(pos + 1, pos + 9);
      if (arr.some(row => !/^[ABC]{8}$/.test(row))) throw new Error(`${pos / 9 + 1}번 케이스: 각 행에 A, B, C로 이루어진 글자 8개를 입력해주세요.`);
      cases.push({N: Number(lines[pos]), arr});
    }
    return {cases};
  }
  function buildSteps() {
    const steps = []; let output = '';
    state.cases.forEach(({N, arr}, index) => {
      let i = null, j = null, k = null, word = '', result = 0, direction = '가로', matched = null, collecting = false;
      const push = (phase, message) => steps.push({N, arr, tc: index + 1, i, j, k, word, result, direction, matched, collecting, phase, line: stepLineMap.get(phase), message, output});
      push('init', '회문 개수를 0으로 초기화합니다. 가로 탐색을 마친 뒤 세로 탐색을 이어갑니다.');
      for (const vertical of [false, true]) {
        const suffix = vertical ? 'V' : 'H'; direction = vertical ? '세로' : '가로';
        for (let outer = 0; outer < 8; outer++) {
          i = vertical ? null : outer; j = vertical ? outer : null; k = null; word = ''; matched = null; collecting = false;
          push('outer' + suffix, `${direction} 탐색: ${vertical ? '열 j' : '행 i'} = ${outer}를 선택합니다.`);
          for (let start = 0; start <= 8 - N; start++) {
            i = vertical ? start : outer; j = vertical ? outer : start; k = null; matched = null; collecting = false;
            push('start' + suffix, `시작 위치 (${i}, ${j}). 시작 인덱스는 0~${8 - N}까지입니다.`);
            word = ''; collecting = true; push('clear' + suffix, 'word를 비우고 이번 후보의 글자를 모읍니다.');
            for (k = 0; k < N; k++) {
              push('loop' + suffix, `k = ${k}: ${vertical ? `arr[${i + k}][${j}]` : `arr[${i}][${j + k}]`}를 읽습니다.`);
              word += vertical ? arr[i + k][j] : arr[i][j + k];
              push('append' + suffix, `${word.at(-1)}를 word에 추가합니다. 현재 word: ${word}`);
            }
            k = N - 1;
            matched = word === [...word].reverse().join('');
            push('check' + suffix, `${word} == ${[...word].reverse().join('')} → ${matched ? '참: 회문입니다.' : '거짓: 회문이 아닙니다.'}`);
            if (matched) {result++; push('count' + suffix, `회문을 찾았습니다. result를 ${result}로 증가시킵니다.`);}
          }
        }
      }
      output += `#${index + 1} ${result}\n`;
      push('output', `가로와 세로 탐색을 모두 마쳤습니다. #${index + 1} ${result}를 출력합니다.`);
    });
    state.steps = steps;
  }
  function renderBoardInto(container, step) {
    const {i,j,N,k,arr,direction,matched} = step;
    const cells = arr.flatMap((row,r) => [...row].map((char,c) => {
      const candidate = i !== null && j !== null && (direction === '가로' ? r === i && c >= j && c < j + N : c === j && r >= i && r < i + N);
      const current = candidate && /^(loop|append)/.test(step.phase) && (direction === '가로' ? c === j + k : r === i + k);
      return `<span class="pal-cell${candidate ? ' candidate' : ''}${current ? ' current' : ''}${candidate && matched === true ? ' match' : ''}${candidate && matched === false ? ' mismatch' : ''}" aria-label="${r}행 ${c}열 ${char}">${char}</span>`;
    })).join('');
    container.innerHTML = `<div class="pal-grid">${cells}</div><p class="pal-legend">인덱스는 0부터 · 파랑: 후보 · 흰 테두리: 읽는 칸 · 초록: 회문 · 주황 테두리: 불일치</p><div class="pal-word">word: ${step.word || '[]'}${!step.collecting && step.word ? ' (이전 후보)' : ''}<br>word[::-1]: ${step.collecting ? [...step.word].reverse().join('') || '[]' : '—'}</div>`;
  }
  function highlight(lines, number) { lines.forEach((line,n) => line.classList.toggle('active', n === number)); }
  function renderDesktop(step) {
    highlight(state.codeLines, step.line); renderBoardInto(els.board, step);
    els.codeLineLabel.textContent = `LINE ${step.line}`;
    els.boardLabel.textContent = `#${step.tc} · N=${step.N} · ${step.direction}`;
    els.phaseLabel.textContent = step.phase === 'output' ? '완료' : step.direction;
    for (const [id,value] of Object.entries({rowValue: step.i, colValue: step.j, kValue: step.k, lengthValue: step.N, resultValue: step.result, statusValue: step.phase === 'output' ? '완료' : step.direction})) els[id].textContent = value ?? '—';
    els.explainText.textContent = step.message; els.outputView.textContent = step.output || '아직 출력이 없습니다.';
  }
  function renderMobile(step) {
    highlight(state.mobileCodeLines, step.line); renderBoardInto(els.mobileBoard, step);
    els.mobileCoord.textContent = `#${step.tc} · N=${step.N}`;
    els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.mobilePhase.textContent = step.direction; els.mobileExplanation.textContent = step.message;
    els.mobileStateMeta.textContent = step.matched === null ? '글자 모으기' : step.matched ? '회문 일치' : '불일치';
    for (const [id,value] of Object.entries({mobileRow: step.i, mobileCol: step.j, mobileK: step.k, mobileResult: step.result, mobileStatus: step.phase === 'output' ? '완료' : step.direction})) els[id].textContent = value ?? '—';
    els.mobileOutputView.textContent = step.output || '아직 출력이 없습니다.';
    els.mobileTimeline.value = state.stepIndex; els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.mobilePrevBtn.disabled = state.stepIndex === 0; els.mobileNextBtn.disabled = state.stepIndex === state.steps.length - 1;
  }
  function render({follow = true} = {}) {
    const step = state.steps[state.stepIndex]; if (!step) return;
    renderDesktop(step); renderMobile(step);
    els.timeline.value = state.stepIndex; els.stepLabel.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.prevBtn.disabled = state.stepIndex === 0; els.nextBtn.disabled = state.stepIndex === state.steps.length - 1;
    if (follow) for (const [viewport,lines] of [[els.codeViewport,state.codeLines],[els.mobileCodeViewport,state.mobileCodeLines]]) Core.centerInsideViewport(viewport, lines.get(step.line), {horizontal:false});
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


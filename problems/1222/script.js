(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({"platform": "SWEA", "number": "1222", "level": "D4", "title": "계산기1", "autoplayMs": 550, "defaultSampleId": "one", "samples": [{"id": "one", "label": "샘플 1 · 변환과 계산", "value": "9\n3+4+5+6+7"}, {"id": "zero", "label": "샘플 2 · 0 포함", "value": "5\n0+9+0"}, {"id": "all", "label": "첨부 예제 전체", "value": "101\n9+8+5+9+2+4+1+8+3+9+3+8+7+8+6+8+9+4+1+1+7+6+1+5+8+7+6+9+6+3+1+3+1+7+5+9+2+8+4+3+7+3+4+7+3+4+8+3+2+6+6\n83\n7+4+8+3+4+8+5+5+3+6+7+1+2+5+6+5+5+6+1+6+7+8+6+4+7+4+3+1+6+1+2+1+6+8+6+9+2+7+4+3+2+3\n119\n9+4+7+9+1+3+5+4+7+4+1+3+3+4+9+9+6+2+7+7+3+4+4+7+2+7+9+7+9+9+4+5+9+2+9+8+4+8+8+2+4+6+8+7+5+3+7+7+6+9+8+3+3+4+6+8+3+8+7+9\n61\n3+7+9+5+6+4+9+3+4+2+1+3+6+5+3+6+5+7+1+7+7+4+5+2+1+9+2+4+3+7+9\n67\n9+3+8+7+2+6+1+1+3+8+2+9+3+9+1+9+3+5+3+2+1+6+2+4+3+5+6+1+2+7+7+5+4+2\n83\n6+1+4+4+7+6+3+9+6+9+2+5+7+7+8+8+9+6+2+3+3+9+7+2+5+1+3+7+9+4+7+3+2+9+3+3+8+1+4+4+3+4\n63\n4+5+3+3+1+2+9+9+3+9+9+7+5+6+1+1+7+1+8+8+2+9+8+8+8+7+7+5+9+3+4+9\n89\n6+1+2+1+6+8+6+8+8+9+5+7+2+1+3+4+8+5+2+2+5+5+4+8+5+3+4+5+9+5+9+2+9+4+7+2+6+8+9+6+3+2+1+2+4\n69\n6+3+3+1+8+2+4+2+5+5+4+9+2+2+1+3+5+9+3+6+4+7+1+9+1+9+3+4+2+7+2+6+9+6+5\n65\n4+3+6+8+9+5+9+4+4+9+1+9+8+9+9+2+4+6+8+6+9+5+3+9+7+3+9+5+6+5+9+7+5"}], "sourceSteps": [{"text": "stack = []", "types": "init", "occurrence": 1}, {"text": "numbers = ''", "types": "ready", "occurrence": 1}, {"text": "for i in fx:", "types": "scan", "occurrence": 1}, {"text": "if i != '+':", "types": "check", "occurrence": 1}, {"text": "numbers += i", "types": "append", "occurrence": 1}, {"text": "if not stack:", "types": "empty", "occurrence": 1}, {"text": "stack.append(i)", "types": "push", "occurrence": 1}, {"text": "numbers += i", "types": "operator", "occurrence": 2}, {"text": "numbers += stack.pop()", "types": "flush", "occurrence": 1}, {"text": "stack = []", "types": "resetStack", "occurrence": 2}, {"text": "for i in numbers:", "types": "read", "occurrence": 1}, {"text": "if i != '+':", "types": "numberCheck", "occurrence": 2}, {"text": "stack.append(int(i))", "types": "number", "occurrence": 1}, {"text": "op2 = stack.pop()", "types": "pop2", "occurrence": 1}, {"text": "op1 = stack.pop()", "types": "pop1", "occurrence": 1}, {"text": "stack.append(op1 + op2)", "types": "add", "occurrence": 1}, {"text": "print('#{} {}'.format(tc, *stack))", "types": "output", "occurrence": 1}]});
  const samples = PROBLEM.samples;
  const defaultSample = samples.find(s => s.id === PROBLEM.defaultSampleId);
  const els = Core.getByIds(["sourceCode", "resetBtn", "prevBtn", "nextBtn", "playBtn", "replayBtn", "skipBtn", "speedRange", "speedLabel", "stepLabel", "timeline", "codeLineLabel", "codeViewport", "codeView", "boardLabel", "boardViewport", "board", "phaseLabel", "tokenValue", "op1Value", "op2Value", "sizeValue", "resultValue", "statusValue", "explainText", "outputView", "inputArea", "applyBtn", "sampleButtons", "inputError", "mobileCoord", "mobileCodeStatus", "mobileCodeViewport", "mobileCodeView", "mobilePhase", "mobileBoardViewport", "mobileBoard", "mobileExplanation", "mobileStateMeta", "mobileToken", "mobileOp1", "mobileOp2", "mobileResult", "mobileStatus", "mobileOutputView", "mobilePrevBtn", "mobileTimeline", "mobileTimelineStatus", "mobileNextBtn"]);
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
    if (!text.trim() || lines.length % 2 || lines.length > 20) throw new Error('길이 N과 계산식을 두 줄씩, 1~10개 케이스로 입력해주세요.');
    const cases = [];
    for (let i = 0; i < lines.length; i += 2) {
      const fx = lines[i + 1];
      if (!/^\d+$/.test(lines[i]) || Number(lines[i]) !== fx.length) throw new Error(`${i / 2 + 1}번 케이스: N과 계산식 길이가 다릅니다.`);
      if (fx.length > 1000 || !/^\d(?:\+\d)+$/.test(fx)) throw new Error('숫자 한 자리와 +가 번갈아 나오는 식을 입력해주세요. 첨부 코드의 마지막 pop을 위해 +가 하나 이상 필요합니다. 최대 길이는 1000입니다.');
      cases.push({ fx });
    }
    return { cases };
  }
  function buildSteps() {
    const steps = []; let output = '';
    state.cases.forEach(({fx}, index) => {
      let stack = [], numbers = '', token = null, cursor = -1, op1 = null, op2 = null, stage = '후위 변환';
      const push = (phase, message) => steps.push({ tc: index + 1, fx, stack: [...stack], numbers, token, cursor, op1, op2, stage, phase, line: stepLineMap.get(phase), message, output });
      push('init', '연산자를 보관할 빈 스택을 만듭니다.');
      push('ready', '후위 표기식을 담을 numbers를 빈 문자열로 만듭니다.');
      for (cursor = 0; cursor < fx.length; cursor++) {
        token = fx[cursor]; push('scan', `계산식의 ${cursor + 1}번째 문자 ${token}을 읽습니다.`);
        push('check', `${token} != '+' → ${token !== '+' ? '참' : '거짓'}`);
        if (token !== '+') { numbers += token; push('append', `숫자 ${token}을 numbers 뒤에 붙입니다.`); }
        else {
          push('empty', `스택이 ${stack.length ? '비어 있지 않습니다.' : '비어 있습니다.'}`);
          if (!stack.length) { stack.push(token); push('push', '첫 +를 스택에 보관합니다.'); }
          else { numbers += token; push('operator', '첨부 코드대로 현재 +를 numbers에 붙입니다. 연산자가 모두 +이므로 같은 결과를 얻습니다.'); }
        }
      }
      cursor = -1; token = null; numbers += stack.pop(); push('flush', '스택에 남겨둔 마지막 +를 꺼내 numbers에 붙입니다.');
      stack = []; stage = '스택 계산'; push('resetStack', '숫자 계산을 위해 스택을 비웁니다.');
      for (cursor = 0; cursor < numbers.length; cursor++) {
        token = numbers[cursor]; push('read', `후위 표기식의 ${token}을 읽습니다.`);
        push('numberCheck', `${token} != '+' → ${token !== '+' ? '참' : '거짓'}`);
        if (token !== '+') { stack.push(Number(token)); push('number', `${token}을 정수로 바꿔 스택에 넣습니다.`); }
        else {
          op2 = stack.pop(); push('pop2', `스택 맨 위의 ${op2}를 꺼내 op2에 저장합니다.`);
          op1 = stack.pop(); push('pop1', `다음 숫자 ${op1}을 꺼내 op1에 저장합니다.`);
          stack.push(op1 + op2); push('add', `${op1} + ${op2} = ${op1 + op2}를 스택에 넣습니다.`);
        }
      }
      cursor = -1; stage = '완료'; output += `#${index + 1} ${stack[0]}\n`; push('output', `스택에 남은 최종 결과 ${stack[0]}를 출력합니다.`);
    });
    state.steps = steps;
  }
  function renderBoardInto(container, step) {
    const tokens = (value, active) => [...value].map((v,i) => `<span class="calc-token${i === active ? ' active' : ''}">${v}</span>`).join('');
    container.innerHTML = `<div class="calc-label">fx · 중위 표기식</div><div class="calc-tokens">${tokens(step.fx, step.stage === '후위 변환' ? step.cursor : -1)}</div><div class="calc-label">numbers · 후위 표기식</div><div class="calc-tokens">${tokens(step.numbers, step.stage === '스택 계산' ? step.cursor : -1) || '빈 문자열'}</div><div class="calc-label">stack · 오른쪽이 TOP</div><div class="calc-tokens">${step.stack.map((v,i) => `<span class="calc-token${i === step.stack.length - 1 ? ' top' : ''}">${v}</span>`).join('') || '빈 스택'}</div>`;
  }
  function highlight(lines, number) { lines.forEach((line, n) => line.classList.toggle('active', n === number)); }
  function renderDesktop(step) {
    highlight(state.codeLines, step.line); renderBoardInto(els.board, step);
    els.codeLineLabel.textContent = `LINE ${step.line}`;
    els.boardLabel.textContent = `#${step.tc} · N=${step.fx.length}`;
    els.phaseLabel.textContent = step.stage;
    const result = step.stage === '완료' ? step.stack[0] : '—';
    for (const [id, value] of Object.entries({tokenValue: step.token, op1Value: step.op1, op2Value: step.op2, sizeValue: step.stack.length, resultValue: result, statusValue: step.stage})) els[id].textContent = value ?? '—';
    els.explainText.textContent = step.message;
    els.outputView.textContent = step.output || '아직 출력이 없습니다.';
  }
  function renderMobile(step) {
    highlight(state.mobileCodeLines, step.line); renderBoardInto(els.mobileBoard, step);
    els.mobileCoord.textContent = `#${step.tc} · N=${step.fx.length}`;
    els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.mobilePhase.textContent = step.stage; els.mobileExplanation.textContent = step.message;
    els.mobileStateMeta.textContent = `스택 크기 ${step.stack.length}`;
    for (const [id,value] of Object.entries({mobileToken: step.token, mobileOp1: step.op1, mobileOp2: step.op2, mobileResult: step.stage === '완료' ? step.stack[0] : '—', mobileStatus: step.stage})) els[id].textContent = value ?? '—';
    els.mobileOutputView.textContent = step.output || '아직 출력이 없습니다.';
    els.mobileTimeline.value = state.stepIndex;
    els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.mobilePrevBtn.disabled = state.stepIndex === 0;
    els.mobileNextBtn.disabled = state.stepIndex === state.steps.length - 1;
  }
  function render({follow = true} = {}) {
    const step = state.steps[state.stepIndex]; if (!step) return;
    renderDesktop(step); renderMobile(step);
    els.timeline.value = state.stepIndex;
    els.stepLabel.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.prevBtn.disabled = state.stepIndex === 0;
    els.nextBtn.disabled = state.stepIndex === state.steps.length - 1;
    if (follow) {
      for (const [viewport, lines] of [[els.codeViewport, state.codeLines], [els.mobileCodeViewport, state.mobileCodeLines]]) Core.centerInsideViewport(viewport, lines.get(step.line), { horizontal: false });
      for (const viewport of [els.boardViewport, els.mobileBoardViewport]) Core.centerInsideViewport(viewport, viewport.querySelector('.calc-token.active'), { horizontal: false });
    }
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


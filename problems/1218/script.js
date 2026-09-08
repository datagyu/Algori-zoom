(() => {
  const Core = window.AlgoriZoomCore;
  const OPEN = new Set(['(', '{', '[', '<']);
  const PAIR = { ')': '(', '}': '{', ']': '[', '>': '<' };
  const samples = Array.isArray(window.BRACKET_SAMPLES) ? window.BRACKET_SAMPLES : [];

  const state = {
    input: samples[0]?.value ?? '()[]{}<>',
    steps: [],
    index: 0,
    playing: false,
    timer: null,
    speed: 1,
    selectedSample: samples[0]?.id ?? null,
    userScrolledCode: false,
    userScrolledString: false,
    userScrolledStack: false,
  };

  const els = {
    sourceTemplate: document.getElementById('sourceCodeTemplate'),
    desktopCodeViewport: document.getElementById('desktopCodeViewport'),
    mobileCodeViewport: document.getElementById('mobileCodeViewport'),
    stringViewport: document.getElementById('stringViewport'),
    mobileStringViewport: document.getElementById('mobileStringViewport'),
    stringTrack: document.getElementById('stringTrack'),
    mobileStringTrack: document.getElementById('mobileStringTrack'),
    stackViewport: document.getElementById('stackViewport'),
    mobileStackViewport: document.getElementById('mobileStackViewport'),
    stackView: document.getElementById('stackView'),
    mobileStackView: document.getElementById('mobileStackView'),
    timelineRange: document.getElementById('timelineRange'),
    mobileTimeline: document.getElementById('mobileTimeline'),
    timelineStatus: document.getElementById('timelineStatus'),
    mobileTimelineStatus: document.getElementById('mobileTimelineStatus'),
    codeStatus: document.getElementById('codeStatus'),
    mobileCodeStatus: document.getElementById('mobileCodeStatus'),
    stringStatus: document.getElementById('stringStatus'),
    phaseLabel: document.getElementById('phaseLabel'),
    mobilePhase: document.getElementById('mobilePhase'),
    explanation: document.getElementById('explanation'),
    mobileExplanation: document.getElementById('mobileExplanation'),
    conditionBox: document.getElementById('conditionBox'),
    conditionTitle: document.getElementById('conditionTitle'),
    conditionDetail: document.getElementById('conditionDetail'),
    varI: document.getElementById('varI'),
    varChar: document.getElementById('varChar'),
    varTop: document.getElementById('varTop'),
    varStackTop: document.getElementById('varStackTop'),
    varResult: document.getElementById('varResult'),
    stackCount: document.getElementById('stackCount'),
    mobileStackCount: document.getElementById('mobileStackCount'),
    resultLabel: document.getElementById('resultLabel'),
    resultValue: document.getElementById('resultValue'),
    mobileResultLabel: document.getElementById('mobileResultLabel'),
    mobileResult: document.getElementById('mobileResult'),
    mobileCoord: document.getElementById('mobileCoord'),
    resetBtn: document.getElementById('resetBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    playBtn: document.getElementById('playBtn'),
    replayBtn: document.getElementById('replayBtn'),
    skipBtn: document.getElementById('skipBtn'),
    mobilePrevBtn: document.getElementById('mobilePrevBtn'),
    mobileNextBtn: document.getElementById('mobileNextBtn'),
    speedRange: document.getElementById('speedRange'),
    speedLabel: document.getElementById('speedLabel'),
    customInput: document.getElementById('customInput'),
    applyInputBtn: document.getElementById('applyInputBtn'),
    sampleButtons: document.getElementById('sampleButtons'),
    inputMessage: document.getElementById('inputMessage'),
  };

  let desktopLineMap;
  let mobileLineMap;
  let desktopChars = [];
  let mobileChars = [];

  function mountCode() {
    const html = els.sourceTemplate.innerHTML;
    els.desktopCodeViewport.innerHTML = html;
    els.mobileCodeViewport.innerHTML = html;
    desktopLineMap = Core.createLineMap(els.desktopCodeViewport);
    mobileLineMap = Core.createLineMap(els.mobileCodeViewport);
  }

  function buildSteps(input) {
    const steps = [];
    const stack = [];
    let top = -1;
    let result = 1;
    let stopped = false;

    const push = (type, i, extra = {}) => {
      steps.push({ type, i, char: i >= 0 ? input[i] : null, stack: [...stack], top, result, ...extra });
    };

    for (let i = 0; i < input.length; i += 1) {
      const ch = input[i];
      push('loop', i, { line: 7, text: `i = ${i}. 현재 문자는 '${ch}'입니다.` });
      push('open-check', i, { line: 8, text: OPEN.has(ch) ? `'${ch}'는 여는 괄호입니다.` : `'${ch}'는 닫는 괄호입니다.` });

      if (OPEN.has(ch)) {
        stack.push(ch);
        push('push', i, { line: 9, text: `'${ch}'를 stack에 push합니다.` });
        top += 1;
        push('top-up', i, { line: 10, text: `top을 ${top}으로 올립니다.` });
        continue;
      }

      push('close-branch', i, { line: 11, text: '닫는 괄호이므로 짝을 확인합니다.' });
      push('empty-check', i, { line: 12, text: top === -1 ? 'stack이 비어 있어 짝을 찾을 수 없습니다.' : 'stack에 비교할 여는 괄호가 있습니다.' });
      if (top === -1) {
        result = 0;
        push('fail-empty', i, { line: 13, text: '짝이 없으므로 result = 0이고 반복을 종료합니다.', error: true });
        stopped = true;
        break;
      }

      const expected = PAIR[ch];
      const actual = stack[top];
      const matched = actual === expected;
      push('match-check', i, { line: 14, expected, actual, matched, text: matched ? `'${actual}'와 '${ch}'의 짝이 맞습니다.` : `'${actual}'와 '${ch}'의 짝이 맞지 않습니다.` });
      if (!matched) {
        result = 0;
        push('fail-mismatch', i, { line: 15, expected, actual, matched, text: '짝이 다르므로 result = 0이고 반복을 종료합니다.', error: true });
        stopped = true;
        break;
      }

      stack.pop();
      push('pop', i, { line: 16, text: '짝이 맞으므로 stack의 맨 위를 pop합니다.' });
      top -= 1;
      push('top-down', i, { line: 17, text: `top을 ${top}으로 내립니다.` });
    }

    push('final-check', input.length ? input.length - 1 : -1, { line: 18, stopped, text: top !== -1 ? `반복이 끝났지만 stack에 ${top + 1}개가 남았습니다.` : '반복이 끝났고 stack이 비어 있습니다.' });
    if (top !== -1) {
      result = 0;
      push('final-fail', input.length ? input.length - 1 : -1, { line: 19, text: '남은 여는 괄호가 있으므로 result = 0입니다.', error: true });
    }
    push('done', input.length ? input.length - 1 : -1, { line: 20, text: `최종 결과는 ${result}입니다.`, done: true });
    return steps;
  }

  function renderString() {
    const make = (track) => {
      track.innerHTML = state.input.split('').map((ch, i) => `<span class="char-cell" data-i="${i}">${Core.escapeHtml(ch)}</span>`).join('');
      return [...track.querySelectorAll('.char-cell')];
    };
    desktopChars = make(els.stringTrack);
    mobileChars = make(els.mobileStringTrack);
  }

  function renderSamples() {
    els.sampleButtons.innerHTML = '';
    for (const sample of samples) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn ghost';
      btn.dataset.sampleId = sample.id;
      btn.textContent = sample.label;
      btn.addEventListener('click', () => applyInput(sample.value, sample.id));
      els.sampleButtons.appendChild(btn);
    }
    syncSampleButtons();
  }

  function syncSampleButtons() {
    for (const btn of els.sampleButtons.querySelectorAll('button')) {
      btn.classList.toggle('selected', btn.dataset.sampleId === state.selectedSample);
    }
  }

  function renderStack(container, stack) {
    if (!stack.length) {
      container.innerHTML = '<span class="stack-empty">비어 있음</span>';
      return;
    }
    container.innerHTML = stack.map((ch, i) => `<div class="stack-item ${i === stack.length - 1 ? 'top' : ''}"><span>${Core.escapeHtml(ch)}</span><span class="stack-index">${i === stack.length - 1 ? 'TOP · ' : ''}${i}</span></div>`).join('');
  }

  function clearHighlights() {
    desktopLineMap.forEach((el) => el.classList.remove('active'));
    mobileLineMap.forEach((el) => el.classList.remove('active'));
    desktopChars.forEach((el) => el.classList.remove('active', 'visited', 'error'));
    mobileChars.forEach((el) => el.classList.remove('active', 'visited', 'error'));
  }

  function markChars(step) {
    if (step.i == null || step.i < 0) return;
    for (let i = 0; i < step.i; i += 1) {
      desktopChars[i]?.classList.add('visited');
      mobileChars[i]?.classList.add('visited');
    }
    for (const cell of [desktopChars[step.i], mobileChars[step.i]]) {
      cell?.classList.add(step.error ? 'error' : 'active');
    }
  }

  function phaseName(type) {
    return ({ loop:'READ', 'open-check':'CHECK', push:'PUSH', 'top-up':'TOP', 'close-branch':'CLOSE', 'empty-check':'CHECK', 'match-check':'MATCH', pop:'POP', 'top-down':'TOP', 'fail-empty':'FAIL', 'fail-mismatch':'FAIL', 'final-check':'FINAL', 'final-fail':'FAIL', done:'DONE' })[type] ?? type.toUpperCase();
  }

  function conditionFor(step) {
    if (step.type === 'open-check') return [OPEN.has(step.char) ? '여는 괄호' : '닫는 괄호', `arr[i] = '${step.char}'`];
    if (step.type === 'empty-check') return ['top == -1 ?', step.top === -1 ? 'True · stack이 비어 있음' : `False · top = ${step.top}`];
    if (step.type === 'match-check' || step.type === 'fail-mismatch') return [`stack[top] == '${step.expected}' ?`, `${step.actual ?? '—'} ${step.matched ? '==' : '!='} ${step.expected}`];
    if (step.type === 'final-check' || step.type === 'final-fail') return ['top != -1 ?', `${step.top} ${step.top !== -1 ? '!=' : '=='} -1`];
    return ['현재 단계', step.text];
  }

  function render() {
    const total = state.steps.length;
    state.index = Core.clamp(state.index, 0, Math.max(0, total - 1));
    const step = state.steps[state.index] ?? null;
    clearHighlights();

    const status = `STEP ${total ? state.index + 1 : 0} / ${total}`;
    els.timelineStatus.textContent = status;
    els.mobileTimelineStatus.textContent = `${total ? state.index + 1 : 0} / ${total}`;
    els.timelineRange.max = Math.max(0, total - 1);
    els.mobileTimeline.max = Math.max(0, total - 1);
    els.timelineRange.value = state.index;
    els.mobileTimeline.value = state.index;

    if (!step) return;
    desktopLineMap.get(step.line)?.classList.add('active');
    mobileLineMap.get(step.line)?.classList.add('active');
    markChars(step);
    renderStack(els.stackView, step.stack);
    renderStack(els.mobileStackView, step.stack);

    const phase = phaseName(step.type);
    els.codeStatus.textContent = `LINE ${step.line}`;
    els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.stringStatus.textContent = step.i >= 0 ? `i = ${step.i}` : 'i = —';
    els.phaseLabel.textContent = phase;
    els.mobilePhase.textContent = phase;
    els.explanation.textContent = step.text;
    els.mobileExplanation.textContent = step.text;
    els.varI.textContent = step.i >= 0 ? step.i : '—';
    els.varChar.textContent = step.char ?? '—';
    els.varTop.textContent = step.top;
    els.varStackTop.textContent = step.top >= 0 ? step.stack[step.top] : '—';
    els.varResult.textContent = step.result;
    els.stackCount.textContent = `${step.stack.length} items`;
    els.mobileStackCount.textContent = `${step.stack.length} items`;
    els.resultValue.textContent = step.result;
    els.mobileResult.textContent = step.result;
    els.resultLabel.textContent = step.done ? (step.result ? '유효함' : '유효하지 않음') : '진행 중';
    els.mobileResultLabel.textContent = els.resultLabel.textContent;
    els.mobileCoord.textContent = `i = ${step.i >= 0 ? step.i : '—'} · top = ${step.top}`;

    const [title, detail] = conditionFor(step);
    els.conditionTitle.textContent = title;
    els.conditionDetail.textContent = detail;
    els.conditionBox.className = `condition-box ${step.error ? 'bad' : (step.matched === true || ['push','pop','done'].includes(step.type) ? 'good' : 'neutral')}`;

    if (!state.userScrolledCode) {
      Core.centerInsideViewport(els.desktopCodeViewport, desktopLineMap.get(step.line), { horizontal:false, vertical:true });
      Core.centerInsideViewport(els.mobileCodeViewport, mobileLineMap.get(step.line), { horizontal:false, vertical:true });
    }
    if (!state.userScrolledString && step.i >= 0) {
      Core.centerInsideViewport(els.stringViewport, desktopChars[step.i], { horizontal:true, vertical:false });
      Core.centerInsideViewport(els.mobileStringViewport, mobileChars[step.i], { horizontal:true, vertical:false });
    }
    if (!state.userScrolledStack) {
      const desktopTop = els.stackView.querySelector('.stack-item.top');
      const mobileTop = els.mobileStackView.querySelector('.stack-item.top');
      if (desktopTop) Core.centerInsideViewport(els.stackViewport, desktopTop, { horizontal:false, vertical:true });
      if (mobileTop) Core.centerInsideViewport(els.mobileStackViewport, mobileTop, { horizontal:false, vertical:true });
    }

    els.prevBtn.disabled = state.index <= 0;
    els.mobilePrevBtn.disabled = state.index <= 0;
    els.nextBtn.disabled = state.index >= total - 1;
    els.mobileNextBtn.disabled = state.index >= total - 1;
  }

  function stopPlay() {
    state.playing = false;
    if (state.timer) clearTimeout(state.timer);
    state.timer = null;
    els.playBtn.textContent = '▶ 자동 실행';
  }

  function resetAutoFollow() {
    state.userScrolledCode = false;
    state.userScrolledString = false;
    state.userScrolledStack = false;
  }

  function goTo(index, userAction = true) {
    if (userAction) resetAutoFollow();
    state.index = Core.clamp(Number(index) || 0, 0, Math.max(0, state.steps.length - 1));
    render();
  }

  function move(delta) { stopPlay(); goTo(state.index + delta, true); }

  function tick() {
    if (!state.playing) return;
    if (state.index >= state.steps.length - 1) { stopPlay(); return; }
    goTo(state.index + 1, false);
    state.timer = setTimeout(tick, 650 / state.speed);
  }

  function togglePlay() {
    if (state.playing) { stopPlay(); return; }
    resetAutoFollow();
    state.playing = true;
    els.playBtn.textContent = '⏸ 일시정지';
    tick();
  }

  function applyInput(value, sampleId = null) {
    const cleaned = String(value).trim();
    if (!cleaned || !/^[(){}\[\]<>]+$/.test(cleaned)) {
      els.inputMessage.textContent = '(), [], {}, <> 괄호 문자만 입력해주세요.';
      return;
    }
    els.inputMessage.textContent = '';
    stopPlay();
    state.input = cleaned;
    state.steps = buildSteps(cleaned);
    state.index = 0;
    state.selectedSample = sampleId;
    els.customInput.value = cleaned;
    renderString();
    syncSampleButtons();
    resetAutoFollow();
    render();
  }

  function bindScroll(viewport, key) {
    viewport.addEventListener('pointerdown', () => { state[key] = true; });
    viewport.addEventListener('wheel', () => { state[key] = true; }, { passive:true });
    viewport.addEventListener('touchstart', () => { state[key] = true; }, { passive:true });
  }

  els.prevBtn.addEventListener('click', () => move(-1));
  els.nextBtn.addEventListener('click', () => move(1));
  els.mobilePrevBtn.addEventListener('click', () => move(-1));
  els.mobileNextBtn.addEventListener('click', () => move(1));
  els.resetBtn.addEventListener('click', () => { stopPlay(); goTo(0, true); });
  els.replayBtn.addEventListener('click', () => { stopPlay(); goTo(0, true); togglePlay(); });
  els.skipBtn.addEventListener('click', () => { stopPlay(); goTo(state.steps.length - 1, true); });
  els.playBtn.addEventListener('click', togglePlay);
  els.timelineRange.addEventListener('input', (e) => { stopPlay(); goTo(e.target.value, true); });
  els.mobileTimeline.addEventListener('input', (e) => { stopPlay(); goTo(e.target.value, true); });
  els.speedRange.addEventListener('input', () => { state.speed = Number(els.speedRange.value); els.speedLabel.textContent = `${Core.formatDecimal(state.speed)}×`; });
  els.applyInputBtn.addEventListener('click', () => applyInput(els.customInput.value, null));
  els.customInput.addEventListener('input', () => { state.selectedSample = null; syncSampleButtons(); });

  [els.desktopCodeViewport, els.mobileCodeViewport].forEach((el) => bindScroll(el, 'userScrolledCode'));
  [els.stringViewport, els.mobileStringViewport].forEach((el) => bindScroll(el, 'userScrolledString'));
  [els.stackViewport, els.mobileStackViewport].forEach((el) => bindScroll(el, 'userScrolledStack'));

  mountCode();
  renderSamples();
  applyInput(state.input, state.selectedSample);
})();

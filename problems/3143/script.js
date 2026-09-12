(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({"platform": "SWEA", "number": "3143", "level": "D3", "title": "가장 빠른 문자열 타이핑", "autoplayMs": 550, "defaultSampleId": "one", "samples": [{"id": "one", "label": "샘플 1 · banana", "value": "1\nbanana bana"}, {"id": "two", "label": "샘플 2 · asakusa", "value": "1\nasakusa sa"}, {"id": "overlap", "label": "겹치는 패턴", "value": "1\naaaaa aaa"}, {"id": "all", "label": "첨부 예제 전체", "value": "2\nbanana bana\nasakusa sa"}], "sourceSteps": [{"text": "i = 0", "types": "init", "occurrence": 1}, {"text": "count = 0", "types": "ready", "occurrence": 1}, {"text": "while i < len(A):", "types": "while", "occurrence": 1}, {"text": "if A[i:i + len(B)] == B:", "types": "check", "occurrence": 1}, {"text": "count += 1", "types": "shortcut", "occurrence": 1}, {"text": "i += len(B)", "types": "jump", "occurrence": 1}, {"text": "count += 1", "types": "single", "occurrence": 2}, {"text": "i += 1", "types": "advance", "occurrence": 1}, {"text": "print(f'#{tc} {count}')", "types": "output", "occurrence": 1}]});
  const samples = PROBLEM.samples;
  const defaultSample = samples.find(s => s.id === PROBLEM.defaultSampleId);
  const els = Core.getByIds(["sourceCode", "resetBtn", "prevBtn", "nextBtn", "playBtn", "replayBtn", "skipBtn", "speedRange", "speedLabel", "stepLabel", "timeline", "codeLineLabel", "codeViewport", "codeView", "boardLabel", "boardViewport", "board", "phaseLabel", "indexValue", "countValue", "patternLengthValue", "textLengthValue", "remainingValue", "statusValue", "explainText", "outputView", "inputArea", "applyBtn", "sampleButtons", "inputError", "mobileCoord", "mobileCodeStatus", "mobileCodeViewport", "mobileCodeView", "mobilePhase", "mobileBoardViewport", "mobileBoard", "mobileExplanation", "mobileStateMeta", "mobileIndex", "mobileCount", "mobilePatternLength", "mobileRemaining", "mobileStatus", "mobileOutputView", "mobilePrevBtn", "mobileTimeline", "mobileTimelineStatus", "mobileNextBtn"]);
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
    const tokens = text.trim().split(/\s+/);
    const T = Number(tokens[0]);
    if (!/^\d+$/.test(tokens[0]) || !Number.isInteger(T) || T < 1 || T > 50 || tokens.length !== 1 + T * 2) throw new Error('첫 줄에 T(1~50), 각 케이스에 A와 B를 입력해주세요.');
    const cases = []; let total = 0;
    for (let tc = 0; tc < T; tc++) {
      const A = Array.from(tokens[1 + tc * 2]), B = Array.from(tokens[2 + tc * 2]);
      if (A.length < 1 || A.length > 10000 || B.length < 1 || B.length > 100) throw new Error('A는 1~10,000글자, B는 1~100글자로 입력해주세요.');
      total += A.length; cases.push({A,B});
    }
    if (total > 50000) throw new Error('원활한 단계 재생을 위해 한 번에 A의 합계 50,000글자까지 입력해주세요.');
    return {cases};
  }
  function buildSteps() {
    const steps = []; let output = '';
    state.cases.forEach(({A,B}, index) => {
      let i = 0, count = 0, matched = null, compareAt = null;
      const push = (phase) => steps.push({A,B,tc:index+1,i,count,matched,compareAt,phase,line:stepLineMap.get(phase),output});
      push('init'); push('ready');
      while (true) {
        compareAt = null; matched = null; push('while');
        if (i >= A.length) break;
        compareAt = i; matched = i + B.length <= A.length && B.every((char,k) => char === A[i+k]); push('check');
        count++;
        if (matched) { push('shortcut'); i += B.length; push('jump'); }
        else { push('single'); i++; push('advance'); }
      }
      output += `#${index+1} ${count}\n`; push('output');
    });
    state.steps = steps;
  }
  function explanation(step) {
    const {A,B,i,count,matched,compareAt,phase}=step;
    switch (phase) {
      case 'init': return '현재 위치 i를 0으로 초기화합니다.';
      case 'ready': return '키 입력 횟수 count를 0으로 초기화합니다.';
      case 'while': return `${i} < ${A.length} → ${i < A.length ? '참: 아직 입력할 글자가 있습니다.' : '거짓: 문자열 전체를 입력했습니다.'}`;
      case 'check': return `A[${i}:${i+B.length}]와 B를 비교합니다. ${matched ? '일치하므로 단축키를 사용합니다.' : '일치하지 않아 한 글자만 입력합니다.'}`;
      case 'shortcut': return `B 전체를 한 번에 입력합니다. count = ${count}. 아직 i를 이동하기 전입니다.`;
      case 'jump': return `i를 ${compareAt}에서 ${i}로 ${B.length}칸 이동합니다. 입력한 구간은 다시 검사하지 않습니다.`;
      case 'single': return `현재 글자 '${A[i]}'를 한 번 입력합니다. count = ${count}. 아직 i를 이동하기 전입니다.`;
      case 'advance': return `i를 ${compareAt}에서 ${i}로 한 칸 이동합니다.`;
      case 'output': return `최소 키 입력 횟수는 ${count}번입니다. #${step.tc} ${count}를 출력합니다.`;
    }
  }
  function renderBoardInto(container, step) {
    const {A,B,i,compareAt,phase}=step;
    const start = Math.max(0, Math.min(i - 12, A.length - 80)), end = Math.min(A.length,start+80);
    // Limit rendered cells while retaining the full input and execution history.
    const pending = ['check','shortcut','single'].includes(phase);
    const typedUntil = phase === 'shortcut' ? i+B.length : phase === 'single' ? i+1 : i;
    const tokens = A.slice(start,end).map((char,k) => {
      const pos=start+k, candidate=pending && pos>=i && pos<i+B.length;
      return `<span class="typing-token${pos<typedUntil ? ' done' : ''}${candidate ? ' candidate' : ''}${pos===i ? ' current' : ''}">${Core.escapeHtml(char)}<small>${pos}</small></span>`;
    }).join('');
    const slice = compareAt === null ? '—' : A.slice(compareAt,compareAt+B.length).join('');
    container.innerHTML = `<p class="typing-label">A · 인덱스 ${start}~${end-1} / 전체 ${A.length}글자</p><div class="typing-tokens">${tokens}</div><p class="typing-legend">초록: 입력 완료 · 파랑: 비교 범위 · 흰 테두리: i<br>입력 완료 ${typedUntil} / ${A.length}${A.length>80 ? ' · 현재 위치 주변 최대 80글자 표시' : ''}</p><div class="typing-comparison">B: ${Core.escapeHtml(B.join(''))}<br>A 슬라이스: ${Core.escapeHtml(slice)}<br>비교 결과: ${step.matched===null ? '—' : step.matched ? '일치' : '불일치'}</div>`;
  }
  function highlight(lines,number) { lines.forEach((line,n)=>line.classList.toggle('active',n===number)); }
  function remaining(step) { return step.A.length - (step.phase==='shortcut' ? step.i+step.B.length : step.phase==='single' ? step.i+1 : step.i); }
  function phaseLabel(step) { return step.phase==='output' ? '완료' : step.matched===null ? '탐색' : step.matched ? '단축키' : '한 글자'; }
  function renderDesktop(step) {
    highlight(state.codeLines,step.line); renderBoardInto(els.board,step);
    els.codeLineLabel.textContent=`LINE ${step.line}`; els.boardLabel.textContent=`#${step.tc} · i=${step.i}`; els.phaseLabel.textContent=phaseLabel(step);
    for (const [id,value] of Object.entries({indexValue:step.i,countValue:step.count,patternLengthValue:step.B.length,textLengthValue:step.A.length,remainingValue:remaining(step),statusValue:phaseLabel(step)})) els[id].textContent=value;
    els.explainText.textContent=explanation(step); els.outputView.textContent=step.output||'아직 출력이 없습니다.';
  }
  function renderMobile(step) {
    highlight(state.mobileCodeLines,step.line); renderBoardInto(els.mobileBoard,step);
    els.mobileCoord.textContent=`#${step.tc} · i=${step.i}`; els.mobileCodeStatus.textContent=`LINE ${step.line}`; els.mobilePhase.textContent=phaseLabel(step);
    els.mobileExplanation.textContent=explanation(step); els.mobileStateMeta.textContent=`len(A) = ${step.A.length}`;
    for (const [id,value] of Object.entries({mobileIndex:step.i,mobileCount:step.count,mobilePatternLength:step.B.length,mobileRemaining:remaining(step),mobileStatus:phaseLabel(step)})) els[id].textContent=value;
    els.mobileOutputView.textContent=step.output||'아직 출력이 없습니다.';
    els.mobileTimeline.value=state.stepIndex; els.mobileTimelineStatus.textContent=`${state.stepIndex+1} / ${state.steps.length}`;
    els.mobilePrevBtn.disabled=state.stepIndex===0; els.mobileNextBtn.disabled=state.stepIndex===state.steps.length-1;
  }
  function render({follow=true}={}) {
    const step=state.steps[state.stepIndex]; if (!step) return;
    renderDesktop(step); renderMobile(step);
    els.timeline.value=state.stepIndex; els.stepLabel.textContent=`${state.stepIndex+1} / ${state.steps.length}`;
    els.prevBtn.disabled=state.stepIndex===0; els.nextBtn.disabled=state.stepIndex===state.steps.length-1;
    if (follow) for (const [viewport,lines] of [[els.codeViewport,state.codeLines],[els.mobileCodeViewport,state.mobileCodeLines]]) Core.centerInsideViewport(viewport,lines.get(step.line),{horizontal:false});
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


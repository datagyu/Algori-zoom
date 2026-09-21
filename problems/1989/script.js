(() => {
  "use strict";
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({"platform": "SWEA", "number": "1989", "title": "초심자의 회문 검사", "autoplayMs": 450, "samples": [{"id": "one", "label": "샘플 1", "value": "1\nlevel"}, {"id": "two", "label": "샘플 2", "value": "1\nsamsung"}, {"id": "all", "label": "전체 샘플", "value": "10\nlevel\nsamsung\neye\nexo\nioi\nblackpink\nhannah\nB1A4\nlinetown\nnursesrun"}], "sourceSteps": [{"text": "result = 1", "types": "init"}, {"text": "for i in range(len(arr) // 2):", "types": "loop"}, {"text": "if arr[i] != arr[-1-i]:", "types": "compare"}, {"text": "result = 0", "types": "mismatch"}, {"text": "break", "types": "break"}, {"text": "print('#{} {}'.format(tc, result))", "types": "output"}]});
  const samples = PROBLEM.samples;
  const els = Core.getByIds([...document.querySelectorAll('[id]')].map(el => el.id));
  let steps = [], cursor = 0, timer = null, selectedSample = null, stepLines;

  function parseInput(raw) {
    const lines = raw.trim().split(/\r?\n/).map(line => line.trim());
    const T = Number(lines[0]);
    if (!Number.isInteger(T) || T < 1 || T > 100) throw new Error('첫 줄에 테스트케이스 수 T(1~100)를 입력해 주세요.');
    if (lines.length !== T + 1) throw new Error('테스트케이스 수만큼 한 줄에 한 단어를 입력해 주세요.');
    return lines.slice(1).map((word, index) => {
      if (!/^[A-Za-z0-9]{3,10}$/.test(word)) throw new Error(`${index + 1}번 단어는 영문 대소문자와 숫자로 된 3~10글자여야 합니다.`);
      return {tc:index + 1, word};
    });
  }
  function buildSteps(cases) {
    const out = [];
    let output = '';
    for (const test of cases) {
      let answer = 1, i = null, checked = [];
      const push = (phase, text) => out.push({test, i, checked:[...checked], answer, line:stepLines.get(phase), phase,
        values:[i ?? '—', i === null ? '—' : test.word.length - 1 - i, answer],
        caption:`#${test.tc} · 길이 ${test.word.length}`, comparison:i === null ? '양 끝에서 가운데로 비교합니다.' : `arr[${i}] = ${test.word[i]} · arr[${-1-i}] = ${test.word[test.word.length - 1 - i]}`,
        text, output, done:phase === 'output', detail:`확인한 문자 쌍: ${checked.length / 2} / ${Math.floor(test.word.length / 2)} · 대소문자를 구분합니다.`});
      push('init','회문이라고 가정하고 result를 1로 초기화합니다.');
      for (i = 0; i < Math.floor(test.word.length / 2); i++) {
        push('loop',`${i}번째 문자와 뒤에서 ${i + 1}번째 문자를 비교합니다.`);
        const right = test.word.length - 1 - i;
        push('compare',test.word[i] === test.word[right] ? '두 문자가 같습니다. 다음 문자 쌍으로 이동합니다.' : '두 문자가 다릅니다. 회문이 아닙니다.');
        if (test.word[i] !== test.word[right]) {
          answer = 0; push('mismatch','result를 0으로 바꿉니다.');
          push('break','더 비교할 필요가 없으므로 반복문을 종료합니다.'); break;
        }
        checked.push(i,right);
      }
      if (answer) i = null;
      output += `#${test.tc} ${answer}\n`;
      push('output',answer ? '모든 대칭 문자 쌍이 같습니다. 회문이므로 1을 출력합니다.' : '다른 문자 쌍이 있으므로 0을 출력합니다.');
    }
    return out;
  }
  function renderBoard(target, s) {
    target.innerHTML = [...s.test.word].map((letter, index) => {
      const active = s.i !== null && (index === s.i || index === s.test.word.length - 1 - s.i);
      const classes = ['letter-cell'];
      if (s.checked.includes(index)) classes.push('matched');
      if (active) classes.push('current');
      if (active && !s.answer) classes.push('mismatch');
      return `<div class="${classes.join(' ')}"><strong>${Core.escapeHtml(letter)}</strong><span>[${index}]</span></div>`;
    }).join('');
  }

  function render(follow = false) {
    const s = steps[cursor];
    if (!s) return;
    document.querySelectorAll('.code-line').forEach(line => line.classList.toggle('active', Number(line.dataset.sourceLine) === s.line));
    renderBoard(els.board, s); renderBoard(els.mobileBoard, s);
    for (const [desktop, mobile, value] of [
      ['iValue', 'mobileI', s.values[0]], ['currentValue', 'mobileCurrent', s.values[1]], ['maxValue', 'mobileMax', s.values[2]],
      ['comparison', 'mobileComparison', s.comparison], ['explainText', 'mobileExplanation', s.text],
      ['codeLineLabel', 'mobileCodeStatus', `LINE ${s.line}`], ['boardLabel', 'mobileCoord', s.caption],
      ['stepLabel', 'mobileTimelineStatus', `${cursor + 1} / ${steps.length}`],
      ['phaseLabel', 'mobilePhase', s.done ? '완료' : '탐색 중'],
    ]) els[desktop].textContent = els[mobile].textContent = value;
    els.detailView.textContent = els.mobileDetailView.textContent = s.detail;
    els.outputView.textContent = els.mobileOutputView.textContent = s.output || '아직 출력이 없습니다.';
    for (const id of ['timeline', 'mobileTimeline']) { els[id].max = steps.length - 1; els[id].value = cursor; }
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = cursor === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = cursor === steps.length - 1;
    if (follow) {
      for (const id of ['codeViewport', 'mobileCodeViewport']) Core.centerInsideViewport(els[id], els[id].querySelector('.active'), {horizontal:false});
      for (const id of ['boardViewport', 'mobileBoardViewport']) Core.centerInsideViewport(els[id], els[id].querySelector('.current'));
    }
    if (cursor === steps.length - 1) stop();
  }
  function stop() { clearTimeout(timer); timer = null; Core.updatePlaybackControls(els.playBtn, false); }
  function goTo(index) { cursor = Core.clamp(index, 0, steps.length - 1); render(true); }
  function schedule() {
    timer = setTimeout(() => {
      goTo(cursor + 1);
      if (cursor < steps.length - 1) schedule();
    }, PROBLEM.autoplayMs / Number(els.speedRange.value));
  }
  function start() { stop(); if (cursor === steps.length - 1) goTo(0); Core.updatePlaybackControls(els.playBtn, true); schedule(); }
  function reset() { stop(); goTo(0); }
  function renderSamples() {
    els.sampleButtons.replaceChildren(...samples.map(sample => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'btn'; button.textContent = sample.label;
      button.classList.toggle('selected', selectedSample === sample.id);
      button.addEventListener('click', () => { els.inputArea.value = sample.value; apply(sample.value, sample.id); });
      return button;
    }));
  }
  function apply(raw, sampleId = null) {
    stop();
    try {
      const nextSteps = buildSteps(parseInput(raw));
      steps = nextSteps; cursor = 0; selectedSample = sampleId;
      els.inputError.textContent = ''; renderSamples(); render(true);
    } catch (error) { els.inputError.textContent = error.message; }
  }
  for (const [id, delta] of [['prevBtn', -1], ['mobilePrevBtn', -1], ['nextBtn', 1], ['mobileNextBtn', 1]]) els[id].addEventListener('click', () => { stop(); goTo(cursor + delta); });
  els.resetBtn.addEventListener('click', reset);
  els.replayBtn.addEventListener('click', () => { reset(); start(); });
  els.skipBtn.addEventListener('click', () => { stop(); goTo(steps.length - 1); });
  els.playBtn.addEventListener('click', () => timer ? stop() : start());
  els.mobilePlayBtn.addEventListener('click', () => els.playBtn.click());
  els.speedRange.addEventListener('input', () => {
    els.speedLabel.textContent = `${Core.formatDecimal(els.speedRange.value)}×`;
    if (timer) { clearTimeout(timer); schedule(); }
  });
  for (const id of ['timeline', 'mobileTimeline']) els[id].addEventListener('input', event => { stop(); goTo(Number(event.target.value)); });
  els.applyBtn.addEventListener('click', () => apply(els.inputArea.value));
  els.inputArea.addEventListener('input', () => { selectedSample = null; renderSamples(); });
  const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps, {wrap: false});
  els.codeView.innerHTML = els.mobileCodeView.innerHTML = markup;
  stepLines = Core.createStepLineMap(els.codeView);
  els.inputArea.value = samples[0].value;
  apply(samples[0].value, samples[0].id);
})();

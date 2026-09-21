(() => {
  "use strict";
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({autoplayMs: 600});
  const samples = [
    { id:'all', label:'전체 샘플', value:`4\n5\n1 2 3 4 5\n5\n4 5 1 2 3\n5\n5 4 3 2 1\n8\n1 2 1 2 3 1 2 1` },
    { id:'inc', label:'샘플 1', value:`1\n5\n1 2 3 4 5` },
    { id:'reset', label:'샘플 2', value:`1\n8\n1 2 1 2 3 1 2 1` }
  ];

  const els = Core.getByIds([...document.querySelectorAll('[id]')].map(el => el.id));
  let steps = [], cursor = 0, timer = null, selectedSample = null;

  function parseInput(raw) {
    if (!raw.trim()) throw new Error('입력을 작성해 주세요.');
    const tokens = raw.trim().split(/\s+/).map(Number);
    if (tokens.some(n => !Number.isSafeInteger(n) || n < 1)) throw new Error('테스트케이스 수, N, 당근 크기는 양의 정수여야 합니다.');
    const T = tokens[0], result = [];
    let p = 1, total = 0;
    if (T > 2000) throw new Error('시각화는 테스트케이스 2,000개까지 지원합니다.');
    for (let tc = 1; tc <= T; tc++) {
      const N = tokens[p++];
      if (!N || p + N > tokens.length) throw new Error(`${tc}번 테스트케이스의 N과 당근 개수를 확인해 주세요.`);
      total += N;
      if (total > 2000) throw new Error('시각화는 전체 당근 2,000개까지 지원합니다.');
      result.push({tc, N, carrots: tokens.slice(p, p + N)});
      p += N;
    }
    if (p !== tokens.length) throw new Error('테스트케이스 뒤에 남는 입력값이 있습니다.');
    return result;
  }

  function buildSteps(allCases) {
    const out=[];
    allCases.forEach(test => {
      let currentCount=1, maxCount=1, streakStart=0, bestStart=0, bestEnd=0;
      out.push({line:5,test,i:null,currentCount,maxCount,streakStart,bestStart,bestEnd,text:`#${test.tc}: max_count = 1로 시작합니다.`,comparison:'아직 비교하지 않았습니다.'});
      out.push({line:6,test,i:null,currentCount,maxCount,streakStart,bestStart,bestEnd,text:'current_count = 1로 시작합니다.',comparison:'각 당근 하나만 있어도 연속 구간의 길이는 1입니다.'});
      for (let i=0;i<test.N-1;i++) {
        const left=test.carrots[i], right=test.carrots[i+1], grows=left<right;
        out.push({line:8,test,i,currentCount,maxCount,streakStart,bestStart,bestEnd,text:`carrots[${i}]와 carrots[${i+1}]을 비교합니다.`,comparison:`${left} < ${right} → ${grows ? '참' : '거짓'}`});
        if (grows) {
          currentCount++;
          out.push({line:9,test,i,currentCount,maxCount,streakStart,bestStart,bestEnd,text:`연속으로 커졌으므로 current_count를 ${currentCount}(으)로 증가시킵니다.`,comparison:`${left} < ${right} → current_count + 1`});
          if (maxCount < currentCount) {
            maxCount=currentCount; bestStart=streakStart; bestEnd=i+1;
            out.push({line:11,test,i,currentCount,maxCount,streakStart,bestStart,bestEnd,text:`새로운 최댓값입니다. max_count = ${maxCount}`,comparison:`max_count < current_count → ${maxCount}`});
          }
        } else {
          currentCount=1; streakStart=i+1;
          out.push({line:13,test,i,currentCount,maxCount,streakStart,bestStart,bestEnd,text:'증가가 끊겼으므로 current_count를 1로 초기화합니다.',comparison:`${left} >= ${right} → current_count = 1`});
        }
      }
      out.push({line:14,test,i:null,currentCount,maxCount,streakStart,bestStart,bestEnd,text:`#${test.tc}의 정답은 ${maxCount}입니다.`,comparison:`출력: #${test.tc} ${maxCount}`,done:true});
    });
    return out;
  }

  function renderCarrots(step, target) {
    const {test, i, streakStart, bestStart, bestEnd} = step;
    target.innerHTML = test.carrots.map((value, idx) => {
      const classes = ['carrot'];
      if (i !== null && (idx === i || idx === i + 1)) classes.push('compare');
      if (i !== null && idx >= streakStart && idx <= i + 1) classes.push('current');
      if (idx >= bestStart && idx <= bestEnd) classes.push('best');
      return `<div class="${classes.join(' ')}"><div class="carrot-bar" style="--size:${Math.min(10, value)}"></div><span class="carrot-value">${value}</span><span class="carrot-index">[${idx}]</span></div>`;
    }).join('');
  }

  function render(follow = false) {
    const s = steps[cursor];
    if (!s) return;
    document.querySelectorAll('.code-line').forEach(line => line.classList.toggle('active', Number(line.dataset.sourceLine) === s.line));
    renderCarrots(s, els.board);
    renderCarrots(s, els.mobileBoard);
    for (const [desktop, mobile, value] of [
      ['iValue', 'mobileI', s.i ?? '—'], ['currentValue', 'mobileCurrent', s.currentCount], ['maxValue', 'mobileMax', s.maxCount],
      ['comparison', 'mobileComparison', s.comparison], ['explainText', 'mobileExplanation', s.text],
      ['codeLineLabel', 'mobileCodeStatus', s.done ? '완료' : `LINE ${s.line}`],
      ['boardLabel', 'mobileCoord', `#${s.test.tc} · N=${s.test.N}`],
      ['stepLabel', 'mobileTimelineStatus', `${cursor + 1} / ${steps.length}`],
      ['phaseLabel', 'mobilePhase', s.done ? '완료' : '비교와 갱신'],
    ]) { els[desktop].textContent = els[mobile].textContent = value; }
    const output = steps.slice(0, cursor + 1).filter(step => step.done).map(step => `#${step.test.tc} ${step.maxCount}`).join('\n');
    els.outputView.textContent = els.mobileOutputView.textContent = output || '아직 출력이 없습니다.';
    for (const id of ['timeline', 'mobileTimeline']) { els[id].max = steps.length - 1; els[id].value = cursor; }
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = cursor === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = cursor === steps.length - 1;
    if (follow) {
      for (const id of ['codeViewport', 'mobileCodeViewport']) Core.centerInsideViewport(els[id], els[id].querySelector('.active'), {horizontal: false});
      for (const id of ['boardViewport', 'mobileBoardViewport']) Core.centerInsideViewport(els[id], els[id].querySelector('.compare'), {vertical: false});
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
  const markup = Core.createCodeMarkup(els.sourceCode, [], {wrap: false});
  els.codeView.innerHTML = els.mobileCodeView.innerHTML = markup;
  els.inputArea.value = samples[0].value;
  apply(samples[0].value, samples[0].id);
})();

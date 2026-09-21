(() => {
  "use strict";
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({"platform": "SWEA", "number": "27816", "title": "섬 찾기", "autoplayMs": 450, "samples": [{"id": "sample1", "label": "샘플 1", "value": "1\n5 5\nWWWWW\nWLLWW\nWLWWW\nWWLWW\nWWLLW"}, {"id": "sample2", "label": "샘플 2", "value": "1\n5 7\nLLLLLLL\nLLLLLLL\nLLLLLLL\nLLLLLLL\nLLLLLLL"}, {"id": "sample3", "label": "샘플 3", "value": "1\n6 6\nLWLWLW\nWLWLWL\nLWLWLW\nWLWLWL\nLWLWLW\nWLWLWL"}, {"id": "all", "label": "전체 샘플", "value": "3\n5 5\nWWWWW\nWLLWW\nWLWWW\nWWLWW\nWWLLW\n5 7\nLLLLLLL\nLLLLLLL\nLLLLLLL\nLLLLLLL\nLLLLLLL\n6 6\nLWLWLW\nWLWLWL\nLWLWLW\nWLWLWL\nLWLWLW\nWLWLWL\n"}], "sourceSteps": [{"text": "island = 0", "types": "init"}, {"text": "if arr[i][j] == 'L':", "types": "scan"}, {"text": "queue.append((i, j))", "types": "seed"}, {"text": "arr[i][j] = 'W'", "types": "seed-visit"}, {"text": "island += 1", "types": "island"}, {"text": "while queue:", "types": "while"}, {"text": "cr, cc = queue.pop(0)", "types": "pop"}, {"text": "nr = cr + dr", "types": "neighbor"}, {"text": "if (0 <= nr < N) and (0 <= nc < M):", "types": "bounds"}, {"text": "if arr[nr][nc] == 'L':", "types": "check"}, {"text": "queue.append((nr, nc))", "types": "enqueue"}, {"text": "arr[nr][nc] = 'W'", "types": "visit"}, {"text": "print('#{} {}'.format(tc, island))", "types": "output"}]});
  const samples = PROBLEM.samples;
  const els = Core.getByIds([...document.querySelectorAll('[id]')].map(el => el.id));
  let steps = [], cursor = 0, timer = null, selectedSample = null, stepLines;

  function parseInput(raw) {
    const lines = raw.trim().split(/\r?\n/).map(line => line.trim());
    const T = Number(lines[0]);
    if (!Number.isInteger(T) || T < 1 || T > 10) throw new Error('첫 줄에 테스트케이스 수 T(1~10)를 입력해 주세요.');
    let at = 1;
    const cases = [];
    for (let tc = 1; tc <= T; tc++) {
      const size = (lines[at++] || '').split(/\s+/).map(Number);
      if (size.length !== 2 || size.some(n => !Number.isInteger(n) || n < 5 || n > 20)) throw new Error(`${tc}번 N과 M은 5~20 사이 정수여야 합니다.`);
      const [N, M] = size, rows = lines.slice(at, at + N);
      if (rows.length !== N || rows.some(row => row.length !== M || !/^[LW]+$/.test(row))) throw new Error(`${tc}번 지도는 L과 W로 이루어진 ${N}행 ${M}열이어야 합니다.`);
      cases.push({tc, N, M, original: rows.join('')}); at += N;
    }
    if (at !== lines.length) throw new Error('테스트케이스 뒤에 남는 입력값이 있습니다.');
    return cases;
  }
  function buildSteps(cases) {
    const result = [];
    let output = '';
    for (const test of cases) {
      const board = [...test.original], queue = [];
      let island = 0, current = null, candidate = null, scan = null;
      const push = (phase, text) => {
        const position = current || scan;
        result.push({test, board: board.join(''), queue: queue.map(cell => [...cell]),
          current, candidate, phase, line: stepLines.get(phase), text, output, done: phase === 'output',
          focus: position, values: [position ? `(${position.join(', ')})` : '—', queue.length, island],
          caption: `#${test.tc} · ${test.N}×${test.M}`, comparison: candidate ? `확인 위치: (${candidate.join(', ')})` : '상하좌우 연결 · 대각선 제외',
          detail: queue.length ? 'FRONT → ' + queue.map(cell => `(${cell.join(', ')})`).join(' → ') : '큐가 비어 있습니다.'});
      };
      push('init', `#${test.tc}: 섬의 개수를 0으로 초기화합니다.`);
      for (let i = 0; i < test.N; i++) for (let j = 0; j < test.M; j++) {
        scan = [i, j]; current = null; candidate = null;
        push('scan', `(${i}, ${j})의 값이 L인지 확인합니다. ${board[i * test.M + j] === 'L' ? '새 섬을 발견했습니다.' : '바다 또는 이미 방문한 땅이므로 넘어갑니다.'}`);
        if (board[i * test.M + j] !== 'L') continue;
        queue.push([i, j]); push('seed', `새 섬의 시작점 (${i}, ${j})를 큐에 넣습니다.`);
        board[i * test.M + j] = 'W'; push('seed-visit', '시작점을 W로 바꿔 중복 방문을 막습니다.');
        island++; push('island', `섬의 개수를 ${island}로 늘립니다.`);
        while (queue.length) {
          candidate = null; push('while', `큐에 ${queue.length}개 위치가 남아 탐색을 계속합니다.`);
          current = queue.shift(); push('pop', `큐 맨 앞의 (${current.join(', ')})를 꺼냅니다.`);
          for (const [dr, dc] of [[0,-1],[-1,0],[0,1],[1,0]]) {
            candidate = [current[0] + dr, current[1] + dc];
            const [nr, nc] = candidate;
            push('neighbor', `다음 위치 (${nr}, ${nc})를 계산합니다.`);
            const inside = nr >= 0 && nr < test.N && nc >= 0 && nc < test.M;
            push('bounds', inside ? '지도 안에 있는 위치입니다.' : '지도 밖이므로 건너뜁니다.');
            if (!inside) continue;
            push('check', board[nr * test.M + nc] === 'L' ? '연결된 미방문 땅 L을 발견했습니다.' : 'W이므로 큐에 다시 넣지 않습니다.');
            if (board[nr * test.M + nc] !== 'L') continue;
            queue.push([nr, nc]); push('enqueue', `(${nr}, ${nc})를 큐 뒤에 넣습니다.`);
            board[nr * test.M + nc] = 'W'; push('visit', '방문한 땅을 W로 바꿉니다. 같은 섬이므로 섬 개수는 늘리지 않습니다.');
          }
        }
      }
      current = candidate = scan = null;
      output += `#${test.tc} ${island}\n`;
      push('output', `지도를 모두 확인했습니다. 섬 ${island}개를 출력합니다.`);
    }
    return result;
  }
  function renderBoard(target, s) {
    target.style.gridTemplateColumns = `repeat(${s.test.M}, 34px)`;
    const queued = new Set(s.queue.map(([r,c]) => r * s.test.M + c));
    const matches = (point, index) => point && point[0] * s.test.M + point[1] === index && point[0] >= 0 && point[0] < s.test.N && point[1] >= 0 && point[1] < s.test.M;
    target.innerHTML = [...s.board].map((value, index) => {
      const visited = s.test.original[index] === 'L' && value === 'W';
      const classes = ['island-cell', visited ? 'visited' : value === 'L' ? 'land' : 'water'];
      if (queued.has(index)) classes.push('queued');
      if (matches(s.focus, index)) classes.push('current');
      if (matches(s.candidate, index)) classes.push('candidate');
      const r = Math.floor(index / s.test.M), c = index % s.test.M;
      return `<div class="${classes.join(' ')}" title="(${r}, ${c})${visited ? ' 방문한 땅' : ''}">${value}</div>`;
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

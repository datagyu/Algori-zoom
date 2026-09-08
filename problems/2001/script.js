(() => {
  const SOURCE = document.getElementById('sourceCode').content.textContent.trimEnd().split('\n');
  const samples = [
    {
      id: 'one',
      label: '샘플 1',
      text: `5 2\n1 3 3 6 7\n8 13 9 12 8\n4 16 11 12 6\n2 4 1 23 2\n9 13 4 7 3`,
    },
    {
      id: 'two',
      label: '샘플 2',
      text: `6 3\n29 21 26 9 5 8\n21 19 8 0 21 19\n9 24 2 11 4 24\n19 29 1 0 21 19\n10 29 6 18 4 3\n29 11 15 3 3 29`,
    },
  ];

  const els = Object.fromEntries([
    'codeViewport','codeView','codeLineLabel','boardViewport','board','boardLabel','phaseLabel',
    'iValue','jValue','rValue','cValue','totalValue','maxValue','explainText','prevBtn','playBtn',
    'restartBtn','nextBtn','timeline','stepLabel','inputArea','applyBtn','sampleButtons','inputError',
  ].map(id => [id, document.getElementById(id)]));

  const state = {
    N: 5,
    M: 2,
    board: [],
    steps: [],
    stepIndex: 0,
    timer: null,
    selectedSample: 'one',
    cells: [],
    codeLines: [],
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  function highlightCode(line) {
    let s = escapeHtml(line);
    s = s.replace(/(&#39;[^']*&#39;|&quot;[^&]*&quot;)/g, '<span class="str">$1</span>');
    s = s.replace(/\b(for|in|if|else|print)\b/g, '<span class="kw">$1</span>');
    s = s.replace(/\b(range|int|input|map|list)\b/g, '<span class="fn">$1</span>');
    s = s.replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
    return s;
  }

  function renderCode() {
    els.codeView.innerHTML = SOURCE.map((line, index) => (
      `<span class="code-line" data-line="${index + 1}"><span class="ln">${index + 1}</span><span>${highlightCode(line)}</span></span>`
    )).join('');
    state.codeLines = [...els.codeView.querySelectorAll('.code-line')];
  }

  function parseInput(text) {
    const lines = text.trim().split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (!lines.length) throw new Error('입력을 확인해주세요.');
    const first = lines[0].split(/\s+/).map(Number);
    if (first.length !== 2 || first.some(Number.isNaN)) throw new Error('첫 줄에는 N과 M을 입력해주세요.');
    const [N, M] = first;
    if (N < 5 || N > 15) throw new Error('N은 5 이상 15 이하입니다.');
    if (M < 2 || M > N) throw new Error('M은 2 이상 N 이하입니다.');
    if (lines.length !== N + 1) throw new Error(`보드는 정확히 ${N}줄이어야 합니다.`);
    const board = lines.slice(1).map((line, row) => {
      const nums = line.split(/\s+/).map(Number);
      if (nums.length !== N || nums.some(Number.isNaN)) throw new Error(`${row + 1}번째 행은 숫자 ${N}개가 필요합니다.`);
      if (nums.some(v => v < 0 || v > 30)) throw new Error('각 영역의 파리 수는 0 이상 30 이하입니다.');
      return nums;
    });
    return { N, M, board };
  }

  function buildSteps() {
    const steps = [];
    let maxValue = 0;
    let best = null;

    for (let i = 0; i < state.N - state.M + 1; i++) {
      steps.push({ line: 7, phase: 'MOVE I', i, j: 0, r: null, c: null, total: 0, maxValue, best, message: `i = ${i}. 파리채의 시작 행을 선택합니다.` });
      for (let j = 0; j < state.N - state.M + 1; j++) {
        let total = 0;
        steps.push({ line: 8, phase: 'MOVE J', i, j, r: null, c: null, total, maxValue, best, message: `파리채를 (${i}, ${j}) 위치에 놓습니다.` });
        steps.push({ line: 9, phase: 'RESET', i, j, r: null, c: null, total, maxValue, best, message: '새 위치의 합을 구하기 위해 total을 0으로 초기화합니다.' });

        for (let r = 0; r < state.M; r++) {
          steps.push({ line: 10, phase: 'ROW', i, j, r, c: null, total, maxValue, best, message: `파리채 내부 r = ${r} 행을 확인합니다.` });
          for (let c = 0; c < state.M; c++) {
            steps.push({ line: 11, phase: 'CELL', i, j, r, c, total, maxValue, best, message: `파리채 내부 (${r}, ${c}) 칸을 선택합니다.` });
            const value = state.board[i + r][j + c];
            total += value;
            steps.push({ line: 12, phase: 'ADD', i, j, r, c, total, maxValue, best, message: `board[${i + r}][${j + c}] = ${value}를 더해 total = ${total}.` });
          }
        }

        steps.push({ line: 14, phase: 'COMPARE', i, j, r: null, c: null, total, maxValue, best, message: `${maxValue} < ${total} 인지 비교합니다.` });
        if (maxValue < total) {
          maxValue = total;
          best = { i, j };
          steps.push({ line: 15, phase: 'UPDATE', i, j, r: null, c: null, total, maxValue, best, message: `더 큰 합을 찾았습니다. max_value = ${maxValue}.` });
        }
      }
    }

    steps.push({ line: 17, phase: 'DONE', i: null, j: null, r: null, c: null, total: null, maxValue, best, message: `모든 위치를 확인했습니다. 정답은 ${maxValue}입니다.` });
    state.steps = steps;
  }

  function renderBoard() {
    els.board.style.gridTemplateColumns = `repeat(${state.N}, max-content)`;
    els.board.innerHTML = '';
    state.cells = Array.from({ length: state.N }, () => Array(state.N));
    for (let r = 0; r < state.N; r++) {
      for (let c = 0; c < state.N; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = state.board[r][c];
        cell.dataset.r = r;
        cell.dataset.c = c;
        els.board.appendChild(cell);
        state.cells[r][c] = cell;
      }
    }
    els.boardLabel.textContent = `N=${state.N} · M=${state.M}`;
  }

  function inWindow(row, col, top, left) {
    return top != null && left != null && row >= top && row < top + state.M && col >= left && col < left + state.M;
  }

  function updateBoardClasses(step) {
    for (let r = 0; r < state.N; r++) {
      for (let c = 0; c < state.N; c++) {
        const cell = state.cells[r][c];
        cell.classList.toggle('swatter', inWindow(r, c, step.i, step.j));
        cell.classList.toggle('best', step.best && inWindow(r, c, step.best.i, step.best.j));
        cell.classList.remove('current');
      }
    }
    if (step.r != null && step.c != null) {
      const row = step.i + step.r;
      const col = step.j + step.c;
      state.cells[row]?.[col]?.classList.add('current');
    }
  }

  function centerActiveCode(line) {
    const node = state.codeLines[line - 1];
    if (!node) return;
    const top = node.offsetTop - (els.codeViewport.clientHeight - node.offsetHeight) / 2;
    els.codeViewport.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function centerBoard(step) {
    if (step.i == null || step.j == null) return;
    const row = step.r == null ? step.i : step.i + step.r;
    const col = step.c == null ? step.j : step.j + step.c;
    const cell = state.cells[row]?.[col];
    if (!cell) return;
    const left = cell.offsetLeft - (els.boardViewport.clientWidth - cell.offsetWidth) / 2;
    const top = cell.offsetTop - (els.boardViewport.clientHeight - cell.offsetHeight) / 2;
    els.boardViewport.scrollTo({ left: Math.max(0, left), top: Math.max(0, top), behavior: 'smooth' });
  }

  function renderStep({ follow = true } = {}) {
    const step = state.steps[state.stepIndex];
    if (!step) return;
    state.codeLines.forEach((line, index) => line.classList.toggle('active', index + 1 === step.line));
    updateBoardClasses(step);

    els.codeLineLabel.textContent = `LINE ${step.line}`;
    els.phaseLabel.textContent = step.phase;
    els.phaseLabel.className = step.phase === 'UPDATE' ? 'phase-update' : step.phase === 'ADD' ? 'phase-add' : '';
    els.iValue.textContent = step.i ?? '-';
    els.jValue.textContent = step.j ?? '-';
    els.rValue.textContent = step.r ?? '-';
    els.cValue.textContent = step.c ?? '-';
    els.totalValue.textContent = step.total ?? '-';
    els.maxValue.textContent = step.maxValue;
    els.explainText.textContent = step.message;
    els.timeline.value = state.stepIndex;
    els.stepLabel.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.prevBtn.disabled = state.stepIndex === 0;
    els.nextBtn.disabled = state.stepIndex === state.steps.length - 1;

    if (follow) {
      centerActiveCode(step.line);
      centerBoard(step);
    }
  }

  function stopPlayback() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
    els.playBtn.textContent = '▶ 자동 실행';
  }

  function goTo(index, options = {}) {
    state.stepIndex = Math.max(0, Math.min(index, state.steps.length - 1));
    renderStep(options);
  }

  function togglePlayback() {
    if (state.timer) {
      stopPlayback();
      return;
    }
    if (state.stepIndex >= state.steps.length - 1) state.stepIndex = 0;
    els.playBtn.textContent = '⏸ 일시정지';
    state.timer = setInterval(() => {
      if (state.stepIndex >= state.steps.length - 1) {
        stopPlayback();
        return;
      }
      state.stepIndex += 1;
      renderStep({ follow: true });
    }, 550);
  }

  function renderSampleButtons() {
    els.sampleButtons.innerHTML = '';
    for (const sample of samples) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = sample.label;
      button.dataset.sample = sample.id;
      button.classList.toggle('selected', state.selectedSample === sample.id);
      els.sampleButtons.appendChild(button);
    }
  }

  function applyText(text, sampleId = null) {
    stopPlayback();
    try {
      const parsed = parseInput(text);
      state.N = parsed.N;
      state.M = parsed.M;
      state.board = parsed.board;
      state.selectedSample = sampleId;
      els.inputError.textContent = '';
      renderBoard();
      buildSteps();
      state.stepIndex = 0;
      els.timeline.max = Math.max(0, state.steps.length - 1);
      renderSampleButtons();
      renderStep({ follow: true });
    } catch (error) {
      els.inputError.textContent = error.message;
    }
  }

  els.prevBtn.addEventListener('click', () => { stopPlayback(); goTo(state.stepIndex - 1, { follow: true }); });
  els.nextBtn.addEventListener('click', () => { stopPlayback(); goTo(state.stepIndex + 1, { follow: true }); });
  els.restartBtn.addEventListener('click', () => { stopPlayback(); goTo(0, { follow: true }); });
  els.playBtn.addEventListener('click', togglePlayback);
  els.timeline.addEventListener('input', event => { stopPlayback(); goTo(Number(event.target.value), { follow: true }); });
  els.applyBtn.addEventListener('click', () => applyText(els.inputArea.value, null));
  els.inputArea.addEventListener('input', () => { state.selectedSample = null; renderSampleButtons(); });
  els.sampleButtons.addEventListener('click', event => {
    const button = event.target.closest('button[data-sample]');
    if (!button) return;
    const sample = samples.find(item => item.id === button.dataset.sample);
    if (!sample) return;
    els.inputArea.value = sample.text;
    applyText(sample.text, sample.id);
  });

  renderCode();
  els.inputArea.value = samples[0].text;
  applyText(samples[0].text, samples[0].id);
})();

(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
  "number": "26059",
  "title": "과일 등급 분류",
  "autoplayMs": 350,
  "defaultSampleId": "one",
  "sourceSteps": [
    {
      "text": "ans = 100000",
      "types": "init"
    },
    {
      "text": "for i in range(n - 1):",
      "types": "sort-pass"
    },
    {
      "text": "for j in range(n - 1 - i):",
      "types": "sort-pair"
    },
    {
      "text": "if fruits[j] > fruits[j + 1]:",
      "types": "sort-check"
    },
    {
      "text": "fruits[j], fruits[j + 1] = fruits[j + 1], fruits[j]",
      "types": "swap"
    },
    {
      "text": "for i in range(1, n):",
      "types": "first"
    },
    {
      "text": "if fruits[i - 1] == fruits[i]:",
      "types": "first-check"
    },
    {
      "text": "continue",
      "types": "first-skip",
      "occurrence": 1
    },
    {
      "text": "for j in range(i + 1, n):",
      "types": "second"
    },
    {
      "text": "if fruits[j - 1] == fruits[j]:",
      "types": "second-check"
    },
    {
      "text": "continue",
      "types": "second-skip",
      "occurrence": 2
    },
    {
      "text": "E = i",
      "types": "economy"
    },
    {
      "text": "S = j - i",
      "types": "standard"
    },
    {
      "text": "P = n - j",
      "types": "premium"
    },
    {
      "text": "if (l <= E <= h) and (l <= S <= h) and (l <= P <= h):",
      "types": "bounds"
    },
    {
      "text": "c_ans = max(E, S, P) - min(E, S, P)",
      "types": "difference"
    },
    {
      "text": "if c_ans < ans:",
      "types": "best-check"
    },
    {
      "text": "ans = c_ans",
      "types": "best"
    },
    {
      "text": "if ans == 100000:",
      "types": "final-check"
    },
    {
      "text": "ans = -1",
      "types": "impossible"
    },
    {
      "text": "print('#{} {}'.format(tc, ans))",
      "types": "output"
    }
  ],
  "samples": [
    {
      "id": "one",
      "label": "첨부 예제 1",
      "value": "1\n5 1 4\n3 1 4 5 5"
    },
    {
      "id": "sample2",
      "label": "첨부 예제 2 · 균등 분류",
      "value": "1\n6 2 2\n1 1 2 2 4 4"
    },
    {
      "id": "sample3",
      "label": "첨부 예제 3 · 분류 불가",
      "value": "1\n4 2 2\n10 10 10 10"
    },
    {
      "id": "sample4",
      "label": "첨부 예제 4",
      "value": "1\n5 1 3\n1 1 1 2 5"
    },
    {
      "id": "all",
      "label": "첨부 예제 전체",
      "value": "4\n5 1 4\n3 1 4 5 5\n6 2 2\n1 1 2 2 4 4\n4 2 2\n10 10 10 10\n5 1 3\n1 1 1 2 5"
    }
  ]
});
  const samples = PROBLEM.samples;
  const defaultSample = samples[0];
  const els = Core.getByIds(["sourceCode","resetBtn","prevBtn","nextBtn","playBtn","replayBtn","skipBtn","speedRange","speedLabel","stepLabel","timeline","codeLineLabel","codeViewport","codeView","boardLabel","boardViewport","board","bestPath","phaseLabel","iValue","jValue","economyValue","standardValue","premiumValue","answerValue","differenceValue","boundsValue","explainText","outputView","inputArea","applyBtn","sampleButtons","inputError","mobileCoord","mobileCodeStatus","mobileCodeViewport","mobileCodeView","mobilePhase","mobileBoardViewport","mobileBoard","mobileBestPath","mobileExplanation","mobileStateMeta","mobileCounts","mobileAnswer","mobileOutputView","mobilePlayBtn","mobilePrevBtn","mobileTimeline","mobileTimelineStatus","mobileNextBtn"]);
  const state = {steps:[],stepIndex:0,timer:null,speed:1,selectedSample:defaultSample.id,codeLines:[],mobileCodeLines:[]};
  let stepLineMap;
  function renderCode() {
    const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps, {
      wrap: false,
      editor: true,
    });
    els.codeView.innerHTML = markup;
    els.mobileCodeView.innerHTML = markup;
    state.codeLines = Core.createLineMap(els.codeView);
    stepLineMap = Core.createStepLineMap(els.codeView);
    state.mobileCodeLines = Core.createLineMap(els.mobileCodeView);
  }


  function parseInput(text) {
    const tokens = text.trim().split(/\s+/);
    if (!text.trim() || tokens.some(token => !/^\d+$/.test(token))) throw new Error("T, N, l, h와 무게를 정수로 입력해주세요.");
    const values = tokens.map(Number);
    let pos = 0;
    const T = values[pos++];
    if (!Number.isInteger(T) || T < 1 || T > 10) throw new Error("시각화는 예제 1~10개를 지원합니다.");
    const cases = [];
    for (let tc = 1; tc <= T; tc++) {
      const n = values[pos++], l = values[pos++], h = values[pos++];
      if (!Number.isInteger(n) || n < 3 || n > 50) throw new Error(`#${tc}: 단계별 시각화의 N은 3~50입니다.`);
      if (!Number.isInteger(l) || !Number.isInteger(h) || l < 1 || l > h || h > n) throw new Error(`#${tc}: 1 ≤ l ≤ h ≤ N이어야 합니다.`);
      const fruits = values.slice(pos, pos + n);
      if (fruits.length !== n) throw new Error(`#${tc}: 무게 ${n}개가 필요합니다.`);
      if (fruits.some(weight => !Number.isInteger(weight) || weight < 1 || weight > 10000)) throw new Error(`#${tc}: 무게는 1~10,000입니다.`);
      cases.push({n,l,h,fruits});
      pos += n;
    }
    if (pos !== values.length) throw new Error("T와 과일 개수를 확인해주세요. 남는 입력이 있습니다.");
    return {cases};
  }

  function buildSteps(cases) {
    const steps = [];
    let output = "";
    cases.forEach(({n,l,h,fruits:input},index) => {
      let fruits = [...input];
      let i = null, j = null, E = null, S = null, P = null, ans = 100000, difference = null;
      let first = null, second = null, best = null, sorting = false, valid = null;
      const push = (phase,message) => {
        steps.push({phase,message,line:stepLineMap.get(phase),tc:index+1,n,l,h,fruits,i,j,E,S,P,ans,difference,first,second,best,sorting,valid,output});
      };
      push("init","최솟값 ans를 100000으로 초기화합니다.");
      sorting = true;
      for (i = 0; i < n-1; i++) {
        j = null;
        push("sort-pass",`버블 정렬 ${i+1}회차: 인접한 두 무게를 비교합니다.`);
        for (j = 0; j < n-1-i; j++) {
          push("sort-pair",`인덱스 ${j}, ${j+1}을 선택합니다.`);
          const swap = fruits[j] > fruits[j+1];
          push("sort-check",`${fruits[j]} > ${fruits[j+1]}: ${swap ? "참 · 두 값을 교환합니다." : "거짓 · 순서를 유지합니다."}`);
          if (swap) {
            fruits = [...fruits];
            [fruits[j],fruits[j+1]] = [fruits[j+1],fruits[j]];
            push("swap","두 과일의 위치를 교환했습니다.");
          }
        }
      }
      sorting = false;
      for (i = 1; i < n; i++) {
        first = i; second = null; j = null; E = S = P = difference = null; valid = null;
        push("first",`첫 경계 i = ${i}: 하 등급과 나머지를 나눕니다.`);
        push("first-check",`${fruits[i-1]} == ${fruits[i]}: ${fruits[i-1] === fruits[i] ? "참" : "거짓"}`);
        if (fruits[i-1] === fruits[i]) {
          push("first-skip","같은 무게 사이에는 경계를 둘 수 없어 다음 i로 넘어갑니다.");
          continue;
        }
        for (j = i+1; j < n; j++) {
          second = j; E = S = P = difference = null; valid = null;
          push("second",`두 번째 경계 j = ${j}: 중 등급과 상 등급을 나눕니다.`);
          push("second-check",`${fruits[j-1]} == ${fruits[j]}: ${fruits[j-1] === fruits[j] ? "참" : "거짓"}`);
          if (fruits[j-1] === fruits[j]) {
            push("second-skip","같은 무게가 다른 등급으로 나뉘므로 다음 j로 넘어갑니다.");
            continue;
          }
          E = i; push("economy",`하 등급 E = i = ${E}개`);
          S = j-i; push("standard",`중 등급 S = j - i = ${S}개`);
          P = n-j; push("premium",`상 등급 P = n - j = ${P}개`);
          valid = [E,S,P].every(count => count >= l && count <= h);
          push("bounds",`등급별 개수 (${E}, ${S}, ${P})가 모두 ${l}~${h}개: ${valid ? "충족" : "불충족"}`);
          if (valid) {
            difference = Math.max(E,S,P)-Math.min(E,S,P);
            push("difference",`가장 많은 등급 − 가장 적은 등급 = ${difference}`);
            push("best-check",`${difference} < ${ans}: ${difference < ans ? "참" : "거짓"}`);
            if (difference < ans) {
              ans = difference; best = {first:i,second:j,E,S,P};
              push("best",`최솟값 ans를 ${ans}로 갱신합니다.`);
            }
          }
        }
      }
      i = n-1; j = null; first = second = null; E = S = P = difference = null; valid = null;
      push("final-check",ans === 100000 ? "조건에 맞는 분류가 없었습니다." : `모든 경계를 검사했습니다. 최솟값은 ${ans}입니다.`);
      if (ans === 100000) { ans = -1; push("impossible","분류할 수 없으므로 ans = -1로 바꿉니다."); }
      output += `#${index+1} ${ans}\n`;
      push("output",`#${index+1} ${ans}을 출력합니다.`);
    });
    return steps;
  }

  function renderBoard(container, step) {
    const finished = step.phase === "output" && step.best;
    const first = finished ? step.best.first : step.first;
    const second = finished ? step.best.second : step.second;
    container.innerHTML = step.fruits.map((weight,index) => {
      const grade = first === null ? "" : index < first ? "economy" : second === null ? "" : index < second ? "standard" : "premium";
      const label = {economy:"E",standard:"S",premium:"P"}[grade] || "·";
      const comparing = step.sorting && step.j !== null && (index === step.j || index === step.j+1);
      const boundary = index === first || index === second;
      return `<div class="fruit-cell ${grade}${comparing ? " comparing" : ""}${boundary ? " boundary" : ""}" aria-label="인덱스 ${index}, 무게 ${weight}, 등급 ${label}"><small>${index}</small><strong>${weight}</strong><span>${label}</span></div>`;
    }).join("");
  }

  function render({follow=true}={}) {
    const step = state.steps[state.stepIndex];
    if (!step) return;
    renderBoard(els.board,step);
    renderBoard(els.mobileBoard,step);
    for (const lines of [state.codeLines,state.mobileCodeLines]) lines.forEach((line,n) => line.classList.toggle("active",n === step.line));
    els.boardLabel.textContent = `#${step.tc} · N=${step.n}`;
    els.codeLineLabel.textContent = els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.phaseLabel.textContent = els.mobilePhase.textContent = step.phase === "output" ? "완료" : step.sorting ? "버블 정렬" : "등급 분류";
    const fields = {iValue:step.i,jValue:step.j,economyValue:step.E,standardValue:step.S,premiumValue:step.P,answerValue:step.ans,differenceValue:step.difference,boundsValue:`${step.l} ~ ${step.h}`};
    for (const [id,value] of Object.entries(fields)) els[id].textContent = value ?? "—";
    els.mobileCounts.textContent = [step.E,step.S,step.P].map(value => value ?? "—").join(" / ");
    els.mobileAnswer.textContent = step.ans;
    els.mobileCoord.textContent = `#${step.tc} · i = ${step.i ?? "—"} · j = ${step.j ?? "—"}`;
    els.mobileStateMeta.textContent = `허용 개수 ${step.l} ~ ${step.h}`;
    els.explainText.textContent = els.mobileExplanation.textContent = step.message;
    els.explainText.classList.toggle("fruit-invalid",step.valid === false);
    els.mobileExplanation.classList.toggle("fruit-invalid",step.valid === false);
    els.outputView.textContent = els.mobileOutputView.textContent = step.output || "아직 출력이 없습니다.";
    const best = step.best;
    els.bestPath.textContent = els.mobileBestPath.textContent = best ? `E ${best.E}개 · S ${best.S}개 · P ${best.P}개 / 차이 ${step.ans} / 경계 ${best.first}, ${best.second}` : "아직 조건을 만족하는 분류가 없습니다.";
    els.timeline.value = els.mobileTimeline.value = state.stepIndex;
    els.stepLabel.textContent = els.mobileTimelineStatus.textContent = `${state.stepIndex+1} / ${state.steps.length}`;
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = state.stepIndex === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = state.stepIndex === state.steps.length-1;
    if (follow) {
      const mobile = matchMedia("(max-width:760px)").matches;
      Core.centerInsideViewport(mobile ? els.mobileCodeViewport : els.codeViewport,(mobile ? state.mobileCodeLines : state.codeLines).get(step.line),{horizontal:false});
      const container = mobile ? els.mobileBoard : els.board;
      Core.centerInsideViewport(mobile ? els.mobileBoardViewport : els.boardViewport,container.querySelector(".comparing, .boundary"));
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
      const steps = buildSteps(parsed.cases);
      Object.assign(state, parsed, { steps, selectedSample: sampleId, stepIndex: 0 });
      els.inputError.textContent = "";




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

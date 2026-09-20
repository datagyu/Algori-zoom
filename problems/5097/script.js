(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    platform: "SWEA", number: "5097", level: "D3", title: "회전", autoplayMs: 600, defaultSampleId: "one",
    sourceSteps: [
      { text: "numbers = list(map(int, input().split()))", types: "numbers", occurrence: 1 },
      { text: "count = 0", types: "count", occurrence: 1 },
      { text: "while count < M:", types: "while", occurrence: 1 },
      { text: "numbers.append(numbers.pop(0))", types: "pop append", occurrence: 1 },
      { text: "count += 1", types: "increment", occurrence: 1 },
      { text: "print('#{} {}'.format(tc, numbers[0]))", types: "output", occurrence: 1 },
    ],
    samples: [
      { id: "one", label: "샘플 1 · 회전 흐름", value: "1\n3 10\n5527 731 31274" },
      { id: "all", label: "첨부 예제 전체", value: "3\n3 10\n5527 731 31274\n5 12\n18140 14618 18641 22536 23097\n10 23\n17236 31594 29094 2412 4316 5044 28515 24737 11578 7907" },
    ],
  });

  const samples = PROBLEM.samples;
  const defaultSample = samples[0];
  const els = Core.getByIds([
    "sourceCode","resetBtn","prevBtn","nextBtn","playBtn","replayBtn","skipBtn","speedRange","speedLabel","stepLabel","timeline",
    "codeLineLabel","codeViewport","codeView","boardLabel","boardViewport","board","phaseLabel","countValue","moveValue","poppedValue",
    "frontValue","remainingValue","lengthValue","explainText","historyView","historyLabel","outputView","inputArea","applyBtn","sampleButtons","inputError",
    "mobileCoord","mobileCodeStatus","mobileCodeViewport","mobileCodeView","mobilePhase","mobileBoardViewport","mobileBoard","mobileHistoryView","mobileExplanation",
    "mobileStateMeta","mobileCount","mobileMove","mobilePopped","mobileFront","mobileRemaining","mobileOutputView","mobilePrevBtn","mobileTimeline","mobileTimelineStatus","mobileNextBtn"
  ]);
  const state = { cases: [], steps: [], stepIndex: 0, timer: null, speed: 1, selectedSample: defaultSample.id, codeLines: null, mobileCodeLines: null };
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
    if (!text.trim() || tokens.some((token) => !/^\d+$/.test(token))) throw new Error("입력은 양의 정수로 작성해주세요.");
    const values = tokens.map(Number);
    const T = values[0];
    if (T < 1 || T > 50) throw new Error("T는 1 이상 50 이하입니다.");
    let cursor = 1;
    const cases = [];
    for (let tc = 1; tc <= T; tc++) {
      if (cursor + 1 >= values.length) throw new Error("각 케이스의 N과 M을 확인해주세요.");
      const N = values[cursor++];
      const M = values[cursor++];
      if (N < 3 || N > 20 || M < N || M > 1000) throw new Error("N은 3~20, M은 N~1000 범위여야 합니다.");
      const numbers = values.slice(cursor, cursor + N);
      cursor += N;
      if (numbers.length !== N) throw new Error(`테스트케이스 ${tc}의 숫자 ${N}개를 확인해주세요.`);
      cases.push({ N, M, numbers });
    }
    if (cursor !== values.length) throw new Error("T와 입력된 테스트 케이스 수, N과 숫자 개수를 확인해주세요.");
    return { cases };
  }

  function buildSteps() {
    const steps = [];
    let output = "";
    state.cases.forEach((data, index) => {
      const numbers = [...data.numbers];
      let count = 0;
      let popped = null;
      let moved = null;
      const history = [];
      let operation = "수열 준비";
      const push = (phase, message, extra = {}) => steps.push({
        ...data, tc: index + 1, numbers: [...numbers], count, popped, moved, history: history.map((item) => ({ ...item })),
        operation, phase, line: stepLineMap.get(phase), message, output, ...extra,
      });

      push("numbers", `숫자 ${data.N}개를 순서대로 준비합니다. 맨 왼쪽이 큐의 FRONT입니다.`);
      operation = "count = 0";
      push("count", "아직 회전하지 않았으므로 count를 0으로 시작합니다.");

      while (count < data.M) {
        popped = null;
        moved = null;
        operation = `${count} < ${data.M}`;
        push("while", `count(${count})가 M(${data.M})보다 작으므로 한 번 더 회전합니다.`);

        popped = numbers.shift();
        operation = `pop(0) → ${popped}`;
        push("pop", `맨 앞 숫자 ${popped}를 꺼냅니다.`, { poppedOnly: popped });

        numbers.push(popped);
        moved = popped;
        operation = `append(${popped})`;
        history.push({ turn: count + 1, value: popped });
        push("append", `${popped}를 맨 뒤에 붙입니다. 큐가 한 칸 왼쪽으로 회전했습니다.`);

        count += 1;
        operation = `count = ${count}`;
        push("increment", `회전 횟수를 ${count}로 증가시킵니다.`);
      }

      popped = null;
      moved = null;
      operation = "출력";
      output += `#${index + 1} ${numbers[0]}\n`;
      push("output", `M번 회전이 끝났습니다. 현재 맨 앞 숫자 ${numbers[0]}를 출력합니다.`);
    });
    state.steps = steps;
  }

  function numberCard(value, index, step) {
    const card = document.createElement("div");
    card.className = "number-card";
    if (index === 0) card.classList.add("front");
    if (step.moved === value && index === step.numbers.length - 1 && step.phase === "append") card.classList.add("moved");
    card.textContent = value;
    return card;
  }

  function renderQueue(container, step) {
    container.replaceChildren();
    if (step.phase === "pop" && step.poppedOnly != null) {
      const popped = document.createElement("div");
      popped.className = "number-card popped";
      popped.textContent = step.poppedOnly;
      container.appendChild(popped);
      const arrow = document.createElement("span");
      arrow.className = "queue-arrow";
      arrow.textContent = "→";
      container.appendChild(arrow);
    }
    step.numbers.forEach((value, index) => {
      container.appendChild(numberCard(value, index, step));
      if (index < step.numbers.length - 1) {
        const arrow = document.createElement("span");
        arrow.className = "queue-arrow";
        arrow.textContent = "→";
        container.appendChild(arrow);
      }
    });
  }

  function renderHistory(container, step) {
    container.replaceChildren();
    if (!step.history.length) {
      const empty = document.createElement("p");
      empty.className = "history-empty";
      empty.textContent = "아직 회전한 기록이 없습니다.";
      container.appendChild(empty);
      return;
    }
    step.history.forEach((item) => {
      const node = document.createElement("div");
      node.className = "history-item";
      node.innerHTML = `<strong>${item.turn}회전</strong>${item.value} 이동`;
      container.appendChild(node);
    });
  }

  function highlight(lines, number) { lines.forEach((line, key) => line.classList.toggle("active", key === number)); }

  function render({ follow = true } = {}) {
    const step = state.steps[state.stepIndex];
    if (!step) return;
    highlight(state.codeLines, step.line);
    highlight(state.mobileCodeLines, step.line);
    renderQueue(els.board, step);
    renderQueue(els.mobileBoard, step);
    renderHistory(els.historyView, step);
    renderHistory(els.mobileHistoryView, step);

    const front = step.numbers[0] ?? "—";
    const remaining = Math.max(0, step.M - step.count);
    els.codeLineLabel.textContent = `LINE ${step.line}`;
    els.boardLabel.textContent = `#${step.tc} · N=${step.N} · M=${step.M}`;
    els.phaseLabel.textContent = step.phase.toUpperCase();
    els.countValue.textContent = step.count;
    els.moveValue.textContent = step.M;
    els.poppedValue.textContent = step.popped ?? "—";
    els.frontValue.textContent = front;
    els.remainingValue.textContent = remaining;
    els.lengthValue.textContent = step.numbers.length;
    els.explainText.textContent = step.message;
    els.historyLabel.textContent = step.operation;
    els.outputView.textContent = step.output || "아직 출력이 없습니다.";

    els.mobileCoord.textContent = `#${step.tc} · N=${step.N}`;
    els.mobileCodeStatus.textContent = `LINE ${step.line}`;
    els.mobilePhase.textContent = step.phase.toUpperCase();
    els.mobileExplanation.textContent = step.message;
    els.mobileStateMeta.textContent = step.operation;
    els.mobileCount.textContent = step.count;
    els.mobileMove.textContent = step.M;
    els.mobilePopped.textContent = step.popped ?? "—";
    els.mobileFront.textContent = front;
    els.mobileRemaining.textContent = remaining;
    els.mobileOutputView.textContent = step.output || "아직 출력이 없습니다.";

    els.timeline.value = state.stepIndex;
    els.mobileTimeline.value = state.stepIndex;
    els.stepLabel.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = state.stepIndex === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = state.stepIndex === state.steps.length - 1;
    if (follow) {
      Core.centerInsideViewport(els.codeViewport, state.codeLines.get(step.line), { horizontal: false });
      Core.centerInsideViewport(els.mobileCodeViewport, state.mobileCodeLines.get(step.line), { horizontal: false });
    }
  }

  function stopPlayback(){if(state.timer)clearTimeout(state.timer);state.timer=null;Core.updatePlaybackControls(els.playBtn,false);}
  function goTo(index,options={}){state.stepIndex=Core.clamp(index,0,state.steps.length-1);render(options);}
  function move(delta){stopPlayback();goTo(state.stepIndex+delta,{follow:true});}
  function scheduleNext(){state.timer=setTimeout(()=>{if(state.stepIndex>=state.steps.length-1){stopPlayback();return;}goTo(state.stepIndex+1,{follow:true});state.stepIndex>=state.steps.length-1?stopPlayback():scheduleNext();},PROBLEM.autoplayMs/state.speed);}
  function startPlayback(){stopPlayback();if(state.stepIndex>=state.steps.length-1)goTo(0);Core.updatePlaybackControls(els.playBtn,true);scheduleNext();}
  function togglePlayback(){state.timer?stopPlayback():startPlayback();}
  function reset(){stopPlayback();goTo(0,{follow:true});}
  function renderSampleButtons(){els.sampleButtons.replaceChildren();samples.forEach((sample)=>{const button=document.createElement("button");button.type="button";button.className="btn";button.textContent=sample.label;button.dataset.sample=sample.id;button.classList.toggle("selected",state.selectedSample===sample.id);els.sampleButtons.appendChild(button);});}
  function applyText(text,sampleId=null){stopPlayback();try{Object.assign(state,parseInput(text),{selectedSample:sampleId,stepIndex:0});els.inputError.textContent="";buildSteps();const max=Math.max(0,state.steps.length-1);els.timeline.max=els.mobileTimeline.max=max;renderSampleButtons();render({follow:true});}catch(error){els.inputError.textContent=error.message;}}

  els.prevBtn.addEventListener("click",()=>move(-1));
  els.nextBtn.addEventListener("click",()=>move(1));
  document.getElementById("mobilePlayBtn").addEventListener("click",()=>els.playBtn.click());
  els.mobilePrevBtn.addEventListener("click",()=>move(-1));
  els.mobileNextBtn.addEventListener("click",()=>move(1));
  els.resetBtn.addEventListener("click",reset);
  els.replayBtn.addEventListener("click",()=>{reset();startPlayback();});
  els.skipBtn.addEventListener("click",()=>{stopPlayback();goTo(state.steps.length-1,{follow:true});});
  els.playBtn.addEventListener("click",togglePlayback);
  els.speedRange.addEventListener("input",()=>{state.speed=Number(els.speedRange.value);els.speedLabel.textContent=`${Core.formatDecimal(state.speed)}×`;if(state.timer){clearTimeout(state.timer);scheduleNext();}});
  [els.timeline,els.mobileTimeline].forEach((timeline)=>timeline.addEventListener("input",(event)=>{stopPlayback();goTo(Number(event.target.value),{follow:true});}));
  els.applyBtn.addEventListener("click",()=>applyText(els.inputArea.value));
  els.inputArea.addEventListener("input",()=>{state.selectedSample=null;renderSampleButtons();});
  els.sampleButtons.addEventListener("click",(event)=>{const button=event.target.closest("button[data-sample]");if(!button)return;const sample=samples.find((item)=>item.id===button.dataset.sample);if(!sample)return;els.inputArea.value=sample.value;applyText(sample.value,sample.id);});

  renderCode();
  els.inputArea.value = defaultSample.value;
  applyText(defaultSample.value, defaultSample.id);
})();

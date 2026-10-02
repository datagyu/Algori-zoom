(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    number: "5204", title: "병합 정렬", autoplayMs: 520, defaultSampleId: "all",
    samples: [
      { id: "one", label: "샘플 1", value: "1\n5\n2 2 1 1 3" },
      { id: "two", label: "샘플 2", value: "1\n10\n7 5 4 1 2 10 3 6 9 8" },
      { id: "all", label: "전체 샘플", value: "2\n5\n2 2 1 1 3\n10\n7 5 4 1 2 10 3 6 9 8" },
    ],
    sourceSteps: [
      { text: "def merge(start, end):", types: "call" },
      { text: "if end - start == 1:", types: "baseCheck" },
      { text: "return", types: "baseReturn" },
      { text: "mid = (start + end) // 2", types: "mid" },
      { text: "merge(start, mid)", types: "leftCall" },
      { text: "merge(mid, end)", types: "rightCall" },
      { text: "if arr[mid - 1] > arr[end - 1]:", types: "compareEnds" },
      { text: "cnt += 1", types: "cntInc" },
      { text: "a = start", types: "initA" },
      { text: "b = mid", types: "initB" },
      { text: "result = []", types: "initResult" },
      { text: "while True:", types: "whileLoop" },
      { text: "if a >= mid and b >= end:", types: "doneCheck" },
      { text: "break", types: "mergeBreak" },
      { text: "elif a >= mid:", types: "leftExhaust" },
      { text: "result.append(arr[b])", types: "appendRightExhaust", occurrence: 1 },
      { text: "b += 1", types: "incBExhaust", occurrence: 1 },
      { text: "elif b >= end:", types: "rightExhaust" },
      { text: "result.append(arr[a])", types: "appendLeftExhaust", occurrence: 1 },
      { text: "a += 1", types: "incAExhaust", occurrence: 1 },
      { text: "elif arr[a] <= arr[b]:", types: "compareValues" },
      { text: "result.append(arr[a])", types: "appendLeftCompare", occurrence: 2 },
      { text: "a += 1", types: "incACompare", occurrence: 2 },
      { text: "else:", types: "elseRight" },
      { text: "result.append(arr[b])", types: "appendRightCompare", occurrence: 2 },
      { text: "b += 1", types: "incBCompare", occurrence: 2 },
      { text: "for i in range(len(result)):", types: "copyLoop" },
      { text: "arr[start + i] = result[i]", types: "copyBack" },
      { text: "arr = list(map(int, input().split()))", types: "caseInput" },
      { text: "cnt = 0", types: "cntInit" },
      { text: "merge(0, N)", types: "startSort" },
      { text: "print('#{} {} {}'.format(tc, arr[N // 2], cnt))", types: "output" },
    ],
  });

  const els = Core.getByIds(["sourceCode","codeView","mobileCodeView","codeViewport","mobileCodeViewport","resetBtn","prevBtn","nextBtn","playBtn","replayBtn","skipBtn","speedRange","speedLabel","timeline","mobileTimeline","stepLabel","mobileTimelineStatus","mobilePlayBtn","mobilePrevBtn","mobileNextBtn","codeLineLabel","mobileCodeStatus","board","mobileBoard","boardLabel","phaseLabel","mobilePhase","startValue","endValue","midValue","aValue","bValue","cntValue","explainText","mobileCoord","mobileExplanation","mobileStateMeta","mobileStart","mobileEnd","mobileMid","mobileCnt","detailView","mobileDetailView","detailMeta","outputView","mobileOutputView","inputArea","applyBtn","sampleButtons","inputError"]);
  const state = { steps: [], stepIndex: 0, timer: null, speed: 1, selectedSample: PROBLEM.defaultSampleId };
  let desktopLines, mobileLines, stepLines;

  function parseInput(text) {
    const tokens = text.trim().split(/\s+/).filter(Boolean).map(Number);
    if (!tokens.length || tokens.some((v) => !Number.isFinite(v))) throw new Error("숫자로 된 입력을 확인해주세요.");
    let p = 0; const T = tokens[p++]; const cases = [];
    if (!Number.isInteger(T) || T < 1 || T > 10) throw new Error("시각화에서는 T를 1~10으로 입력해주세요.");
    for (let tc = 0; tc < T; tc++) {
      const N = tokens[p++];
      if (!Number.isInteger(N) || N < 5 || N > 60) throw new Error(`#${tc + 1}의 N은 시각화를 위해 5~60으로 입력해주세요.`);
      if (p + N > tokens.length) throw new Error(`#${tc + 1}의 배열 원소가 부족합니다.`);
      const arr = tokens.slice(p, p + N); p += N;
      if (arr.some((v) => !Number.isInteger(v) || v < 0 || v > 1000000)) throw new Error("배열 원소는 0~1,000,000의 정수여야 합니다.");
      cases.push({ N, arr });
    }
    if (p !== tokens.length) throw new Error("입력 끝에 사용되지 않은 값이 있습니다.");
    return cases;
  }

  function buildSteps(cases) {
    const steps = []; let output = "";
    cases.forEach((item, ci) => {
      let arr = [...item.arr], cnt = 0;
      const push = (phase, message, extra = {}) => steps.push({ tc: ci + 1, N: item.N, arr: [...arr], cnt, start: null, end: null, mid: null, a: null, b: null, result: [], depth: 0, compareIndices: [], copyIndex: null, phase, message, output, ...extra, result: [...(extra.result || [])], compareIndices: [...(extra.compareIndices || [])] });
      push("caseInput", `#${ci + 1} 입력 배열을 확인합니다: ${arr.join(", ")}`);
      push("cntInit", "오른쪽 원소가 먼저 복사되는 조건의 횟수 cnt를 0으로 초기화합니다.");
      push("startSort", `merge(0, ${item.N})을 호출해 전체 배열 정렬을 시작합니다.`, { start: 0, end: item.N });

      function merge(start, end, depth) {
        const snap = (phase, message, extra = {}) => push(phase, message, { start, end, depth, ...extra });
        snap("call", `merge(${start}, ${end}) 호출 · 현재 구간은 인덱스 ${start}부터 ${end - 1}까지입니다.`);
        snap("baseCheck", `end - start = ${end - start}. 원소가 하나인지 확인합니다.`);
        if (end - start === 1) {
          snap("baseReturn", `원소가 하나(${arr[start]})이므로 더 나누지 않고 반환합니다.`);
          return;
        }
        const mid = (start + end) >> 1;
        snap("mid", `mid = (${start} + ${end}) // 2 = ${mid}로 나눕니다.`, { mid });
        snap("leftCall", `왼쪽 구간 [${start}, ${mid})을 먼저 정렬합니다.`, { mid });
        merge(start, mid, depth + 1);
        snap("rightCall", `오른쪽 구간 [${mid}, ${end})을 정렬합니다.`, { mid });
        merge(mid, end, depth + 1);

        const endCompare = arr[mid - 1] > arr[end - 1];
        snap("compareEnds", `왼쪽 마지막 ${arr[mid - 1]} > 오른쪽 마지막 ${arr[end - 1]} → ${endCompare ? "참" : "거짓"}`, { mid, compareIndices: [mid - 1, end - 1] });
        if (endCompare) {
          cnt += 1;
          snap("cntInc", `조건을 만족하므로 cnt를 ${cnt}로 증가시킵니다.`, { mid, compareIndices: [mid - 1, end - 1] });
        }

        let a = start, b = mid, result = [];
        snap("initA", `왼쪽 포인터 a를 ${start}로 둡니다.`, { mid, a, b, result });
        snap("initB", `오른쪽 포인터 b를 ${mid}로 둡니다.`, { mid, a, b, result });
        snap("initResult", "병합 결과를 담을 result를 비웁니다.", { mid, a, b, result });
        while (true) {
          snap("whileLoop", `a=${a}, b=${b} 상태에서 다음 원소를 고릅니다.`, { mid, a, b, result });
          const done = a >= mid && b >= end;
          snap("doneCheck", `a ≥ mid 그리고 b ≥ end → ${done ? "참" : "거짓"}`, { mid, a, b, result });
          if (done) {
            snap("mergeBreak", "두 구간의 원소를 모두 result에 담았으므로 병합 반복을 끝냅니다.", { mid, a, b, result });
            break;
          }
          if (a >= mid) {
            snap("leftExhaust", "왼쪽 구간을 모두 사용했으므로 오른쪽 원소를 가져옵니다.", { mid, a, b, result });
            const value = arr[b]; result.push(value);
            snap("appendRightExhaust", `arr[${b}] = ${value}를 result에 추가합니다.`, { mid, a, b, result });
            b += 1; snap("incBExhaust", `b를 ${b}로 이동합니다.`, { mid, a, b, result });
          } else if (b >= end) {
            snap("rightExhaust", "오른쪽 구간을 모두 사용했으므로 왼쪽 원소를 가져옵니다.", { mid, a, b, result });
            const value = arr[a]; result.push(value);
            snap("appendLeftExhaust", `arr[${a}] = ${value}를 result에 추가합니다.`, { mid, a, b, result });
            a += 1; snap("incAExhaust", `a를 ${a}로 이동합니다.`, { mid, a, b, result });
          } else {
            const leftValue = arr[a], rightValue = arr[b];
            const chooseLeft = leftValue <= rightValue;
            snap("compareValues", `${leftValue} ≤ ${rightValue} → ${chooseLeft ? "참. 왼쪽 선택" : "거짓. 오른쪽 선택"}`, { mid, a, b, result, compareIndices: [a, b] });
            if (chooseLeft) {
              result.push(leftValue); snap("appendLeftCompare", `${leftValue}를 result에 추가합니다.`, { mid, a, b, result, compareIndices: [a, b] });
              a += 1; snap("incACompare", `a를 ${a}로 이동합니다.`, { mid, a, b, result });
            } else {
              snap("elseRight", "왼쪽 값이 더 크므로 오른쪽 원소를 선택합니다.", { mid, a, b, result, compareIndices: [a, b] });
              result.push(rightValue); snap("appendRightCompare", `${rightValue}를 result에 추가합니다.`, { mid, a, b, result, compareIndices: [a, b] });
              b += 1; snap("incBCompare", `b를 ${b}로 이동합니다.`, { mid, a, b, result });
            }
          }
        }
        for (let i = 0; i < result.length; i++) {
          snap("copyLoop", `result[${i}]을 원본 배열의 ${start + i}번 위치에 복사할 차례입니다.`, { mid, a, b, result, copyIndex: start + i });
          arr[start + i] = result[i];
          snap("copyBack", `arr[${start + i}] = ${result[i]}로 갱신했습니다.`, { mid, a, b, result, copyIndex: start + i });
        }
      }

      merge(0, item.N, 0);
      output += `#${ci + 1} ${arr[item.N >> 1]} ${cnt}\n`;
      push("output", `정렬 완료: arr[N//2] = ${arr[item.N >> 1]}, cnt = ${cnt}를 출력합니다.`, { start: 0, end: item.N });
    });
    return steps;
  }

  const names = { caseInput:"입력 배열",cntInit:"cnt 초기화",startSort:"정렬 시작",call:"merge 호출",baseCheck:"기저 조건",baseReturn:"재귀 반환",mid:"구간 분할",leftCall:"왼쪽 재귀",rightCall:"오른쪽 재귀",compareEnds:"마지막 값 비교",cntInc:"cnt 증가",initA:"a 초기화",initB:"b 초기화",initResult:"result 초기화",whileLoop:"병합 반복",doneCheck:"병합 종료 확인",mergeBreak:"병합 반복 종료",leftExhaust:"왼쪽 소진",appendRightExhaust:"오른쪽 추가",incBExhaust:"b 이동",rightExhaust:"오른쪽 소진",appendLeftExhaust:"왼쪽 추가",incAExhaust:"a 이동",compareValues:"값 비교",appendLeftCompare:"왼쪽 추가",incACompare:"a 이동",elseRight:"오른쪽 선택",appendRightCompare:"오른쪽 추가",incBCompare:"b 이동",copyLoop:"복사 준비",copyBack:"원본 복사",output:"출력" };
  function arrayBoard(container, s) {
    const inSeg = (i) => s.start !== null && i >= s.start && i < s.end;
    const cells = s.arr.map((v, i) => {
      const cls = ["array-cell"];
      if (s.start !== null && !inSeg(i)) cls.push("outside");
      if (inSeg(i)) cls.push("segment");
      if (s.mid !== null && inSeg(i)) cls.push(i < s.mid ? "left-half" : "right-half");
      if (i === s.a) cls.push("pointer-a");
      if (i === s.b) cls.push("pointer-b");
      if (s.compareIndices.includes(i)) cls.push("compare-end");
      if (i === s.copyIndex) cls.push("copy-target");
      return `<span class="${cls.join(" ")}">${v}<small>${i}</small></span>`;
    }).join("");
    const result = s.result.length ? s.result.map((v) => `<span class="buffer-chip">${v}</span>`).join("") : '<span class="buffer-empty">아직 result가 비어 있습니다.</span>';
    container.innerHTML = `<div class="array-wrap"><p class="array-title"><span>arr</span><span>${s.start === null ? "전체 배열" : `[${s.start}, ${s.end}) · depth ${s.depth}`}</span></p><div class="array-row">${cells}</div><div class="buffer-box"><p class="buffer-title"><span>result</span><span>${s.result.length}개</span></p><div class="buffer-row">${result}</div></div><p class="legend">파랑: 왼쪽 구간 · 보라: 오른쪽 구간 · 파란/보라 테두리: a/b 포인터 · 노랑 테두리: 비교 · 초록: 원본에 복사 중</p></div>`;
  }
  function detail(container, s) {
    const chunks = [`<span class="detail-chip">재귀 깊이 <strong>${s.depth}</strong></span>`, `<span class="detail-chip">구간 <strong>${s.start === null ? "—" : `[${s.start}, ${s.end})`}</strong></span>`, `<span class="detail-chip">result <strong>${s.result.length ? s.result.join(" · ") : "—"}</strong></span>`];
    if (s.phase === "compareEnds" || s.phase === "cntInc") chunks.push(`<span class="detail-chip warn">마지막 값 조건 ${s.phase === "cntInc" ? "성립 → cnt + 1" : "확인 중"}</span>`);
    container.innerHTML = chunks.join("");
  }
  function highlight(lines, n) { lines.forEach((line, k) => line.classList.toggle("active", k === n)); }
  function renderDesktop(s) { const ln = stepLines.get(s.phase); highlight(desktopLines, ln); arrayBoard(els.board, s); detail(els.detailView, s); els.codeLineLabel.textContent = ln ? `LINE ${ln}` : names[s.phase]; els.boardLabel.textContent = `#${s.tc} · N=${s.N}`; els.phaseLabel.textContent = names[s.phase]; els.startValue.textContent = s.start ?? "—"; els.endValue.textContent = s.end ?? "—"; els.midValue.textContent = s.mid ?? "—"; els.aValue.textContent = s.a ?? "—"; els.bValue.textContent = s.b ?? "—"; els.cntValue.textContent = s.cnt; els.explainText.textContent = s.message; els.detailMeta.textContent = s.start === null ? "재귀 시작 전" : `depth ${s.depth} · [${s.start}, ${s.end})`; els.outputView.textContent = s.output || "아직 출력이 없습니다."; }
  function renderMobile(s) { const ln = stepLines.get(s.phase); highlight(mobileLines, ln); arrayBoard(els.mobileBoard, s); detail(els.mobileDetailView, s); els.mobileCoord.textContent = `#${s.tc} · cnt = ${s.cnt}`; els.mobileCodeStatus.textContent = ln ? `LINE ${ln}` : names[s.phase]; els.mobilePhase.textContent = names[s.phase]; els.mobileExplanation.textContent = s.message; els.mobileStateMeta.textContent = `depth ${s.depth} · result ${s.result.length}`; els.mobileStart.textContent = s.start ?? "—"; els.mobileEnd.textContent = s.end ?? "—"; els.mobileMid.textContent = s.mid ?? "—"; els.mobileCnt.textContent = s.cnt; els.mobileOutputView.textContent = s.output || "아직 출력이 없습니다."; }
  function sync() { const empty = !state.steps.length; els.prevBtn.disabled = els.mobilePrevBtn.disabled = empty || state.stepIndex === 0; els.nextBtn.disabled = els.mobileNextBtn.disabled = empty || state.stepIndex === state.steps.length - 1; [els.playBtn,els.replayBtn,els.resetBtn,els.skipBtn,els.timeline,els.mobileTimeline,els.mobilePlayBtn].forEach((x) => x.disabled = empty); }
  function render({ follow = true } = {}) { const s = state.steps[state.stepIndex]; if (!s) return; renderDesktop(s); renderMobile(s); els.timeline.value = els.mobileTimeline.value = state.stepIndex; els.stepLabel.textContent = els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}`; sync(); if (follow) { const ln = stepLines.get(s.phase); if (ln) { Core.centerInsideViewport(els.codeViewport, desktopLines.get(ln), { horizontal:false }); Core.centerInsideViewport(els.mobileCodeViewport, mobileLines.get(ln), { horizontal:false }); } } }
  function stop() { if (state.timer !== null) clearTimeout(state.timer); state.timer = null; Core.updatePlaybackControls(els.playBtn, false); }
  function go(i, opts={}) { if (!state.steps.length) return; state.stepIndex = Core.clamp(i, 0, state.steps.length - 1); render(opts); }
  function move(d) { stop(); go(state.stepIndex + d); }
  function schedule() { state.timer = setTimeout(() => { if (state.stepIndex >= state.steps.length - 1) { stop(); return; } go(state.stepIndex + 1); if (state.stepIndex >= state.steps.length - 1) stop(); else schedule(); }, PROBLEM.autoplayMs / state.speed); }
  function start() { if (!state.steps.length) return; stop(); if (state.stepIndex >= state.steps.length - 1) go(0); Core.updatePlaybackControls(els.playBtn, true); schedule(); }
  function reset() { stop(); go(0); }
  function sampleButtons() { els.sampleButtons.replaceChildren(); PROBLEM.samples.forEach((s) => { const b = document.createElement("button"); b.type="button"; b.className="btn"; b.textContent=s.label; b.dataset.sample=s.id; b.classList.toggle("selected",state.selectedSample===s.id); els.sampleButtons.append(b); }); }
  function apply(text,id=null) { stop(); try { state.steps=buildSteps(parseInput(text)); state.stepIndex=0; state.selectedSample=id; els.inputError.textContent=""; els.timeline.max=els.mobileTimeline.max=Math.max(0,state.steps.length-1); sampleButtons(); render(); } catch(e) { state.selectedSample=null; els.inputError.textContent=e.message; sampleButtons(); } }
  const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps, { wrap:false, editor:true }); els.codeView.innerHTML=els.mobileCodeView.innerHTML=markup; desktopLines=Core.createLineMap(els.codeView); mobileLines=Core.createLineMap(els.mobileCodeView); stepLines=Core.createStepLineMap(els.codeView);
  els.prevBtn.onclick=()=>move(-1); els.nextBtn.onclick=()=>move(1); els.mobilePrevBtn.onclick=()=>move(-1); els.mobileNextBtn.onclick=()=>move(1); els.mobilePlayBtn.onclick=()=>els.playBtn.click(); els.playBtn.onclick=()=>state.timer===null?start():stop(); els.resetBtn.onclick=reset; els.replayBtn.onclick=()=>{reset();start();}; els.skipBtn.onclick=()=>{stop();go(state.steps.length-1);}; els.speedRange.oninput=()=>{state.speed=Number(els.speedRange.value);els.speedLabel.textContent=`${Core.formatDecimal(state.speed)}×`;if(state.timer!==null){clearTimeout(state.timer);schedule();}}; [els.timeline,els.mobileTimeline].forEach((x)=>x.oninput=(e)=>{stop();go(Number(e.target.value));}); els.applyBtn.onclick=()=>apply(els.inputArea.value); els.inputArea.oninput=()=>{state.selectedSample=null;sampleButtons();}; els.sampleButtons.onclick=(e)=>{const b=e.target.closest("button[data-sample]");if(!b)return;const s=PROBLEM.samples.find((v)=>v.id===b.dataset.sample);if(!s)return;els.inputArea.value=s.value;apply(s.value,s.id);};
  const d=PROBLEM.samples.find((s)=>s.id===PROBLEM.defaultSampleId); sampleButtons(); els.inputArea.value=d.value; apply(d.value,d.id);
})();

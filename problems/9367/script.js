(() => {
  'use strict';

  const PROBLEM = Object.freeze({
    platform: 'SWEA', number: '9367', level: 'D2', title: '점점 커지는 당근의 개수', autoplayMs: 600,
    source: [
      'T = int(input())',
      'for tc in range(1, T+1):',
      '    N = int(input())',
      '    carrots = list(map(int, input().split()))',
      '    max_count = 1',
      '    current_count = 1',
      '    for i in range(N-1):',
      '        if carrots[i] < carrots[i+1]:',
      '            current_count += 1',
      '            if max_count < current_count:',
      '                max_count = current_count',
      '        else:',
      '            current_count = 1',
      "    print('#{} {}'.format(tc, max_count))"
    ]
  });

  const samples = [
    { id:'all', label:'전체 샘플', value:`4\n5\n1 2 3 4 5\n5\n4 5 1 2 3\n5\n5 4 3 2 1\n8\n1 2 1 2 3 1 2 1` },
    { id:'inc', label:'계속 증가', value:`1\n5\n1 2 3 4 5` },
    { id:'reset', label:'초기화 확인', value:`1\n8\n1 2 1 2 3 1 2 1` }
  ];

  const $ = id => document.getElementById(id);
  const els = {
    source:$('sourceCode'), track:$('carrotTrack'), comparison:$('comparison'), explanation:$('explanation'),
    i:$('iValue'), current:$('currentValue'), max:$('maxValue'), step:$('stepLabel'), caseLabel:$('caseLabel'),
    first:$('firstBtn'), prev:$('prevBtn'), play:$('playBtn'), next:$('nextBtn'), last:$('lastBtn'), speed:$('speedSelect'),
    timeline:$('timeline'), progress:$('progressText'), input:$('inputText'), apply:$('applyInputBtn'), output:$('outputText'), samples:$('sampleButtons')
  };

  let cases = [], steps = [], cursor = 0, timer = null;

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function renderSource() {
    els.source.innerHTML = PROBLEM.source.map((line, idx) => `<span class="code-line" data-line="${idx+1}">${escapeHtml(line)}</span>`).join('');
  }

  function parseInput(raw) {
    const tokens = raw.trim().split(/\s+/).map(Number);
    if (!tokens.length || tokens.some(Number.isNaN)) throw new Error('입력값을 확인해 주세요.');
    let p = 0; const T = tokens[p++]; const result = [];
    for (let tc=1; tc<=T; tc++) {
      const N = tokens[p++];
      if (!Number.isInteger(N) || N < 1 || p + N > tokens.length) throw new Error(`${tc}번 테스트케이스의 N 또는 당근 개수를 확인해 주세요.`);
      result.push({ tc, N, carrots: tokens.slice(p, p+N) }); p += N;
    }
    return result;
  }

  function solve(test) {
    let maxCount=1, currentCount=1;
    for (let i=0; i<test.N-1; i++) {
      if (test.carrots[i] < test.carrots[i+1]) { currentCount++; if (maxCount < currentCount) maxCount=currentCount; }
      else currentCount=1;
    }
    return maxCount;
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

  function renderCarrots(step) {
    const {test,i,streakStart,bestStart,bestEnd}=step;
    els.track.innerHTML=test.carrots.map((value,idx)=>{
      const classes=['carrot'];
      if (i !== null && (idx===i || idx===i+1)) classes.push('compare');
      if (i !== null && idx>=streakStart && idx<=i+1) classes.push('current');
      if (idx>=bestStart && idx<=bestEnd) classes.push('best');
      return `<div class="${classes.join(' ')}"><div class="carrot-bar" style="--size:${Math.max(1,Math.min(10,value))}"></div><span class="carrot-value">${value}</span><span class="carrot-index">[${idx}]</span></div>`;
    }).join('');
  }

  function render() {
    if (!steps.length) return;
    const s=steps[cursor];
    document.querySelectorAll('.code-line').forEach(x=>x.classList.toggle('active', Number(x.dataset.line)===s.line));
    renderCarrots(s);
    els.i.textContent=s.i===null?'-':s.i;
    els.current.textContent=s.currentCount;
    els.max.textContent=s.maxCount;
    els.step.textContent=s.done?'완료':`line ${s.line}`;
    els.caseLabel.textContent=`#${s.test.tc} · N=${s.test.N}`;
    els.comparison.textContent=s.comparison;
    els.explanation.textContent=s.text;
    els.timeline.max=Math.max(0,steps.length-1); els.timeline.value=cursor;
    els.progress.textContent=`${cursor+1} / ${steps.length}`;
    els.prev.disabled=cursor===0; els.first.disabled=cursor===0; els.next.disabled=cursor===steps.length-1; els.last.disabled=cursor===steps.length-1;
    if (cursor===steps.length-1) stop();
  }

  function setCursor(n){ cursor=Math.max(0,Math.min(steps.length-1,n)); render(); }
  function stop(){ if(timer){clearInterval(timer);timer=null;} els.play.textContent='재생'; }
  function play(){
    if(timer){stop();return;}
    if(cursor===steps.length-1) cursor=0;
    els.play.textContent='정지';
    timer=setInterval(()=>{ if(cursor>=steps.length-1){stop();return;} setCursor(cursor+1); }, Number(els.speed.value));
  }

  function apply(raw) {
    stop();
    try {
      cases=parseInput(raw); steps=buildSteps(cases); cursor=0;
      els.output.textContent=cases.map(t=>`#${t.tc} ${solve(t)}`).join('\n');
      render();
    } catch(err) { els.output.textContent=`입력 오류: ${err.message}`; }
  }

  function renderSamples(){
    els.samples.innerHTML='';
    samples.forEach(sample=>{
      const b=document.createElement('button'); b.type='button'; b.textContent=sample.label;
      b.addEventListener('click',()=>{els.input.value=sample.value;apply(sample.value);}); els.samples.appendChild(b);
    });
  }

  els.first.addEventListener('click',()=>setCursor(0));
  els.prev.addEventListener('click',()=>setCursor(cursor-1));
  els.play.addEventListener('click',play);
  els.next.addEventListener('click',()=>setCursor(cursor+1));
  els.last.addEventListener('click',()=>setCursor(steps.length-1));
  els.speed.addEventListener('change',()=>{ if(timer){stop();play();} });
  els.timeline.addEventListener('input',e=>{stop();setCursor(Number(e.target.value));});
  els.apply.addEventListener('click',()=>apply(els.input.value));

  renderSource(); renderSamples(); els.input.value=samples[0].value; apply(samples[0].value);
})();

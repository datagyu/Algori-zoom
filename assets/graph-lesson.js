/* Shared playback for the graph lessons. Each problem owns its parser and algorithm. */
(() => {
  const Core = window.AlgoriZoomCore, problem = window.GraphLesson;
  const $ = id => document.getElementById(id);
  const code = Core.createCodeMarkup($('sourceCode'), problem.anchors, {wrap:false, editor:true});
  $('codeView').innerHTML = $('mobileCodeView').innerHTML = code;
  const lines = [Core.createLineMap($('codeView')), Core.createLineMap($('mobileCodeView'))];
  const phaseLines = Core.createStepLineMap($('codeView'));
  const phaseNames = {init:'배열 초기화',graph:'인접 리스트 준비',edge:'간선 확인',start:'출발 방문',startCall:'DFS 호출',countInit:'개수 초기화',costInit:'비용 초기화',startDistance:'출발 거리',startQueue:'출발 큐 추가',queueInit:'큐 초기화',sumInit:'합 초기화',loop:'반복 조건',pop:'큐에서 꺼내기',neighbor:'다음 후보',check:'조건 검사',goal:'도착 조건',visit:'방문 표시',call:'재귀 호출',enter:'함수 진입',found:'도착 처리',return:'함수 반환',back:'방문 복구',summary:'반복 요약',distance:'거리 갱신',sum:'거리 합산',enqueue:'큐에 추가',waterCheck:'물인지 검사',waterQueue:'물 큐 추가',waterDistance:'물 거리 0',unionCall:'union 호출',findA:'첫 대표 찾기',findB:'둘째 대표 찾기',same:'대표 비교',skip:'건너뛰기',union:'대표 연결',groupsInit:'집합 초기화',leader:'대표 찾기',count:'개수 기록',findEnter:'find 진입',rootCheck:'대표 조건',rootReturn:'대표 반환',findCall:'부모로 재귀',compress:'경로 압축',findReturn:'find 반환',sort:'간선 정렬',compare:'후보 비교',cost:'비용 합산',done:'완료 조건',stop:'반복 종료',staleCheck:'오래된 후보 검사',stale:'continue',candidate:'누적 거리 계산',numbers:'연산 후보 계산',output:'출력'};
  phaseNames.waterSummary = '초기 검사 요약';
  const localViews = ['queueView','mobileQueueView'].map(id => {
    const view=document.createElement('div');view.className='lesson-locals';view.id=id==='queueView'?'traceDetails':'mobileTraceDetails';
    view.setAttribute('aria-label','현재 코드 줄의 변수');$(id).after(view);return view;
  });
  let steps = [], index = 0, timer = null, speed = 1;
  const text = (id, value) => { $(id).textContent = value; };
  function board(el, s) {
    if (s.grid) {
      el.className = 'lesson-grid'; el.style.setProperty('--cols', s.grid[0].length);
      el.innerHTML = s.grid.flatMap((row, r) => row.map((v, c) => {
        const d = s.dist[r][c], active = s.focus?.some(p => p[0] === r && p[1] === c);
        return `<div class="land-cell ${v === 'W' ? 'water' : ''} ${active ? 'focus' : ''}"><b>${v === 'W' ? '물' : '땅'}</b><small>${d < 0 ? '미방문' : d + '칸'}</small></div>`;
      })).join(''); return;
    }
    el.className = 'graph-board';
    const nodes = s.nodes, p = new Map(nodes.map((n, i) => {
      const a = -Math.PI / 2 + Math.PI * 2 * i / nodes.length;
      return [n, [50 + 35 * Math.cos(a), 50 + 35 * Math.sin(a)]];
    }));
    const edgeKey = (a,b) => s.directed ? `${a},${b}` : [a,b].sort((x,y)=>x-y).join(',');
    const chosen = new Set((s.chosen || []).map(e => edgeKey(e[0],e[1])));
    const edges = (s.edges || []).map(([a,b,w],i) => {
      const [x,y] = p.get(a), [xx,yy] = p.get(b), dx=xx-x,dy=yy-y,len=Math.hypot(dx,dy)||1;
      const active = s.edge && edgeKey(a,b) === edgeKey(...s.edge);
      const cls = active ? 'active' : chosen.has(edgeKey(a,b)) ? 'selected' : '';
      // Inset endpoints so arrowheads remain outside node circles.
      return `<line class="graph-edge ${cls}" x1="${x+dx/len*5.5}" y1="${y+dy/len*5.5}" x2="${xx-dx/len*7}" y2="${yy-dy/len*7}" ${s.directed ? 'marker-end="url(#arrow-'+el.id+')"' : ''}/>${w == null ? '' : `<text class="edge-weight" x="${(x+xx)/2}" y="${(y+yy)/2-2}">${w}</text>`}`;
    }).join('');
    el.innerHTML = `<svg class="graph-svg" viewBox="0 0 100 100" role="img" aria-label="${Core.escapeHtml(s.message)}"><defs><marker id="arrow-${el.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#a2a8b1"/></marker></defs>${edges}${nodes.map(n => {
      const [x,y]=p.get(n), active=s.focus?.includes(n), marked=s.marked?.includes(n);
      const v = s.values?.[n];
      return `<g class="graph-node ${marked ? 'visited' : ''} ${active ? 'current' : ''}"><circle cx="${x}" cy="${y}" r="5.4"/><text x="${x}" y="${y+1.6}">${n}</text>${v == null ? '' : `<text class="distance-tag" x="${x}" y="${y+10}">${Core.escapeHtml(v)}</text>`}</g>`;
    }).join('')}</svg>`;
  }
  function render() {
    const s = steps[index]; if (!s) return;
    const line = phaseLines.get(s.phase);
    if (!line) throw Error(`Unmapped phase: ${s.phase}`);
    lines.forEach((map,i) => {
      map.forEach((el,n) => el.classList.toggle('active', n === line));
      Core.centerInsideViewport($(i ? 'mobileCodeViewport' : 'codeViewport'),map.get(line),{horizontal:false});
    });
    board($('board'),s); board($('mobileBoard'),s);
    const items = s.items || [], markup = items.length ? items.map(item => `<div class="queue-item">${Core.escapeHtml(item)}</div>`).join('') : '<p class="queue-empty">대기 중인 항목이 없습니다.</p>';
    $('queueView').innerHTML = $('mobileQueueView').innerHTML = markup;
    const locals=Object.entries(s.variables || {}).map(([name,value])=>`<div><span>${Core.escapeHtml(name)}</span><strong>${Core.escapeHtml(value)}</strong></div>`).join('');
    localViews.forEach(view=>{view.innerHTML=locals;view.classList.toggle('is-summary',Boolean(s.summary));});
    ['explainText','mobileExplanation'].forEach(id=>text(id,s.message));
    ['outputView','mobileOutputView'].forEach(id=>text(id,s.output || '아직 출력이 없습니다.'));
    ['phaseLabel','mobilePhase'].forEach(id=>text(id,phaseNames[s.phase] || s.phase));
    ['codeLineLabel','mobileCodeStatus'].forEach(id=>text(id,`LINE ${line}`));
    text('boardLabel',`#${s.tc} · ${problem.boardTitle}`); text('mobileCoord',`#${s.tc}`);
    text('queueLabel',s.itemLabel || problem.itemTitle);
    const values=s.stats || ['—','—','—','—','—','—'];
    ['currentValue','nextValue','distanceValue','queueLengthValue','checkValue','answerValue'].forEach((id,i)=>text(id,values[i]));
    ['mobileCurrent','mobileNext','mobileDistance','mobileQueueLength'].forEach((id,i)=>text(id,values[i]));
    text('mobileAnswer',values[5]); text('mobileStateMeta',values[4]);
    ['timeline','mobileTimeline'].forEach(id=>{$(id).max=steps.length-1;$(id).value=index;});
    ['stepLabel','mobileTimelineStatus'].forEach(id=>text(id,`${index+1} / ${steps.length}`));
    ['prevBtn','mobilePrevBtn'].forEach(id=>$(id).disabled=index===0);
    ['nextBtn','mobileNextBtn'].forEach(id=>$(id).disabled=index===steps.length-1);
  }
  function stop(){clearTimeout(timer);timer=null;Core.updatePlaybackControls($('playBtn'),false);}
  function go(i){index=Core.clamp(i,0,steps.length-1);render();}
  function tick(){timer=setTimeout(()=>{go(index+1);if(index===steps.length-1)stop();else tick();},1100/speed);}
  function play(){if(timer){stop();return;}if(index===steps.length-1)go(0);Core.updatePlaybackControls($('playBtn'),true);tick();}
  function select(id){$('sampleButtons').querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.dataset.sample===id));}
  function apply(value,id=null){
    stop();
    try {
      const cases=problem.parse(value), next=[];let output='';
      cases.forEach((d,i)=>{
        const result=problem.build(d);
        result.steps.forEach(s=>next.push({...s,tc:i+1,output}));
        output+=`#${i+1} ${result.answer}\n`;
        next.push({...result.steps.at(-1),phase:'output',summary:false,tc:i+1,output,message:`${problem.resultLabel}: ${result.answer}. #${i+1} ${result.answer}를 출력합니다.`});
      });
      steps=next;index=0;select(id);text('inputError','');render();
    } catch(e){text('inputError',e.message);}
  }
  problem.samples.forEach((sample,i)=>{const b=document.createElement('button');b.className='btn';b.type='button';b.dataset.sample=String(i);b.textContent=`샘플 ${i+1}`;b.onclick=()=>{$('inputArea').value=sample;apply(sample,String(i));};$('sampleButtons').append(b);});
  const all=document.createElement('button');all.className='btn';all.type='button';all.textContent='전체 샘플';all.dataset.sample='all';all.onclick=()=>{const v=problem.samples.length+'\n'+problem.samples.map(s=>s.trim().split('\n').slice(1).join('\n')).join('\n');$('inputArea').value=v;apply(v,'all');};$('sampleButtons').append(all);
  ['prevBtn','mobilePrevBtn'].forEach(id=>$(id).onclick=()=>{stop();go(index-1);});
  ['nextBtn','mobileNextBtn'].forEach(id=>$(id).onclick=()=>{stop();go(index+1);});
  ['playBtn','mobilePlayBtn'].forEach(id=>$(id).onclick=play);
  $('resetBtn').onclick=()=>{stop();go(0);};$('skipBtn').onclick=()=>{stop();go(steps.length-1);};$('replayBtn').onclick=()=>{stop();go(0);play();};
  ['timeline','mobileTimeline'].forEach(id=>$(id).oninput=e=>{stop();go(Number(e.target.value));});
  $('speedRange').oninput=()=>{speed=Number($('speedRange').value);text('speedLabel',`${Core.formatDecimal(speed)}×`);if(timer){clearTimeout(timer);tick();}};
  $('applyBtn').onclick=()=>apply($('inputArea').value);$('inputArea').oninput=()=>select(null);
  $('inputArea').value=problem.samples[0];apply(problem.samples[0],'0');
})();

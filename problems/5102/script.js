(() => {
const Core=window.AlgoriZoomCore || {};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const updatePlayback=(button,playing)=>{
  if(button){ button.textContent=playing ? "일시 정지" : "자동 재생"; button.setAttribute("aria-pressed", String(playing)); }
  const mobile=document.getElementById("mobilePlayBtn");
  if(mobile){ mobile.textContent=playing ? "정지" : "재생"; mobile.setAttribute("aria-pressed", String(playing)); }
};
const getByIds=(ids)=>Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
const PROBLEM={autoplayMs:560,sourceSteps:[
{text:"graph = [[] for _ in range(V + 1)]",types:"graph"},{text:"graph[n1].append(n2)",types:"edge"},{text:"visited = [False] * (V + 1)",types:"init"},{text:"queue = [S]",types:"start"},{text:"while queue:",types:"while"},{text:"current = queue.pop(0)",types:"pop"},{text:"for next_node in graph[current]:",types:"neighbor"},{text:"if not visited[next_node]:",types:"check"},{text:"queue.append(next_node)",types:"enqueue"},{text:"visited[next_node] = True",types:"visit"},{text:"distance[next_node] = distance[current] + 1",types:"distance"},{text:"print('#{} {}'.format(tc, distance[G]))",types:"output"}],
samples:[{id:"one",label:"샘플 1 · BFS 흐름",value:`1
6 5
1 4
1 3
2 3
2 5
4 6
1 6 `},{id:"all",label:"첨부 예제 전체",value:`3
6 5
1 4
1 3
2 3
2 5
4 6
1 6 
7 4
1 6
2 3
2 6
3 5
1 5 
9 9
2 6
4 7
5 7
1 5
2 9
3 9
4 8
5 3
7 8
1 9`}]};
const els=getByIds(["sourceCode","resetBtn","prevBtn","nextBtn","playBtn","replayBtn","skipBtn","speedRange","speedLabel","stepLabel","timeline","codeLineLabel","codeViewport","codeView","boardLabel","boardViewport","board","phaseLabel","currentValue","distanceValue","nextValue","queueLengthValue","checkValue","answerValue","explainText","queueView","queueLabel","outputView","inputArea","applyBtn","sampleButtons","inputError","mobileCoord","mobileCodeStatus","mobileCodeViewport","mobileCodeView","mobilePhase","mobileBoardViewport","mobileBoard","mobileQueueView","mobileExplanation","mobileStateMeta","mobileCurrent","mobileDistance","mobileNext","mobileQueueLength","mobileAnswer","mobileOutputView","mobilePrevBtn","mobileTimeline","mobileTimelineStatus","mobileNextBtn"]);
const state={cases:[],steps:[],stepIndex:0,timer:null,speed:1,codeLines:null,mobileCodeLines:null};let stepLineMap;
function renderCode(){
  const markup=Core.createCodeMarkup(
    els.sourceCode,
    PROBLEM.sourceSteps,
    {wrap:false,editor:true}
  );

  els.codeView.innerHTML=markup;
  els.mobileCodeView.innerHTML=markup;

  state.codeLines=Core.createLineMap(els.codeView);
  state.mobileCodeLines=Core.createLineMap(els.mobileCodeView);
  stepLineMap=Core.createStepLineMap(els.codeView);
}
function parseInput(text){const l=text.trim().split(/\r?\n/).map(x=>x.trim()).filter(Boolean),T=Number(l[0]);if(!T)throw Error("첫 줄의 T를 확인해주세요.");let c=1,cases=[];for(let t=0;t<T;t++){const [V,E]=l[c++].split(/\s+/).map(Number),edges=[];for(let i=0;i<E;i++)edges.push(l[c++].split(/\s+/).map(Number));const [S,G]=l[c++].split(/\s+/).map(Number);cases.push({V,E,edges,S,G})}if(c!==l.length)throw Error("입력 형식을 확인해주세요.");return cases}
function buildSteps(){let steps=[],output="";state.cases.forEach((d,idx)=>{const {V,E,edges,S,G}=d,g=Array.from({length:V+1},()=>[]);let q=[],vis=Array(V+1).fill(false),dist=Array(V+1).fill(0),current=null,next=null,check="준비";
const push=(phase,message,extra={})=>steps.push({V,E,edges:edges.map(x=>[...x]),S,G,q:[...q],vis:[...vis],dist:[...dist],current,next,check,phase,line:stepLineMap.get(phase),message,output,...extra});
push("graph","각 노드의 연결 정보를 저장할 인접 리스트를 준비합니다.");for(const [a,b] of edges){g[a].push(b);g[b].push(a);check=`${a} ↔ ${b}`;push("edge",`${a}번과 ${b}번을 양방향으로 연결합니다.`,{edgeNow:[a,b]})}
push("init","visited와 distance 배열을 준비합니다.");q=[S];vis[S]=true;check=`S=${S} enqueue`;push("start",`출발 노드 ${S}를 큐에 넣고 방문 처리합니다.`);
while(q.length){push("while",`큐에 ${q.length}개 노드가 있어 BFS를 계속합니다.`);current=q.shift();next=null;check=`pop(0) → ${current}`;push("pop",`${current}번 노드를 큐의 맨 앞에서 꺼냅니다.`);
for(const n of g[current]){next=n;check=`이웃 ${n}`;push("neighbor",`${current}번과 연결된 ${n}번을 확인합니다.`);check=vis[n]?"이미 방문":"미방문";push("check",vis[n]?`${n}번은 이미 방문했습니다.`:`${n}번은 처음 방문합니다.`);if(vis[n])continue;q.push(n);push("enqueue",`${n}번을 큐 뒤에 넣습니다.`);vis[n]=true;push("visit",`${n}번을 방문 처리합니다.`);dist[n]=dist[current]+1;check=`distance[${n}]=${dist[n]}`;push("distance",`${current}까지 거리 ${dist[current]} + 1 → ${n}까지 거리 ${dist[n]}입니다.`)}}
current=null;next=null;check=dist[G]?"최소 거리":"연결 안 됨";output+=`#${idx+1} ${dist[G]}\n`;push("output",dist[G]?`최소 간선 수 ${dist[G]}을 출력합니다.`:"두 노드가 연결되지 않아 0을 출력합니다.")});state.steps=steps}
function pos(V){let p={};for(let i=1;i<=V;i++){let a=-Math.PI/2+2*Math.PI*(i-1)/V;p[i]=[50+38*Math.cos(a),50+36*Math.sin(a)]}return p}
function graph(el,s){el.replaceChildren();let p=pos(s.V),svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox","0 0 100 100");svg.classList.add("graph-svg");s.edges.forEach(([a,b])=>{let x=document.createElementNS(svg.namespaceURI,"line");["x1","y1","x2","y2"].forEach((k,i)=>x.setAttribute(k,[p[a][0],p[a][1],p[b][0],p[b][1]][i]));x.classList.add("graph-edge");if(s.edgeNow&&s.edgeNow.includes(a)&&s.edgeNow.includes(b))x.classList.add("active");svg.append(x)});for(let n=1;n<=s.V;n++){let g=document.createElementNS(svg.namespaceURI,"g"),c=document.createElementNS(svg.namespaceURI,"circle"),t=document.createElementNS(svg.namespaceURI,"text");g.classList.add("graph-node");if(n===s.S)g.classList.add("start");if(n===s.G)g.classList.add("goal");if(s.vis[n])g.classList.add("visited");if(s.q.includes(n))g.classList.add("queued");if(s.current===n)g.classList.add("current");if(s.next===n)g.classList.add("next");c.setAttribute("cx",p[n][0]);c.setAttribute("cy",p[n][1]);c.setAttribute("r",5.4);t.setAttribute("x",p[n][0]);t.setAttribute("y",p[n][1]+1.6);t.textContent=n;g.append(c,t);if(s.vis[n]){let d=document.createElementNS(svg.namespaceURI,"text");d.setAttribute("x",p[n][0]);d.setAttribute("y",p[n][1]+9);d.classList.add("distance-tag");d.textContent=`d=${s.dist[n]}`;g.append(d)}svg.append(g)}el.append(svg)}
function queue(el,s){el.replaceChildren();if(!s.q.length){el.innerHTML='<p class="queue-empty">큐가 비어 있습니다.</p>';return}s.q.forEach((n,i)=>{let x=document.createElement("div");x.className="queue-item"+(i?"":" front");x.innerHTML=`${n}번<small>distance ${s.dist[n]}</small>`;el.append(x)})}
function render(){let s=state.steps[state.stepIndex];if(!s)return;state.codeLines.forEach((x,n)=>x.classList.toggle("active",n===s.line));state.mobileCodeLines.forEach((x,n)=>x.classList.toggle("active",n===s.line));graph(els.board,s);graph(els.mobileBoard,s);queue(els.queueView,s);queue(els.mobileQueueView,s);let cur=s.current??"—",nxt=s.next??"—",d=s.current==null?"—":s.dist[s.current];els.codeLineLabel.textContent=`LINE ${s.line}`;els.boardLabel.textContent=`#${s.tc||1} · V=${s.V} · ${s.S}→${s.G}`;els.phaseLabel.textContent=s.phase.toUpperCase();els.currentValue.textContent=cur;els.nextValue.textContent=nxt;els.distanceValue.textContent=d;els.queueLengthValue.textContent=s.q.length;els.checkValue.textContent=s.check;els.answerValue.textContent=s.dist[s.G];els.explainText.textContent=s.message;els.queueLabel.textContent=s.q.length?`FRONT → ${s.q.length}개 대기`:"QUEUE EMPTY";els.outputView.textContent=s.output||"아직 출력이 없습니다.";els.mobileCoord.textContent=`${s.S}→${s.G}`;els.mobileCodeStatus.textContent=`LINE ${s.line}`;els.mobilePhase.textContent=s.phase.toUpperCase();els.mobileExplanation.textContent=s.message;els.mobileStateMeta.textContent=s.check;els.mobileCurrent.textContent=cur;els.mobileDistance.textContent=d;els.mobileNext.textContent=nxt;els.mobileQueueLength.textContent=s.q.length;els.mobileAnswer.textContent=s.dist[s.G];els.mobileOutputView.textContent=s.output||"아직 출력이 없습니다.";els.timeline.value=els.mobileTimeline.value=state.stepIndex;els.stepLabel.textContent=els.mobileTimelineStatus.textContent=`${state.stepIndex+1} / ${state.steps.length}`;els.prevBtn.disabled=els.mobilePrevBtn.disabled=state.stepIndex===0;els.nextBtn.disabled=els.mobileNextBtn.disabled=state.stepIndex===state.steps.length-1}
function stop(){if(state.timer)clearTimeout(state.timer);state.timer=null;updatePlayback(els.playBtn,false)}function go(i){state.stepIndex=clamp(i,0,state.steps.length-1);render()}function move(d){stop();go(state.stepIndex+d)}function tick(){state.timer=setTimeout(()=>{if(state.stepIndex>=state.steps.length-1){stop();return}go(state.stepIndex+1);tick()},PROBLEM.autoplayMs/state.speed)}function play(){if(state.timer){stop();return}if(state.stepIndex>=state.steps.length-1)go(0);updatePlayback(els.playBtn,true);tick()}function apply(v){stop();try{state.cases=parseInput(v);buildSteps();state.stepIndex=0;els.timeline.max=els.mobileTimeline.max=Math.max(0,state.steps.length-1);els.inputError.textContent="";render()}catch(e){els.inputError.textContent=e.message}}
renderCode();PROBLEM.samples.forEach(s=>{let b=document.createElement("button");b.className="btn";b.type="button";b.textContent=s.label;b.onclick=()=>{els.inputArea.value=s.value;apply(s.value)};els.sampleButtons.append(b)});els.inputArea.value=PROBLEM.samples[0].value;apply(els.inputArea.value);
els.prevBtn.onclick=()=>move(-1);els.nextBtn.onclick=()=>move(1);els.mobilePrevBtn.onclick=()=>move(-1);els.mobileNextBtn.onclick=()=>move(1);els.playBtn.onclick=play;document.getElementById("mobilePlayBtn").onclick=play;els.resetBtn.onclick=()=>{stop();go(0)};els.replayBtn.onclick=()=>{stop();go(0);play()};els.skipBtn.onclick=()=>{stop();go(state.steps.length-1)};els.applyBtn.onclick=()=>apply(els.inputArea.value);[els.timeline,els.mobileTimeline].forEach(x=>x.oninput=e=>{stop();go(+e.target.value)});els.speedRange.oninput=()=>{state.speed=+els.speedRange.value;els.speedLabel.textContent=`${state.speed}×`};
})();
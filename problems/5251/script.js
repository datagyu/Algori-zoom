(() => {
  const anchors=[
    ['graph = [[] for _ in range(N + 1)]','graph'],['graph[s].append((w, e))','edge'],
    ["distance = [float('inf')] * (N + 1)",'init'],['distance[0] = 0','startDistance'],['pq = []','queueInit'],
    ['heapq.heappush(pq, (0, 0))','startQueue'],['while pq:','loop'],['current_w, current_node = heapq.heappop(pq)','pop'],
    ['if distance[current_node] < current_w:','staleCheck'],['continue','stale'],
    ['for next_w, next_node in graph[current_node]:','neighbor'],['new_w = current_w + next_w','candidate'],
    ['if distance[next_node] > new_w:','compare'],['distance[next_node] = new_w','distance'],
    ['heapq.heappush(pq, (new_w, next_node))','enqueue'],["print('#{} {}'.format(tc, distance[N]))",'output'],
  ].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++){const N=p.number(1,11,'학습용 N'),E=p.number(1,24,'학습용 E'),edges=Array.from({length:E},()=>[p.number(0,N,'s'),p.number(0,N,'e'),p.number(1,10,'거리')]);a.push({N,edges});}p.end();return a;}
  function build({N,edges}) {
    const graph=Array.from({length:N+1},()=>[]),dist=Array(N+1).fill(Infinity),prev=Array(N+1).fill(null),pq=[],steps=[],loaded=[];
    let current=null,currentW=null,next=null,nextW=null,newW=null;
    const val=n=>n===Infinity?'∞':n??'—';
    function emit(phase,message,edge=null) {
      steps.push({phase,message,nodes:dist.map((_,i)=>i),edges:loaded.map(e=>[...e]),directed:true,edge,focus:current==null?[]:[current],
        values:Object.fromEntries(dist.map((v,i)=>[i,`d=${val(v)}`])),chosen:prev.flatMap((p,i)=>p==null?[]:[[p,i]]),
        items:pq.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(([w,n])=>`(${w}, ${n})`),
        itemLabel:'우선순위 큐 · (누적 거리, 정점) · 작은 거리부터 표시',
        stats:[current??'—',next??'—',currentW??'—',pq.length,'거리, 정점',val(dist[N])],
        variables:{current_w:val(currentW),current_node:val(current),next_w:val(nextW),next_node:val(next),new_w:val(newW),distance:dist.map((v,i)=>`${i}:${val(v)}`).join(' · ')}});
    }
    emit('graph','각 정점의 일방통행 도로를 저장할 인접 리스트를 만듭니다.');
    for(const [a,b,w] of edges){graph[a].push([w,b]);loaded.push([a,b,w]);emit('edge',`graph[${a}]에 (${w}, ${b})를 추가합니다. ${a} → ${b}로 갈 때 도로 길이는 ${w}입니다.`,[a,b]);}
    emit('init','모든 distance를 ∞(아직 모름)로 초기화합니다.');
    dist[0]=0;emit('startDistance','출발점까지의 거리는 0이므로 distance[0]=0으로 둡니다.');
    emit('queueInit','빈 우선순위 큐 pq를 준비합니다.');pq.push([0,0]);emit('startQueue','(누적 거리 0, 정점 0)을 pq에 넣습니다.');
    while(pq.length) {
      emit('loop',`pq에 ${pq.length}개의 후보가 있어 while pq가 참입니다.`);
      pq.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);[currentW,current]=pq.shift();next=nextW=newW=null;
      emit('pop',`가장 작은 후보 (${currentW}, ${current})를 꺼냅니다. 큐에서 이 항목만 빠졌고 distance는 그대로입니다.`);
      const stale=dist[current]<currentW;
      emit('staleCheck',`distance[${current}](${dist[current]}) < current_w(${currentW}) → ${stale}. ${stale?'더 짧은 경로를 이미 기록한 오래된 후보입니다.':'유효한 후보이므로 다음 도로를 확인합니다.'}`);
      if(stale){emit('stale','continue로 이번 후보의 도로 탐색을 건너뜁니다. while pq로 돌아갑니다.');continue;}
      for(const [w,n] of graph[current]) {
        next=n;nextW=w;newW=null;
        emit('neighbor',`graph[${current}]에서 (next_w=${w}, next_node=${n})을 꺼냅니다. 도로 하나의 길이는 ${w}입니다.`,[current,n]);
        newW=currentW+w;emit('candidate',`new_w = ${currentW} + ${w} = ${newW}. 출발점부터 ${n}까지의 후보 누적 거리를 계산합니다. 아직 distance는 그대로입니다.`,[current,n]);
        const improve=dist[n]>newW,old=dist[n];
        emit('compare',`distance[${n}](${val(old)}) > new_w(${newW}) → ${improve}. ${improve?'더 짧은 후보이므로 갱신합니다.':'같거나 더 긴 후보라 거리·큐를 바꾸지 않습니다.'}`,[current,n]);
        if(!improve)continue;
        dist[n]=newW;prev[n]=current;
        emit('distance',`distance[${n}]: ${val(old)} → ${newW}. 거리를 먼저 바꿨습니다. 새 큐 후보는 아직 추가하지 않았습니다.`,[current,n]);
        pq.push([newW,n]);emit('enqueue',`(${newW}, ${n})을 pq에 추가합니다. 이전 후보가 남아 있어도 나중에 오래된 후보 검사로 걸러집니다.`,[current,n]);
      }
    }
    current=currentW=next=nextW=newW=null;emit('loop','pq가 비어 while pq가 거짓입니다. 모든 후보를 확인했으므로 결과를 출력합니다.');
    if(!Number.isFinite(dist[N]))throw Error(`0에서 ${N}까지 갈 수 있는 방향 그래프를 입력해 주세요.`);
    return {steps,answer:dist[N]};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'방향 간선과 누적 거리',itemTitle:'우선순위 큐',resultLabel:'0에서 마지막 정점까지 최소 거리',samples:['1\n2 3\n0 1 1\n0 2 6\n1 2 1','1\n4 7\n0 1 9\n0 2 3\n0 3 7\n1 4 2\n2 3 8\n2 4 1\n3 4 8','1\n3 5\n0 1 1\n0 2 5\n1 2 1\n2 3 2\n1 3 8']};
})();

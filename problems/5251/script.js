(() => {
  const anchors=[['distance[0] = 0','init'],['current_w, current_node = heapq.heappop(pq)','pop'],['if distance[current_node] < current_w:','stale'],['distance[next_node] = new_w','relax'],['if distance[next_node] > new_w:','skip'],["print('#{} {}'.format(tc, distance[N]))",'output']].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++){const N=p.number(1,11,'학습용 N'),E=p.number(1,24,'학습용 E'),edges=Array.from({length:E},()=>[p.number(0,N,'s'),p.number(0,N,'e'),p.number(1,10,'거리')]);a.push({N,edges});}p.end();return a;}
  function build({N,edges}){
    const g=Array.from({length:N+1},()=>[]);edges.forEach(([a,b,w])=>g[a].push([w,b]));const dist=Array(N+1).fill(Infinity),prev=Array(N+1).fill(null),pq=[[0,0]],steps=[];dist[0]=0;
    const emit=(phase,message,current=null,edge=null)=>steps.push({phase,message,nodes:dist.map((_,i)=>i),edges,directed:true,edge,focus:current==null?[]:[current],values:Object.fromEntries(dist.map((v,i)=>[i,`d=${v===Infinity?'∞':v}`])),chosen:prev.flatMap((p,i)=>p==null?[]:[[p,i]]),items:pq.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(([w,n])=>`(${w}, ${n})`),stats:[current??'—',edge?.[1]??'—',current==null?'—':dist[current],pq.length,'거리, 정점',dist[N]===Infinity?'∞':dist[N]]});
    emit('init','다익스트라: 출발점 0의 거리는 0, 나머지는 ∞(아직 모름)입니다. 큐에서 누적 거리가 가장 작은 후보를 먼저 꺼냅니다.');
    while(pq.length){pq.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const [w,n]=pq.shift();emit('pop',`거리 ${w}, 정점 ${n} 후보를 꺼냅니다. 도로 하나의 길이가 아니라 출발점부터의 누적 거리입니다.`,n);if(dist[n]<w){emit('stale',`${n}까지 더 짧은 거리 ${dist[n]}를 이미 찾았습니다. 옛 후보 ${w}는 탐색하지 않습니다.`,n);continue;}
      for(const [nw,next] of g[n]){const sum=w+nw,old=dist[next];if(sum<old){dist[next]=sum;prev[next]=n;pq.push([sum,next]);emit('relax',`${n} → ${next}: 현재 거리 ${w} + 도로 길이 ${nw} = ${sum}. 기존 ${old===Infinity?'∞':old}보다 작아 갱신하고 큐에 넣습니다.`,n,[n,next]);}else emit('skip',`${n} → ${next}: 후보 ${sum}은 기존 ${old}보다 작지 않습니다. 거리와 큐를 바꾸지 않습니다.`,n,[n,next]);}
    }
    if(!Number.isFinite(dist[N]))throw Error(`0에서 ${N}까지 갈 수 있는 방향 그래프를 입력해 주세요.`);
    return {steps,answer:dist[N]};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'방향 간선과 누적 거리',itemTitle:'우선순위 큐 · (거리, 정점), 작은 거리부터',resultLabel:'0에서 마지막 정점까지 최소 거리',samples:['1\n2 3\n0 1 1\n0 2 6\n1 2 1','1\n4 7\n0 1 9\n0 2 3\n0 3 7\n1 4 2\n2 3 8\n2 4 1\n3 4 8','1\n3 5\n0 1 1\n0 2 5\n1 2 1\n2 3 2\n1 3 8']};
})();

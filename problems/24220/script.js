(() => {
  const anchors=[['used[S] = True','init'],['used[i] = True','visit'],['cnt += 1','found'],['used[i] = False','back'],['for i in graph[now]:','summary'],["print('#{} {}'.format(tc, cnt))",'output']].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++){const N=p.number(3,8,'학습용 N'),E=p.number(N-1,N*(N-1)/2,'E'),edges=Array.from({length:E},()=>[p.number(1,N,'출발 정점'),p.number(1,N,'도착 정점')]);a.push({N,edges,S:p.number(1,N,'S'),G:p.number(1,N,'G')});}p.end();return a;}
  function build({N,edges,S,G}){
    const g=Array.from({length:N+1},()=>[]);edges.forEach(([a,b])=>g[a].push(b));
    const used=Array(N+1).fill(false),path=[S],steps=[];let cnt=0,detail=true,calls=0,recovered=false;used[S]=true;
    const emit=(phase,message,edge=null)=>steps.push({phase,message,nodes:Array.from({length:N},(_,i)=>i+1),edges,directed:true,edge,focus:[path.at(-1)],marked:path.slice(),chosen:path.slice(1).map((n,i)=>[path[i],n]),items:path.map(n=>`${n}번`),stats:[path.at(-1),G,path.length-1,path.length,'현재 경로만 방문',cnt]});
    emit('init',`${S}에서 ${G}까지 같은 정점을 두 번 지나지 않는 경로를 셉니다. used는 전체 탐색 기록이 아니라 현재 경로의 방문 표시입니다.`);
    function dfs(now){calls++;if(now===G){cnt++;if(detail)emit('found',`도착! ${path.join(' → ')} 경로를 세어 cnt=${cnt}입니다. 도착점 이후에는 더 탐색하지 않습니다.`);detail=false;return;}
      let moved=false;
      for(const next of g[now]){if(used[next])continue;moved=true;used[next]=true;path.push(next);if(detail)emit('visit',`${now} → ${next}: 현재 경로에 없는 정점이므로 방문 표시 후 재귀 호출합니다.`,[now,next]);dfs(next);path.pop();used[next]=false;if(detail||!recovered||path.length===1){emit('back',`${next} 탐색을 마치고 used[${next}]=False로 복구합니다. 다른 경로에서 다시 사용할 수 있습니다.`,[now,next]);recovered=true;}}
      if(!moved&&detail){emit('summary',`${now}에서 더 갈 수 있는 미방문 정점이 없습니다. 도착하지 못한 분기에서 돌아갑니다. 이후 반복은 요약해도 모든 경로를 셉니다.`);detail=false;}
    }
    // The first successful route is detailed; every remaining route is still counted.
    if(S===G)dfs(S);else for(const next of g[S]){if(used[next])continue;const before=cnt;used[next]=true;path.push(next);if(detail)emit('visit',`${S} → ${next}를 선택하고 첫 경로를 살펴봅니다.`,[S,next]);dfs(next);path.pop();used[next]=false;emit('back',`출발점으로 돌아와 used[${next}]를 복구했습니다.`,[S,next]);emit('summary',`${S} → ${next}로 시작하는 경로 ${cnt-before}개를 모두 확인했습니다. 첫 도착 이후의 반복은 요약합니다. 누적 ${cnt}개입니다.`);}
    emit('summary',`모든 분기를 확인했습니다. 재귀 호출 ${calls}회에서 찾은 경로는 ${cnt}개입니다. 순환 간선이 있어도 현재 경로의 정점은 다시 방문하지 않습니다.`);
    return {steps,answer:cnt};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'화살표 방향으로 DFS',itemTitle:'현재 재귀 경로 · 왼쪽이 출발점',resultLabel:'가능한 경로 수',samples:['1\n5 6\n1 2 1 3 3 2 3 4 2 5 5 4\n1 4','1\n5 7\n1 2 1 3 3 2 3 4 2 5 5 4 5 3\n1 4','1\n3 2\n1 2 2 1\n1 3']};
})();

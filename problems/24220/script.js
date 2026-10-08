(() => {
  const anchors=[
    ['graph = [[] for _ in range(N + 1)]','graph'],['graph[arr[i]].append(arr[i + 1])','edge'],
    ['used = [False] * (N + 1)','init'],['used[S] = True','start'],['cnt = 0','countInit'],['dfs(S)','startCall'],
    ['def dfs(now):','enter'],['if now == G:','goal'],['cnt += 1','found'],['return','return'],
    ['for i in graph[now]:','neighbor summary'],['if not used[i]:','check'],['used[i] = True','visit'],
    ['dfs(i)','call'],['used[i] = False','back'],["print('#{} {}'.format(tc, cnt))",'output'],
  ].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++){const N=p.number(3,8,'학습용 N'),E=p.number(N-1,N*(N-1)/2,'E'),edges=Array.from({length:E},()=>[p.number(1,N,'출발 정점'),p.number(1,N,'도착 정점')]);a.push({N,edges,S:p.number(1,N,'S'),G:p.number(1,N,'G')});}p.end();return a;}
  function build({N,edges,S,G}) {
    const graph=Array.from({length:N+1},()=>[]),used=Array(N+1).fill(false),path=[],steps=[],loaded=[];
    let cnt=0,leaves=0,calls=0,current=null,candidate=null;const full=N<=5&&edges.length<=8;
    function emit(phase,message,edge=null) {
      steps.push({phase,message,nodes:Array.from({length:N},(_,i)=>i+1),edges:loaded.map(e=>[...e]),directed:true,edge,
        focus:current==null?[]:[current],marked:used.flatMap((v,i)=>v?[i]:[]),chosen:path.slice(1).map((n,i)=>[path[i],n]),
        values:Object.fromEntries(Array.from({length:N},(_,i)=>[i+1,`used=${used[i+1]?'T':'F'}`])),items:path.map(n=>`dfs(${n})`),
        itemLabel:'재귀 호출 스택 · 오른쪽이 현재 호출',
        stats:[current??'—',candidate??'—',path.length?path.length-1:0,path.length,'현재 경로의 방문',cnt],
        variables:{now:current??'—',i:candidate??'—',G,cnt,used:used.slice(1).map((v,i)=>`${i+1}:${v?'T':'F'}`).join(' · ')},summary:phase==='summary'});
    }
    emit('graph','각 정점의 다음 정점을 저장할 빈 인접 리스트를 만듭니다. 방향은 출발 → 도착입니다.');
    for(const [a,b] of edges){graph[a].push(b);loaded.push([a,b]);emit('edge',`graph[${a}]에 ${b}를 추가합니다. 현재 연결 목록: [${graph[a].join(', ')}]. 역방향은 추가하지 않습니다.`,[a,b]);}
    emit('init','used를 모두 False로 초기화합니다. 현재 경로에 들어 있는 정점만 True가 됩니다.');
    used[S]=true;current=S;emit('start',`출발 ${S}를 True로 표시합니다. 순환해서 출발점으로 돌아가는 경로를 막습니다.`);
    emit('countInit','완성한 경로 수 cnt를 0으로 초기화합니다.');emit('startCall',`dfs(${S})를 호출합니다. 이제 함수 안으로 들어갑니다.`);
    function dfs(now,trace) {
      calls++;path.push(now);current=now;candidate=null;
      if(trace){emit('enter',`dfs(${now})에 들어왔습니다. 호출 스택: ${path.join(' → ')}.`);emit('goal',`now(${now}) == G(${G}) → ${now===G}. ${now===G?'완성한 경로를 셉니다.':'다음 정점을 확인합니다.'}`);}
      if(now===G){cnt++;leaves++;if(trace){emit('found',`${path.join(' → ')}를 한 경로로 셉니다. cnt는 ${cnt-1} → ${cnt}.`);emit('return','도착점에서는 return합니다. 아직 used는 True입니다. 방문 복구는 호출한 함수가 수행합니다.');}path.pop();return;}
      let moved=false;
      for(const next of graph[now]) {
        current=now;candidate=next;const show=trace&&(full||leaves<2);
        if(show){emit('neighbor',`graph[${now}]의 다음 이웃 ${next}를 i로 선택합니다.`,[now,next]);emit('check',`not used[${next}] → ${!used[next]}. ${used[next]?'이미 현재 경로에 있어 순환을 막고 건너뜁니다.':'현재 경로에 없어 방문할 수 있습니다.'}`,[now,next]);}
        if(used[next])continue;moved=true;
        const before=cnt,beforeCalls=calls;
        used[next]=true;
        if(show){emit('visit',`used[${next}]=True. 방문 표시를 먼저 바꿉니다. 아직 dfs(${next})에 들어가지 않았습니다.`,[now,next]);emit('call',`dfs(${next})를 호출합니다. 현재 dfs(${now})는 여기서 기다립니다.`,[now,next]);}
        dfs(next,show);
        current=now;candidate=next;
        if(!show&&trace)emit('summary',`반복 요약: ${now} → ${next} 분기에서도 방문 표시 → 재귀 → 복귀를 실행했습니다. 재귀 ${calls-beforeCalls}회에서 경로 ${cnt-before}개를 추가했습니다. dfs(${now})로 돌아왔고 used[${next}]는 아직 True입니다.`,[now,next]);
        used[next]=false;
        if(trace)emit('back',`dfs(${next})에서 돌아와 used[${next}]=False로 복구합니다. 다른 경로에서도 ${next}를 다시 쓸 수 있습니다.`,[now,next]);
      }
      if(!moved)leaves++;
      if(trace)emit('neighbor',`graph[${now}]의 이웃 확인을 마쳤습니다. ${moved?'이 호출을 끝내고 이전 호출로 돌아갑니다.':'더 갈 수 있는 미방문 이웃이 없어 돌아갑니다.'}`);
      path.pop();
    }
    dfs(S,true);current=candidate=null;
    emit('startCall',`최초 dfs(${S}) 호출까지 돌아왔습니다. 모든 분기를 확인했고 cnt=${cnt}입니다. 출발점 이외의 used는 False로 복구되었습니다.`);
    return {steps,answer:cnt};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'화살표 방향으로 DFS',itemTitle:'현재 재귀 호출 스택',resultLabel:'가능한 경로 수',samples:['1\n5 6\n1 2 1 3 3 2 3 4 2 5 5 4\n1 4','1\n5 7\n1 2 1 3 3 2 3 4 2 5 5 4 5 3\n1 4','1\n3 2\n1 2 2 1\n1 3']};
})();

(() => {
  const anchors=[
    ['edges.sort()','sort'],['parent = [i for i in range(V + 1)]','init'],['ans = 0','costInit'],['cnt = 0','countInit'],
    ['for w, n1, n2 in edges:','edge'],['if find(n1) != find(n2):','compare'],['union(n1, n2)','unionCall'],
    ['fa = find(a)','findA'],['fb = find(b)','findB'],['if fa == fb:','same'],['parent[fb] = fa','union'],
    ['ans += w','cost'],['cnt += 1','count'],['if cnt == V:','done'],['break','stop'],
    ['def find(member):','findEnter'],['if parent[member] == member:','rootCheck'],['return member','rootReturn'],
    ['ret = find(parent[member])','findCall'],['parent[member] = ret','compress'],['return ret','findReturn'],
    ["print('#{} {}'.format(tc, ans))",'output'],
  ].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++){const V=p.number(1,11,'학습용 V'),E=p.number(1,24,'학습용 E'),edges=Array.from({length:E},()=>[p.number(0,V,'n1'),p.number(0,V,'n2'),p.number(1,10,'가중치')]);a.push({V,edges});}p.end();return a;}
  function build({V,edges}) {
    const sorted=edges.slice().sort((a,b)=>a[2]-b[2]||a[0]-b[0]||a[1]-b[1]),parent=Array.from({length:V+1},(_,i)=>i),chosen=[],steps=[],stack=[];
    let ans=0,cnt=0,active=null,index=-1,fa=null,fb=null,tracedChain=false;
    const rootOf=n=>{while(parent[n]!==n)n=parent[n];return n;};
    function emit(phase,message,focus=active?.slice(0,2)||[]) {
      steps.push({phase,message,nodes:parent.map((_,i)=>i),edges,chosen:chosen.map(e=>[...e]),edge:active,focus,
        values:Object.fromEntries(parent.map((_,i)=>[i,`대표 ${rootOf(i)}`])),items:stack.length?stack.map(n=>`find(${n})`):sorted.map(([a,b,w],i)=>`${i===index?'현재 → ':''}${a}—${b}: ${w}`),
        itemLabel:stack.length?'대표 찾기 호출 스택':'가중치 오름차순 간선 · 현재 후보 표시',
        stats:[active?.[0]??'—',active?.[1]??'—',active?.[2]??'—',cnt,`cnt == ${V}`,ans],
        variables:{fa:fa??'—',fb:fb??'—',cnt,ans,parent:parent.map((p,i)=>`${i}→${p}`).join(' · ')}});
    }
    function find(n,trace) {
      if(trace){stack.push(n);emit('findEnter',`find(${n})에서 대표를 찾습니다.`,[n]);emit('rootCheck',`parent[${n}] == ${n} → ${parent[n]===n}.`,[n]);}
      if(parent[n]===n){if(trace){emit('rootReturn',`${n}은 자기 자신이 부모이므로 대표 ${n}을 반환합니다.`,[n]);stack.pop();}return n;}
      const old=parent[n];if(trace)emit('findCall',`부모 ${old}에 대해 find(${old})를 재귀 호출합니다.`,[n,old]);
      const root=find(old,trace);parent[n]=root;
      if(trace){emit('compress',`대표 ${root}를 받아 parent[${n}]를 ${old} → ${root}로 압축합니다.`,[n,root]);emit('findReturn',`대표 ${root}를 반환합니다.`,[n]);stack.pop();}return root;
    }
    emit('sort','간선을 (가중치, n1, n2) 순으로 정렬합니다. 작은 비용부터 확인합니다.');
    emit('init',`정점은 0~${V}, 총 ${V+1}개입니다. 각 정점의 부모를 자기 자신으로 둡니다.`);
    emit('costInit','총 비용 ans를 0으로 초기화합니다.');emit('countInit','선택한 간선 수 cnt를 0으로 초기화합니다.');
    for(index=0;index<sorted.length;index++) {
      active=sorted[index];const [a,b,w]=active;fa=fb=null;
      emit('edge',`다음 간선 ${a}—${b}, 가중치 ${w}를 꺼냅니다. 아직 선택하지 않았습니다.`);
      // Trace the first find and first parent chain; repeated finds show their returned roots.
      const chain=parent[a]!==a||parent[b]!==b;
      const trace=index===0||(!tracedChain&&chain);if(chain&&trace)tracedChain=true;
      fa=find(a,trace);fb=find(b,trace);
      emit('compare',`find(${a})=${fa}, find(${b})=${fb}. ${fa} != ${fb} → ${fa!==fb}. ${fa===fb?'같은 그룹을 연결하면 사이클이라 이 간선을 건너뜁니다.':'다른 그룹이므로 선택할 수 있습니다.'}`);
      if(fa===fb)continue;
      emit('unionCall',`union(${a}, ${b})를 호출해 두 대표를 연결합니다. 비용과 cnt는 아직 그대로입니다.`);
      emit('findA',`union 안에서 fa = find(${a})를 실행합니다.`);fa=find(a,false);
      emit('findB',`fa=${fa}. fb = find(${b})를 실행합니다.`);fb=find(b,false);
      emit('same',`fa == fb → ${fa===fb}. 서로 다른 대표이므로 연결합니다.`);
      parent[fb]=fa;chosen.push(active);emit('union',`parent[${fb}] = ${fa}. 두 그룹이 합쳐졌습니다. 아직 비용을 더하지 않았습니다.`);
      ans+=w;emit('cost',`ans += ${w}: ${ans-w} → ${ans}. 선택한 간선의 비용을 더합니다.`);
      cnt++;emit('count',`cnt += 1: ${cnt-1} → ${cnt}. 간선 선택 개수를 기록합니다.`);
      emit('done',`cnt(${cnt}) == V(${V}) → ${cnt===V}. ${cnt===V?'모든 정점을 연결했으므로 break합니다.':'간선이 더 필요하므로 다음 후보를 확인합니다.'}`);
      if(cnt===V){emit('stop',`${V}개 간선으로 ${V+1}개 정점을 연결했습니다. break로 간선 반복을 끝냅니다.`);break;}
    }
    if(cnt!==V)throw Error('모든 정점이 연결되는 그래프를 입력해 주세요. 최소 신장 트리를 만들 수 없습니다.');
    return {steps,answer:ans};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'선택한 간선이 초록색',itemTitle:'가중치 오름차순 간선',resultLabel:'최소 신장 트리 비용',samples:['1\n2 3\n0 1 1\n0 2 1\n1 2 6','1\n4 7\n0 1 9\n0 2 3\n0 3 7\n1 4 2\n2 3 8\n2 4 1\n3 4 8','1\n3 5\n0 1 1\n1 2 2\n0 2 3\n2 3 4\n0 3 8']};
})();

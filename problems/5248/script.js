(() => {
  const anchors=[
    ['parent = [i for i in range(N + 1)]','init'],['union(people[i], people[i+1])','unionCall'],
    ['leader_a = find(a)','findA'],['leader_b = find(b)','findB'],['if leader_a == leader_b:','same'],
    ['parent[leader_b] = leader_a','union'],['groups = set()','groupsInit'],['leader = find(person)','leader'],['groups.add(leader)','count'],
    ['def find(person):','findEnter'],['if parent[person] == person:','rootCheck'],['return person','rootReturn'],
    ['per = find(parent[person])','findCall'],['parent[person] = per','compress'],['return per','findReturn'],
    ["print('#{} {}'.format(tc, len(groups)))",'output'],
  ].map(([text,types])=>({text,types}));
  anchors.push({text:'return',types:'skip'});
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++){const N=p.number(2,12,'학습용 N'),M=p.number(1,24,'학습용 M'),edges=Array.from({length:M},()=>[p.number(1,N,'신청자'),p.number(1,N,'희망 조원')]);a.push({N,edges});}p.end();return a;}
  function build({N,edges}) {
    const parent=Array.from({length:N+1},(_,i)=>i),groups=new Set(),stack=[],steps=[];
    let a=null,b=null,person=null,leaderA=null,leaderB=null,result=null;
    function emit(phase,message,focus=[]) {
      steps.push({phase,message,nodes:parent.slice(1).map((_,i)=>i+1),edges:parent.slice(1).flatMap((p,i)=>p===i+1?[]:[[i+1,p]]),directed:true,focus,
        values:Object.fromEntries(parent.slice(1).map((p,i)=>[i+1,`부모 ${p}`])),items:stack.length?stack.map(n=>`find(${n})`):parent.slice(1).map((p,i)=>`parent[${i+1}]=${p}`),
        itemLabel:stack.length?'find 재귀 호출 스택 · 오른쪽이 현재 호출':'parent 배열',
        stats:[a??person??'—',b??'—',result??'—',N,`대표 ${leaderA??'—'} / ${leaderB??'—'}`,groups.size],
        variables:{person:person??'—',leader_a:leaderA??'—',leader_b:leaderB??'—',반환값:result??'—',groups:`{${[...groups].join(', ')}}`,parent:parent.slice(1).map((p,i)=>`${i+1}→${p}`).join(' · ')}});
    }
    function find(n) {
      stack.push(n);person=n;result=null;emit('findEnter',`find(${n})에 들어왔습니다. parent[${n}]=${parent[n]}입니다.`,[n]);
      emit('rootCheck',`parent[${n}] == ${n} → ${parent[n]===n}. ${parent[n]===n?'자기 자신이 부모라 조의 대표입니다.':'부모를 따라 대표를 더 찾아야 합니다.'}`,[n]);
      if(parent[n]===n){result=n;emit('rootReturn',`${n}을 대표 번호로 반환합니다. 이 find 호출을 끝냅니다.`,[n]);stack.pop();return n;}
      const old=parent[n];emit('findCall',`find(parent[${n}]) = find(${old})를 재귀 호출합니다. find(${n})는 반환값을 기다립니다.`,[n,old]);
      const root=find(old);person=n;result=root;parent[n]=root;
      emit('compress',`대표 ${root}를 받았습니다. parent[${n}]: ${old} → ${root}. 대표에 바로 연결하는 경로 압축입니다.`,[n,root]);
      emit('findReturn',`find(${n})도 대표 ${root}를 반환합니다.`,[n]);stack.pop();return root;
    }
    emit('init','처음에는 모두 자신의 부모입니다. parent[i]=i인 사람이 그 조의 대표입니다.');
    for(const pair of edges) {
      [a,b]=pair;leaderA=leaderB=result=null;person=null;
      emit('unionCall',`신청서 (${a}, ${b})를 읽고 union(${a}, ${b})를 호출합니다. 아직 부모 배열은 바뀌지 않았습니다.`,pair);
      emit('findA',`leader_a = find(${a})를 실행합니다. 먼저 ${a}의 대표를 찾습니다.`,[a]);leaderA=find(a);
      emit('findB',`${a}의 대표 ${leaderA}를 받았습니다. 이제 leader_b = find(${b})를 실행합니다.`,[b]);leaderB=find(b);
      emit('same',`${leaderA} == ${leaderB} → ${leaderA===leaderB}. ${leaderA===leaderB?'이미 같은 조입니다.':'다른 조라 두 대표를 연결합니다.'}`,pair);
      if(leaderA===leaderB){emit('skip','return으로 union을 끝냅니다. 이미 같은 조이므로 부모 배열을 바꾸지 않습니다.',pair);continue;}
      parent[leaderB]=leaderA;emit('union',`parent[${leaderB}] = ${leaderA}. ${b}의 대표를 ${a}의 대표에 연결해 한 조로 합칩니다.`,pair);
    }
    a=b=person=leaderA=leaderB=result=null;emit('groupsInit','groups를 빈 집합으로 만듭니다. 같은 대표를 여러 번 넣어도 한 번만 저장됩니다.');
    for(let n=1;n<=N;n++) {
      person=n;emit('leader',`person=${n}. find(${n})로 최종 대표를 찾습니다.`,[n]);const root=find(n);person=n;result=root;
      const before=groups.size;groups.add(root);emit('count',`groups.add(${root}). ${before===groups.size?'이미 있는 대표라 조 수는 그대로입니다.':'새 대표라 조 수가 '+before+' → '+groups.size+'입니다.'}`,[n,root]);
    }
    return {steps,answer:groups.size};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'부모 화살표와 조의 대표',itemTitle:'parent 배열 / find 호출 스택',resultLabel:'전체 조 수',samples:['1\n5 2\n1 2 3 4','1\n5 3\n1 2 2 3 4 5','1\n6 4\n1 2 3 4 3 1 2 4']};
})();

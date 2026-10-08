(() => {
  const anchors=[['parent = [i for i in range(N + 1)]','init'],['parent[person] = per','compress'],['if leader_a == leader_b:','same'],['parent[leader_b] = leader_a','union'],['groups.add(leader)','count'],["print('#{} {}'.format(tc, len(groups)))",'output']].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++){const N=p.number(2,12,'학습용 N'),M=p.number(1,24,'학습용 M'),edges=Array.from({length:M},()=>[p.number(1,N,'신청자'),p.number(1,N,'희망 조원')]);a.push({N,edges});}p.end();return a;}
  function build({N,edges}){
    const parent=Array.from({length:N+1},(_,i)=>i),steps=[];let groups=new Set(),active=null;
    const emit=(phase,message)=>steps.push({phase,message,nodes:parent.slice(1).map((_,i)=>i+1),edges:parent.slice(1).flatMap((p,i)=>p===i+1?[]:[[i+1,p]]),directed:true,focus:active||[],values:Object.fromEntries(parent.slice(1).map((p,i)=>[i+1,`부모 ${p}`])),items:parent.slice(1).map((p,i)=>`parent[${i+1}]=${p}`),stats:[active?.[0]??'—',active?.[1]??'—','대표 찾기',N,'부모 → 대표',groups.size||'—']});
    function find(n){if(parent[n]===n)return n;const old=parent[n],root=find(old);parent[n]=root;if(old!==root)emit('compress',`${n}의 부모를 ${old}에서 대표 ${root}로 바로 연결합니다. 다음 find는 더 짧아집니다.`);return root;}
    emit('init','처음에는 모든 사람이 자기 자신의 대표입니다. 신청서를 보고 두 사람의 대표를 합칩니다. 화살표는 신청 관계가 아니라 부모 관계입니다.');
    for(const [a,b] of edges){active=[a,b];const ra=find(a),rb=find(b);if(ra===rb)emit('same',`${a}, ${b}의 대표는 둘 다 ${ra}입니다. 이미 같은 조라 합치지 않습니다.`);else{parent[rb]=ra;emit('union',`${a}의 대표 ${ra}와 ${b}의 대표 ${rb}를 합칩니다. parent[${rb}]=${ra}. 신청하지 않은 사람도 혼자 한 조입니다.`);}}
    active=null;for(let n=1;n<=N;n++)groups.add(find(n));
    emit('count',`모든 사람의 대표를 찾아 중복을 제거합니다. 대표 {${[...groups].join(', ')}} → ${groups.size}개 조입니다.`);
    return {steps,answer:groups.size};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'부모 화살표와 조의 대표',itemTitle:'parent 배열 · 대표의 부모는 자기 자신',resultLabel:'전체 조 수',samples:['1\n5 2\n1 2 3 4','1\n5 3\n1 2 2 3 4 5','1\n6 4\n1 2 3 4 3 1 2 4']};
})();

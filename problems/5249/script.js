(() => {
  const anchors=[['edges.sort()','sort'],['parent = [i for i in range(V + 1)]','init'],['if find(n1) != find(n2):','skip'],['ans += w','choose'],['if cnt == V:','done'],["print('#{} {}'.format(tc, ans))",'output']].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++){const V=p.number(1,11,'학습용 V'),E=p.number(1,24,'학습용 E'),edges=Array.from({length:E},()=>[p.number(0,V,'n1'),p.number(0,V,'n2'),p.number(1,10,'가중치')]);a.push({V,edges});}p.end();return a;}
  function build({V,edges}){
    const sorted=edges.slice().sort((a,b)=>a[2]-b[2]||a[0]-b[0]||a[1]-b[1]),parent=Array.from({length:V+1},(_,i)=>i),chosen=[],steps=[];let ans=0;
    function find(n){if(parent[n]!==n)parent[n]=find(parent[n]);return parent[n];}
    const emit=(phase,message,edge=null)=>steps.push({phase,message,nodes:parent.map((_,i)=>i),edges,chosen:chosen.map(e=>[...e]),edge,focus:edge?.slice(0,2)||[],values:Object.fromEntries(parent.map((_,i)=>[i,`대표 ${find(i)}`])),items:sorted.map(([a,b,w])=>`${a}—${b}: ${w}`),stats:[edge?.[0]??'—',edge?.[1]??'—',edge?.[2]??'—',chosen.length,'필요 간선 '+V,ans]});
    emit('sort','크루스칼: 간선을 가중치가 작은 순서로 정렬합니다. 모든 정점을 가장 싼 비용으로 연결할 후보를 고릅니다.');emit('init',`정점은 0~${V}, 총 ${V+1}개입니다. 모두 연결하려면 ${V}개의 간선이 필요합니다.`);
    for(const e of sorted){const [a,b,w]=e,ra=find(a),rb=find(b);if(ra===rb)emit('skip',`${a}—${b} (${w}): 이미 같은 대표 ${ra}입니다. 추가하면 사이클이 되므로 건너뜁니다.`,e);else{parent[rb]=ra;chosen.push(e);ans+=w;emit('choose',`${a}—${b} (${w})를 선택해 두 그룹을 연결합니다. 비용 ${ans}, 선택 간선 ${chosen.length}개입니다.`,e);if(chosen.length===V)break;}}
    if(chosen.length!==V)throw Error('모든 정점이 연결되는 그래프를 입력해 주세요. 최소 신장 트리를 만들 수 없습니다.');
    emit('done',`${V}개 간선으로 ${V+1}개 정점을 연결했습니다. 순환이 없는 최소 신장 트리의 비용은 ${ans}입니다.`);
    return {steps,answer:ans};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'선택한 간선이 초록색',itemTitle:'가중치 오름차순 간선',resultLabel:'최소 신장 트리 비용',samples:['1\n2 3\n0 1 1\n0 2 1\n1 2 6','1\n4 7\n0 1 9\n0 2 3\n0 3 7\n1 4 2\n2 3 8\n2 4 1\n3 4 8','1\n3 5\n0 1 1\n1 2 2\n0 2 3\n2 3 4\n0 3 8']};
})();

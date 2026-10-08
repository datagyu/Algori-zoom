(() => {
  const anchors = [
    ['used = [-1] * 1000001','init'], ['queue = deque([N])','startQueue'], ['used[N] = 0','startDistance'],
    ['while queue:','loop summary'], ['current = queue.popleft()','pop'], ['if current == M:','goal'],
    ['break','found'], ['next_numbers = [current + 1,','numbers'], ['for next_num in next_numbers:','neighbor'],
    ['if 1 <= next_num <= 1000000 and used[next_num] == -1:','check'],
    ['used[next_num] = used[current] + 1','distance'], ['queue.append(next_num)','enqueue'],
    ["print('#{} {}'.format(tc, used[M]))",'output'],
  ].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++)a.push({N:p.number(1,2000,'학습용 N'),M:p.number(1,2000,'학습용 M')});p.end();return a;}
  function build({N,M}) {
    const used=new Int32Array(1000001).fill(-1), prev=new Int32Array(1000001), q=new Int32Array(1000001);
    const steps=[]; let head=0,tail=0,current=null,next=null,processed=0,nodes=[N],edges=[];
    function emit(phase,message,variables={}) {
      steps.push({phase,message,nodes:[...nodes],edges:edges.map(e=>[...e]),directed:true,focus:current==null?[]:[current],
        values:Object.fromEntries(nodes.map(n=>[n,`used=${used[n]}`])), items:Array.from(q.slice(head,Math.min(tail,head+10))).map(n=>`${n} (횟수 ${used[n]})`),
        itemLabel:`BFS 큐 · FRONT → · ${tail-head}개 (앞 10개 표시)`,
        stats:[current??'—',next??'—',current==null?'—':used[current],tail-head,phase==='summary'?'반복 요약':'한 줄씩 실행',used[M]<0?'—':used[M]],
        variables:{current:current??'—',next_num:next??'—','used[current]':current==null?'—':used[current],'used[next_num]':next==null||next<1||next>1000000?'—':used[next],...variables},summary:phase==='summary'});
    }
    emit('init','used를 -1로 초기화합니다. -1은 아직 만들어 보지 않은 수입니다. 큐는 아직 비어 있습니다.');
    q[tail++]=N;emit('startQueue',`출발 수 ${N}을 큐에 넣습니다. 먼저 넣은 수부터 꺼냅니다.`);
    used[N]=0;emit('startDistance',`used[${N}]=0. 출발 수를 만드는 데 필요한 연산은 0번입니다.`);
    let batch=0,batchAdded=0,batchStart=0;
    while(head<tail) {
      const end=tail,level=used[q[head]];let omitted=0,added=0,found=false;
      while(head<end) {
        const detailed=processed<3;
        if(detailed)emit('loop',`큐에 ${tail-head}개가 남아 while queue가 참입니다.`);
        current=q[head++];next=null;processed++;
        if(detailed) {
          if(!nodes.includes(current))nodes=[current];
          edges=[];emit('pop',`큐의 맨 앞에서 ${current}을 꺼냈습니다. 아직 다음 수는 만들지 않았습니다.`);
          emit('goal',`${current} == ${M} → ${current===M}. ${current===M?'목표를 찾았으므로 break합니다.':'목표가 아니므로 네 연산을 확인합니다.'}`);
        }else omitted++;
        if(current===M){found=true;break;}
        const candidates=[current+1,current-1,current*2,current-10];
        if(detailed)emit('numbers',`${current}에 +1, -1, ×2, -10을 적용한 후보는 [${candidates.join(', ')}]입니다. 아직 방문·큐 상태는 바뀌지 않았습니다.`,{next_numbers:candidates.join(', ')});
        for(const [i,n] of candidates.entries()) {
          next=n;const inside=n>=1&&n<=1000000,ok=inside&&used[n]===-1;
          if(detailed) {
            if(inside&&!nodes.includes(n))nodes.push(n);
            if(inside)edges.push([current,n]);
            emit('neighbor',`for문에서 ${['+1','-1','×2','-10'][i]} 결과 ${n}을 next_num으로 꺼냅니다.`);
            emit('check',`${inside?'범위 안, used['+n+']='+used[n]: '범위 밖이므로 used 배열을 읽지 않음'}. 조건 → ${ok}. ${ok?'처음 만든 수이므로 거리를 기록합니다.':'큐에 넣지 않고 다음 후보를 확인합니다.'}`,{범위:inside,미방문:inside?used[n]===-1:'검사 안 함'});
          }
          if(!ok)continue;
          used[n]=used[current]+1;prev[n]=current;if(!detailed)added++;
          if(detailed)emit('distance',`used[${n}] = used[${current}] + 1 = ${used[n]}. 방문 표시와 최소 횟수를 기록합니다. 큐는 아직 그대로입니다.`);
          q[tail++]=n;
          if(detailed)emit('enqueue',`${n}을 큐 뒤에 추가했습니다. 이제 큐 길이는 ${tail-head}입니다.`);
        }
      }
      if(batch===0&&omitted)batchStart=level;
      batch+=omitted;batchAdded+=added;
      if(batch&&(level<5||(level-4)%20===0||found)) {
        nodes=[...new Set([N,current,M])];edges=[];
        emit('summary',`반복 요약: 거리 ${batchStart}~${level} 구간의 나머지 ${batch}개 수에서도 꺼내기 → 목표 검사 → 네 연산 → 범위·방문 검사 → 거리 기록 → 큐 추가를 실행했습니다. 구간에서 새 수 ${batchAdded}개를 발견했습니다.`,{거리층:`${batchStart}~${level}`});
        batch=0;batchAdded=0;batchStart=level+1;
      }
      if(found)break;
    }
    current=M;next=null;nodes=[M];edges=[];
    if(processed>3)emit('goal',`큐에서 목표 ${M}을 꺼냈습니다. current == M은 참입니다. 먼저 꺼낸 목표의 used 값 ${used[M]}이 최소 횟수입니다.`);
    const path=[];for(let n=M;;n=prev[n]){path.push(n);if(n===N)break;}path.reverse();
    nodes=path.slice(0,12);edges=nodes.slice(1).map((n,i)=>[nodes[i],n]);
    emit('found',`break로 while문을 끝냅니다. 최소 ${used[M]}번. 계산한 최단 경로 하나는 아래 목록에 표시합니다.`,{'최단 경로':path.join(' → ')});
    steps.at(-1).items=path.map((n,i)=>i?`${path[i-1]} → ${n}`:`출발 ${n}`);
    steps.at(-1).itemLabel='최단 경로 복습 · 긴 경로의 그래프는 앞 12개';
    return {steps,answer:used[M]};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'수도 정점으로 생각하기',itemTitle:'BFS 큐',resultLabel:'최소 연산 횟수',samples:['1\n2 7','1\n3 15','1\n36 1007']};
})();

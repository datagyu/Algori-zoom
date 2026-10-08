(() => {
  const anchors=[['used[N] = 0','init'],['current = queue.popleft()','pop'],['used[next_num] = used[current] + 1','wave'],['if current == M:','found'],["print('#{} {}'.format(tc, used[M]))",'output']].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),a=[];for(let i=0;i<p.count;i++)a.push({N:p.number(1,2000,'학습용 N'),M:p.number(1,2000,'학습용 M')});p.end();return a;}
  function build({N,M}){
    const dist=new Int32Array(1000001).fill(-1),prev=new Int32Array(1000001),queue=new Int32Array(1000001);let head=0,tail=1;queue[0]=N;dist[N]=0;
    const steps=[];
    const emit=(phase,message,nodes,edges=[],focus=[],items=[],stats=[])=>steps.push({phase,message,nodes,edges,directed:true,focus,items,stats});
    emit('init',`${N}을 0번 연산으로 만들 수 있습니다. 큐에서 꺼내는 순서는 연산 횟수가 적은 순서입니다.`,[N],[],[N],[N],[N,M,0,1,'시작',0]);
    let first=true,batchProcessed=0,batchAdded=0,batchStart=0;
    while(head<tail){const end=tail,level=dist[queue[head]];let processed=0,added=0,found=false;
      while(head<end){const current=queue[head++];processed++;if(current===M){found=true;break;}
        const neighbors=[current+1,current-1,current*2,current-10],fresh=[];
        for(const n of neighbors)if(n>=1&&n<=1000000&&dist[n]===-1){dist[n]=level+1;prev[n]=current;queue[tail++]=n;added++;fresh.push(n);}
        if(first){emit('pop',`${current}에서 +1, -1, ×2, -10을 확인합니다. 범위 밖·이미 방문한 수는 큐에 넣지 않습니다.`,[current,...fresh],fresh.map(n=>[current,n]),[current],fresh,[current,M,level,fresh.length,'첫 확장',dist[M]<0?'—':dist[M]]);first=false;}
      }
      batchProcessed+=processed;batchAdded+=added;
      if(level<3||(level-2)%20===0||found){emit('wave',`연산 ${batchStart===level?level:batchStart+'~'+level}번 구간: 수 ${batchProcessed.toLocaleString()}개를 확인하고 새 수 ${batchAdded.toLocaleString()}개를 발견했습니다. 반복은 거리별로 묶으며, 긴 탐색은 20개 거리 층씩 요약합니다.`,[N,M],[],[],Array.from(queue.slice(head,Math.min(tail,head+10))),[N,M,level,tail-head,'거리별 요약',dist[M]<0?'—':dist[M]]);batchStart=level+1;batchProcessed=0;batchAdded=0;}
      if(found)break;
    }
    const path=[];for(let n=M;;n=prev[n]){path.push(n);if(n===N)break;}path.reverse();
    const operations=path.slice(1).map((n,i)=>n===path[i]+1?'+1':n===path[i]-1?'-1':n===path[i]*2?'×2':'-10');
    emit('found',`목표를 큐에서 꺼냈습니다. 최소 ${dist[M]}번입니다. 가능한 최단 경로 하나: ${path.map((n,i)=>i?`${operations[i-1]} → ${n}`:n).join(' · ')}`,path.slice(0,12),path.slice(1,12).map((n,i)=>[path[i],n]),[M],path.map((n,i)=>`${n}${i?' ('+operations[i-1]+')':''}`),[N,M,dist[M],tail-head,'목표 도착',dist[M]]);
    return {steps,answer:dist[M]};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'수도 정점으로 생각하기',itemTitle:'큐 앞 10개 / 마지막 단계는 최단 경로',resultLabel:'최소 연산 횟수',samples:['1\n2 7','1\n3 15','1\n36 1007']};
})();

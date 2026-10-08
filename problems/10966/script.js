(() => {
  const anchors=[['queue = deque()','init'],["if ground[r][c] == 'W':",'water'],['distance[nr][nc] = distance[cr][cc] + 1','wave'],["print('#{} {}'.format(tc, ans))",'output']].map(([text,types])=>({text,types}));
  function parse(text){const p=GraphLessonInput(text),cases=[];for(let t=0;t<p.count;t++){const N=p.number(1,8,'행 수'),M=p.number(1,10,'열 수'),grid=Array.from({length:N},()=>{const row=p.word();if(row.length!==M||!/^[WL]+$/.test(row))throw Error('각 지도 행에 열 수만큼 W(물), L(땅)를 입력해 주세요.');return [...row];});if(!grid.some(r=>r.includes('W')))throw Error('물(W)이 적어도 한 칸 필요합니다.');cases.push({grid});}p.end();return cases;}
  function build({grid}){
    const N=grid.length,M=grid[0].length,dist=grid.map(r=>r.map(()=>-1)),steps=[];let q=[],ans=0,visited=0;
    const emit=(phase,message,focus=[])=>steps.push({phase,message,grid,dist:dist.map(r=>[...r]),focus,items:q.slice(0,12).map(([r,c])=>`(${r},${c})`),itemLabel:`다음 거리의 큐 ${q.length}칸 · 앞 12개 표시`,stats:[focus.length+'칸',q.length,visited,N*M,phase==='wave'?'동일 거리 묶음':'준비',ans]});
    emit('init','물에서 출발해 땅으로 퍼져 나갑니다. distance=-1은 아직 거리를 모르는 칸입니다.');
    grid.forEach((row,r)=>row.forEach((v,c)=>{if(v==='W'){dist[r][c]=0;q.push([r,c]);visited++;}}));
    emit('water','모든 물을 거리 0으로 동시에 큐에 넣습니다. 땅은 가장 먼저 닿은 물까지의 거리를 얻습니다.',q);
    while(q.length){const wave=q;q=[];const focus=[];for(const [r,c] of wave)for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<N&&nc>=0&&nc<M&&dist[nr][nc]===-1){dist[nr][nc]=dist[r][c]+1;ans+=dist[nr][nc];visited++;q.push([nr,nc]);focus.push([nr,nc]);}}
      if(focus.length)emit('wave',`거리 ${dist[focus[0][0]][focus[0][1]]}인 땅 ${focus.length}칸을 처음 발견했습니다. 같은 거리의 반복을 한 단계로 묶었습니다. 합계는 ${ans}입니다.`,focus);
    }
    return {steps,answer:ans};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'물에서 퍼지는 거리',itemTitle:'BFS 큐 · 좌표는 0부터',resultLabel:'모든 땅의 최소 거리 합',samples:['1\n2 3\nWLL\nLLL','1\n3 2\nWL\nLL\nLW','1\n4 5\nLLLWW\nWWLLL\nLLLWL\nLWLLL']};
})();

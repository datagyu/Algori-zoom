(() => {
  const anchors = [
    ['distance = [[-1] * M for _ in range(N)]', 'init'],
    ["if ground[r][c] == 'W':", 'waterCheck waterSummary'],
    ['queue.append((r, c))', 'waterQueue'], ['distance[r][c] = 0', 'waterDistance'],
    ['ans = 0', 'sumInit'], ['while queue:', 'loop summary'],
    ['cr, cc = queue.popleft()', 'pop'], ['nr, nc = cr + dr, cc + dc', 'neighbor'],
    ['if 0 <= nr < N and 0 <= nc < M and distance[nr][nc] == -1:', 'check'],
    ['distance[nr][nc] = distance[cr][cc] + 1', 'distance'],
    ['ans += distance[nr][nc]', 'sum'], ['queue.append((nr, nc))', 'enqueue'],
    ["print('#{} {}'.format(tc, ans))", 'output'],
  ].map(([text, types]) => ({text, types}));
  function parse(text) {
    const p = GraphLessonInput(text), cases = [];
    for (let t = 0; t < p.count; t++) {
      const N = p.number(1, 8, '행 수'), M = p.number(1, 10, '열 수');
      const grid = Array.from({length:N}, () => {
        const row = p.word();
        if (row.length !== M || !/^[WL]+$/.test(row)) throw Error('각 지도 행에 열 수만큼 W(물), L(땅)를 입력해 주세요.');
        return [...row];
      });
      if (!grid.some(r => r.includes('W'))) throw Error('물(W)이 적어도 한 칸 필요합니다.');
      cases.push({grid});
    }
    p.end(); return cases;
  }
  function build({grid}) {
    const N = grid.length, M = grid[0].length, dist = grid.map(r => r.map(() => -1)), steps = [];
    const q = []; let head = 0, ans = 0, current = null, next = null, popped = 0;
    const coord = p => p ? `(${p[0]}, ${p[1]})` : '—';
    function emit(phase, message, focus = [], variables = {}) {
      steps.push({phase, message, grid, dist:dist.map(r => [...r]), focus,
        items:q.slice(head, head+12).map(coord), itemLabel:`BFS 큐 · 왼쪽이 FRONT · ${q.length-head}칸 (앞 12개 표시)`,
        stats:[coord(current), coord(next), current ? dist[current[0]][current[1]] : '—', q.length-head, phase==='summary'?'반복 요약':'한 줄씩 실행', ans],
        variables:{'cr, cc':coord(current), 'nr, nc':coord(next), ans, ...variables}, summary:phase==='summary'});
    }
    emit('init', 'distance를 -1로 초기화합니다. -1은 아직 방문하지 않아 물까지의 거리를 모른다는 뜻입니다.');
    const full = N*M <= 12;
    for (let r=0;r<N;r++) for (let c=0;c<M;c++) {
      const water = grid[r][c] === 'W';
      if (full || water) emit('waterCheck', `ground[${r}][${c}] == 'W' → ${water}. ${water?'물이라 큐에 넣습니다.':'땅이라 초기 큐에 넣지 않습니다.'}`, [[r,c]], {'r, c':`(${r}, ${c})`, ground:grid[r][c]});
      if (water) {
        q.push([r,c]); emit('waterQueue', `물 (${r}, ${c})을 큐 뒤에 넣었습니다. 아직 distance는 -1입니다.`, [[r,c]]);
        dist[r][c] = 0; emit('waterDistance', `distance[${r}][${c}] = 0. 물에서 물까지는 이동하지 않습니다.`, [[r,c]]);
      }
    }
    if(!full){emit('waterSummary',`초기 지도 검사 요약: ${N*M}칸을 모두 검사했고 물 ${q.length}칸만 큐에 넣어 거리 0으로 표시했습니다. 반복되는 땅 검사는 큐·거리 상태를 바꾸지 않습니다.`);steps.at(-1).summary=true;steps.at(-1).stats[4]='초기 검사 요약';}
    emit('sumInit', '모든 물을 출발점으로 준비했습니다. 땅의 거리 합 ans를 0으로 두고 BFS를 시작합니다.');
    while (head < q.length) {
      const end = q.length, layer = dist[q[head][0]][q[head][1]];
      let omitted = 0, added = 0, layerSum = 0; const discovered = [];
      while (head < end) {
        const detailed = full || popped < 2;
        if (detailed) emit('loop', `큐에 ${q.length-head}칸이 남아 while queue가 참입니다.`);
        current = q[head++]; next = null; popped++;
        if (detailed) emit('pop', `큐 맨 앞에서 ${coord(current)}을 꺼냅니다. 큐 길이는 ${q.length-head}로 줄었습니다.`, [current]);
        else omitted++;
        const [r,c] = current;
        for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          next = [r+dr,c+dc]; const [nr,nc] = next;
          const inside = nr>=0 && nr<N && nc>=0 && nc<M, ok = inside && dist[nr][nc] === -1;
          if (detailed) {
            emit('neighbor', `방향 (${dr}, ${dc})을 더해 다음 좌표 ${coord(next)}을 계산합니다. 아직 방문하지 않았습니다.`, inside?[current,next]:[current], {dr,dc});
            emit('check', `${inside?'격자 안입니다. distance['+nr+']['+nc+']='+dist[nr][nc]+'.':'격자 밖입니다. 배열 값을 읽지 않습니다.'} 조건 → ${ok}. ${ok?'처음 방문하므로 거리를 갱신합니다.':'이 방향은 건너뜁니다.'}`, inside?[current,next]:[current], {범위:inside, 미방문:inside?dist[nr][nc]===-1:'검사 안 함'});
          }
          if (!ok) continue;
          dist[nr][nc] = dist[r][c]+1;
          if (detailed) emit('distance', `distance[${nr}][${nc}] = ${dist[r][c]} + 1 = ${dist[nr][nc]}. 큐에는 아직 넣지 않았습니다.`, [next]);
          ans += dist[nr][nc]; layerSum += dist[nr][nc]; added++; discovered.push(next);
          if (detailed) emit('sum', `새 땅의 거리 ${dist[nr][nc]}를 ans에 더해 ${ans}이 되었습니다. 이미 방문한 땅은 다시 더하지 않습니다.`, [next]);
          q.push(next);
          if (detailed) emit('enqueue', `${coord(next)}을 큐 뒤에 넣습니다. 먼저 들어온 칸들이 먼저 꺼내집니다.`, [next]);
        }
      }
      if (omitted) emit('summary', `반복 요약: 거리 ${layer}의 나머지 ${omitted}칸에서도 꺼내기 → 네 방향 조건 검사 → 거리 갱신 → 합산 → 큐 추가를 실행했습니다. 이 층에서 새 땅 ${added}칸, 합 증가 ${layerSum}. 계산은 모두 수행했습니다.`, discovered);
    }
    current = next = null;
    emit('loop', '큐가 비어 while queue가 거짓입니다. 모든 땅의 최소 거리를 구했으므로 반복문을 끝냅니다.');
    return {steps, answer:ans};
  }
  window.GraphLesson={anchors,parse,build,boardTitle:'물에서 퍼지는 거리',itemTitle:'BFS 큐 · 좌표는 0부터',resultLabel:'모든 땅의 최소 거리 합',samples:['1\n2 3\nWLL\nLLL','1\n3 2\nWL\nLL\nLW','1\n4 5\nLLLWW\nWWLLL\nLLLWL\nLWLLL']};
})();

(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    number: "5656",
    title: "벽돌 깨기",
    autoplayMs: 500,
    defaultSampleId: "all",
    samples: [{"id":"s1","label":"샘플 1","value":"1\n3 10 10\n0 0 0 0 0 0 0 0 0 0\n1 0 1 0 1 0 0 0 0 0\n1 0 3 0 1 1 0 0 0 1\n1 1 1 0 1 2 0 0 0 9\n1 1 4 0 1 1 0 0 1 1\n1 1 4 1 1 1 2 1 1 1\n1 1 5 1 1 1 1 2 1 1\n1 1 6 1 1 1 1 1 2 1\n1 1 1 1 1 1 1 1 1 5\n1 1 7 1 1 1 1 1 1 1"},{"id":"s2","label":"샘플 2","value":"1\n2 9 10\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0 0\n1 1 0 0 1 0 0 0 0\n1 1 0 1 1 1 0 1 0\n1 1 0 1 1 1 0 1 0\n1 1 1 1 1 1 1 1 0\n1 1 3 1 6 1 1 1 1\n1 1 1 1 1 1 1 1 1"},{"id":"s3","label":"샘플 3","value":"1\n3 6 7\n1 1 0 0 0 0\n1 1 0 0 1 0\n1 1 0 0 4 0\n4 1 0 0 1 0\n1 5 1 0 1 6\n1 2 8 1 1 6\n1 1 1 9 2 1"},{"id":"s4","label":"샘플 4","value":"1\n4 4 15\n0 0 0 0\n0 0 0 0\n0 0 0 0\n1 0 0 0\n1 0 0 0\n1 0 0 0\n1 0 0 0\n1 0 5 0\n1 1 1 0\n1 1 1 9\n1 1 1 1\n1 6 1 2\n1 1 1 5\n1 1 1 1\n2 1 1 2"},{"id":"s5","label":"샘플 5","value":"1\n4 12 15\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9"},{"id":"all","label":"전체 샘플","value":"5\n3 10 10\n0 0 0 0 0 0 0 0 0 0\n1 0 1 0 1 0 0 0 0 0\n1 0 3 0 1 1 0 0 0 1\n1 1 1 0 1 2 0 0 0 9\n1 1 4 0 1 1 0 0 1 1\n1 1 4 1 1 1 2 1 1 1\n1 1 5 1 1 1 1 2 1 1\n1 1 6 1 1 1 1 1 2 1\n1 1 1 1 1 1 1 1 1 5\n1 1 7 1 1 1 1 1 1 1\n2 9 10\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0 0\n1 1 0 0 1 0 0 0 0\n1 1 0 1 1 1 0 1 0\n1 1 0 1 1 1 0 1 0\n1 1 1 1 1 1 1 1 0\n1 1 3 1 6 1 1 1 1\n1 1 1 1 1 1 1 1 1\n3 6 7\n1 1 0 0 0 0\n1 1 0 0 1 0\n1 1 0 0 4 0\n4 1 0 0 1 0\n1 5 1 0 1 6\n1 2 8 1 1 6\n1 1 1 9 2 1\n4 4 15\n0 0 0 0 \n0 0 0 0 \n0 0 0 0 \n1 0 0 0 \n1 0 0 0 \n1 0 0 0 \n1 0 0 0 \n1 0 5 0 \n1 1 1 0 \n1 1 1 9 \n1 1 1 1 \n1 6 1 2 \n1 1 1 5 \n1 1 1 1 \n2 1 1 2 \n4 12 15\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9"}],
    sourceSteps: [
      { text: "direction = [(-1,0), (1,0), (0,-1), (0,1)]", types: "directions" },
      { text: "T = int(input())", types: "testCount" },
      { text: "def dfs(level, board):", types: "enter" },
      { text: "global ans", types: "globalAns" },
      { text: "c_block = 0", types: "countInit" },
      { text: "if ans == 0:", types: "checkZero" },
      { text: "return", types: "prune", occurrence: 1 },
      { text: "for i in range(H):", types: "count" },
      { text: "for j in range(W):", types: "countColumn" },
      { text: "if board[i][j] != 0:", types: "countCheck" },
      { text: "c_block += 1", types: "countAdd" },
      { text: "if c_block == 0:", types: "empty" },
      { text: "ans = 0", types: "emptyAns" },
      { text: "return", types: "emptyReturn", occurrence: 2 },
      { text: "if level == N:", types: "levelEnd" },
      { text: "ans = min(ans, c_block)", types: "updateAns" },
      { text: "return", types: "levelReturn", occurrence: 3 },
      { text: "for c in range(W):", types: "column" },
      { text: "for r in range(H):", types: "hitScan emptyColumn" },
      { text: "if board[r][c] != 0:", types: "hit" },
      { text: "c_board = [row[:] for row in board]", types: "copy" },
      { text: "queue = []", types: "queueInit" },
      { text: "queue.append((r, c, board[r][c]))", types: "enqueue" },
      { text: "c_board[r][c] = 0", types: "removeHit" },
      { text: "while queue:", types: "queueLoop" },
      { text: "cr, cc, block = queue.pop(0)", types: "pop" },
      { text: "for dr, dc in direction:", types: "spread" },
      { text: "for num in range(1, block):", types: "distance" },
      { text: "nr, nc = cr + dr * num, cc + dc * num", types: "coords" },
      { text: "if not (0 <= nr < H and 0 <= nc < W):", types: "bounds" },
      { text: "break", types: "spreadBreak", occurrence: 1 },
      { text: "if c_board[nr][nc] != 0:", types: "chain" },
      { text: "queue.append((nr, nc, c_board[nr][nc]))", types: "chainEnqueue" },
      { text: "c_board[nr][nc] = 0", types: "chainRemove" },
      { text: "for k in range(W):", types: "gravity" },
      { text: "remain_blocks = []", types: "gravityInit" },
      { text: "for l in range(H-1, -1, -1):", types: "gravityScan", occurrence: 1 },
      { text: "if c_board[l][k] != 0:", types: "gravityCheck" },
      { text: "remain_blocks.append(c_board[l][k])", types: "gravityCollect" },
      { text: "c_board[l][k] = 0", types: "gravityClear" },
      { text: "for l in range(H-1, -1, -1):", types: "gravityFill", occurrence: 2 },
      { text: "if not remain_blocks:", types: "gravityEmpty" },
      { text: "break", types: "gravityBreak", occurrence: 2 },
      { text: "c_board[l][k] = remain_blocks.pop(0)", types: "gravityPlace" },
      { text: "dfs(level + 1, c_board)", types: "recurse" },
      { text: "break", types: "backtrack", occurrence: 3 },
      { text: "for tc in range(1, T + 1):", types: "case" },
      { text: "N, W, H = map(int, input().split())", types: "dimensions" },
      { text: "blocks = [list(map(int, input().split())) for _ in range(H)]", types: "loadBoard" },
      { text: "ans = float('inf')", types: "initAns" },
      { text: "dfs(0, blocks)", types: "start" },
      { text: "print('#{} {}'.format(tc, ans))", types: "output" },
    ],
  });

  const els = Core.getByIds([
    "sourceCode", "codeView", "mobileCodeView", "codeViewport", "mobileCodeViewport",
    "resetBtn", "prevBtn", "nextBtn", "playBtn", "replayBtn", "skipBtn",
    "speedRange", "speedLabel", "timeline", "mobileTimeline", "stepLabel",
    "mobileTimelineStatus", "mobilePlayBtn", "mobilePrevBtn", "mobileNextBtn",
    "codeLineLabel", "mobileCodeStatus", "board", "mobileBoard", "boardLabel",
    "phaseLabel", "mobilePhase", "levelValue", "columnValue", "blockCountValue",
    "powerValue", "queueValue", "ansValue", "explainText", "mobileCoord",
    "mobileExplanation", "mobileStateMeta", "mobileLevel", "mobileColumn",
    "mobileCount", "mobileAns", "routeView", "mobileRouteView", "routeMeta",
    "queueView", "mobileQueueView", "impactView", "mobileImpactView",
    "outputView", "mobileOutputView", "inputArea", "applyBtn", "sampleButtons", "inputError",
  ]);

  const state = { steps: [], iterator: null, complete: false, seeking: false, generation: 0,
    stepIndex: 0, timer: null, speed: 1, selectedSample: PROBLEM.defaultSampleId };
  let desktopLines, mobileLines, stepLines;
  const DIR = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const cloneBoard = (board) => board.map((row) => row.slice());

  function parseInput(text) {
    const tokens = text.trim().split(/\s+/).filter(Boolean).map(Number);
    if (!tokens.length || tokens.some(Number.isNaN)) throw new Error("숫자로 된 입력을 확인해주세요.");
    let p = 0;
    const T = tokens[p++];
    if (!Number.isInteger(T) || T < 1 || T > 50) throw new Error("T는 1~50 사이여야 합니다.");
    const cases = [];
    for (let tc = 0; tc < T; tc++) {
      if (p + 2 >= tokens.length) throw new Error(`#${tc + 1}의 N W H가 부족합니다.`);
      const N = tokens[p++], W = tokens[p++], H = tokens[p++];
      if (!Number.isInteger(N) || N < 1 || N > 4) throw new Error("N은 1~4 사이여야 합니다.");
      if (!Number.isInteger(W) || W < 2 || W > 12) throw new Error("W는 2~12 사이여야 합니다.");
      if (!Number.isInteger(H) || H < 2 || H > 15) throw new Error("H는 2~15 사이여야 합니다.");
      const board = [];
      for (let r = 0; r < H; r++) {
        if (p + W > tokens.length) throw new Error(`#${tc + 1}의 ${r + 1}번째 보드 행이 부족합니다.`);
        const row = tokens.slice(p, p + W);
        p += W;
        if (row.some((v) => !Number.isInteger(v) || v < 0 || v > 9)) throw new Error("벽돌 값은 0~9 사이 정수여야 합니다.");
        board.push(row);
      }
      cases.push({ N, W, H, board });
    }
    if (p !== tokens.length) throw new Error("입력 끝에 사용되지 않은 값이 있습니다.");
    return cases;
  }

  function countBlocks(board) {
    let count = 0;
    for (const row of board) for (const value of row) if (value !== 0) count += 1;
    return count;
  }

  // Generate execution frames on demand; no testcase is truncated at a frame limit.
  function* buildSteps(cases) {
    let output = "";
    const initial = { tc: 1, data: cases[0], level: null, board: cloneBoard(cases[0].board),
      ans: Infinity, path: [], output, queue: [], removed: [], blast: [] };
    yield { ...initial, phase: "directions", message: "상하좌우 네 폭발 방향을 정의하고 DFS 함수를 준비합니다." };
    yield { ...initial, phase: "testCount", message: `T=${cases.length}: 테스트케이스 수를 읽습니다.` };
    for (const [ci, data] of cases.entries()) {
      let ans = Infinity;
      let bestBoard = cloneBoard(data.board);
      let bestPath = [];
      const path = [];
      const frame = (phase, level, board, message, extra = {}) => ({
        tc: ci + 1, data, phase, level, board: cloneBoard(board), ans,
        path: [...path], message, output, ...extra,
        queue: (extra.queue || []).map((v) => [...v]),
        removed: (extra.removed || []).map((v) => [...v]),
        blast: (extra.blast || []).map((v) => [...v]),
      });
      yield frame("case", null, data.board, `#${ci + 1} 테스트케이스를 시작합니다.`);
      yield frame("dimensions", null, data.board, `N=${data.N}, W=${data.W}, H=${data.H}를 읽습니다.`);
      yield frame("loadBoard", null, data.board, "입력으로 벽돌 보드를 만듭니다.");
      yield frame("initAns", null, data.board, "ans를 무한대로 초기화합니다.");
      yield frame("start", 0, data.board, "dfs(0, blocks)로 첫 구슬 탐색을 시작합니다.");

      function* dfs(level, board) {
        let cBlock = 0;
        const emit = (phase, message, extra = {}) => frame(phase, level, board, message, { cBlock, ...extra });
        yield emit("enter", `dfs(level=${level})에 들어옵니다.`);
        yield emit("checkZero", `ans=${Number.isFinite(ans) ? ans : "∞"}: 0인지 확인합니다.`);
        if (ans === 0) {
          yield emit("prune", "ans가 0이므로 이 DFS 호출에서 돌아갑니다.");
          return;
        }
        cBlock = countBlocks(board);
        yield emit("count", `보드 전체의 0이 아닌 칸을 세었습니다. c_block = ${cBlock}입니다.`);
        yield emit("empty", `남은 벽돌 ${cBlock}개가 0인지 확인합니다.`);
        if (cBlock === 0) {
          ans = 0;
          bestBoard = cloneBoard(board);
          bestPath = [...path];
          yield emit("emptyAns", "벽돌이 없으므로 ans = 0으로 갱신합니다.");
          yield emit("emptyReturn", "이 DFS 호출에서 돌아갑니다.");
          return;
        }
        yield emit("levelEnd", `level=${level}이 N=${data.N}인지 확인합니다.`);
        if (level === data.N) {
          const old = ans;
          ans = Math.min(ans, cBlock);
          if (ans < old) { bestBoard = cloneBoard(board); bestPath = [...path]; }
          yield emit("updateAns", `ans: ${Number.isFinite(old) ? old : "∞"} → ${ans}`);
          yield emit("levelReturn", "구슬을 모두 사용했으므로 호출에서 돌아갑니다.");
          return;
        }
        for (let c = 0; c < data.W; c++) {
          yield emit("column", `${c + 1}번 열을 선택합니다.`, { column: c });
          let hitFound = false;
          for (let r = 0; r < data.H; r++) {
            const hit = [r, c];
            if (!board[r][c]) continue;
            hitFound = true;
            yield emit("hit", `위쪽 빈 칸을 지나 (${r + 1}, ${c + 1})의 첫 벽돌 ${board[r][c]}에 명중합니다.`, { column: c, cursor: hit, hit });
            const cBoard = cloneBoard(board);
            const queue = [];
            const removed = [];
            const shot = (phase, message, extra = {}) => frame(phase, level, cBoard, message, {
              column: c, queue, removed, cBlock, ...extra,
            });
            yield shot("copy", "원본 보드를 c_board로 복사합니다.", { hit });
            yield shot("queueInit", "queue = []로 폭발 대기열을 만듭니다.", { hit });
            queue.push([r, c, board[r][c]]);
            yield shot("enqueue", `명중한 값 ${board[r][c]} 벽돌을 queue에 추가합니다.`, { hit, power: board[r][c] });
            cBoard[r][c] = 0;
            removed.push(hit);
            yield shot("removeHit", "명중한 벽돌의 칸을 0으로 비웁니다.", { hit, power: board[r][c] });
            while (true) {
              yield shot("queueLoop", `queue에 ${queue.length}개가 있습니다.${queue.length ? " 다음 폭발을 처리합니다." : " 연쇄 폭발을 마쳤습니다."}`);
              if (!queue.length) break;
              const [cr, cc, block] = queue.shift();
              const blast = [];
              const explosion = (phase, message, extra = {}) => shot(phase, message, { source: [cr, cc], power: block, blast, ...extra });
              yield explosion("pop", `(${cr + 1}, ${cc + 1})의 값 ${block} 벽돌을 꺼냅니다.`);
              for (const [dr, dc] of DIR) {
                for (let num = 1; num < block; num++) {
                  const nr = cr + dr * num, nc = cc + dc * num;
                  const cursor = [nr, nc];
                  const inside = 0 <= nr && nr < data.H && 0 <= nc && nc < data.W;
                  if (!inside) break;
                  blast.push(cursor);
                  if (cBoard[nr][nc] !== 0) {
                    const value = cBoard[nr][nc];
                    yield explosion("chain", `방향 (${dr}, ${dc})으로 ${num}칸 떨어진 (${nr + 1}, ${nc + 1})에 값 ${value} 벽돌이 있습니다. 연쇄 폭발 대상입니다.`, { cursor });
                    queue.push([nr, nc, value]);
                    yield explosion("chainEnqueue", `값 ${value} 벽돌을 queue에 추가합니다.`, { cursor });
                    cBoard[nr][nc] = 0;
                    removed.push(cursor);
                    yield explosion("chainRemove", "queue에 추가한 벽돌의 칸을 0으로 비웁니다.", { cursor });
                  }
                }
              }
            }
            for (let k = 0; k < data.W; k++) {
              const remain = [];
              const gravity = (phase, message, l = null) => shot(phase, message, {
                gravityColumn: k, gravityRow: l, remainBlocks: [...remain],
                removed: [],
              });
              yield gravity("gravityInit", `k=${k}: ${k + 1}번 열의 remain_blocks = []를 준비합니다. 아래부터 빈 칸을 건너뛰며 벽돌을 모읍니다.`);
              for (let l = data.H - 1; l >= 0; l--) {
                if (cBoard[l][k] !== 0) {
                  remain.push(cBoard[l][k]);
                  yield gravity("gravityCollect", `l=${l}: (${l + 1}, ${k + 1})의 값 ${cBoard[l][k]}을 목록 뒤에 추가합니다.`, l);
                  cBoard[l][k] = 0;
                  yield gravity("gravityClear", "목록에 보관한 벽돌의 기존 칸을 비웁니다.", l);
                }
              }
              for (let l = data.H - 1; l >= 0; l--) {
                if (!remain.length) {
                  yield gravity("gravityBreak", "목록이 비었으므로 이 열의 채우기를 끝냅니다.", l);
                  break;
                }
                cBoard[l][k] = remain.shift();
                yield gravity("gravityPlace", `맨 앞 값 ${cBoard[l][k]}을 (${l + 1}, ${k + 1})에 놓습니다.`, l);
              }
            }
            path.push(c);
            yield shot("recurse", `중력을 마쳤습니다. dfs(${level + 1}, c_board)를 호출합니다.`, { removed: [], settled: true });
            yield* dfs(level + 1, cBoard);
            path.pop();
            yield emit("backtrack", `재귀 호출에서 돌아왔습니다. 원본 보드로 복귀하고 r 반복을 끝냅니다.`, { column: c });
            break;
          }
          if (!hitFound) yield emit("emptyColumn", `${c + 1}번 열을 위에서 아래까지 확인했지만 벽돌이 없습니다. 다음 열로 넘어갑니다.`, { column: c });
        }
      }
      yield* dfs(0, cloneBoard(data.board));
      output += `#${ci + 1} ${ans}\n`;
      yield frame("output", null, bestBoard, `#${ci + 1} ${ans}를 출력합니다. 최적 경로의 최종 보드입니다.`, {
        path: [...bestPath], cBlock: ans, best: true,
      });
    }
  }

  const names = {
    directions: "방향 정의", testCount: "테스트 수 입력", globalAns: "전역 ans",
    case: "테스트케이스", dimensions: "크기 입력", loadBoard: "보드 입력", initAns: "ans 초기화",
    countInit: "개수 초기화", countColumn: "개수 확인 칸", countCheck: "벽돌 여부", countAdd: "개수 증가",
    emptyAns: "ans 0 갱신", emptyReturn: "DFS 반환", levelReturn: "DFS 반환",
    hitScan: "명중 위치 탐색", queueInit: "queue 초기화", distance: "폭발 거리",
    coords: "폭발 좌표", bounds: "범위 확인", spreadBreak: "방향 탐색 종료",
    chainEnqueue: "연쇄 queue 추가", chainRemove: "연쇄 벽돌 제거",
    start: "탐색 시작", enter: "DFS 호출", checkZero: "0 조기 종료 확인", prune: "탐색 종료",
    count: "벽돌 개수 계산", empty: "벽돌 0개", levelEnd: "구슬 사용 완료", updateAns: "ans 갱신",
    column: "열 선택", emptyColumn: "빈 열", hit: "구슬 명중", copy: "보드 복사", enqueue: "queue 추가",
    removeHit: "첫 벽돌 제거", queueLoop: "연쇄 폭발", pop: "폭발 벽돌 꺼내기", chain: "연쇄 제거",
    gravity: "중력 준비", gravityDone: "중력 적용", recurse: "다음 구슬", backtrack: "백트래킹",
    gravityInit: "목록 초기화", gravityScan: "아래부터 확인", gravityCheck: "벽돌 확인",
    gravityCollect: "벽돌 모으기", gravityClear: "기존 칸 비우기", gravityFill: "아래부터 채우기",
    gravityEmpty: "남은 목록 확인", gravityBreak: "열 채우기 완료", gravityPlace: "벽돌 배치",
    summary: "탐색 요약", output: "출력",
  };

  function key(r, c) { return `${r},${c}`; }

  function board(container, s) {
    const { W, H } = s.data;
    const removed = new Set((s.removed || []).map((v) => key(v[0], v[1])));
    const blast = new Set((s.blast || []).map((v) => key(v[0], v[1])));
    const queued = new Set((s.queue || []).map((v) => key(v[0], v[1])));
    const hit = s.hit ? key(s.hit[0], s.hit[1]) : null;
    const source = s.source ? key(s.source[0], s.source[1]) : null;
    const heads = Array.from({ length: W }, (_, c) => `<div class="col-head ${c === (s.gravityColumn ?? s.column) ? "active" : ""}">${c + 1}</div>`).join("");
    let cells = "";
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const value = s.board[r][c];
        const cellKey = key(r, c);
        let cls = "brick-cell";
        if (value === 0) cls += " empty";
        else if (value > 1) cls += " strong";
        if (cellKey === hit) cls += " hit";
        if (cellKey === source) cls += " source";
        if (blast.has(cellKey)) cls += " blast";
        if (removed.has(cellKey) && value === 0) cls += " removed";
        if (queued.has(cellKey)) cls += " queued";
        if (s.settled && value !== 0) cls += " settled";
        if (s.cursor && r === s.cursor[0] && c === s.cursor[1]) cls += " gravity-current";
        if (c === s.gravityColumn) cls += " gravity-column";
        if (c === s.gravityColumn && r === s.gravityRow) cls += " gravity-current";
        cells += `<div class="${cls}" title="r${r + 1}, c${c + 1}">${value === 0 ? "" : value}</div>`;
      }
    }
    const gravity = s.gravityColumn == null ? "" : `<div class="gravity-state"><span class="queue-empty">k=${s.gravityColumn} · l=${s.gravityRow ?? "—"} · remain_blocks (앞 → 뒤)</span><div class="queue-view">${s.remainBlocks.length ? s.remainBlocks.map((value, i) => `<span class="queue-chip ${i === 0 ? "gravity-front" : ""}">${value}</span>`).join("") : '<span class="queue-empty">[]</span>'}</div></div>`;
    container.innerHTML = `<div class="brick-scene"><div class="brick-col-heads" style="grid-template-columns:repeat(${W},34px)">${heads}</div><div class="brick-board" style="grid-template-columns:repeat(${W},34px)">${cells}</div>${gravity}<p class="brick-legend">금색: 구슬 명중 · 주황: 현재 폭발 범위 · 보라 테두리: queue 대기 · ×: 이번 구슬에서 제거된 칸 · 파랑: 중력 적용 후 벽돌${s.gravityColumn == null ? "" : " · 파랑 열: 중력 처리 중 · 금색 칸: 현재 l"}</p></div>`;
  }

  function route(container, s) {
    if (!s.path.length) {
      container.innerHTML = '<span class="queue-empty">아직 구슬을 떨어뜨리지 않았습니다.</span>';
      return;
    }
    container.innerHTML = s.path.map((c, i) => `<span class="route-chip ${i === s.path.length - 1 ? "current" : ""}">${i + 1}번째 구슬 → ${c + 1}열</span>`).join("");
  }

  function queueView(container, s) {
    if (!s.queue || !s.queue.length) {
      container.innerHTML = '<span class="queue-empty">queue가 비어 있습니다.</span>';
      return;
    }
    container.innerHTML = s.queue.map((v) => `<span class="queue-chip">(${v[0] + 1},${v[1] + 1}) · ${v[2]}</span>`).join("");
  }

  function impactText(s) {
    const parts = [];
    if (s.source) parts.push(`현재 폭발: (${s.source[0] + 1}, ${s.source[1] + 1}) · block=${s.power}`);
    if (s.removed?.length) parts.push(`이번 구슬 제거: ${s.removed.length}개`);
    if (s.cBlock != null) parts.push(`c_block: ${s.cBlock}`);
    if (!parts.length) parts.push("열을 선택하면 명중 위치와 연쇄 폭발 과정이 표시됩니다.");
    return parts.join(" · ");
  }

  function highlight(lines, n) { lines.forEach((line, k) => line.classList.toggle("active", k === n)); }

  function renderD(s) {
    const ln = stepLines.get(s.phase);
    highlight(desktopLines, ln);
    board(els.board, s);
    route(els.routeView, s);
    queueView(els.queueView, s);
    els.codeLineLabel.textContent = ln ? `LINE ${ln}` : names[s.phase];
    els.boardLabel.textContent = `#${s.tc} · N=${s.data.N} · ${s.data.W}×${s.data.H}`;
    els.phaseLabel.textContent = names[s.phase];
    els.levelValue.textContent = s.level ?? "—";
    els.columnValue.textContent = s.column == null ? "—" : s.column;
    els.blockCountValue.textContent = s.cBlock ?? "—";
    els.powerValue.textContent = s.power ?? "—";
    els.queueValue.textContent = s.queue?.length ?? 0;
    els.ansValue.textContent = Number.isFinite(s.ans) ? s.ans : "∞";
    els.explainText.textContent = s.message;
    els.routeMeta.textContent = `구슬 ${s.path.length} / ${s.data.N} · 최적 ans ${Number.isFinite(s.ans) ? s.ans : "∞"}`;
    els.impactView.textContent = impactText(s);
    els.outputView.textContent = s.output || "아직 출력이 없습니다.";
  }

  function renderM(s) {
    const ln = stepLines.get(s.phase);
    highlight(mobileLines, ln);
    board(els.mobileBoard, s);
    route(els.mobileRouteView, s);
    queueView(els.mobileQueueView, s);
    els.mobileCoord.textContent = s.level == null ? "탐색 완료" : `level ${s.level}`;
    els.mobileCodeStatus.textContent = ln ? `LINE ${ln}` : names[s.phase];
    els.mobilePhase.textContent = names[s.phase];
    els.mobileExplanation.textContent = s.message;
    els.mobileStateMeta.textContent = `#${s.tc} · ${s.data.W}×${s.data.H}`;
    els.mobileLevel.textContent = s.level ?? "—";
    els.mobileColumn.textContent = s.column == null ? "—" : s.column;
    els.mobileCount.textContent = s.cBlock ?? "—";
    els.mobileAns.textContent = Number.isFinite(s.ans) ? s.ans : "∞";
    els.mobileImpactView.textContent = impactText(s);
    els.mobileOutputView.textContent = s.output || "아직 출력이 없습니다.";
  }

  function sync() {
    const empty = !state.steps.length;
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = empty || state.seeking || state.stepIndex === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = empty || state.seeking || atEnd();
    [els.playBtn, els.replayBtn, els.resetBtn, els.skipBtn, els.timeline, els.mobileTimeline, els.mobilePlayBtn].forEach((el) => { el.disabled = empty || state.seeking; });
  }

  function atEnd() { return state.complete && state.stepIndex === state.steps.length - 1; }

  function ensureSteps(index) {
    while (!state.complete && state.steps.length <= index) {
      const next = state.iterator.next();
      if (next.done) state.complete = true;
      else state.steps.push(next.value);
    }
  }

  function render({ follow = true } = {}) {
    const s = state.steps[state.stepIndex];
    if (!s) return;
    renderD(s);
    renderM(s);
    els.timeline.max = els.mobileTimeline.max = state.complete ? state.steps.length - 1 : state.steps.length + 499;
    els.timeline.value = els.mobileTimeline.value = state.stepIndex;
    els.stepLabel.textContent = els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}${state.complete ? "" : "+"}`;
    sync();
    if (follow) {
      const ln = stepLines.get(s.phase);
      if (ln) {
        Core.centerInsideViewport(els.codeViewport, desktopLines.get(ln), { horizontal: false });
        Core.centerInsideViewport(els.mobileCodeViewport, mobileLines.get(ln), { horizontal: false });
      }
    }
  }

  function stop() {
    if (state.timer !== null) clearTimeout(state.timer);
    state.timer = null;
    Core.updatePlaybackControls(els.playBtn, false);
  }
  function go(i, options = {}) {
    if (!state.steps.length) return;
    if (state.seeking) return;
    ensureSteps(i + 1);
    state.stepIndex = Core.clamp(i, 0, state.steps.length - 1);
    render(options);
  }
  function move(delta) { stop(); go(state.stepIndex + delta); }
  function schedule() {
    state.timer = setTimeout(() => {
      if (atEnd()) { stop(); return; }
      go(state.stepIndex + 1);
      if (atEnd()) stop(); else schedule();
    }, PROBLEM.autoplayMs / state.speed);
  }
  function start() {
    if (!state.steps.length) return;
    stop();
    if (state.seeking) return;
    if (atEnd()) go(0);
    Core.updatePlaybackControls(els.playBtn, true);
    schedule();
  }
  function reset() { stop(); go(0); }

  async function skipToEnd() {
    stop();
    if (state.seeking) return;
    state.seeking = true;
    const generation = state.generation;
    sync();
    // Yield between batches so changing the input can cancel a long seek.
    while (!state.complete && generation === state.generation) {
      ensureSteps(state.steps.length + 499);
      els.stepLabel.textContent = els.mobileTimelineStatus.textContent = `끝으로 이동 중 · ${state.steps.length}단계`;
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    if (generation !== state.generation) return;
    state.seeking = false;
    go(state.steps.length - 1);
  }

  function sampleButtons() {
    els.sampleButtons.replaceChildren();
    PROBLEM.samples.forEach((sample) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn";
      button.textContent = sample.label;
      button.dataset.sample = sample.id;
      button.classList.toggle("selected", state.selectedSample === sample.id);
      els.sampleButtons.append(button);
    });
  }

  function apply(text, id = null) {
    stop();
    try {
      const cases = parseInput(text);
      state.generation++;
      state.seeking = false;
      state.steps = [];
      state.iterator = buildSteps(cases);
      state.complete = false;
      ensureSteps(499);
      state.stepIndex = 0;
      state.selectedSample = id;
      els.inputError.textContent = "";
      els.timeline.max = els.mobileTimeline.max = Math.max(0, state.steps.length - 1);
      sampleButtons();
      render();
    } catch (error) {
      state.selectedSample = null;
      els.inputError.textContent = error.message;
      sampleButtons();
    }
  }

  const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps, { wrap: false, editor: true });
  els.codeView.innerHTML = els.mobileCodeView.innerHTML = markup;
  desktopLines = Core.createLineMap(els.codeView);
  mobileLines = Core.createLineMap(els.mobileCodeView);
  stepLines = Core.createStepLineMap(els.codeView);

  els.prevBtn.onclick = () => move(-1);
  els.nextBtn.onclick = () => move(1);
  els.mobilePrevBtn.onclick = () => move(-1);
  els.mobileNextBtn.onclick = () => move(1);
  els.mobilePlayBtn.onclick = () => els.playBtn.click();
  els.playBtn.onclick = () => state.timer === null ? start() : stop();
  els.resetBtn.onclick = reset;
  els.replayBtn.onclick = () => { reset(); start(); };
  els.skipBtn.onclick = skipToEnd;
  els.speedRange.oninput = () => {
    state.speed = Number(els.speedRange.value);
    els.speedLabel.textContent = `${Core.formatDecimal(state.speed)}×`;
    if (state.timer !== null) { clearTimeout(state.timer); schedule(); }
  };
  [els.timeline, els.mobileTimeline].forEach((input) => {
    input.oninput = (event) => { stop(); go(Number(event.target.value)); };
  });
  els.applyBtn.onclick = () => apply(els.inputArea.value);
  els.inputArea.oninput = () => { state.selectedSample = null; sampleButtons(); };
  els.sampleButtons.onclick = (event) => {
    const button = event.target.closest("button[data-sample]");
    if (!button) return;
    const sample = PROBLEM.samples.find((item) => item.id === button.dataset.sample);
    if (!sample) return;
    els.inputArea.value = sample.value;
    apply(sample.value, sample.id);
  };

  const defaultSample = PROBLEM.samples.find((sample) => sample.id === PROBLEM.defaultSampleId);
  sampleButtons();
  els.inputArea.value = defaultSample.value;
  apply(defaultSample.value, defaultSample.id);
})();

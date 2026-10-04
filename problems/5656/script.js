(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    number: "5656",
    title: "벽돌 깨기",
    autoplayMs: 500,
    defaultSampleId: "all",
    maxFrames: 5200,
    samples: [{"id":"s1","label":"샘플 1","value":"1\n3 10 10\n0 0 0 0 0 0 0 0 0 0\n1 0 1 0 1 0 0 0 0 0\n1 0 3 0 1 1 0 0 0 1\n1 1 1 0 1 2 0 0 0 9\n1 1 4 0 1 1 0 0 1 1\n1 1 4 1 1 1 2 1 1 1\n1 1 5 1 1 1 1 2 1 1\n1 1 6 1 1 1 1 1 2 1\n1 1 1 1 1 1 1 1 1 5\n1 1 7 1 1 1 1 1 1 1"},{"id":"s2","label":"샘플 2","value":"1\n2 9 10\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0 0\n1 1 0 0 1 0 0 0 0\n1 1 0 1 1 1 0 1 0\n1 1 0 1 1 1 0 1 0\n1 1 1 1 1 1 1 1 0\n1 1 3 1 6 1 1 1 1\n1 1 1 1 1 1 1 1 1"},{"id":"s3","label":"샘플 3","value":"1\n3 6 7\n1 1 0 0 0 0\n1 1 0 0 1 0\n1 1 0 0 4 0\n4 1 0 0 1 0\n1 5 1 0 1 6\n1 2 8 1 1 6\n1 1 1 9 2 1"},{"id":"s4","label":"샘플 4","value":"1\n4 4 15\n0 0 0 0\n0 0 0 0\n0 0 0 0\n1 0 0 0\n1 0 0 0\n1 0 0 0\n1 0 0 0\n1 0 5 0\n1 1 1 0\n1 1 1 9\n1 1 1 1\n1 6 1 2\n1 1 1 5\n1 1 1 1\n2 1 1 2"},{"id":"s5","label":"샘플 5","value":"1\n4 12 15\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9"},{"id":"all","label":"전체 샘플","value":"5\n3 10 10\n0 0 0 0 0 0 0 0 0 0\n1 0 1 0 1 0 0 0 0 0\n1 0 3 0 1 1 0 0 0 1\n1 1 1 0 1 2 0 0 0 9\n1 1 4 0 1 1 0 0 1 1\n1 1 4 1 1 1 2 1 1 1\n1 1 5 1 1 1 1 2 1 1\n1 1 6 1 1 1 1 1 2 1\n1 1 1 1 1 1 1 1 1 5\n1 1 7 1 1 1 1 1 1 1\n2 9 10\n0 0 0 0 0 0 0 0 0\n0 0 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0 0\n1 1 0 0 1 0 0 0 0\n1 1 0 1 1 1 0 1 0\n1 1 0 1 1 1 0 1 0\n1 1 1 1 1 1 1 1 0\n1 1 3 1 6 1 1 1 1\n1 1 1 1 1 1 1 1 1\n3 6 7\n1 1 0 0 0 0\n1 1 0 0 1 0\n1 1 0 0 4 0\n4 1 0 0 1 0\n1 5 1 0 1 6\n1 2 8 1 1 6\n1 1 1 9 2 1\n4 4 15\n0 0 0 0 \n0 0 0 0 \n0 0 0 0 \n1 0 0 0 \n1 0 0 0 \n1 0 0 0 \n1 0 0 0 \n1 0 5 0 \n1 1 1 0 \n1 1 1 9 \n1 1 1 1 \n1 6 1 2 \n1 1 1 5 \n1 1 1 1 \n2 1 1 2 \n4 12 15\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9\n9 9 9 9 9 9 9 9 9 9 9 9"}],
    sourceSteps: [
      { text: "if ans == 0:", types: "checkZero prune" },
      { text: "for i in range(H):", types: "count" },
      { text: "if c_block == 0:", types: "empty" },
      { text: "if level == N:", types: "levelEnd" },
      { text: "ans = min(ans, c_block)", types: "updateAns" },
      { text: "for c in range(W):", types: "column" },
      { text: "if board[r][c] != 0:", types: "hit" },
      { text: "c_board = [row[:] for row in board]", types: "copy" },
      { text: "queue.append((r, c, board[r][c]))", types: "enqueue" },
      { text: "c_board[r][c] = 0", types: "removeHit" },
      { text: "while queue:", types: "queueLoop" },
      { text: "cr, cc, block = queue.pop(0)", types: "pop" },
      { text: "for dr, dc in direction:", types: "spread" },
      { text: "if c_board[nr][nc] != 0:", types: "chain" },
      { text: "for k in range(W):", types: "gravity" },
      { text: "c_board[l][k] = remain_blocks.pop(0)", types: "gravityDone" },
      { text: "dfs(level + 1, c_board)", types: "recurse" },
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

  const state = { steps: [], stepIndex: 0, timer: null, speed: 1, selectedSample: PROBLEM.defaultSampleId };
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

  function buildSteps(cases) {
    const steps = [];
    let output = "";
    const budget = Math.max(650, Math.floor(PROBLEM.maxFrames / cases.length));

    cases.forEach((data, ci) => {
      let ans = Infinity;
      let frames = 0;
      let omitted = false;
      let calls = 0;
      let bestBoard = cloneBoard(data.board);
      let bestPath = [];
      const path = [];

      const push = (phase, level, board, message, extra = {}) => {
        if (frames >= budget) {
          omitted = true;
          return;
        }
        frames += 1;
        steps.push({
          tc: ci + 1,
          data,
          phase,
          level,
          board: cloneBoard(board),
          ans,
          path: [...path],
          message,
          output,
          ...extra,
          queue: (extra.queue || []).map((v) => [...v]),
          removed: (extra.removed || []).map((v) => [...v]),
          blast: (extra.blast || []).map((v) => [...v]),
        });
      };

      push("start", 0, data.board, "dfs(0, blocks)로 탐색을 시작합니다. 아직 구슬은 사용하지 않았습니다.", {
        cBlock: countBlocks(data.board),
      });

      function dfs(level, board) {
        calls += 1;
        push("enter", level, board, `DFS level=${level}에 들어왔습니다. 현재 보드에서 남은 벽돌을 셉니다.`);
        push("checkZero", level, board, `현재 ans가 ${Number.isFinite(ans) ? ans : "∞"}입니다. ans가 0이면 더 줄일 수 없으므로 탐색을 끝낼 수 있습니다.`);

        if (ans === 0) {
          push("prune", level, board, "이미 남은 벽돌 0개를 찾았으므로 이 이후 경로는 탐색하지 않습니다.", { cBlock: 0 });
          return;
        }

        const cBlock = countBlocks(board);
        push("count", level, board, `현재 남아 있는 벽돌은 ${cBlock}개입니다.`, { cBlock });

        if (cBlock === 0) {
          ans = 0;
          bestBoard = cloneBoard(board);
          bestPath = [...path];
          push("empty", level, board, "벽돌이 하나도 남지 않았습니다. 가능한 최솟값 0을 찾았으므로 ans=0으로 갱신합니다.", {
            cBlock,
            improved: true,
          });
          return;
        }

        if (level === data.N) {
          const old = ans;
          ans = Math.min(ans, cBlock);
          if (ans < old) {
            bestBoard = cloneBoard(board);
            bestPath = [...path];
          }
          push("levelEnd", level, board, `구슬 ${data.N}개를 모두 사용했습니다. 남은 벽돌 ${cBlock}개로 ans를 비교합니다.`, { cBlock });
          push("updateAns", level, board, `ans: ${Number.isFinite(old) ? old : "∞"} → ${ans}`, {
            cBlock,
            improved: ans < old,
          });
          return;
        }

        for (let c = 0; c < data.W; c++) {
          push("column", level, board, `${c + 1}번 열에 구슬을 떨어뜨려 맨 위 벽돌을 찾습니다.`, { column: c, cBlock });

          let hitR = -1;
          for (let r = 0; r < data.H; r++) {
            if (board[r][c] !== 0) {
              hitR = r;
              break;
            }
          }

          if (hitR < 0) {
            push("emptyColumn", level, board, `${c + 1}번 열은 비어 있어 이 열에는 구슬을 사용하지 않습니다.`, { column: c, cBlock });
            continue;
          }

          push("hit", level, board, `${c + 1}번 열의 맨 위 벽돌 (${hitR + 1}, ${c + 1}), 값 ${board[hitR][c]}에 구슬이 명중합니다.`, {
            column: c,
            hit: [hitR, c],
            cBlock,
          });

          const cBoard = cloneBoard(board);
          push("copy", level, cBoard, "원본 보드를 보존하기 위해 c_board로 복사합니다.", {
            column: c,
            hit: [hitR, c],
            cBlock,
          });

          const queue = [[hitR, c, board[hitR][c]]];
          const removed = [[hitR, c]];
          push("enqueue", level, cBoard, `명중 벽돌을 queue에 넣습니다. 폭발력은 ${board[hitR][c]}입니다.`, {
            column: c,
            hit: [hitR, c],
            queue,
            removed,
            cBlock,
            power: board[hitR][c],
          });

          cBoard[hitR][c] = 0;
          push("removeHit", level, cBoard, "명중한 벽돌을 먼저 제거하고 연쇄 폭발을 시작합니다.", {
            column: c,
            hit: [hitR, c],
            queue,
            removed,
            cBlock,
            power: board[hitR][c],
          });

          while (queue.length) {
            push("queueLoop", level, cBoard, `queue에 ${queue.length}개의 폭발 대상이 남아 있습니다.`, {
              column: c,
              queue,
              removed,
              cBlock,
            });

            const [cr, cc, block] = queue.shift();
            const blast = [];
            push("pop", level, cBoard, `(${cr + 1}, ${cc + 1})의 값 ${block} 벽돌을 꺼내 상하좌우 ${Math.max(0, block - 1)}칸을 확인합니다.`, {
              column: c,
              queue,
              removed,
              source: [cr, cc],
              power: block,
              blast,
              cBlock,
            });

            for (const [dr, dc] of DIR) {
              for (let num = 1; num < block; num++) {
                const nr = cr + dr * num;
                const nc = cc + dc * num;
                if (!(0 <= nr && nr < data.H && 0 <= nc && nc < data.W)) break;
                blast.push([nr, nc]);
                if (cBoard[nr][nc] !== 0) {
                  const value = cBoard[nr][nc];
                  queue.push([nr, nc, value]);
                  cBoard[nr][nc] = 0;
                  removed.push([nr, nc]);
                  push("chain", level, cBoard, `폭발 범위의 (${nr + 1}, ${nc + 1}) 벽돌 ${value}도 제거하고 queue에 추가합니다.`, {
                    column: c,
                    queue,
                    removed,
                    source: [cr, cc],
                    power: block,
                    blast,
                    cBlock,
                  });
                }
              }
            }
          }

          push("gravity", level, cBoard, `연쇄 폭발이 끝났습니다. 총 ${removed.length}개를 제거했고, 이제 빈 공간 위의 벽돌을 아래로 떨어뜨립니다.`, {
            column: c,
            removed,
            cBlock,
          });

          for (let k = 0; k < data.W; k++) {
            const remain = [];
            for (let l = data.H - 1; l >= 0; l--) {
              if (cBoard[l][k] !== 0) {
                remain.push(cBoard[l][k]);
                cBoard[l][k] = 0;
              }
            }
            for (let l = data.H - 1; l >= 0; l--) {
              if (!remain.length) break;
              cBoard[l][k] = remain.shift();
            }
          }

          push("gravityDone", level, cBoard, "중력이 적용되어 각 열의 벽돌이 아래쪽부터 다시 쌓였습니다.", {
            column: c,
            settled: true,
            cBlock: countBlocks(cBoard),
          });

          path.push(c);
          push("recurse", level, cBoard, `${c + 1}번 열 선택을 경로에 기록하고 다음 구슬을 위해 dfs(${level + 1}, c_board)를 호출합니다.`, {
            column: c,
            cBlock: countBlocks(cBoard),
          });
          dfs(level + 1, cBoard);
          path.pop();

          push("backtrack", level, board, `${c + 1}번 열에서 시작한 탐색을 마치고 원래 보드로 돌아와 다음 열을 확인합니다.`, {
            column: c,
            cBlock,
          });

          if (ans === 0) return;
        }
      }

      dfs(0, cloneBoard(data.board));

      if (omitted) {
        steps.push({
          tc: ci + 1,
          data,
          phase: "summary",
          level: null,
          board: cloneBoard(bestBoard),
          ans,
          path: [...bestPath],
          message: `화면 단계는 ${budget}개까지만 표시했습니다. 계산은 끝까지 수행했으며 총 ${calls}회 DFS 호출 후 최소 ${ans}개의 벽돌이 남는 경로를 찾았습니다.`,
          output,
          queue: [],
          removed: [],
          blast: [],
          cBlock: ans,
        });
      }

      output += `#${ci + 1} ${ans}\n`;
      steps.push({
        tc: ci + 1,
        data,
        phase: "output",
        level: null,
        board: cloneBoard(bestBoard),
        ans,
        path: [...bestPath],
        message: `#${ci + 1} ${ans}를 출력합니다. 화면에는 최적 경로에서 최종적으로 남은 보드를 보여줍니다.`,
        output,
        queue: [],
        removed: [],
        blast: [],
        cBlock: ans,
        best: true,
      });
    });

    return steps;
  }

  const names = {
    start: "탐색 시작", enter: "DFS 호출", checkZero: "0 조기 종료 확인", prune: "탐색 종료",
    count: "벽돌 개수 계산", empty: "벽돌 0개", levelEnd: "구슬 사용 완료", updateAns: "ans 갱신",
    column: "열 선택", emptyColumn: "빈 열", hit: "구슬 명중", copy: "보드 복사", enqueue: "queue 추가",
    removeHit: "첫 벽돌 제거", queueLoop: "연쇄 폭발", pop: "폭발 벽돌 꺼내기", chain: "연쇄 제거",
    gravity: "중력 준비", gravityDone: "중력 적용", recurse: "다음 구슬", backtrack: "백트래킹",
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
    const heads = Array.from({ length: W }, (_, c) => `<div class="col-head ${c === s.column ? "active" : ""}">${c + 1}</div>`).join("");
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
        cells += `<div class="${cls}" title="r${r + 1}, c${c + 1}">${value === 0 ? "" : value}</div>`;
      }
    }
    container.innerHTML = `<div class="brick-scene"><div class="brick-col-heads" style="grid-template-columns:repeat(${W},34px)">${heads}</div><div class="brick-board" style="grid-template-columns:repeat(${W},34px)">${cells}</div><p class="brick-legend">금색: 구슬 명중 · 주황: 현재 폭발 범위 · 보라 테두리: queue 대기 · ×: 이번 구슬에서 제거된 칸 · 파랑: 중력 적용 후 벽돌</p></div>`;
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
    if (s.cBlock != null) parts.push(`현재 남은 벽돌: ${s.cBlock}개`);
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
    els.prevBtn.disabled = els.mobilePrevBtn.disabled = empty || state.stepIndex === 0;
    els.nextBtn.disabled = els.mobileNextBtn.disabled = empty || state.stepIndex === state.steps.length - 1;
    [els.playBtn, els.replayBtn, els.resetBtn, els.skipBtn, els.timeline, els.mobileTimeline, els.mobilePlayBtn].forEach((el) => { el.disabled = empty; });
  }

  function render({ follow = true } = {}) {
    const s = state.steps[state.stepIndex];
    if (!s) return;
    renderD(s);
    renderM(s);
    els.timeline.value = els.mobileTimeline.value = state.stepIndex;
    els.stepLabel.textContent = els.mobileTimelineStatus.textContent = `${state.stepIndex + 1} / ${state.steps.length}`;
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
    state.stepIndex = Core.clamp(i, 0, state.steps.length - 1);
    render(options);
  }
  function move(delta) { stop(); go(state.stepIndex + delta); }
  function schedule() {
    state.timer = setTimeout(() => {
      if (state.stepIndex >= state.steps.length - 1) { stop(); return; }
      go(state.stepIndex + 1);
      if (state.stepIndex >= state.steps.length - 1) stop(); else schedule();
    }, PROBLEM.autoplayMs / state.speed);
  }
  function start() {
    if (!state.steps.length) return;
    stop();
    if (state.stepIndex >= state.steps.length - 1) go(0);
    Core.updatePlaybackControls(els.playBtn, true);
    schedule();
  }
  function reset() { stop(); go(0); }

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
      state.steps = buildSteps(parseInput(text));
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
  els.skipBtn.onclick = () => { stop(); go(state.steps.length - 1); };
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

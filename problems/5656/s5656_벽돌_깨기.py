# swea 5656 벽돌 깨기
import sys
sys.stdin = open("input_s5656.txt", "r")

direction = [(-1,0), (1,0), (0,-1), (0,1)]
def dfs(level, board):
    global ans
    c_block = 0
    if ans == 0:
        return
    for i in range(H):
        for j in range(W):
            if board[i][j] != 0:
                c_block += 1
    if c_block == 0:
        ans = 0
        return
    if level == N:
        ans = min(ans, c_block)
        return
    for c in range(W):
        for r in range(H):
            if board[r][c] != 0:
                c_board = [row[:] for row in board]
                queue = []
                queue.append((r, c, board[r][c]))
                c_board[r][c] = 0
                while queue:
                    cr, cc, block = queue.pop(0)
                    for dr, dc in direction:
                        for num in range(1, block):
                            nr, nc = cr + dr * num, cc + dc * num
                            if not (0 <= nr < H and 0 <= nc < W):
                                break
                            if c_board[nr][nc] != 0:
                                queue.append((nr, nc, c_board[nr][nc]))
                                c_board[nr][nc] = 0
                for k in range(W):
                    remain_blocks = []
                    for l in range(H-1, -1, -1):
                        if c_board[l][k] != 0:
                            remain_blocks.append(c_board[l][k])
                            c_board[l][k] = 0
                    for l in range(H-1, -1, -1):
                        if not remain_blocks:
                            break
                        c_board[l][k] = remain_blocks.pop(0)
                dfs(level + 1, c_board)
                break
T = int(input())
for tc in range(1, T + 1):
    N, W, H = map(int, input().split())
    blocks = [list(map(int, input().split())) for _ in range(H)]
    ans = float('inf')
    dfs(0, blocks)
    print('#{} {}'.format(tc, ans))




'''
구술을 쏘아 벽돌을 깨트리는 게임을 하려고 한다.
구슬은 N번만 쏠 수 있고, 벽돌들의 정보는 아래와 같이 W x H 배열로 주어진다.

( 0 은 빈 공간을 의미하며, 그 외의 숫자는 벽돌을 의미한다. )
 
게임의 규칙은 다음과 같다.

① 구슬은 좌, 우로만 움직일 수 있어서 항상 맨 위에 있는 벽돌만 깨트릴 수 있다.

② 벽돌은 숫자 1 ~ 9 로 표현되며,
구술이 명중한 벽돌은 상하좌우로 ( 벽돌에 적힌 숫자 - 1 ) 칸 만큼 같이 제거된다.
아래는 벽돌에 적힌 숫자와, 구술이 명중했을 시 제거되는 범위의 예이다.

③ 제거되는 범위 내에 있는 벽돌은 동시에 제거된다.
예를 들어 아래와 같이 4 번 벽돌에 구술이 명중할 경우,
9번 벽돌은 4 번 벽돌에 반응하여,
동시에 제거된다.

④ 빈 공간이 있을 경우 벽돌은 밑으로 떨어지게 된다.

N 개의 벽돌을 떨어트려 최대한 많은 벽돌을 제거하려고 한다.
N, W, H, 그리고 벽돌들의 정보가 주어질 때,
▶ 남은 벽돌의 개수를 구하라!

※ sample input 1
N = 3, W = 10, H = 10 이고 벽돌들의 정보가 아래와 같을 때,
최대한 많은 벽돌을 깨트리는 방법은 아래와 같으며, 정답은 12 가 된다.
그림의 빨간 색 원은 구술이 명중한 위치이며, 주황색 칸은 폭발의 범위를 의미한다.

i) 첫 번째 구술
ii) 두 번째 구술
iii) 세 번째 구술

[제약 사항]
1. 1 ≤ N ≤ 4
2. 2 ≤ W ≤ 12
3. 2 ≤ H ≤ 15

[입력]
가장 첫 줄에는 총 테스트 케이스의 개수 T 가 주어지고,
그 다음 줄부터 T 개의 테스트 케이스가 주어진다.
각 테스트 케이스의 첫 번째 줄에는 N, W, H 가 순서대로 공백을 사이에 두고 주어지고,
다음 H 줄에 걸쳐 벽돌들의 정보가 1 줄에 W 개씩 주어진다.

[출력]
출력은 #t 를 찍고 한 칸 띄운 다음 정답을 출력한다.
(t 는 테스트 케이스의 번호를 의미하며 1 부터 시작한다)
'''

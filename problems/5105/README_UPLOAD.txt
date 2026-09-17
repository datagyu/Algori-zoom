# 알고리줌 SWEA 5105 - 미로의 거리

업로드 위치: `problems/5105/`

파일 3개를 위 폴더에 업로드하세요.
- index.html
- styles.css
- script.js

기존 알고리줌 공통 자산(`assets/theme.css`, `visualizer.css`, `visualizer-core.js`, `ui.css`, `ui.js`)을 그대로 사용합니다.

시각화 핵심:
- 2(출발), 3(도착), 벽, 방문 칸을 미로에서 구분
- 현재 칸과 다음 델타 후보 칸 강조
- BFS Queue의 FRONT와 `[r, c, distance]`를 실시간 표시
- 큐에 넣을 때 `distance + 1`, 방문 처리 과정을 코드 라인과 동기화
- 자동 재생 / 이전 / 다음 / 다시 재생 / 끝으로 / 속도 / 타임라인
- 모바일 뷰 포함

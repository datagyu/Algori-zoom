# 새 알고리즘 시각화 추가 가이드

알고리줌은 문제마다 알고리즘 규칙이 다르므로 **문제 로직까지 억지로 하나의 공통 엔진에 넣지 않습니다.**
대신 반복되는 UI 유틸리티와 홈 등록 규칙만 공통화합니다.

## 1. 폴더 추가

```text
problems/<문제-id>/
├─ index.html
├─ styles.css
└─ script.js
```

현재 `problems/5356/`을 참고하되, 문제 고유 값은 `script.js` 상단의 설정 객체에 모아둡니다.

## 2. 하드코딩하지 말아야 할 값

다음 값은 HTML/CSS 여러 곳에 직접 반복하지 않습니다.

- 전체 STEP 수
- board 행/열 수
- 샘플 개수
- 현재 실행 코드 줄 번호
- 재생 속도 기준값

5356에서는 다음 방식으로 처리합니다.

- STEP 수: `buildSteps()` 결과로 재생바에 자동 반영
- 열 수: JS가 `--board-cols` CSS 변수에 전달
- 샘플: `PROBLEM.samples`에서 버튼 자동 생성
- 코드 줄: `<code-line data-step-types="...">`에서 자동 연결

## 3. 코드 줄 연결

현재 실행되는 코드 줄에 `data-step-types`를 붙입니다.

```html
<span class="code-line" data-source-line="8" data-step-types="check skip">...</span>
```

줄 번호가 바뀌어도 JS의 별도 숫자 매핑을 수정할 필요가 없습니다.

## 4. 큰 입력/board

Ladder, DP, 그래프처럼 데이터가 커져도 전체 페이지를 늘리지 않습니다.

- 데이터 전체는 DOM/상태에 유지
- 화면은 고정 크기 viewport 사용
- 현재 위치로 자동 정렬
- 사용자가 직접 스크롤 가능
- 다음 STEP 조작 시 현재 위치로 다시 정렬

큰 board에서는 매 STEP마다 모든 셀을 다시 순회하지 말고, **바뀐 셀만 class를 갱신**하는 방식을 우선합니다.

## 5. 홈 등록

`assets/catalog.js`에 카드 데이터를 추가합니다.

```js
{
  id: "swea-0000",
  title: "문제명",
  platform: "SWEA",
  problemNo: "0000",
  level: "D2",
  href: "problems/0000/",
  status: "ready",
  searchTerms: ["스택", "문자열"],
}
```

`searchTerms`는 카드에는 보이지 않고 검색에만 사용됩니다.

## 6. 공통 파일

모든 페이지에서 다음 파일을 사용합니다.

```html
<link rel="stylesheet" href="../../assets/theme.css" />
<script src="../../assets/visualizer-core.js"></script>
```

`theme.css`는 알고리줌 공통 디자인/주의 문구를 담당하고,
`visualizer-core.js`는 viewport 정렬, clamp, 코드 줄 Map 같은 작은 공통 기능만 담당합니다.

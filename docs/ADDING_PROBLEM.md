# 새 알고리즘 시각화 추가 가이드

알고리줌은 문제마다 알고리즘 규칙이 다르므로 **문제 로직까지 하나의 공통 엔진에 억지로 넣지 않습니다.**
대신 화면 구조, 모바일 UX, 코드 매핑, 배포/캐시 정책과 반복 유틸리티를 공통화합니다.

## 1. 기본 폴더 구조

```text
problems/<문제-id>/
├─ index.html
├─ styles.css
└─ script.js
```

새 문제는 기존 시각화의 **공통 구조를 먼저 복제한 뒤 문제별 시각화만 교체**합니다.
문제 고유 상수와 샘플은 가능하면 `script.js` 상단에 모읍니다.

## 2. 공통 화면 구조

### 데스크톱

기본 순서는 다음을 유지합니다.

```text
헤더
→ 실행 컨트롤
→ 재생바
→ PYTHON / 문제 시각화 / STATE
→ INPUT
```

가능한 경우 핵심 workspace는 3열 구조를 우선하고, 화면 폭이 줄어들면 2열 또는 세로 배치로 자연스럽게 전환합니다.

### 모바일

모바일은 다음 순서를 기본 템플릿으로 사용합니다.

```text
모바일 헤더
→ PYTHON
→ 핵심 시각화
→ STATE / RESULT
→ 하단 고정 이전 · 재생바 · 다음
```

공통 모바일 코드 viewport와 하단 플레이어는 `assets/theme.css`가 담당합니다.

- 코드 viewport 높이: 250px
- 내부 스크롤 사용
- 현재 코드 줄 자동 추적
- 재생바는 화면 하단 고정
- 하단 여백은 공통 CSS 변수 사용
- 본문이 고정 플레이어에 가리지 않도록 clearance 확보

새 문제에서 `.mobile-code-viewport`, `.mobile-player`, `.mobile-scrubber` 클래스를 그대로 재사용합니다.

## 3. 하드코딩하지 말아야 할 값

다음 값은 HTML/CSS/JS 여러 곳에 반복하지 않습니다.

- 전체 STEP 수
- board 행/열 수
- 샘플 개수
- 현재 실행 코드 줄 번호
- 재생 속도 기준값
- 모바일 플레이어의 하단 위치

예시 원칙:

- STEP 수: `buildSteps()` 결과로 재생바에 자동 반영
- 열 수: JS → CSS 변수 전달
- 샘플: 설정 배열에서 버튼 자동 생성
- 코드 줄: `data-step-types` 기반 자동 연결
- 모바일 플레이어 위치: `theme.css` 공통 변수 사용

## 4. 코드 줄 연결

현재 실행되는 코드 줄에는 `data-step-types`를 붙이는 방식을 우선합니다.

```html
<span class="code-line"
      data-source-line="8"
      data-step-types="check skip">...</span>
```

공통 유틸리티의 `createStepLineMap()`을 사용하면 줄 번호가 바뀌어도 별도 숫자 매핑을 고칠 필요가 없습니다.

```js
const stepLineMap = AlgoriZoomCore.createStepLineMap(root);
```

단순 줄 번호 Map이 필요하면 `createLineMap()`을 사용합니다.

## 5. 큰 입력 / board / stack

데이터가 커져도 페이지 자체를 가로 또는 세로로 무한히 늘리지 않습니다.

- 전체 데이터는 DOM/상태에 유지
- 화면은 고정 크기 viewport 사용
- 현재 위치 자동 정렬
- 사용자가 직접 스크롤 가능
- 다음 STEP 조작 시 다시 현재 위치를 추적

자동 정렬은 직접 `offsetLeft`, `offsetTop` 계산을 반복하지 말고 다음 공통 함수를 우선 사용합니다.

```js
AlgoriZoomCore.centerInsideViewport(viewport, target, {
  horizontal: true,
  vertical: true,
});
```

큰 board에서는 매 STEP마다 DOM을 새로 만들지 않고, 기존 셀을 캐시해 class만 갱신하는 방식을 우선합니다.

## 6. 공통 유틸리티

모든 문제 페이지에서 다음 파일을 사용합니다.

```html
<link rel="stylesheet" href="../../assets/theme.css" />
<script src="../../assets/visualizer-core.js"></script>
```

`visualizer-core.js`에서 제공하는 주요 기능:

- `clamp()`
- `escapeHtml()`
- `getByIds()`
- `createLineMap()`
- `createStepLineMap()`
- `centerInsideViewport()`

알고리즘 자체의 규칙은 각 문제 `script.js`에 남깁니다.

## 7. 홈 등록

`assets/catalog.js`에 카드 데이터를 하나 추가합니다.

```js
{
  id: "swea-0000",
  title: "문제명",
  platform: "SWEA",
  problemNo: "0000",
  level: "D2",
  href: "problems/0000/",
  status: "ready",
  searchTerms: ["완전탐색", "2차원 배열"],
}
```

`searchTerms`는 실제 구현 방식과 맞는 개념만 넣습니다.

## 8. 배포와 캐시

GitHub Pages 배포 시 `.github/workflows/pages.yml`에서 CSS/JS 파일에 현재 커밋 SHA 기반 버전값을 자동으로 붙입니다.

따라서 HTML에 `Date.now()` 같은 임시 캐시 무효화 코드를 추가하지 않습니다.

```text
assets/theme.css?v=<commit-sha>
script.js?v=<commit-sha>
```

이 방식으로 새 문제나 UI 수정 후 일반 새로고침만으로 최신 정적 파일을 받도록 유지합니다.

## 9. 새 문제 완료 체크리스트

배포 전에 아래 항목을 확인합니다.

- 데스크톱 컨트롤/재생바 위치가 기존 문제와 같은가
- desktop workspace의 STATE 위치가 통일되어 있는가
- 모바일 코드창이 공통 스타일을 사용하는가
- 모바일 재생바가 하단에 고정되는가
- 페이지 전체에 불필요한 가로 스크롤이 없는가
- 큰 데이터는 내부 viewport에서 스크롤되는가
- STEP 수가 동적으로 계산되는가
- 코드 줄 번호가 불필요하게 JS에 하드코딩되지 않았는가
- 샘플/입력 변경 후 재생 상태가 정상 초기화되는가
- 홈 카드가 `catalog.js`에 등록되어 있는가
- 검색 키워드가 실제 구현 방식과 일치하는가

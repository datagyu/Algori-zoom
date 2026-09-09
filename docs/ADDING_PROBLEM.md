# 새 알고리즘 시각화 추가 가이드

알고리줌은 순수 HTML/CSS/JavaScript로 동작합니다. 프레임워크, 패키지 설치, 빌드 없이 GitHub Pages에 배포할 수 있습니다.

## 파일 역할

| 파일                         | 담당                                                                        |
| ---------------------------- | --------------------------------------------------------------------------- |
| `assets/theme.css`           | 색상 변수, 기본 글꼴/reset, focus-visible, 브랜드                           |
| `assets/visualizer.css`      | panel, 버튼, 헤더, 입력, 코드창, timeline, 모바일 플레이어, 반응형 레이아웃 |
| `assets/visualizer-core.js`  | DOM 조회, Python 코드 표시, 코드 줄 매핑, 숫자/문자열 처리, 내부 스크롤     |
| `problems/<번호>/styles.css` | 문제 고유 board/stack/조건/결과 표현                                        |
| `problems/<번호>/script.js`  | PROBLEM 설정, 입력 검사, buildSteps, render, 재생과 이벤트                  |
| `assets/catalog.js`          | 홈 카드 및 검색 정보                                                        |

**공통 panel/button/mobile/code-viewer CSS를 문제별 파일에 복사하지 않습니다.** 공통 UI 수정은 `visualizer.css` 한 곳에서 합니다. 기존 화면 차이는 `visualizer--classic`, `visualizer--editor`, `visualizer--compact`라는 재사용 가능한 표시 옵션으로 보존합니다. 문제 번호로 공통 파일을 분기하지 않습니다.

## 새 문제 추가: 8단계

1. `problems/<번호>/` 폴더를 만듭니다.
2. 기존 문제의 `index.html`을 복사합니다. 세 공통 자원 경로와 공통 UI 클래스를 유지하고 문제 전용 시각화 영역을 교체합니다.
3. `script.js`의 `PROBLEM` 객체에 문제 정보·샘플·재생 간격을 작성합니다.
4. HTML의 `sourceCode` template에 Python 코드를 한 번 작성합니다.
5. `buildSteps()`에서 실행 순서대로 상태를 생성합니다.
6. 같은 step을 받는 `renderDesktop(step)`과 `renderMobile(step)`을 작성합니다.
7. 문제 고유 시각화만 `styles.css`에 작성합니다.
8. `assets/catalog.js`에 카드를 등록하고 아래 검증 목록을 확인합니다.

## HTML 구성

```html
<title>문제명 | 알고리줌</title>
<link rel="stylesheet" href="../../assets/theme.css" />
<link rel="stylesheet" href="../../assets/visualizer.css" />
<link rel="stylesheet" href="styles.css" />
```

body에 `class="visualizer visualizer--classic"`을 사용합니다. `editor`는 넓은 코드창, `compact`는 chapter navigation이 있는 화면의 기존 간격을 제공합니다. 옵션은 화면 표현에만 영향을 줍니다.

문제 페이지에는 실제 안내 요소를 둡니다. 홈에는 추가하지 않습니다.

```html
<p class="code-disclaimer">
  이 페이지의 코드들은 예시일 뿐이니 참고만 해주세요.
</p>
<template id="sourceCode">for i in range(N): print(i)</template>
```

template는 HTML이므로 Python의 `<`와 `&`는 각각 `&lt;`, `&amp;`로 적습니다. 구문 강조용 span과 줄 번호는 직접 작성하지 않습니다. 공통 표시기가 자동 생성합니다.

페이지 끝에는 순서를 지켜 스크립트를 불러옵니다.

```html
<script src="../../assets/visualizer-core.js"></script>
<script src="script.js"></script>
```

기존 `aria-label`, `role="alert"`, `tabindex`, `alt`, `focus-visible`을 유지합니다. 화살표 버튼과 range input에는 동작을 설명하는 `aria-label`을 붙입니다.

## JS 기본 구조

```javascript
(() => {
  const Core = window.AlgoriZoomCore;
  const PROBLEM = Object.freeze({
    platform: "SWEA",
    number: "0000",
    level: "D2",
    title: "문제명",
    autoplayMs: 550,
    defaultSampleId: "one",
    samples: [{ id: "one", label: "샘플 1", value: "입력 문자열" }],
    sourceSteps: [
      { text: "for i in range(N):", types: "loop" },
      { text: "print(i)", types: "done" },
    ],
  });

  const els = Core.getByIds([
    "sourceCode",
    "desktopCodeViewport",
    "mobileCodeViewport",
    "prevBtn",
    "nextBtn",
    "timelineRange",
  ]);
  // state → cache → buildSteps → render → playback → events → init
})();
```

샘플은 모두 `PROBLEM.samples`의 `id`, `label`, `value`로 관리합니다. 여러 줄 입력도 하나의 문자열로 저장하고 문제의 입력 처리 함수에서 줄을 나눕니다. 선택 표시와 직접 입력 시 선택 해제도 구현합니다.

DOM 조회는 `Core.getByIds()`를 쓰며, 변수명도 HTML id와 동일하게 사용합니다. 문제별 변수와 함수는 IIFE 안에 두고 window에 노출하지 않습니다.

## Python 줄 연결

```javascript
const markup = Core.createCodeMarkup(els.sourceCode, PROBLEM.sourceSteps);
els.desktopCodeViewport.innerHTML = markup;
els.mobileCodeViewport.innerHTML = markup;
const desktopLines = Core.createLineMap(els.desktopCodeViewport);
const mobileLines = Core.createLineMap(els.mobileCodeViewport);
const stepLines = Core.createStepLineMap(els.desktopCodeViewport);
```

`sourceSteps`는 줄 번호 대신 **공백을 제외한 해당 코드 줄 전체**를 사용합니다. 위에 줄을 추가해도 연결은 유지됩니다. 코드 줄 내용이 바뀌면 대응하는 `text`도 수정합니다. 같은 코드가 반복되면 `occurrence: 2`처럼 몇 번째인지 지정합니다. 한 줄에 연결되는 단계가 여러 개면 `types: 'check skip'`처럼 공백으로 구분합니다. 연결할 코드가 없으면 명시적으로 오류가 발생합니다.

기존 `pre` 요소 안에 표시할 때는 `{ wrap: false }` 옵션을 사용합니다. 기존 editor 팔레트를 유지할 때는 `{ editor: true }`도 지정할 수 있습니다. 이는 알고리즘 로직과 무관한 표시 옵션입니다.

Python 문법 전체를 분석하는 라이브러리가 아니라 간단한 토큰 강조입니다. 코드 실행은 하지 않습니다. 문제 설명용 의사코드도 원문 그대로 표시합니다.

## 상태와 재생

- `buildSteps()`는 알고리즘 실행 순서·누적값·위치·강조 상태를 한 번 생성합니다.
- `render()`가 현재 step을 선택하고 desktop/mobile 양쪽에 전달합니다.
- `goTo(index)`는 `Core.clamp()`로 범위를 제한합니다.
- `move(delta)`, `startPlayback()`, `stopPlayback()`, `reset()`, `skipToEnd()`로 역할을 나눕니다.
- 재생은 recursive `setTimeout`을 사용합니다. 시작 전에 기존 timer를 해제하고, 정지할 때 timer를 null로 만듭니다.
- 재생 중 속도 변경을 지원하면 예약된 timer를 해제한 후 새 속도로 다시 예약합니다.
- 입력 변경·샘플 선택·끝 이동·timeline 조작 시 기존 재생 중단 여부를 명확히 합니다.
- timeline의 max는 실제 steps 길이에서 계산합니다. 시작 전 READY를 별도 표시하는 문제는 UI 번호와 배열 index 변환을 명시합니다.

기존 UX 차이: 1218/2001은 첫 실행 단계를 바로 표시하고 5356은 READY부터 시작합니다. 2001의 다시보기는 처음으로 이동하고, 1218/5356의 다시보기는 처음부터 자동 실행합니다. 기존 문제 수정 시 이 동작을 바꾸지 않습니다.

## 큰 board와 모바일

board 행·열 제한, 문자 종류, 파리 수 등은 문제 설정에 둡니다. board 열 수는 CSS 변수 또는 gridTemplateColumns로 전달합니다. 공통 코드에서 문제 번호를 검사하지 않습니다.

코드·board·stack은 내부 viewport에서 스크롤되도록 합니다. 현재 위치 추적은 `Core.centerInsideViewport(viewport, target, options)`를 사용합니다. `clamp`, `escapeHtml`, `formatDecimal`, `getByIds`, `createLineMap`, `createStepLineMap`을 문제 파일에 다시 구현하지 않습니다.

공통 모바일 기준은 `760px`입니다. 코드창 높이와 하단 플레이어는 `visualizer.css`가 관리합니다. `--mobile-player-bottom`, `--mobile-player-clearance`는 공통 변수입니다. 기본 하단 구조는 이전 버튼 / timeline / 다음 버튼입니다. 전체 페이지 가로 스크롤을 만들지 않고, 마지막 콘텐츠가 플레이어 위까지 스크롤될 여백을 확보합니다.

## 홈 등록과 배포

```javascript
{
  id: 'swea-0000',
  title: '문제명',
  platform: 'SWEA',
  problemNo: '0000',
  level: 'D2',
  href: 'problems/0000/',
  status: 'ready',
  searchTerms: ['스택', '문자열'],
}
```

홈은 문제 스크립트를 실행하지 않으므로 카드 정보는 catalog에 별도로 등록합니다. 문제 설정·HTML 제목·카드 정보가 일치하는지 확인합니다.

기존 Pages workflow는 정적 파일 복사와 커밋 SHA 기반 캐시 버전만 처리합니다. 로컬에서 HTML을 열거나 정적 HTTP 서버로 제공할 때도 별도 빌드가 필요 없습니다. 임시 `Date.now()` 캐시 코드는 추가하지 않습니다.

## 완료 전 검증

- 홈: 로고, 카드, 검색, 결과 없음, 문제 링크, 모바일
- 각 문제: 모든 샘플, 직접 입력과 오류, 이전/다음, 자동 실행/정지, 다시보기, 끝 이동, timeline, 최종 정답
- 문제 특수 상태: stack, best 영역, 빈 칸 skip, chapter navigation 등
- desktop/mobile이 같은 단계·결과·코드 줄을 표시하는지 확인
- 너비 `1440, 1280, 1024, 768, 430, 390, 375, 360`에서 확인
- 페이지 가로 스크롤 없음, 코드/board 내부 스크롤 정상, 하단 콘텐츠와 버튼이 가려지지 않음
- 콘솔 오류와 자원 404 없음
- 공통 UI CSS 복사, !important 추가, 전역 변수 노출 없음

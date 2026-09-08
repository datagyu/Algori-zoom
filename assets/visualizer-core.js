/*
 * 알고리줌 공통 유틸리티
 *
 * 문제별 알고리즘 로직은 problems/<id>/script.js에 두고,
 * 여러 시각화에서 반복되는 DOM·코드 매핑·스크롤 기능만 이곳에서 공유합니다.
 */
(() => {
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatDecimal(value) {
    return Number(value).toFixed(2).replace(/\.?0+$/, '');
  }

  function getByIds(ids) {
    return Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
  }

  function createLineMap(root) {
    return new Map(
      [...root.querySelectorAll('.code-line')].map((line) => [
        Number(line.dataset.sourceLine ?? line.dataset.line),
        line,
      ]),
    );
  }

  function createStepLineMap(root) {
    const map = new Map();

    for (const line of root.querySelectorAll('.code-line[data-step-types]')) {
      const sourceLine = Number(line.dataset.sourceLine ?? line.dataset.line);
      for (const type of line.dataset.stepTypes.split(/\s+/).filter(Boolean)) {
        map.set(type, sourceLine);
      }
    }

    return map;
  }

  function centerInsideViewport(
    viewport,
    target,
    { horizontal = true, vertical = true } = {},
  ) {
    if (!viewport || !target) return;

    const viewportRect = viewport.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const position = {};

    if (horizontal) {
      position.left = viewport.scrollLeft
        + targetRect.left
        - viewportRect.left
        - (viewport.clientWidth - targetRect.width) / 2;
    }

    if (vertical) {
      position.top = viewport.scrollTop
        + targetRect.top
        - viewportRect.top
        - (viewport.clientHeight - targetRect.height) / 2;
    }

    viewport.scrollTo({
      ...position,
      behavior: reduceMotionQuery.matches ? 'auto' : 'smooth',
    });
  }

  window.AlgoriZoomCore = Object.freeze({
    clamp,
    escapeHtml,
    formatDecimal,
    getByIds,
    createLineMap,
    createStepLineMap,
    centerInsideViewport,
  });
})();

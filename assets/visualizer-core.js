/*
 * 알고리줌 공통 유틸리티
 * 문제별 시각화에서 반복되는 안전한 DOM/스크롤 보조 기능만 둡니다.
 * 알고리즘 규칙 자체는 각 problems/<id>/script.js에 남깁니다.
 */
(() => {
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDecimal(value) {
    return Number(value).toFixed(2).replace(/\.?0+$/, "");
  }

  function createLineMap(root) {
    return new Map(
      [...root.querySelectorAll(".code-line")].map((line) => [
        Number(line.dataset.sourceLine),
        line,
      ]),
    );
  }

  function centerInsideViewport(viewport, target, { horizontal = true, vertical = true } = {}) {
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

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({ ...position, behavior: reduceMotion ? "auto" : "smooth" });
  }

  window.AlgoriZoomCore = Object.freeze({
    clamp,
    escapeHtml,
    formatDecimal,
    createLineMap,
    centerInsideViewport,
  });
})();

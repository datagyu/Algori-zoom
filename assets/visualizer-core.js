/*
 * 알고리줌 공통 유틸리티
 *
 * 문제별 알고리즘 로직은 problems/<id>/script.js에 두고,
 * 여러 시각화에서 반복되는 DOM·코드 매핑·스크롤 기능만 이곳에서 공유합니다.
 */
(() => {
  const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function formatDecimal(value) {
    return Number(value)
      .toFixed(2)
      .replace(/\.?0+$/, "");
  }

  function getByIds(ids) {
    return Object.fromEntries(
      ids.map((id) => [id, document.getElementById(id)]),
    );
  }

  // Both layouts control the same problem timer and always show the same state.
  function updatePlaybackControls(playButton, playing) {
    playButton.textContent = playing ? "일시정지" : "자동 재생";
    playButton.setAttribute("aria-pressed", String(playing));
    const mobileButton = document.getElementById("mobilePlayBtn");
    if (!mobileButton) return;
    mobileButton.textContent = playing ? "일시정지" : "재생";
    mobileButton.setAttribute("aria-label", playing ? "일시정지" : "자동 재생");
    mobileButton.setAttribute("aria-pressed", String(playing));
    mobileButton.title = playing ? "일시정지" : "자동 재생";
  }

  function createLineMap(root) {
    return new Map(
      [...root.querySelectorAll(".code-line")].map((line) => [
        Number(line.dataset.sourceLine ?? line.dataset.line),
        line,
      ]),
    );
  }

  function createStepLineMap(root) {
    const map = new Map();

    for (const line of root.querySelectorAll(".code-line[data-step-types]")) {
      const sourceLine = Number(line.dataset.sourceLine ?? line.dataset.line);
      for (const type of line.dataset.stepTypes.split(/\s+/).filter(Boolean)) {
        map.set(type, sourceLine);
      }
    }

    return map;
  }

  // Tokenize before escaping: strings and comments must not be highlighted again.
  function highlightPython(line, { editor = false } = {}) {
    const keywords = new Set([
      "for",
      "in",
      "if",
      "else",
      "elif",
      "break",
      "continue",
      "while",
      "def",
      "return",
      "and",
      "or",
      "not",
    ]);
    const functions = new Set([
      "range",
      "int",
      "input",
      "map",
      "list",
      "len",
      "print",
      "append",
      "pop",
      "join",
    ]);
    const tokens =
      /#[^\n]*|(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b/g;
    let end = 0;
    let markup = "";
    for (const match of line.matchAll(tokens)) {
      markup += escapeHtml(line.slice(end, match.index));
      const token = match[0];
      let kind = keywords.has(token)
        ? "kw"
        : functions.has(token)
          ? "fn"
          : /^\d/.test(token)
            ? "num"
            : /^["']/.test(token)
              ? "str"
              : "";


      markup += kind
        ? `<span class="${kind}">${escapeHtml(token)}</span>`
        : escapeHtml(token);
      end = match.index + token.length;
    }
    return markup + escapeHtml(line.slice(end));
  }

  // Anchors live beside buildSteps(), so inserted source lines don't break mapping.
  function createCodeMarkup(
    template,
    anchors = [],
    { wrap = true, editor = false } = {},
  ) {
    const lines = template.content.textContent
      .replace(/^\r?\n/, "")
      .trimEnd()
      .split(/\r?\n/);
    const steps = new Map();
    for (const { text, types, occurrence = 1 } of anchors) {
      let seen = 0;
      const index = lines.findIndex(
        (line) => line.trim() === text && ++seen === occurrence,
      );
      if (index < 0) throw new Error(`Python source anchor not found: ${text}`);
      steps.set(index, types);
    }
    const markup = lines
      .map((line, index) => {
        const types = steps.has(index)
          ? ` data-step-types="${escapeHtml(steps.get(index))}"`
          : "";
        return `<span class="code-line" data-source-line="${index + 1}"${types}><span class="ln">${index + 1}</span><span>${highlightPython(line, { editor })}</span></span>`;
      })
      .join("");
    return wrap
      ? `<pre class="code-block"><code>${markup}</code></pre>`
      : markup;
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
      position.left =
        viewport.scrollLeft +
        targetRect.left -
        viewportRect.left -
        (viewport.clientWidth - targetRect.width) / 2;
    }

    if (vertical) {
      position.top =
        viewport.scrollTop +
        targetRect.top -
        viewportRect.top -
        (viewport.clientHeight - targetRect.height) / 2;
    }

    viewport.scrollTo({
      ...position,
      behavior: reduceMotionQuery.matches ? "auto" : "smooth",
    });
  }

  window.AlgoriZoomCore = Object.freeze({
    clamp,
    escapeHtml,
    formatDecimal,
    getByIds,
    updatePlaybackControls,
    createLineMap,
    createStepLineMap,
    createCodeMarkup,
    centerInsideViewport,
  });
})();

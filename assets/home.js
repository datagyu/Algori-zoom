(() => {
  const { escapeHtml } = window.AlgoriZoomCore;
  const items = Array.isArray(window.VISUALIZATIONS) ? window.VISUALIZATIONS : [];
  const els = {
    grid: document.getElementById("visualGrid"),
    search: document.getElementById("searchInput"),
    emptyState: document.getElementById("emptyState"),
  };

  function searchableText(item) {
    return [
      item.title,
      item.platform,
      item.problemNo,
      item.level,
      ...(item.searchTerms ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function matchesSearch(item, query) {
    return !query || searchableText(item).includes(query);
  }

  function renderCard(item, index) {
    const status = item.status === "ready" ? "학습 가능" : "준비 중";
    return `
      <a class="visual-card" href="${escapeHtml(item.href)}">
        <div class="card-top">
          <span class="card-index">${String(items.indexOf(item) + 1).padStart(2, "0")}</span>
          <span class="status-dot"><i></i> ${escapeHtml(status)}</span>
        </div>
        <div class="card-main">
          <div class="meta">${escapeHtml(item.platform)} ${escapeHtml(item.problemNo)}${item.level ? " · " + escapeHtml(item.level) : ""}</div>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        <div class="card-enter"><span>시각화 열기</span></div>
      </a>
    `;
  }

  function renderCatalog() {
    const query = els.search.value.trim().toLowerCase();
    const filtered = items.filter((item) => matchesSearch(item, query));

    els.grid.innerHTML = filtered.map(renderCard).join("");
    els.emptyState.hidden = filtered.length > 0;
    document.getElementById("resultCount").textContent = `전체 ${items.length}개 중 ${filtered.length}개`;
    document.getElementById("clearSearch").hidden = !els.search.value;
  }

  els.search.addEventListener("input", renderCatalog);
  document.getElementById("clearSearch").addEventListener("click", () => {
    els.search.value = ""; renderCatalog(); els.search.focus();
  });
  renderCatalog();
})();

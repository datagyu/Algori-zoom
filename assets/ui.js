/* Shared responsive controls; the original inputs and handlers remain the source of truth. */
(() => {
  if (!document.body.classList.contains("visualizer")) return;
  const byId = (id) => document.getElementById(id);
  const desktop = document.querySelector(".desktop-view");
  const mobile = document.querySelector(".mobile-view");
  const player = document.querySelector(".mobile-player");
  const input = document.querySelector(".input-panel");
  const breakpoint = matchMedia("(max-width: 760px)");
  const inputAnchor = document.createComment("shared input position");
  input.before(inputAnchor);

  const settings = document.createElement("section");
  settings.className = "panel mobile-settings";
  settings.setAttribute("aria-label", "재생 설정");
  const actions = document.createElement("div");
  actions.className = "controls-main";
  for (const [target, label] of [["resetBtn", "처음으로"], ["replayBtn", "다시 재생"], ["skipBtn", "끝으로"]]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn";
    button.textContent = label;
    button.addEventListener("click", () => byId(target).click());
    actions.append(button);
  }
  settings.append(actions);
  mobile.querySelector(".mobile-header").after(settings);

  // Move, never clone, so input drafts, sample handlers and speed stay in sync.
  const speed = document.querySelector(".speed-control");
  const speedAnchor = document.createComment("shared speed position");
  speed.before(speedAnchor);
  const statePanel = desktop.querySelector(".state-panel");
  const stateAnchor = document.createComment("shared state position");
  statePanel.before(stateAnchor);
  const stateDetails = document.createElement("details");
  stateDetails.className = "panel mobile-state-details";
  const summary = document.createElement("summary");
  summary.textContent = "전체 변수와 상태 보기";
  stateDetails.append(summary);
  mobile.querySelector(".mobile-result").after(stateDetails);
  const subtitle = desktop.querySelector(".subtitle");
  if (subtitle) {
    const description = document.createElement("p");
    description.className = "mobile-description";
    description.textContent = subtitle.textContent;
    mobile.querySelector(".mobile-header").append(description);
  }
  const chapter = byId("chapterNav");
  const chapterAnchor = document.createComment("shared chapter position");
  if (chapter) chapter.before(chapterAnchor);
  function placeSharedControls() {
    if (breakpoint.matches) {
      mobile.insertBefore(input, player);
      settings.append(speed);
      stateDetails.append(statePanel);
      if (chapter) settings.append(chapter);
    } else {
      inputAnchor.after(input);
      speedAnchor.after(speed);
      stateAnchor.after(statePanel);
      if (chapter) chapterAnchor.after(chapter);
    }
  }
  breakpoint.addEventListener("change", placeSharedControls);
  placeSharedControls();

  // Keep example-code guidance in the document flow instead of covering the header.
  const note = document.querySelector(".code-disclaimer");
  if (note) {
    note.textContent = "학습용 예시 코드입니다. 풀이 흐름을 이해하는 데 활용하세요.";
    note.className = "code-disclaimer";
    const footer = document.createElement("footer");
    footer.className = "site-note";
    footer.append(note);
    document.body.append(footer);
  }

  const sampleButtons = byId("sampleButtons");
  const updateSamples = () => sampleButtons.querySelectorAll("button").forEach(button => {
    button.setAttribute("aria-pressed", String(button.classList.contains("selected") || button.classList.contains("sample-active")));
  });
  new MutationObserver(updateSamples).observe(sampleButtons, {childList:true, subtree:true, attributes:true, attributeFilter:["class"]});
  updateSamples();

  // Native inputs retain their keyboard behavior. Page shortcuts never consume typing.
  document.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat ||
        event.target.closest("input, textarea, select, button, a, [contenteditable], [role=button], summary")) return;
    const controls = {ArrowLeft:"prevBtn", ArrowRight:"nextBtn", " ":"playBtn", Home:"resetBtn", End:"skipBtn"};
    const id = controls[event.key];
    if (id) { event.preventDefault(); byId(id).click(); }
  });
  const help = document.createElement("p");
  help.className = "keyboard-help";
  help.textContent = "방향키: 이전·다음 단계 · Space: 재생·일시정지 · Home / End: 처음·끝";
  desktop.querySelector(".timeline-panel").append(help);
})();

/* Copy the original Python source without line numbers or highlighting. */
(() => {
  const source = document.getElementById('sourceCode');
  if (!source) return;
  const icon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg>';
  const status = document.createElement('span');
  status.className = 'copy-status';
  status.setAttribute('role', 'status');
  document.body.append(status);
  function fallbackCopy(text) {
    const field = document.createElement('textarea');
    field.value = text;
    field.style.cssText = 'position:fixed;left:-9999px;top:0;';
    const focused = document.activeElement;
    document.body.append(field);
    field.select();
    try {
      if (!document.execCommand('copy')) throw new Error('Copy failed');
    } finally {
      field.remove();
      if (focused) focused.focus({ preventScroll: true });
    }
  }
  document.querySelectorAll('.code-panel > .panel-head, .mobile-code > .mobile-section-head').forEach(head => {
    const title = head.firstElementChild;
    if (!title) return;
    const group = document.createElement('span');
    group.className = 'code-title-actions';
    title.before(group);
    group.append(title);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code-button';
    button.innerHTML = icon;
    button.title = 'Python 코드 복사';
    button.setAttribute('aria-label', 'Python 코드 복사');
    group.append(button);
    let resetTimer;
    button.addEventListener('click', async () => {
      const text = source.content.textContent.replace(/^\r?\n/, '').trimEnd();
      clearTimeout(resetTimer);
      status.textContent = '';
      try {
        try {
          if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(text);
        } catch (_) {
          fallbackCopy(text);
        }
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
        button.title = '복사 완료';
        button.setAttribute('aria-label', '복사 완료');
        status.textContent = 'Python 코드를 복사했습니다.';
      } catch (_) {
        button.title = '복사 실패: 다시 시도하세요';
        status.textContent = '코드를 복사하지 못했습니다. 다시 시도하세요.';
      }
      resetTimer = setTimeout(() => {
        button.innerHTML = icon;
        button.title = 'Python 코드 복사';
        button.setAttribute('aria-label', 'Python 코드 복사');
      }, 1800);
    });
  });
})();

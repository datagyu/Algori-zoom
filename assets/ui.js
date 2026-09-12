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

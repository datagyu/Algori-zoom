# UI consistency validation

Base: `9225024b893e66ee3bdf0c2a357d73db606a61a4`

## Shared UI contract

Load `assets/ui.css` after problem styles, and `assets/ui.js` after the problem script. Board geometry and algorithm-specific state colors remain in problem styles; shared typography, panels, controls, responsive spacing and code highlighting use one presentation layer.

At 760px and below, the existing input panel, speed control, chapter navigation (where present), and full state panel move into the mobile layout. They are not cloned, so there is one input draft and one set of event handlers. The full state panel is available under “전체 변수와 상태 보기”. Resizing restores these elements to their desktop positions.

Playback uses each problem's existing timer and navigation functions. Labels use text instead of pictographs. Page shortcuts do not consume events originating in form controls, links, buttons, summaries, or editable content.

## Checks performed

- All 10 problem pages at 320, 760, 761, 1024 and 1440px: no document horizontal overflow, one input panel, one visible main heading, full state panel present.
- All 10 mobile pages: previous/next, reset, end, playback and pause; end disables next. Problem outputs inspected for applicable pages.
- 5356: invalid input displays an inline error; valid five-line A/B/C/D/E input produces ABCDE. Input draft and 2x speed survive desktop/mobile layout transitions. Full state details open.
- 1215 desktop: native timeline End reaches the last step; next disables; reset and ArrowRight navigate correctly.
- Home: number/title search, empty results, result count, clear button and navigation; card numbers remain stable while filtering. 320px visual inspection.
- JavaScript syntax, local HTML resource links, unique IDs, and absence of extended pictographs checked.
- Browser error logs inspected: no JavaScript errors during the checks.

These checks use the desktop app's Chromium browser with viewport overrides. Physical iOS/Android devices and browser-specific behavior outside Chromium have not been tested.

## Repeat after changes

1. Open each problem at a narrow viewport and exercise playback, timeline, sample selection and input application.
2. Enter an unsubmitted draft and change speed. Resize across 760px and confirm both survive.
3. Open full variable details on mobile. Resize to desktop and confirm the state panel returns to the workspace.
4. Check 320px and 761px widths, then run the problem to its last step.
5. Search the home catalog, clear it, and open a result.

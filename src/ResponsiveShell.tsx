import type { ReactNode } from "react";

/**
 * Class for an in-detail control that should only show while the detail panel is
 * a phone/tablet overlay (e.g. its back button) — hidden once the panel is
 * docked on desktop. Put it on the app's detail back button:
 * `<button className={RESPONSIVE_SHELL_DETAIL_BACK_CLASS} onClick={onClose}>`.
 */
export const RESPONSIVE_SHELL_DETAIL_BACK_CLASS = "skl-shell-detail-back";

export interface ResponsiveShellProps {
  /** Persistent top bar — spans the full width at every breakpoint (e.g. TopBar/DesktopActionBar). */
  topBar: ReactNode;
  /** The center content column (scrolls). */
  main: ReactNode;
  /** Phone nav (`< 720px`) — e.g. the app's BottomNav. Hidden at wider widths. */
  bottomNav?: ReactNode;
  /** Tablet nav (`720–1079px`) — e.g. {@link IconRail}. Hidden otherwise. */
  rail?: ReactNode;
  /** Desktop nav (`≥ 1080px`) — e.g. SidebarNav (pass width 236 to fill the column). */
  sidebar?: ReactNode;
  /** Master-detail panel: docked right column on desktop; full-screen overlay on phone/tablet. */
  detail?: ReactNode;
  /** Phone/tablet overlay visibility. Ignored on desktop, where detail is always docked. */
  detailOpen?: boolean;
  /** Optional id for scoping/testing. */
  id?: string;
}

// Breakpoints: phone < 720 ≤ tablet < 1080 ≤ desktop. One list-detail layout that
// reflows — the desktop right panel IS the mobile drill-in, given a permanent column.
const CSS = `
.skl-shell {
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--skl-color-app-bg, #f8fafc);
  font-family: var(--skl-font-sans);
}
.skl-shell__top { flex: 0 0 auto; }
.skl-shell__main { flex: 1 1 auto; min-height: 0; overflow-y: auto; }
.skl-shell__bottom { flex: 0 0 auto; }
.skl-shell__rail, .skl-shell__sidebar { display: none; }
.skl-shell__detail {
  position: absolute; inset: 0; z-index: 40; background: #fff;
  display: none; flex-direction: column;
}
.skl-shell__detail.is-open { display: flex; animation: sklShellFade .2s ease-out; }
.${RESPONSIVE_SHELL_DETAIL_BACK_CLASS} { display: inline-flex; }
@keyframes sklShellFade { from { opacity: 0; } to { opacity: 1; } }

@media (min-width: 720px) {
  .skl-shell {
    display: grid;
    grid-template-columns: 78px 1fr;
    grid-template-rows: auto minmax(0, 1fr);
    grid-template-areas: "top top" "nav main";
  }
  .skl-shell__top { grid-area: top; }
  .skl-shell__main { grid-area: main; height: 100%; }
  .skl-shell__rail { grid-area: nav; display: flex; border-right: 1px solid var(--skl-color-border); }
  .skl-shell__sidebar { grid-area: nav; }
  .skl-shell__bottom { display: none; }
}

@media (min-width: 1080px) {
  .skl-shell {
    grid-template-columns: 236px 1fr 340px;
    grid-template-areas: "top top top" "nav main detail";
  }
  /* Views without a detail panel: drop the docked column (sidebar + content only). */
  .skl-shell--no-detail {
    grid-template-columns: 236px 1fr;
    grid-template-areas: "top top" "nav main";
  }
  .skl-shell__rail { display: none; }
  .skl-shell__sidebar { grid-area: nav; display: block; border-right: 1px solid var(--skl-color-border); }
  .skl-shell__detail {
    position: relative; inset: auto; z-index: auto; grid-area: detail;
    display: flex; border-left: 1px solid var(--skl-color-border); overflow-y: auto;
  }
  .${RESPONSIVE_SHELL_DETAIL_BACK_CLASS} { display: none; }
}
`;

/**
 * The SkipLeague adaptive app shell (design_handoff_responsive_shell).
 *
 * ONE layout that reflows across three breakpoints — no separate mobile/desktop
 * product. The top bar is constant; the nav and detail regions rearrange:
 *
 *   Phone  (<720):  top bar / content / bottom tab bar; detail = full overlay
 *   Tablet (720–1079): top bar / [icon rail | content]; detail = full overlay
 *   Desktop (≥1080):  top bar / [sidebar | content | docked detail]
 *
 * The detail is the SAME element everywhere (list-detail / master-detail): a
 * drill-in overlay on phone/tablet, a permanently docked right column on desktop.
 * Pass the app's own nav components into `bottomNav` / `rail` / `sidebar` — the
 * shell shows the right one per breakpoint via CSS (no JS width state needed).
 *
 * Give the shell a fixed-height parent (e.g. `height: 100dvh`); it fills it and
 * scrolls internally.
 */
export function ResponsiveShell({
  topBar,
  main,
  bottomNav,
  rail,
  sidebar,
  detail,
  detailOpen = false,
  id,
}: ResponsiveShellProps) {
  return (
    <div className={`skl-shell${detail ? "" : " skl-shell--no-detail"}`} id={id}>
      <style>{CSS}</style>
      <div className="skl-shell__top">{topBar}</div>
      {sidebar && <div className="skl-shell__sidebar">{sidebar}</div>}
      {rail && <div className="skl-shell__rail">{rail}</div>}
      <div className="skl-shell__main">{main}</div>
      {detail && <div className={`skl-shell__detail${detailOpen ? " is-open" : ""}`}>{detail}</div>}
      {bottomNav && <div className="skl-shell__bottom">{bottomNav}</div>}
    </div>
  );
}

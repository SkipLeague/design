import type { ReactNode } from "react";
/**
 * Class for an in-detail control that should only show while the detail panel is
 * a phone/tablet overlay (e.g. its back button) — hidden once the panel is
 * docked on desktop. Put it on the app's detail back button:
 * `<button className={RESPONSIVE_SHELL_DETAIL_BACK_CLASS} onClick={onClose}>`.
 */
export declare const RESPONSIVE_SHELL_DETAIL_BACK_CLASS = "skl-shell-detail-back";
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
export declare function ResponsiveShell({ topBar, main, bottomNav, rail, sidebar, detail, detailOpen, id, }: ResponsiveShellProps): import("react").JSX.Element;

import type { CSSProperties, ReactNode } from "react";
/** A single destination in the tablet {@link IconRail}. */
export interface IconRailItem {
    /** Stable key. */
    key: string;
    label: string;
    /** ~21px line icon (stroke 2, currentColor) — inherits the item's color. */
    icon: ReactNode;
    /** Current route — highlighted brand. Derive from your router. */
    active?: boolean;
    /** Renders an `<a href>`; omit for a `<button>` (pure onClick). */
    href?: string;
    onClick?: () => void;
}
export interface IconRailProps {
    items: IconRailItem[];
    /** Rail width in px (default 78 — the shell's tablet nav column). */
    width?: number;
    /** Route item links via your own router (e.g. React Router's `<Link>`). */
    renderLink?: (args: {
        href: string;
        style: CSSProperties;
        "aria-current"?: "page";
        children: ReactNode;
    }) => ReactNode;
}
/**
 * The tablet-width vertical navigation rail (design_handoff_responsive_shell) —
 * icon-over-label stacks in a 78px column. Sits in the `rail` slot of
 * {@link ResponsiveShell} between the phone bottom bar and the desktop
 * {@link SidebarNav}. Nav only; identity/account live in the top bar.
 */
export declare function IconRail({ items, width, renderLink }: IconRailProps): import("react").JSX.Element;

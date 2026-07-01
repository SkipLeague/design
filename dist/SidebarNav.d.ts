import { type CSSProperties, type ReactNode } from "react";
/** A single navigation row in the desktop sidebar. */
export interface SidebarNavItem {
    /** Stable key (also used for React reconciliation). */
    key: string;
    label: string;
    /** ~18px line icon (stroke 2, currentColor) — inherits the row's color. */
    icon?: ReactNode;
    /** Renders an `<a href>`; omit for a plain `<button>` (e.g. pure onClick). */
    href?: string;
    /** Current route — highlighted. Derive from your router. */
    active?: boolean;
    onClick?: () => void;
}
/** A run of items under an optional uppercase heading (e.g. "LISTS"). */
export interface SidebarNavSection {
    /** Uppercase section heading. Omit for an ungrouped run of items. */
    heading?: string;
    items: SidebarNavItem[];
}
/** Args passed to a custom `renderLink` so apps can route with their own `<Link>`. */
export interface SidebarNavLinkArgs {
    href: string;
    style?: CSSProperties;
    "aria-current"?: "page";
    children: ReactNode;
}
export interface SidebarNavProps {
    /** Sections rendered top→bottom; each an optional heading + its items. */
    sections: SidebarNavSection[];
    /** Sidebar width in px (default 210). */
    width?: number;
    /**
     * Render item links via your own router (e.g. React Router's `<Link>`) instead
     * of a full-page `<a href>`. Example:
     * `renderLink={({ href, ...p }) => <Link to={href} {...p} />}`.
     */
    renderLink?: (args: SidebarNavLinkArgs) => ReactNode;
}
/**
 * The desktop left navigation sidebar (design_handoff_desktop_action_bar).
 *
 * Sits BELOW the shared app bar ({@link TopBar}/`DesktopActionBar`), never
 * beside it. Starts directly with nav items — it carries NO app-name heading;
 * the app name lives only in the bar. Desktop-only: hide it below the app's
 * desktop breakpoint and rely on the app's bottom tab bar instead.
 *
 * Which item is `active` is owned by the app's router, not this component.
 */
export declare function SidebarNav({ sections, width, renderLink }: SidebarNavProps): import("react").JSX.Element;

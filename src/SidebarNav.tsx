import { useState, type CSSProperties, type ReactNode } from "react";

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
export function SidebarNav({ sections, width = 210, renderLink }: SidebarNavProps) {
  return (
    <nav
      style={{
        width,
        flex: "0 0 auto",
        borderRight: "1px solid var(--skl-color-border)",
        padding: "14px 12px",
        background: "#ffffff",
        fontFamily: "var(--skl-font-sans)",
      }}
    >
      {sections.map((section, si) => (
        <div key={section.heading ?? `s${si}`}>
          {section.heading && <div style={headingStyle}>{section.heading}</div>}
          {section.items.map((item) => (
            <Item key={item.key} item={item} renderLink={renderLink} />
          ))}
        </div>
      ))}
    </nav>
  );
}

function Item({
  item,
  renderLink,
}: {
  item: SidebarNavItem;
  renderLink?: (args: SidebarNavLinkArgs) => ReactNode;
}) {
  const [hover, setHover] = useState(false);
  const { label, icon, href, active, onClick } = item;

  const style: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "9px 11px",
    borderRadius: 9,
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
    cursor: "pointer",
    // Active wins; otherwise a subtle hover fill for affordance.
    background: active ? "var(--skl-color-current-bg)" : hover ? "var(--skl-color-surface-muted)" : "transparent",
    color: active ? "var(--skl-color-brand)" : "#475569",
  };

  const inner = (
    <>
      {icon}
      {label}
    </>
  );
  const hoverHandlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  // Link row (href) — use the app's router when renderLink is supplied.
  if (href) {
    if (renderLink) {
      return (
        <div {...hoverHandlers}>
          {renderLink({ href, style, "aria-current": active ? "page" : undefined, children: inner })}
        </div>
      );
    }
    return (
      <a href={href} style={style} aria-current={active ? "page" : undefined} onClick={onClick} {...hoverHandlers}>
        {inner}
      </a>
    );
  }

  // Button row (no href) — pure onClick.
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      style={{ ...style, width: "100%", textAlign: "left", border: "none" }}
      {...hoverHandlers}
    >
      {inner}
    </button>
  );
}

const headingStyle: CSSProperties = {
  fontWeight: 700,
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: 0.7,
  color: "var(--skl-color-text-faint)",
  padding: "14px 11px 5px",
};

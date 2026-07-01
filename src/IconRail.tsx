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
  renderLink?: (args: { href: string; style: CSSProperties; "aria-current"?: "page"; children: ReactNode }) => ReactNode;
}

/**
 * The tablet-width vertical navigation rail (design_handoff_responsive_shell) —
 * icon-over-label stacks in a 78px column. Sits in the `rail` slot of
 * {@link ResponsiveShell} between the phone bottom bar and the desktop
 * {@link SidebarNav}. Nav only; identity/account live in the top bar.
 */
export function IconRail({ items, width = 78, renderLink }: IconRailProps) {
  return (
    <nav
      style={{
        width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 4,
        padding: "14px 10px",
        background: "#ffffff",
        fontFamily: "var(--skl-font-sans)",
      }}
    >
      {items.map((item) => (
        <Item key={item.key} item={item} renderLink={renderLink} />
      ))}
    </nav>
  );
}

function Item({
  item,
  renderLink,
}: {
  item: IconRailItem;
  renderLink?: IconRailProps["renderLink"];
}) {
  const { label, icon, active, href, onClick } = item;
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    padding: "11px 6px",
    borderRadius: 12,
    textDecoration: "none",
    cursor: "pointer",
    color: active ? "var(--skl-color-brand)" : "#94a3b8",
    background: active ? "var(--skl-color-current-bg)" : "transparent",
  };
  const inner = (
    <>
      {icon}
      <span style={{ fontSize: 9.5, fontWeight: 600, lineHeight: 1 }}>{label}</span>
    </>
  );

  if (href) {
    if (renderLink) {
      return renderLink({ href, style, "aria-current": active ? "page" : undefined, children: inner });
    }
    return (
      <a href={href} style={style} aria-current={active ? "page" : undefined} onClick={onClick}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-current={active ? "page" : undefined} style={{ ...style, border: "none", width: "100%" }}>
      {inner}
    </button>
  );
}

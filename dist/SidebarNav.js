import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
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
export function SidebarNav({ sections, width = 210, renderLink }) {
    return (_jsx("nav", { style: {
            width,
            flex: "0 0 auto",
            borderRight: "1px solid var(--skl-color-border)",
            padding: "14px 12px",
            background: "#ffffff",
            fontFamily: "var(--skl-font-sans)",
        }, children: sections.map((section, si) => (_jsxs("div", { children: [section.heading && _jsx("div", { style: headingStyle, children: section.heading }), section.items.map((item) => (_jsx(Item, { item: item, renderLink: renderLink }, item.key)))] }, section.heading ?? `s${si}`))) }));
}
function Item({ item, renderLink, }) {
    const [hover, setHover] = useState(false);
    const { label, icon, href, active, onClick } = item;
    const style = {
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
    const inner = (_jsxs(_Fragment, { children: [icon, label] }));
    const hoverHandlers = {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
    };
    // Link row (href) — use the app's router when renderLink is supplied.
    if (href) {
        if (renderLink) {
            return (_jsx("div", { ...hoverHandlers, children: renderLink({ href, style, "aria-current": active ? "page" : undefined, children: inner }) }));
        }
        return (_jsx("a", { href: href, style: style, "aria-current": active ? "page" : undefined, onClick: onClick, ...hoverHandlers, children: inner }));
    }
    // Button row (no href) — pure onClick.
    return (_jsx("button", { type: "button", onClick: onClick, "aria-current": active ? "page" : undefined, style: { ...style, width: "100%", textAlign: "left", border: "none" }, ...hoverHandlers, children: inner }));
}
const headingStyle = {
    fontWeight: 700,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    color: "var(--skl-color-text-faint)",
    padding: "14px 11px 5px",
};

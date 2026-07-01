import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The tablet-width vertical navigation rail (design_handoff_responsive_shell) —
 * icon-over-label stacks in a 78px column. Sits in the `rail` slot of
 * {@link ResponsiveShell} between the phone bottom bar and the desktop
 * {@link SidebarNav}. Nav only; identity/account live in the top bar.
 */
export function IconRail({ items, width = 78, renderLink }) {
    return (_jsx("nav", { style: {
            width,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 4,
            padding: "14px 10px",
            background: "#ffffff",
            fontFamily: "var(--skl-font-sans)",
        }, children: items.map((item) => (_jsx(Item, { item: item, renderLink: renderLink }, item.key))) }));
}
function Item({ item, renderLink, }) {
    const { label, icon, active, href, onClick } = item;
    const style = {
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
    const inner = (_jsxs(_Fragment, { children: [icon, _jsx("span", { style: { fontSize: 9.5, fontWeight: 600, lineHeight: 1 }, children: label })] }));
    if (href) {
        if (renderLink) {
            return renderLink({ href, style, "aria-current": active ? "page" : undefined, children: inner });
        }
        return (_jsx("a", { href: href, style: style, "aria-current": active ? "page" : undefined, onClick: onClick, children: inner }));
    }
    return (_jsx("button", { type: "button", onClick: onClick, "aria-current": active ? "page" : undefined, style: { ...style, border: "none", width: "100%" }, children: inner }));
}

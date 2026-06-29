import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * A section card: an optional heading above a white, bordered, rounded container —
 * the standard grouping used on the account/settings pages.
 */
export function Card({ title, children, style, }) {
    return (_jsxs("section", { style: { fontFamily: "var(--skl-font-sans)", ...style }, children: [title && (_jsx("h3", { style: { margin: "0 0 0.75rem", fontSize: "1rem", fontWeight: 600, color: "var(--skl-color-text)" }, children: title })), _jsx("div", { style: {
                    background: "var(--skl-color-surface)",
                    border: "1px solid var(--skl-color-border)",
                    borderRadius: "var(--skl-radius-panel)",
                    padding: "1rem",
                }, children: children })] }));
}

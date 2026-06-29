import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// Exact 24×24 glyph paths (design_handoff_top_bar). `color` only matters for the
// racquetball ball, which is filled rather than stroked.
function glyphPaths(app, color) {
    switch (app) {
        case "lists":
            return (_jsxs(_Fragment, { children: [_jsx("path", { d: "M3.5 7l1.8 1.8L8.5 5.6" }), _jsx("path", { d: "M12.5 7H20.5" }), _jsx("path", { d: "M3.5 16l1.8 1.8L8.5 14.6" }), _jsx("path", { d: "M12.5 16.5H20.5" })] }));
        case "racquetball":
            return (_jsxs(_Fragment, { children: [_jsx("ellipse", { cx: "10", cy: "9", rx: "5.4", ry: "6.6", transform: "rotate(-34 10 9)" }), _jsx("path", { d: "M6.6 14.2L3.4 19.4" }), _jsx("circle", { cx: "18", cy: "17.4", r: "2.3", fill: color, stroke: "none" })] }));
        case "trips":
            return (_jsxs(_Fragment, { children: [_jsx("path", { d: "M12 21.5s6.6-5.8 6.6-10.5a6.6 6.6 0 1 0-13.2 0c0 4.7 6.6 10.5 6.6 10.5z" }), _jsx("circle", { cx: "12", cy: "10.8", r: "2.4" })] }));
    }
}
/**
 * The per-app logo mark — a brand-green rounded tile holding a white monoline
 * glyph. Replaces the single-letter {@link AppBadge}; gives each SkipLeague app a
 * distinct mark for the top bar, app switcher, and home screens.
 */
export function AppLogo({ app, size = 28, bg = "var(--skl-color-brand)", glyph = "#ffffff", }) {
    const inner = Math.round(size * 0.84);
    const style = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.32),
        background: bg,
        boxShadow: "0 1px 2px rgba(2,6,23,0.18)",
        flexShrink: 0,
    };
    return (_jsx("span", { style: style, "aria-hidden": true, children: _jsx("svg", { width: inner, height: inner, viewBox: "0 0 24 24", fill: "none", stroke: glyph, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", children: glyphPaths(app, glyph) }) }));
}

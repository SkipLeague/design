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
        case "gifts":
            // Gift box: lid band, body, vertical ribbon, and a two-loop bow.
            return (_jsxs(_Fragment, { children: [_jsx("rect", { x: "3.5", y: "8", width: "17", height: "4.5", rx: "1" }), _jsx("path", { d: "M5 12.5V20h14v-7.5" }), _jsx("path", { d: "M12 8v12" }), _jsx("path", { d: "M12 8C11 5.5 9.5 4.2 8.2 4.9 6.9 5.6 8 8 12 8Z" }), _jsx("path", { d: "M12 8c1-2.5 2.5-3.8 3.8-3.1C17.1 5.6 16 8 12 8Z" })] }));
        case "reading":
            // Open book: two pages meeting at a center spine.
            return (_jsxs(_Fragment, { children: [_jsx("path", { d: "M12 6.5C9.8 5.1 6.4 4.6 4 5.3v12.6c2.4-.7 5.8-.2 8 1.2 2.2-1.4 5.6-1.9 8-1.2V5.3C17.6 4.6 14.2 5.1 12 6.5Z" }), _jsx("path", { d: "M12 6.5V19.3" })] }));
        case "today":
            // Sun = "today" / the day.
            return (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "3.8" }), _jsx("path", { d: "M12 2.6V5" }), _jsx("path", { d: "M12 19V21.4" }), _jsx("path", { d: "M2.6 12H5" }), _jsx("path", { d: "M19 12H21.4" }), _jsx("path", { d: "M5.2 5.2 6.9 6.9" }), _jsx("path", { d: "M17.1 17.1 18.8 18.8" }), _jsx("path", { d: "M18.8 5.2 17.1 6.9" }), _jsx("path", { d: "M6.9 17.1 5.2 18.8" })] }));
        case "flow":
            // Two workflow nodes joined by an elbow connector — orchestration
            // ("when X happens, do Y").
            return (_jsxs(_Fragment, { children: [_jsx("rect", { x: "3", y: "3", width: "8", height: "8", rx: "2" }), _jsx("rect", { x: "13", y: "13", width: "8", height: "8", rx: "2" }), _jsx("path", { d: "M7 11v3.5a2 2 0 0 0 2 2h3.5" })] }));
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

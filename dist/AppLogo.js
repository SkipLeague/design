import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// Exact 24×24 glyph paths (design_handoff_app_glyphs — the finalized round that
// fixed racquetball, trips, and flow and added the guide mark). `color` only
// matters for filled sub-shapes (e.g. the racquetball ball), which are filled
// rather than stroked.
function glyphPaths(app, color) {
    switch (app) {
        case "lists":
            // Checklist ticks.
            return (_jsxs(_Fragment, { children: [_jsx("path", { d: "M3.5 7l1.8 1.8L8.5 5.6" }), _jsx("path", { d: "M12.5 7H20.5" }), _jsx("path", { d: "M3.5 16l1.8 1.8L8.5 14.6" }), _jsx("path", { d: "M12.5 16.5H20.5" })] }));
        case "racquetball":
            // Racquet (teardrop head + handle rotated 40°) with a filled ball.
            return (_jsxs(_Fragment, { children: [_jsxs("g", { transform: "rotate(40 10 9)", children: [_jsx("path", { d: "M10 3C13.2 3 14.8 5.6 14.8 8.4C14.8 11.4 12.6 13.6 10 15.6C7.4 13.6 5.2 11.4 5.2 8.4C5.2 5.6 6.8 3 10 3Z" }), _jsx("path", { d: "M10 15.6L10 21" })] }), _jsx("circle", { cx: "17.8", cy: "17", r: "2.3", fill: color, stroke: "none" })] }));
        case "trips":
            // Hard-shell suitcase: top handle and two clasps on the body.
            return (_jsxs(_Fragment, { children: [_jsx("rect", { x: "3.5", y: "8", width: "17", height: "11.5", rx: "2.2" }), _jsx("path", { d: "M8.5 8V6.2a1.6 1.6 0 0 1 1.6-1.6h3.8a1.6 1.6 0 0 1 1.6 1.6V8" }), _jsx("path", { d: "M9.5 12.4h1.8" }), _jsx("path", { d: "M12.7 12.4h1.8" })] }));
        case "gifts":
            // Gift box: body, lid band, vertical ribbon, and a two-loop bow.
            return (_jsxs(_Fragment, { children: [_jsx("path", { d: "M4 11h16v8.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" }), _jsx("path", { d: "M3 7.5h18v3.5H3z" }), _jsx("path", { d: "M12 7.5v13" }), _jsx("path", { d: "M12 7.5C11 5.2 7.6 4.6 7.6 6.5C7.6 7.7 9.7 8 12 7.5z" }), _jsx("path", { d: "M12 7.5C13 5.2 16.4 4.6 16.4 6.5C16.4 7.7 14.3 8 12 7.5z" })] }));
        case "reading":
            // Open book: two pages meeting at a center spine.
            return (_jsxs(_Fragment, { children: [_jsx("path", { d: "M12 6.6C9.8 5.1 6.4 4.8 4 5.4v12.8c2.4-.6 5.8-.3 8 1.2 2.2-1.5 5.6-1.8 8-1.2V5.4c-2.4-.6-5.8-.3-8 1.2z" }), _jsx("path", { d: "M12 6.6v12.8" })] }));
        case "today":
            // Sun = "today" / the day.
            return (_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("path", { d: "M12 2.4v2.2" }), _jsx("path", { d: "M12 19.4v2.2" }), _jsx("path", { d: "M4.6 4.6l1.6 1.6" }), _jsx("path", { d: "M17.8 17.8l1.6 1.6" }), _jsx("path", { d: "M2.4 12h2.2" }), _jsx("path", { d: "M19.4 12h2.2" }), _jsx("path", { d: "M6.2 17.8l-1.6 1.6" }), _jsx("path", { d: "M17.8 6.2l1.6-1.6" })] }));
        case "guide":
            // Folded map.
            return (_jsxs(_Fragment, { children: [_jsx("path", { d: "M9 4L3 6.4v13.6L9 17.6l6 2.4 6-2.4V6L15 8.4z" }), _jsx("path", { d: "M9 4v13.6" }), _jsx("path", { d: "M15 8.4V20" })] }));
        case "flow":
            // Two rounded cards linked by an elbow connector — orchestration
            // ("when X happens, do Y").
            return (_jsxs(_Fragment, { children: [_jsx("rect", { x: "3.5", y: "4.5", width: "7", height: "6", rx: "1.6" }), _jsx("rect", { x: "13.5", y: "13", width: "7", height: "6", rx: "1.6" }), _jsx("path", { d: "M10.5 7.5h2.5a2 2 0 0 1 2 2v3.5" })] }));
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

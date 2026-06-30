import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The shared SkipLeague bottom navigation (design_handoff_bottom_nav).
 *
 * ONE layout for every app: a row of tabs split evenly around a floating
 * center action ("+"). Only the tab labels/icons and the action's label change
 * per app — spacing, sizing, the button, and its clipped glow are identical
 * everywhere, so the bar looks the same across the family.
 *
 *   [tab][tab] ... ( + ) ... [tab][tab]
 *                  label
 *
 * - `tabs` holds 2–8 tabs. They split around the center: the first
 *   `ceil(n/2)` render left of the "+", the rest render right. (For an odd
 *   count the extra tab sits on the left; the "+" tracks the true center of
 *   its column, so it drifts slightly right of screen-center — even counts are
 *   the designed-for case.)
 * - `action` is the floating center button and the word beneath it.
 * - `groups` (optional, even counts only) adds a header band labelling the left
 *   pair/triple vs the right. Total bar height is unchanged — the tabs shift
 *   down to make room.
 */
const ICON = 24; // tab icon box (24px line icons, stroke 2)
const LABEL_GAP = 10; // icon -> label vertical gap
const ACTION_SIZE = 53; // floating center button (square)
const ACTION_RADIUS = 17; // center button corner radius
const ACTION_OVERHANG = 10; // px the button rises above the bar's top edge
const PLUS = 26; // "+" glyph box inside the button
// Soft mint halo + a grounding shadow. Painted on a layer INSIDE the
// overflow:hidden bar so it is clipped at the top edge — no glow above the line.
const ACTION_GLOW = "0 0 22px 4px rgba(94,234,212,0.6), 0 10px 22px rgba(15,118,110,0.30)";
// Two vertical-spacing presets that yield the SAME total bar height.
const PLAIN = { padTop: 10, padBottom: 18, headerGap: 0 };
const GROUPED = { padTop: 5, padBottom: 6, headerGap: 5 };
const cell = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: LABEL_GAP,
};
const labelBase = {
    fontFamily: "var(--skl-font-sans)",
    fontSize: 13,
    lineHeight: 1.15,
};
const groupLabel = {
    ...labelBase,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--skl-color-text-faint)",
    textAlign: "center",
};
function Tab({ label, icon, active, color, onClick, lift }) {
    const accent = color ?? "var(--skl-color-brand)";
    return (_jsxs("button", { type: "button", onClick: onClick, style: {
            ...cell,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            transform: `translateY(${lift}px)`,
            // icon color (currentColor); the label sets its own color below
            color: active ? accent : "var(--skl-color-text-faint)",
        }, children: [_jsx("span", { style: { height: ICON, display: "flex", alignItems: "flex-end" }, children: icon }), _jsx("span", { style: {
                    ...labelBase,
                    fontWeight: active ? 700 : 600,
                    color: active ? accent : "var(--skl-color-text-muted)",
                }, children: label })] }));
}
export function BottomNav({ tabs, action, groups }) {
    const n = tabs.length;
    if (n < 2 || n > 8) {
        // Render what we were given, but flag the contract violation in dev.
        console.warn(`BottomNav expects 2–8 tabs, received ${n}.`);
    }
    // Split around the center: extra tab (odd n) goes left.
    const leftCount = Math.ceil(n / 2);
    const left = tabs.slice(0, leftCount);
    const right = tabs.slice(leftCount);
    const columns = n + 1; // tabs + the center label column
    // Grouped headers are an even-count feature (a header over each side).
    const grouped = Array.isArray(groups) && groups.length === 2 && n % 2 === 0;
    const sp = grouped ? GROUPED : PLAIN;
    // In grouped mode the tab row sits lower; lift the center label back in line
    // with the side tabs (right under the "+"), and nudge the tabs up for balance.
    const centerLabelLift = grouped ? -13 : 0;
    const tabLift = grouped ? -2 : 0;
    // Horizontal center of the action column (== 50% for even counts).
    const actionLeft = `${((leftCount + 0.5) / columns) * 100}%`;
    const gridCols = `repeat(${columns}, 1fr)`;
    // "Tab Colors": the center button + label + glow follow the active tab's color
    // when one is set; otherwise everything stays the default brand teal + mint glow.
    const activeTab = tabs.find((t) => t.active);
    const accent = activeTab?.color ?? "var(--skl-color-brand)";
    const glow = activeTab?.color
        ? `0 0 22px 4px color-mix(in srgb, ${activeTab.color} 55%, transparent), 0 10px 22px color-mix(in srgb, ${activeTab.color} 30%, transparent)`
        : ACTION_GLOW;
    return (
    // `display: block` is set explicitly (not left to the nav default) so a host
    // app's global `nav { display: grid/flex }` rule can't override it and
    // collapse the full-width bar — the children below rely on normal block flow
    // (the bar fills the width; the floating "+" is absolutely positioned).
    _jsxs("nav", { style: { display: "block", position: "relative", flex: "none" }, children: [_jsxs("div", { style: {
                    background: "var(--skl-color-surface)",
                    borderTop: "1px solid var(--skl-color-border)",
                    position: "relative",
                    overflow: "hidden",
                    // Keep the tabs clear of the iOS home indicator (additive to padBottom).
                    paddingBottom: "env(safe-area-inset-bottom, 0px)",
                }, children: [_jsx("span", { "aria-hidden": true, style: {
                            position: "absolute",
                            top: -ACTION_OVERHANG,
                            left: actionLeft,
                            transform: "translateX(-50%)",
                            width: ACTION_SIZE,
                            height: ACTION_SIZE,
                            borderRadius: ACTION_RADIUS,
                            boxShadow: glow,
                            pointerEvents: "none",
                        } }), grouped && (_jsxs("div", { style: { display: "grid", gridTemplateColumns: gridCols, paddingTop: sp.padTop }, children: [_jsx("div", { style: { ...groupLabel, gridColumn: `1 / ${leftCount + 1}` }, children: groups[0] }), _jsx("div", { style: { ...groupLabel, gridColumn: `${leftCount + 2} / ${columns + 1}` }, children: groups[1] })] })), _jsxs("div", { style: {
                            display: "grid",
                            gridTemplateColumns: gridCols,
                            paddingTop: grouped ? sp.headerGap : sp.padTop,
                            paddingBottom: sp.padBottom,
                            position: "relative",
                        }, children: [left.map((t, i) => (_jsx(Tab, { ...t, lift: tabLift }, `l${i}`))), _jsxs("div", { onClick: action.onClick, "aria-hidden": true, style: { ...cell, cursor: "pointer" }, children: [_jsx("div", { style: { height: ICON } }), _jsx("span", { style: {
                                            ...labelBase,
                                            fontWeight: 700,
                                            color: accent,
                                            transform: `translateY(${centerLabelLift}px)`,
                                        }, children: action.label })] }), right.map((t, i) => (_jsx(Tab, { ...t, lift: tabLift }, `r${i}`)))] })] }), _jsx("button", { type: "button", onClick: action.onClick, "aria-label": action.ariaLabel ?? action.label, style: {
                    position: "absolute",
                    top: -ACTION_OVERHANG,
                    left: actionLeft,
                    transform: "translateX(-50%)",
                    width: ACTION_SIZE,
                    height: ACTION_SIZE,
                    borderRadius: ACTION_RADIUS,
                    background: accent,
                    color: "#fff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 3,
                    cursor: "pointer",
                }, children: _jsx("span", { style: { display: "flex", width: PLUS, height: PLUS }, children: action.icon }) })] }));
}

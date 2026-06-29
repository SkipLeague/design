import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AppLogo } from "./AppLogo.js";
import { ProfileMenu } from "./ProfileMenu.js";
/**
 * The shared SkipLeague top bar (design_handoff_top_bar, Option A — dark).
 *
 * Layout is identical across apps; only the logo glyph, wordmark, and the
 * contextual action slot change:
 *   [AppLogo + wordmark] ........ [ ...actions ][ ProfileMenu ]
 *
 * - ProfileMenu is pinned to the far right on every page (the persistent slot).
 * - `actions` is the contextual slot (Print / Share / …) — render zero or more
 *   {@link TopBarIconButton}s; they appear left of the ProfileMenu only when the
 *   current page offers them.
 */
export function TopBar({ app, appName, actions, compact = false, ...profile }) {
    const bar = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: compact ? 48 : 54,
        padding: compact ? "0 12px" : "0 14px",
        background: "var(--skl-color-header-dark)",
    };
    return (_jsxs("div", { style: bar, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [_jsx(AppLogo, { app: app, size: compact ? 26 : 27 }), _jsx("span", { style: {
                            fontFamily: "var(--skl-font-sans)",
                            fontWeight: 700,
                            fontSize: compact ? 14 : 15,
                            color: "var(--skl-color-on-dark)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }, children: appName })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [actions, _jsx(ProfileMenu, { tone: "dark", ...profile })] })] }));
}
/**
 * A contextual top-bar action button (Print, Share, …) styled for the dark bar.
 * Pass a 17–18px line icon (stroke 2, currentColor) as children.
 */
export function TopBarIconButton({ compact = false, style, children, ...props }) {
    const [hover, setHover] = useState(false);
    const dim = compact ? 36 : 38;
    return (_jsx("button", { type: "button", onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: {
            width: dim,
            height: dim,
            borderRadius: 9,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: hover ? "rgba(255,255,255,0.08)" : "transparent",
            border: `1px solid ${hover ? "rgba(94,234,212,0.5)" : "rgba(255,255,255,0.16)"}`,
            color: hover ? "var(--skl-color-brand-bright)" : "var(--skl-color-on-dark-muted)",
            transition: "background .12s, border-color .12s, color .12s",
            ...style,
        }, ...props, children: children }));
}

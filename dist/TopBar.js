import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Inbox, MoreHorizontal, Search, Upload, Users } from "lucide-react";
import { AppLogo } from "./AppLogo.js";
import { ProfileMenu } from "./ProfileMenu.js";
/**
 * The shared SkipLeague app bar (design_handoff_top_bar → design_handoff_desktop_action_bar).
 * Also exported as `DesktopActionBar` — the same component under the newer name;
 * migrate imports opportunistically and drop the alias once nothing uses `TopBar`.
 *
 * ONE bar for every app + breakpoint. It spans the full top row on both mobile
 * and desktop; on desktop the app adds a left sidebar (see {@link SidebarNav})
 * BELOW the bar — the bar itself is unchanged. Layout is identical across apps;
 * only the logo glyph, wordmark, tone, and which actions are enabled change:
 *
 *   [AppLogo + wordmark] ........ [ search inbox members share overflow ][ actions ][ ProfileMenu ]
 *
 * - ProfileMenu is pinned to the far right on every page (the persistent slot).
 * - The named action toggles render in a FIXED left→right order
 *   (search → inbox → members → share → overflow), each only when its `show*`
 *   flag is set, so the same action looks identical in every app.
 * - `actions` is an escape hatch for one-off contextual buttons; render zero or
 *   more {@link TopBarIconButton}s. They sit between the named cluster and the
 *   ProfileMenu.
 * - The app name appears ONLY here, never repeated in the sidebar.
 */
export function TopBar({ app, appName, tone = "dark", actions, compact = false, showSearch = false, showInbox = false, showMembers = false, showShare = false, showOverflow = false, onSearch, onInbox, onMembers, onShare, onOverflow, ...profile }) {
    const light = tone === "light";
    const bar = {
        display: "flex",
        alignItems: "center",
        gap: 12,
        height: compact ? 52 : 56,
        padding: compact ? "0 12px" : "0 16px",
        background: light ? "#ffffff" : "var(--skl-color-header-dark)",
        borderBottom: light ? "1px solid var(--skl-color-border)" : undefined,
        fontFamily: "var(--skl-font-sans)",
    };
    // Named actions in their fixed left→right order; only the enabled ones render.
    const named = [
        showSearch && { key: "search", title: "Search", Icon: Search, onClick: onSearch },
        showInbox && { key: "inbox", title: "Inbox", Icon: Inbox, onClick: onInbox },
        showMembers && { key: "members", title: "Members", Icon: Users, onClick: onMembers },
        showShare && { key: "share", title: "Share this view", Icon: Upload, onClick: onShare },
        showOverflow && { key: "overflow", title: "More", Icon: MoreHorizontal, onClick: onOverflow },
    ].filter(Boolean);
    return (_jsxs("div", { style: bar, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: "0 1 auto" }, children: [_jsx(AppLogo, { app: app, size: compact ? 26 : 27 }), _jsx("span", { style: {
                            fontWeight: 700,
                            fontSize: compact ? 14 : 15,
                            color: light ? "var(--skl-color-text)" : "var(--skl-color-on-dark)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }, children: appName })] }), _jsx("div", { style: { flex: "1 1 auto", minWidth: 8 } }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto" }, children: [named.map(({ key, title, Icon, onClick }) => (_jsx(TopBarIconButton, { tone: tone, compact: compact, title: title, "aria-label": title, onClick: onClick, children: _jsx(Icon, { size: 17 }) }, key))), actions, _jsx(ProfileMenu, { tone: tone, ...profile })] })] }));
}
/**
 * A ghost (borderless-fill) icon button for the app bar — the named actions use
 * it, and apps pass their own for one-off `actions`. Give it a 17px line icon
 * (stroke 2, currentColor) as children. Styling tracks the bar `tone`.
 */
export function TopBarIconButton({ tone = "dark", compact = false, style, children, ...props }) {
    const [hover, setHover] = useState(false);
    const dim = compact ? 36 : 38;
    const light = tone === "light";
    const palette = light
        ? {
            border: hover ? "#cbd5e1" : "var(--skl-color-border)",
            background: hover ? "var(--skl-color-surface-muted)" : "#ffffff",
            color: hover ? "var(--skl-color-text)" : "var(--skl-color-text-muted)",
        }
        : {
            border: hover ? "rgba(94,234,212,0.5)" : "rgba(255,255,255,0.16)",
            background: hover ? "rgba(255,255,255,0.08)" : "transparent",
            color: hover ? "var(--skl-color-brand-bright)" : "var(--skl-color-on-dark-muted)",
        };
    return (_jsx("button", { type: "button", onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: {
            width: dim,
            height: dim,
            borderRadius: 9,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flex: "0 0 auto",
            background: palette.background,
            border: `1px solid ${palette.border}`,
            color: palette.color,
            transition: "background .14s, border-color .14s, color .14s",
            ...style,
        }, ...props, children: children }));
}
/**
 * Alias for {@link TopBar} under its platform-app-bar name. Same component,
 * same props — use whichever import name the app standardizes on.
 */
export { TopBar as DesktopActionBar };

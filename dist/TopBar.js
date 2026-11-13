import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronLeft, Inbox, MoreHorizontal, Search, Upload, Users } from "lucide-react";
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
 * - Safe areas: the bar pads itself by `env(safe-area-inset-top)` and the left
 *   and right insets, so under `viewport-fit=cover` (the iSkip app, and a
 *   home-screen web app with `black-translucent`) its content clears the status
 *   bar and the notch while its background still fills behind them. Without
 *   `viewport-fit=cover` the insets are 0 and nothing changes. Pass
 *   `safeArea={false}` when the bar is not at the top edge of the screen.
 */
export function TopBar({ app, appName, tone = "dark", actions, compact = false, showSearch = false, showInbox = false, showMembers = false, showShare = false, showOverflow = false, onSearch, onInbox, onMembers, onShare, onOverflow, safeArea = true, ...profile }) {
    const light = tone === "light";
    const barHeight = compact ? 52 : 56;
    const sidePad = compact ? 12 : 16;
    const bar = {
        display: "flex",
        alignItems: "center",
        gap: 12,
        // border-box so the top inset is added to the bar, not taken out of its
        // 52/56px content row, whatever box-sizing the host app sets globally.
        boxSizing: "border-box",
        ...(safeArea
            ? {
                // Phase 0 measured a 62px top inset in the iSkip app: without this the
                // logo and ProfileMenu sit under the status bar.
                height: `calc(${barHeight}px + env(safe-area-inset-top, 0px))`,
                paddingTop: "env(safe-area-inset-top, 0px)",
                paddingRight: `calc(${sidePad}px + env(safe-area-inset-right, 0px))`,
                paddingBottom: 0,
                paddingLeft: `calc(${sidePad}px + env(safe-area-inset-left, 0px))`,
            }
            : { height: barHeight, padding: `0 ${sidePad}px` }),
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
            // Explicit padding:0 so a host app's global `button { padding }` can't
            // collapse this fixed-size box (border-box) and shrink the icon.
            padding: 0,
            background: palette.background,
            border: `1px solid ${palette.border}`,
            color: palette.color,
            transition: "background .14s, border-color .14s, color .14s",
            ...style,
        }, ...props, children: children }));
}
/**
 * The Back affordance for a drill-in / detail screen's app bar — a
 * {@link TopBarIconButton} carrying a left chevron, so every app's back button
 * looks and behaves identically (same tone-aware ghost styling as Search,
 * Share, ProfileMenu, etc.). Pair it with the app's router, e.g.
 * `<TopBarBackButton onClick={() => navigate(-1)} />`.
 *
 * Works on both a full {@link TopBar} (pass it via `actions`, though back
 * usually sits on the LEFT — apps that build a contextual detail header place it
 * directly) and a bespoke contextual header.
 */
export function TopBarBackButton({ tone = "dark", compact = false, label = "Back", ...props }) {
    return (_jsx(TopBarIconButton, { tone: tone, compact: compact, "aria-label": label, title: label, ...props, children: _jsx(ChevronLeft, { size: 20 }) }));
}
/**
 * Alias for {@link TopBar} under its platform-app-bar name. Same component,
 * same props — use whichever import name the app standardizes on.
 */
export { TopBar as DesktopActionBar };

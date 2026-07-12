import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { CircleUser, LogIn, LogOut, Settings } from "lucide-react";
import { AppBadge } from "./AppBadge.js";
import { AppLogo, appGlyphForSlug } from "./AppLogo.js";
import { SKIPLEAGUE_ACCOUNT_URL, SKIPLEAGUE_APPS, STATUS_DOT } from "./apps.js";
/**
 * The canonical SkipLeague account control: a boxed user-icon button that opens
 * a dropdown with the user's name/email, an inline **app switcher** (one click to
 * jump to another SkipLeague app; the current app is highlighted and not
 * clickable), **Manage account**, and **Sign out**. Also covers the platform
 * apex via `renderLink` (SPA nav), `accountIsCurrent`, and `onSignIn`
 * (signed-out state).
 *
 * Requires `@skipleague/design/tokens.css` to be imported once at the app root.
 */
export function ProfileMenu({ user, currentSlug, apps = SKIPLEAGUE_APPS, enabledSlugs, accountUrl = SKIPLEAGUE_ACCOUNT_URL, onSignOut, tone = "dark", renderLink, accountIsCurrent = false, onSignIn, signInLabel = "Sign in", }) {
    const [open, setOpen] = useState(false);
    const [hover, setHover] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onDocClick = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape")
                setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);
    // Show only the apps this user has enabled (always keeping the current app),
    // when the caller passes the user's enabled slugs. Otherwise list every app.
    const visibleApps = enabledSlugs && enabledSlugs.length > 0
        ? apps.filter((a) => a.slug === currentSlug || enabledSlugs.includes(a.slug))
        : apps;
    const signedIn = !!(user?.displayName || user?.email);
    // Signed-out menu only when a sign-in handler is supplied — otherwise keep the
    // existing always-signed-in behavior product apps depend on.
    const showSignedOut = !signedIn && !!onSignIn;
    const label = signedIn ? user.displayName || user.email || "Account" : "Account";
    const brand = tone === "light" ? "var(--skl-color-brand)" : "var(--skl-color-brand-bright)";
    const idleIcon = tone === "light" ? "#334155" : "#e2e8f0";
    const idleBorder = tone === "light" ? "var(--skl-color-border)" : "rgba(255,255,255,0.18)";
    const boxBg = tone === "light" ? "#ffffff" : "rgba(255,255,255,0.06)";
    const active = open || hover;
    const accountLabel = (_jsxs(_Fragment, { children: [_jsx(Settings, { size: 15 }), " Manage account"] }));
    const accountItem = accountIsCurrent ? (_jsx("div", { "aria-current": "page", style: { ...itemStyle, fontWeight: 600, background: "var(--skl-color-current-bg)", color: "var(--skl-color-current-text)", cursor: "default" }, children: accountLabel })) : renderLink ? (renderLink({ href: accountUrl, role: "menuitem", style: itemStyle, children: accountLabel })) : (_jsx("a", { href: accountUrl, role: "menuitem", style: itemStyle, children: accountLabel }));
    return (_jsxs("div", { ref: ref, style: { position: "relative", fontFamily: "var(--skl-font-sans)" }, children: [_jsx("button", { onClick: () => setOpen((o) => !o), onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), "aria-haspopup": "menu", "aria-expanded": open, "aria-label": "Account", title: label, style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // Explicit padding:0 — a host app's global `button { padding }` would
                    // otherwise collapse this fixed 38×38 box's content area (border-box)
                    // and shrink the icon to a dot.
                    padding: 0,
                    width: 38,
                    height: 38,
                    borderRadius: "var(--skl-radius-control)",
                    cursor: "pointer",
                    border: `1px solid ${active ? brand : idleBorder}`,
                    background: boxBg,
                    color: active ? brand : idleIcon,
                    transition: "border-color 0.15s, color 0.15s",
                }, children: _jsx(CircleUser, { size: 22 }) }), open && (_jsx("div", { role: "menu", style: menuStyle, children: showSignedOut ? (_jsxs(_Fragment, { children: [_jsx("div", { style: { padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--skl-color-border)" }, children: _jsx("div", { style: { fontWeight: 600, fontSize: "var(--skl-text-sm)", color: "var(--skl-color-text)" }, children: "Not signed in" }) }), _jsxs("button", { role: "menuitem", onClick: onSignIn, style: { ...itemStyle, width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }, children: [_jsx(LogIn, { size: 15 }), " ", signInLabel] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { style: { padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--skl-color-border)" }, children: [_jsx("div", { style: { fontWeight: 600, fontSize: "var(--skl-text-sm)", color: "var(--skl-color-text)" }, children: label }), user?.email && _jsx("div", { style: { fontSize: "var(--skl-text-xs)", color: "var(--skl-color-text-muted)" }, children: user.email })] }), visibleApps.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { style: switchHeading, children: "Switch app" }), visibleApps.map((a) => {
                                    const isCurrent = a.slug === currentSlug;
                                    // Per-app glyph when one exists; letter badge otherwise.
                                    const glyph = appGlyphForSlug(a.slug);
                                    const inner = (_jsxs("span", { style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [glyph ? _jsx(AppLogo, { app: glyph, size: 22 }) : _jsx(AppBadge, { name: a.name }), a.name] }));
                                    // Status dot, hard right, for anything not yet Live. Live apps get
                                    // none: most users can only reach Live apps, so a dot on every row
                                    // would say nothing. It rides in the row's existing flex gap, so it
                                    // adds no width to the menu.
                                    const dot = _jsx(StatusDot, { status: a.status });
                                    // The app you're in: light-green highlight, not clickable.
                                    return isCurrent ? (_jsxs("div", { "aria-current": "page", style: { ...appRowStyle, fontWeight: 600, background: "var(--skl-color-current-bg)", color: "var(--skl-color-current-text)", cursor: "default" }, children: [inner, dot] }, a.slug)) : (_jsxs("a", { href: a.url, role: "menuitem", style: appRowStyle, children: [inner, dot] }, a.slug));
                                })] })), _jsx("div", { style: divider }), accountItem, _jsx("div", { style: divider }), _jsxs("button", { role: "menuitem", onClick: onSignOut, style: { ...itemStyle, width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }, children: [_jsx(LogOut, { size: 15 }), " Sign out"] })] })) }))] }));
}
const menuStyle = {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    minWidth: 200,
    background: "var(--skl-color-surface)",
    border: "1px solid var(--skl-color-border)",
    borderRadius: "var(--skl-radius-panel)",
    boxShadow: "var(--skl-shadow-menu)",
    overflow: "hidden",
    zIndex: 50,
};
const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.55rem 0.75rem",
    fontSize: "var(--skl-text-sm)",
    color: "var(--skl-color-text)",
    textDecoration: "none",
};
/**
 * An app row: name hard left, status dot hard right. `space-between` does the work,
 * so the dot costs no extra width — the menu is exactly as wide as it was before.
 */
const appRowStyle = {
    ...itemStyle,
    justifyContent: "space-between",
};
/**
 * The lifecycle dot shown at the right edge of an app row. Renders nothing for a Live
 * app (or one whose status the caller didn't supply), so a user who can only reach
 * Live apps — i.e. almost everyone — sees a switcher with no dots at all, unchanged
 * from before. `title` + `aria-label` carry the status in words: at 8px, hue alone is
 * exactly what red-green color blindness loses.
 */
function StatusDot({ status }) {
    if (!status || status === "live")
        return null;
    const { color, label } = STATUS_DOT[status];
    const isOutline = status === "in_development";
    return (_jsx("span", { role: "img", "aria-label": label, title: label, style: {
            width: 8,
            height: 8,
            borderRadius: 999,
            flex: "0 0 auto",
            marginLeft: "0.5rem",
            background: isOutline ? "transparent" : color,
            border: isOutline ? `1.5px solid ${color}` : "none",
        } }));
}
const switchHeading = {
    padding: "0.5rem 0.75rem 0.25rem",
    fontSize: "var(--skl-text-2xs)",
    fontWeight: 600,
    color: "var(--skl-color-text-faint)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
};
const divider = {
    borderTop: "1px solid var(--skl-color-border)",
    margin: "0.25rem 0",
};

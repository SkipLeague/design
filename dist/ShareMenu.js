import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Link2, Mail, MessageCircle, MoreHorizontal } from "lucide-react";
import { TopBarIconButton } from "./TopBar.js";
/**
 * The top-bar Share dropdown (design_handoff_top_bar). A self-contained trigger
 * (the upload glyph, styled like a {@link TopBarIconButton}) + an anchored menu —
 * same open/dismiss model as ProfileMenu (click, outside-click, Escape).
 *
 * `noun` names the thing being shared ("players" → "Share players"). Pass the
 * handlers you support; omitted items are hidden.
 */
export function ShareMenu({ noun, compact = false, onCopyLink, onMessages, onEmail, onMore, }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onDoc = (e) => {
            if (!ref.current?.contains(e.target))
                setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape")
                setOpen(false);
        };
        window.addEventListener("mousedown", onDoc);
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("mousedown", onDoc);
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);
    const run = (fn) => () => {
        setOpen(false);
        fn?.();
    };
    const items = [
        { key: "copy", icon: _jsx(Link2, { size: 18 }), label: "Copy link", fn: onCopyLink },
        { key: "messages", icon: _jsx(MessageCircle, { size: 18 }), label: "Send in Messages", fn: onMessages },
        { key: "email", icon: _jsx(Mail, { size: 18 }), label: "Email", fn: onEmail },
    ].filter((i) => i.fn);
    return (_jsxs("div", { ref: ref, style: { position: "relative", display: "inline-flex" }, children: [_jsx(TopBarIconButton, { compact: compact, "aria-label": `Share ${noun}`, "aria-expanded": open, onClick: () => setOpen((v) => !v), children: _jsxs("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M12 14.5V3.5" }), _jsx("path", { d: "M8 7.2l4-3.7 4 3.7" }), _jsx("path", { d: "M5.5 12.5v6a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-6" })] }) }), open && (_jsxs(_Fragment, { children: [_jsx("style", { children: "@keyframes sklShareMenuPop{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:none}}" }), _jsxs("div", { role: "menu", style: panelStyle, children: [_jsxs("div", { style: sectionLabelStyle, children: ["Share ", noun] }), items.map((it) => (_jsx(MenuItem, { icon: it.icon, label: it.label, onClick: run(it.fn) }, it.key))), onMore && (_jsxs(_Fragment, { children: [_jsx("div", { style: dividerStyle }), _jsx(MenuItem, { icon: _jsx(MoreHorizontal, { size: 18 }), label: "More options\u2026", onClick: run(onMore), muted: true })] }))] })] }))] }));
}
function MenuItem({ icon, label, onClick, muted }) {
    const [hover, setHover] = useState(false);
    return (_jsxs("button", { type: "button", role: "menuitem", onClick: onClick, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: {
            display: "flex",
            alignItems: "center",
            gap: 11,
            width: "100%",
            padding: "9px 10px",
            border: "none",
            background: hover ? "var(--skl-color-surface-muted)" : "transparent",
            borderRadius: 8,
            font: "600 14px var(--skl-font-sans)",
            color: muted ? "var(--skl-color-text-muted)" : "var(--skl-color-text)",
            textAlign: "left",
            cursor: "pointer",
        }, children: [_jsx("span", { style: { display: "inline-flex", color: muted ? "var(--skl-color-text-faint)" : "var(--skl-color-text-muted)" }, children: icon }), label] }));
}
const panelStyle = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 226,
    background: "var(--skl-color-surface)",
    border: "1px solid var(--skl-color-border)",
    borderRadius: "var(--skl-radius-panel)",
    boxShadow: "var(--skl-shadow-menu)",
    padding: 6,
    zIndex: 70,
    transformOrigin: "top right",
    animation: "sklShareMenuPop .16s ease-out",
};
const sectionLabelStyle = {
    padding: "8px 10px 7px",
    font: "700 10.5px var(--skl-font-sans)",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    color: "var(--skl-color-text-faint)",
};
const dividerStyle = { height: 1, background: "var(--skl-color-border)", margin: "6px 8px" };

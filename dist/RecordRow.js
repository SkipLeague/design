import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, } from "react";
import { Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
const TILE = 64;
/** Standard convenience actions so callers don't re-declare the common three. */
export function recordRowActions(handlers) {
    const out = [];
    if (handlers.onEdit)
        out.push({ key: "edit", label: "Edit", icon: _jsx(Pencil, { size: 16 }), onClick: handlers.onEdit });
    if (handlers.onDuplicate)
        out.push({ key: "duplicate", label: "Duplicate", icon: _jsx(Copy, { size: 16 }), onClick: handlers.onDuplicate });
    if (handlers.onDelete)
        out.push({ key: "delete", label: "Delete", icon: _jsx(Trash2, { size: 16 }), tone: "danger", onClick: handlers.onDelete });
    return out;
}
/**
 * A record row in the "stat-forward, refined" list system: a leading tile, a
 * title + subline, and an optional trailing stat. Actions live behind a swipe
 * (touch) or a `⋯` menu (pointer) instead of the old three inline buttons.
 *
 * Requires `@skipleague/design/tokens.css`.
 */
export function RecordRow({ leading, title, subline, stat, onOpen, actions = [], busy = false, style, }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hover, setHover] = useState(false);
    // Swipe-to-reveal offset (touch only): 0 = closed, negative = revealed.
    const [offset, setOffset] = useState(0);
    const trayWidth = Math.min(actions.length, 3) * 64;
    const ref = useRef(null);
    const drag = useRef(null);
    useEffect(() => {
        if (!menuOpen)
            return;
        const onDoc = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                setMenuOpen(false);
        };
        const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);
    const onPointerDown = (e) => {
        if (busy || actions.length === 0)
            return;
        drag.current = { startX: e.clientX, dx: 0, touch: e.pointerType === "touch" };
    };
    const onPointerMove = (e) => {
        const d = drag.current;
        if (!d || !d.touch)
            return;
        d.dx = e.clientX - d.startX;
        // Only track leftward drags; clamp to the tray width.
        setOffset(Math.max(-trayWidth, Math.min(0, d.dx + (offset < 0 ? -trayWidth : 0))));
    };
    const endDrag = () => {
        const d = drag.current;
        drag.current = null;
        if (!d || !d.touch)
            return;
        // Snap: revealed if dragged past a third of the tray, else closed.
        setOffset(Math.abs(offset) > trayWidth / 3 ? -trayWidth : 0);
    };
    const onClickRow = () => {
        // A swipe-reveal shouldn't also open the record; a tap while open re-closes.
        if (offset !== 0) {
            setOffset(0);
            return;
        }
        onOpen?.();
    };
    return (_jsxs("div", { ref: ref, style: {
            position: "relative",
            borderRadius: "var(--skl-radius-card)",
            overflow: "hidden",
            fontFamily: "var(--skl-font-sans)",
            ...style,
        }, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), children: [actions.length > 0 && (_jsx("div", { "aria-hidden": offset === 0, style: {
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    justifyContent: "flex-end",
                }, children: actions.slice(0, 3).map((a) => (_jsxs("button", { onClick: () => {
                        a.onClick();
                        setOffset(0);
                    }, tabIndex: offset === 0 ? -1 : 0, "aria-label": a.label, style: {
                        width: 64,
                        border: "none",
                        cursor: "pointer",
                        color: "#fff",
                        background: trayColor(a),
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                        fontSize: 11,
                        fontWeight: 600,
                    }, children: [a.icon, a.label] }, a.key))) })), _jsxs("div", { role: onOpen ? "button" : undefined, tabIndex: onOpen ? 0 : undefined, onClick: onClickRow, onKeyDown: (e) => {
                    if (onOpen && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onClickRow();
                    }
                }, onPointerDown: onPointerDown, onPointerMove: onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag, style: {
                    position: "relative",
                    display: "flex",
                    alignItems: "stretch",
                    background: "var(--skl-color-surface)",
                    border: "1px solid var(--skl-color-border)",
                    borderRadius: "var(--skl-radius-card)",
                    overflow: "hidden",
                    transform: `translateX(${offset}px)`,
                    transition: drag.current ? "none" : "transform 0.18s ease",
                    opacity: busy ? 0.5 : 1,
                    cursor: onOpen ? "pointer" : "default",
                    touchAction: "pan-y",
                }, children: [_jsx(Tile, { leading: leading }), _jsxs("div", { style: { padding: "13px 14px", flex: 1, minWidth: 0, alignSelf: "center" }, children: [_jsx("div", { style: {
                                    fontWeight: 800,
                                    fontSize: 16,
                                    color: "var(--skl-color-text)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }, children: title }), subline != null && subline !== "" && (_jsx("div", { style: {
                                    fontWeight: 500,
                                    fontSize: 13,
                                    color: "var(--skl-color-text-muted)",
                                    marginTop: 3,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }, children: subline }))] }), stat && (_jsxs("div", { style: { alignSelf: "center", textAlign: "right", paddingRight: 14, flex: "0 0 auto" }, children: [_jsx("div", { style: {
                                    fontWeight: 800,
                                    fontSize: 20,
                                    color: "var(--skl-color-text)",
                                    fontVariantNumeric: "tabular-nums",
                                }, children: stat.value }), _jsx("div", { style: {
                                    fontWeight: 600,
                                    fontSize: 9.5,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.4,
                                    color: "var(--skl-color-text-faint)",
                                }, children: stat.label })] })), actions.length > 0 && (_jsx("button", { "aria-label": "Record actions", onClick: (e) => {
                            e.stopPropagation();
                            setMenuOpen((o) => !o);
                        }, style: {
                            flex: "0 0 auto",
                            alignSelf: "center",
                            width: 34,
                            height: 34,
                            marginRight: 8,
                            padding: 0,
                            display: "grid",
                            placeItems: "center",
                            border: "none",
                            background: "transparent",
                            borderRadius: 8,
                            color: "var(--skl-color-text-faint)",
                            cursor: "pointer",
                            opacity: hover || menuOpen ? 1 : 0,
                            transition: "opacity 0.12s ease",
                        }, children: _jsx(MoreVertical, { size: 18 }) }))] }), menuOpen && actions.length > 0 && (_jsx("div", { role: "menu", style: {
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    minWidth: 150,
                    background: "var(--skl-color-surface)",
                    border: "1px solid var(--skl-color-border)",
                    borderRadius: "var(--skl-radius-control)",
                    boxShadow: "var(--skl-shadow-menu)",
                    overflow: "hidden",
                    padding: 4,
                }, children: actions.map((a) => (_jsxs("button", { role: "menuitem", onClick: (e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        a.onClick();
                    }, style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "8px 10px",
                        border: "none",
                        background: "transparent",
                        borderRadius: 7,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 500,
                        textAlign: "left",
                        color: a.tone === "danger" ? "#dc2626" : "var(--skl-color-text)",
                    }, children: [a.icon, a.label] }, a.key))) }))] }));
}
function trayColor(a) {
    if (a.tone === "danger")
        return "#dc2626";
    if (a.key === "edit")
        return "var(--skl-color-brand)";
    return "var(--skl-color-text-muted)";
}
function Tile({ leading }) {
    const base = {
        width: TILE,
        flex: "0 0 auto",
        display: "grid",
        placeItems: "center",
    };
    if (leading.kind === "emoji") {
        return _jsx("div", { style: { ...base, background: "var(--skl-color-tile)", fontSize: 30 }, children: leading.emoji });
    }
    if (leading.kind === "glyph") {
        return (_jsx("div", { style: { ...base, background: "var(--skl-color-tile)", color: leading.tint ?? "var(--skl-color-text-muted)" }, children: leading.node }));
    }
    if (leading.kind === "gradient") {
        return _jsx("div", { style: { ...base, background: leading.gradient, color: "#fff" }, children: leading.node });
    }
    return (_jsx("div", { style: { ...base }, children: _jsx("img", { src: leading.src, alt: leading.alt ?? "", style: { width: "100%", height: "100%", objectFit: "cover" } }) }));
}

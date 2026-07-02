import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { ArrowUpDown, Plus } from "lucide-react";
/**
 * The slim bar that replaces the old "Records · Add record · fields" block:
 * a record count on the left, Sort + Add on the right. Requires
 * `@skipleague/design/tokens.css`.
 */
export function ListActionBar({ count, noun = "record", onSort, sortLabel = "Sort", onAdd, addLabel = "Add", style, }) {
    return (_jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--skl-font-sans)",
            ...style,
        }, children: [_jsxs("span", { style: { fontWeight: 600, fontSize: 12.5, color: "var(--skl-color-text-muted)" }, children: [count, " ", count === 1 ? noun : `${noun}s`] }), _jsxs("div", { style: { display: "flex", gap: 8 }, children: [onSort && (_jsxs("button", { onClick: onSort, style: {
                            height: 30,
                            padding: "0 11px",
                            borderRadius: 8,
                            border: "1px solid var(--skl-color-border)",
                            background: "var(--skl-color-surface)",
                            color: "#475569",
                            fontWeight: 600,
                            fontSize: 12,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            cursor: "pointer",
                        }, children: [_jsx(ArrowUpDown, { size: 14 }), sortLabel] })), onAdd && (_jsxs("button", { onClick: onAdd, style: {
                            height: 30,
                            padding: "0 12px",
                            borderRadius: 8,
                            border: "none",
                            background: "var(--skl-color-brand)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 12,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            cursor: "pointer",
                        }, children: [_jsx(Plus, { size: 14 }), addLabel] }))] })] }));
}

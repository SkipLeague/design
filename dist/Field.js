import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { controlStyle } from "./styles.js";
/** A labeled form row: a label, the control (children), and an optional hint. */
export function Field({ label, hint, children, }) {
    return (_jsxs("div", { style: { fontFamily: "var(--skl-font-sans)" }, children: [_jsx("label", { style: { display: "block", fontSize: "var(--skl-text-sm)", fontWeight: 500, marginBottom: 4, color: "var(--skl-color-text)" }, children: label }), children, hint && (_jsx("p", { style: { margin: "0.25rem 0 0", fontSize: "var(--skl-text-xs)", color: "var(--skl-color-text-muted)" }, children: hint }))] }));
}
/** A styled text input. */
export function Input({ style, disabled, ...props }) {
    return (_jsx("input", { ...props, disabled: disabled, style: {
            ...controlStyle,
            ...(disabled ? { background: "var(--skl-color-surface-muted)", color: "var(--skl-color-text-muted)" } : {}),
            ...style,
        } }));
}

import { jsx as _jsx } from "react/jsx-runtime";
import { controlStyle } from "./styles.js";
/** A styled select. Pass `<option>`s as children. */
export function Select({ style, children, ...props }) {
    return (_jsx("select", { ...props, style: { ...controlStyle, ...style }, children: children }));
}

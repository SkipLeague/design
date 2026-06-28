import type { SelectHTMLAttributes } from "react";
import { controlStyle } from "./styles.js";

/** A styled select. Pass `<option>`s as children. */
export function Select({ style, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} style={{ ...controlStyle, ...style }}>
      {children}
    </select>
  );
}

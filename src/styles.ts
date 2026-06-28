import type { CSSProperties } from "react";

/** Base style shared by text inputs and selects. */
export const controlStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.625rem 0.75rem",
  fontFamily: "var(--skl-font-sans)",
  fontSize: "var(--skl-text-sm)",
  color: "var(--skl-color-text)",
  background: "var(--skl-color-surface)",
  border: "1px solid var(--skl-color-border)",
  borderRadius: "var(--skl-radius-md)",
};

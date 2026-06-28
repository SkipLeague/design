import type { ButtonHTMLAttributes, CSSProperties } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** "primary" = brand-green fill (default); "secondary" = white with a border. */
  variant?: "primary" | "secondary";
}

/** The standard SkipLeague button. Token-driven; matches the apps' primary action. */
export function Button({ variant = "primary", style, disabled, ...props }: ButtonProps) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontFamily: "var(--skl-font-sans)",
    fontSize: "var(--skl-text-sm)",
    fontWeight: 600,
    padding: "0.625rem 1.25rem",
    borderRadius: "var(--skl-radius-md)",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.6 : 1,
    border: "1px solid transparent",
    ...(variant === "primary"
      ? { background: "var(--skl-color-brand)", color: "#fff" }
      : { background: "var(--skl-color-surface)", color: "var(--skl-color-text)", borderColor: "var(--skl-color-border)" }),
  };
  return <button {...props} disabled={disabled} style={{ ...base, ...style }} />;
}

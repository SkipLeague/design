import type { InputHTMLAttributes, ReactNode } from "react";
import { controlStyle } from "./styles.js";

/** A labeled form row: a label, the control (children), and an optional hint. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ fontFamily: "var(--skl-font-sans)" }}>
      <label style={{ display: "block", fontSize: "var(--skl-text-sm)", fontWeight: 500, marginBottom: 4, color: "var(--skl-color-text)" }}>
        {label}
      </label>
      {children}
      {hint && (
        <p style={{ margin: "0.25rem 0 0", fontSize: "var(--skl-text-xs)", color: "var(--skl-color-text-muted)" }}>{hint}</p>
      )}
    </div>
  );
}

/** A styled text input. */
export function Input({ style, disabled, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      disabled={disabled}
      style={{
        ...controlStyle,
        ...(disabled ? { background: "var(--skl-color-surface-muted)", color: "var(--skl-color-text-muted)" } : {}),
        ...style,
      }}
    />
  );
}

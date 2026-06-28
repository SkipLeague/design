import type { CSSProperties, ReactNode } from "react";

/**
 * A section card: an optional heading above a white, bordered, rounded container —
 * the standard grouping used on the account/settings pages.
 */
export function Card({
  title,
  children,
  style,
}: {
  title?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section style={{ fontFamily: "var(--skl-font-sans)", ...style }}>
      {title && (
        <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem", fontWeight: 600, color: "var(--skl-color-text)" }}>{title}</h3>
      )}
      <div
        style={{
          background: "var(--skl-color-surface)",
          border: "1px solid var(--skl-color-border)",
          borderRadius: "var(--skl-radius-panel)",
          padding: "1rem",
        }}
      >
        {children}
      </div>
    </section>
  );
}

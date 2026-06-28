import type { CSSProperties } from "react";

/**
 * The square letter-logo for a SkipLeague app — the first letter of the name
 * with the "Skip" prefix dropped (e.g. "SkipLists" → "L"). Brand-green.
 */
export function AppBadge({ name, size = 20 }: { name: string; size?: number }) {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    borderRadius: "var(--skl-radius-badge)",
    background: "var(--skl-color-brand)",
    color: "#fff",
    fontSize: "var(--skl-text-2xs)",
    fontWeight: 700,
    flexShrink: 0,
  };
  return (
    <span style={style} aria-hidden>
      {name.replace(/^Skip/, "").charAt(0)}
    </span>
  );
}

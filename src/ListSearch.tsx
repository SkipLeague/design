import type { CSSProperties } from "react";
import { Search } from "lucide-react";

export interface ListSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** "md" (40px, default) or "lg" (44px — the no-hero Artwork variant). */
  size?: "md" | "lg";
  "aria-label"?: string;
  style?: CSSProperties;
}

/**
 * The search field that leads every list body (directly under the header). The
 * "lg" size is used on lists with no hero, where search leads the body.
 * Requires `@skipleague/design/tokens.css`.
 */
export function ListSearch({
  value,
  onChange,
  placeholder = "Search",
  size = "md",
  style,
  ...rest
}: ListSearchProps) {
  const big = size === "lg";
  return (
    <div style={{ position: "relative", fontFamily: "var(--skl-font-sans)", ...style }}>
      <Search
        size={big ? 18 : 17}
        style={{
          position: "absolute",
          left: 13,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--skl-color-text-faint)",
          pointerEvents: "none",
        }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={rest["aria-label"] ?? placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          height: big ? 44 : 40,
          padding: "0 13px 0 38px",
          borderRadius: big ? 12 : 11,
          border: "1px solid var(--skl-color-border)",
          background: "var(--skl-color-surface)",
          color: "var(--skl-color-text)",
          fontWeight: 500,
          fontSize: big ? 14.5 : 14,
          outline: "none",
        }}
      />
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";

export interface StatBandStat {
  value: ReactNode;
  label: string;
}

export interface StatBandHeroProps {
  /** Equal cells split by hairline dividers (Trips uses trips/nights/states/countries). */
  stats: StatBandStat[];
  style?: CSSProperties;
}

/**
 * The Trips-style contextual hero: a white card of equal stat cells split by
 * 1px dividers. Requires `@skipleague/design/tokens.css`.
 */
export function StatBandHero({ stats, style }: StatBandHeroProps) {
  return (
    <div
      style={{
        display: "flex",
        overflow: "hidden",
        background: "var(--skl-color-surface)",
        border: "1px solid var(--skl-color-border)",
        borderRadius: "var(--skl-radius-card)",
        fontFamily: "var(--skl-font-sans)",
        ...style,
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            padding: "12px 6px",
            textAlign: "center",
            borderLeft: i === 0 ? "none" : "1px solid var(--skl-color-divider)",
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 21,
              color: "var(--skl-color-text)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {s.value}
          </div>
          <div style={{ fontWeight: 600, fontSize: 10, color: "var(--skl-color-text-muted)", marginTop: 2 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

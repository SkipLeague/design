import type { CSSProperties } from "react";
import { ArrowUpDown, Plus } from "lucide-react";

export interface ListActionBarProps {
  /** Record count shown on the left (e.g. 18 → "18 records"). */
  count: number;
  /** Noun for the count (default "record" → "records"). */
  noun?: string;
  /** Sort control; omit to hide. */
  onSort?: () => void;
  sortLabel?: string;
  /** Add control; omit to hide. */
  onAdd?: () => void;
  addLabel?: string;
  style?: CSSProperties;
}

/**
 * The slim bar that replaces the old "Records · Add record · fields" block:
 * a record count on the left, Sort + Add on the right. Requires
 * `@skipleague/design/tokens.css`.
 */
export function ListActionBar({
  count,
  noun = "record",
  onSort,
  sortLabel = "Sort",
  onAdd,
  addLabel = "Add",
  style,
}: ListActionBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "var(--skl-font-sans)",
        ...style,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 12.5, color: "var(--skl-color-text-muted)" }}>
        {count} {count === 1 ? noun : `${noun}s`}
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        {onSort && (
          <button
            onClick={onSort}
            style={{
              height: 30,
              padding: "0 11px",
              borderRadius: 8,
              border: "1px solid var(--skl-color-border)",
              background: "var(--skl-color-surface)",
              color: "#475569",
              fontWeight: 600,
              fontSize: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <ArrowUpDown size={14} />
            {sortLabel}
          </button>
        )}
        {onAdd && (
          <button
            onClick={onAdd}
            style={{
              height: 30,
              padding: "0 12px",
              borderRadius: 8,
              border: "none",
              background: "var(--skl-color-brand)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              cursor: "pointer",
            }}
          >
            <Plus size={14} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

import type { CSSProperties } from "react";
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
export declare function ListActionBar({ count, noun, onSort, sortLabel, onAdd, addLabel, style, }: ListActionBarProps): import("react").JSX.Element;

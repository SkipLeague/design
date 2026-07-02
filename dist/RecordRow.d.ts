import { type CSSProperties, type ReactNode } from "react";
/**
 * The leading 64px tile of a record row. One of:
 * - `emoji`  — a big emoji (flags for Countries/Trips) on the slate tile
 * - `glyph`  — a stroke icon tinted on the slate tile (generic lists)
 * - `gradient` — a pastel gradient with a white glyph (Artwork placeholder)
 * - `image`  — a real photo, cover-cropped (Artwork with a photo)
 */
export type RecordRowLeading = {
    kind: "emoji";
    emoji: string;
} | {
    kind: "glyph";
    node: ReactNode;
    tint?: string;
} | {
    kind: "gradient";
    gradient: string;
    node?: ReactNode;
} | {
    kind: "image";
    src: string;
    alt?: string;
};
export interface RecordRowAction {
    key: string;
    label: string;
    icon?: ReactNode;
    tone?: "default" | "danger";
    onClick: () => void;
}
export interface RecordRowProps {
    leading: RecordRowLeading;
    /** Primary line — the record's title. */
    title: ReactNode;
    /** Secondary line — a single ellipsised line of context. */
    subline?: ReactNode;
    /** Right-aligned stat. Omit where a running number is meaningless (Artwork). */
    stat?: {
        value: ReactNode;
        label: string;
    };
    /** Whole-row tap (opens the record). */
    onOpen?: () => void;
    /**
     * Edit / duplicate / delete. Surfaced behind swipe (touch) and a `⋯` menu
     * (pointer) — never as always-visible inline buttons.
     */
    actions?: RecordRowAction[];
    /** Dim + disable interaction while a mutation is in flight. */
    busy?: boolean;
    style?: CSSProperties;
}
/** Standard convenience actions so callers don't re-declare the common three. */
export declare function recordRowActions(handlers: {
    onEdit?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
}): RecordRowAction[];
/**
 * A record row in the "stat-forward, refined" list system: a leading tile, a
 * title + subline, and an optional trailing stat. Actions live behind a swipe
 * (touch) or a `⋯` menu (pointer) instead of the old three inline buttons.
 *
 * Requires `@skipleague/design/tokens.css`.
 */
export declare function RecordRow({ leading, title, subline, stat, onOpen, actions, busy, style, }: RecordRowProps): import("react").JSX.Element;

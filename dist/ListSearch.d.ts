import type { CSSProperties } from "react";
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
export declare function ListSearch({ value, onChange, placeholder, size, style, ...rest }: ListSearchProps): import("react").JSX.Element;

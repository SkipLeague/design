import type { CSSProperties, ReactNode } from "react";
/**
 * A section card: an optional heading above a white, bordered, rounded container —
 * the standard grouping used on the account/settings pages.
 */
export declare function Card({ title, children, style, }: {
    title?: string;
    children: ReactNode;
    style?: CSSProperties;
}): import("react").JSX.Element;

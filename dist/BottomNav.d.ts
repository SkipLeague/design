import type { ReactNode } from "react";
export interface BottomNavTab {
    label: string;
    /** 24px line icon (stroke 2, currentColor) — inherits the cell's color. */
    icon: ReactNode;
    /** Current tab (accent color, bold). Derive from your router. */
    active?: boolean;
    /**
     * "Tab Colors" option — a per-tab accent (any CSS color). When set and this
     * tab is active, its icon/label AND the center button + glow use this color
     * instead of the default brand. Omit on every tab to keep the standard
     * single-color bar (the default). Provide a color per tab for an app whose
     * tabs each have their own identity (e.g. SkipGifts).
     */
    color?: string;
    onClick?: () => void;
}
export interface BottomNavAction {
    /** Short visual label under the "+" (e.g. "List", "Match"). */
    label: string;
    /**
     * Accessible name for the action control, announced to screen-reader and
     * voice-control users. Use a verb phrase ("New list", "Log match") so the
     * button isn't read as a bare noun confusable with a tab. Falls back to
     * `label`. The visual label always stays `label`; per WCAG 2.5.3, keep
     * `label`'s text inside `ariaLabel` (e.g. label "List" → ariaLabel "New list").
     */
    ariaLabel?: string;
    /** The "+" glyph (white, ~26px, stroke 2.4). Inherits white from the button. */
    icon: ReactNode;
    onClick?: () => void;
}
export interface BottomNavProps {
    /** 2–8 tabs, split evenly around the center action. */
    tabs: BottomNavTab[];
    /** The floating center "+" button and its label. */
    action: BottomNavAction;
    /** Optional grouped-header band; even tab counts only. */
    groups?: [string, string];
}
export declare function BottomNav({ tabs, action, groups }: BottomNavProps): import("react").JSX.Element;

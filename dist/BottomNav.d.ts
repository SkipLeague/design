import type { ReactNode } from "react";
export interface BottomNavTab {
    label: string;
    /** 24px line icon (stroke 2, currentColor) — inherits the cell's color. */
    icon: ReactNode;
    /** Current tab (brand color, bold). Derive from your router. */
    active?: boolean;
    onClick?: () => void;
}
export interface BottomNavAction {
    label: string;
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

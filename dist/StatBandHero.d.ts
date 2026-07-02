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
export declare function StatBandHero({ stats, style }: StatBandHeroProps): import("react").JSX.Element;

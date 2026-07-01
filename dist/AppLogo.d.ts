/** A SkipLeague app's logo glyph (monoline, drawn on the brand tile). */
export type AppGlyph = "lists" | "racquetball" | "trips" | "gifts" | "reading" | "today" | "guide" | "flow";
/**
 * The per-app logo mark — a brand-green rounded tile holding a white monoline
 * glyph. Replaces the single-letter {@link AppBadge}; gives each SkipLeague app a
 * distinct mark for the top bar, app switcher, and home screens.
 */
export declare function AppLogo({ app, size, bg, glyph, }: {
    app: AppGlyph;
    size?: number;
    bg?: string;
    glyph?: string;
}): import("react").JSX.Element;

/** A SkipLeague app's logo glyph (monoline, drawn on the brand tile). */
export type AppGlyph = "lists" | "racquetball" | "trips" | "gifts" | "reading" | "today" | "guide" | "flow";
/** Every app that has a glyph, for slug→glyph resolution and fallbacks. */
export declare const APP_GLYPHS: readonly AppGlyph[];
/**
 * Resolve a platform app slug (e.g. `"skipracquetball"`) to its {@link AppGlyph}
 * by dropping the `skip` prefix, or `null` when no glyph exists for it (so a
 * caller can fall back to a letter {@link AppBadge}). Case-insensitive.
 */
export declare function appGlyphForSlug(slug: string): AppGlyph | null;
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

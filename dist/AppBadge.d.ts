/**
 * The square letter-logo for a SkipLeague app — the first letter of the name
 * with the "Skip" prefix dropped (e.g. "SkipLists" → "L"). Brand-green.
 *
 * At the default 20px it uses the badge radius and the 2xs text size, as the
 * app switcher always has. Larger sizes (e.g. the {@link AppLauncher} grid)
 * scale the letter and corner radius with the tile, matching {@link AppLogo}.
 */
export declare function AppBadge({ name, size }: {
    name: string;
    size?: number;
}): import("react").JSX.Element;

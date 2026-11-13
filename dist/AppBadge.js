import { jsx as _jsx } from "react/jsx-runtime";
/**
 * The square letter-logo for a SkipLeague app — the first letter of the name
 * with the "Skip" prefix dropped (e.g. "SkipLists" → "L"). Brand-green.
 *
 * At the default 20px it uses the badge radius and the 2xs text size, as the
 * app switcher always has. Larger sizes (e.g. the {@link AppLauncher} grid)
 * scale the letter and corner radius with the tile, matching {@link AppLogo}.
 */
export function AppBadge({ name, size = 20 }) {
    const style = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: size > 20 ? Math.round(size * 0.32) : "var(--skl-radius-badge)",
        background: "var(--skl-color-brand)",
        color: "#fff",
        fontSize: size > 20 ? Math.round(size * 0.46) : "var(--skl-text-2xs)",
        fontWeight: 700,
        flexShrink: 0,
    };
    return (_jsx("span", { style: style, "aria-hidden": true, children: name.replace(/^Skip/, "").charAt(0) }));
}

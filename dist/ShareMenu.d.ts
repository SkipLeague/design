/**
 * The top-bar Share dropdown (design_handoff_top_bar). A self-contained trigger
 * (the upload glyph, styled like a {@link TopBarIconButton}) + an anchored menu —
 * same open/dismiss model as ProfileMenu (click, outside-click, Escape).
 *
 * `noun` names the thing being shared ("players" → "Share players"). Pass the
 * handlers you support; omitted items are hidden.
 */
export declare function ShareMenu({ noun, compact, onCopyLink, onMessages, onEmail, onMore, }: {
    noun: string;
    compact?: boolean;
    onCopyLink?: () => void;
    onMessages?: () => void;
    onEmail?: () => void;
    onMore?: () => void;
}): import("react").JSX.Element;

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { type AppGlyph } from "./AppLogo.js";
import { type ProfileMenuProps } from "./ProfileMenu.js";
/** Bar surface tone: `dark` = the green header (default), `light` = white bar. */
export type TopBarTone = "dark" | "light";
/**
 * The shared SkipLeague app bar (design_handoff_top_bar → design_handoff_desktop_action_bar).
 * Also exported as `DesktopActionBar` — the same component under the newer name;
 * migrate imports opportunistically and drop the alias once nothing uses `TopBar`.
 *
 * ONE bar for every app + breakpoint. It spans the full top row on both mobile
 * and desktop; on desktop the app adds a left sidebar (see {@link SidebarNav})
 * BELOW the bar — the bar itself is unchanged. Layout is identical across apps;
 * only the logo glyph, wordmark, tone, and which actions are enabled change:
 *
 *   [AppLogo + wordmark] ........ [ search inbox members share overflow ][ actions ][ ProfileMenu ]
 *
 * - ProfileMenu is pinned to the far right on every page (the persistent slot).
 * - The named action toggles render in a FIXED left→right order
 *   (search → inbox → members → share → overflow), each only when its `show*`
 *   flag is set, so the same action looks identical in every app.
 * - `actions` is an escape hatch for one-off contextual buttons; render zero or
 *   more {@link TopBarIconButton}s. They sit between the named cluster and the
 *   ProfileMenu.
 * - The app name appears ONLY here, never repeated in the sidebar.
 */
export declare function TopBar({ app, appName, tone, actions, compact, showSearch, showInbox, showMembers, showShare, showOverflow, onSearch, onInbox, onMembers, onShare, onOverflow, ...profile }: {
    app: AppGlyph;
    appName: string;
    /** Bar surface tone. `dark` (green header) is the default. */
    tone?: TopBarTone;
    /** One-off contextual buttons, rendered between the named cluster and ProfileMenu. */
    actions?: ReactNode;
    /** Mobile sizing (52px bar) vs the default 56px. */
    compact?: boolean;
    /** Named action toggles — each renders a ghost icon button when true, in fixed order. */
    showSearch?: boolean;
    showInbox?: boolean;
    showMembers?: boolean;
    showShare?: boolean;
    showOverflow?: boolean;
    onSearch?: () => void;
    onInbox?: () => void;
    onMembers?: () => void;
    onShare?: () => void;
    onOverflow?: () => void;
} & Pick<ProfileMenuProps, "user" | "currentSlug" | "apps" | "enabledSlugs" | "accountUrl" | "onSignOut" | "renderLink" | "onSignIn">): import("react").JSX.Element;
/**
 * A ghost (borderless-fill) icon button for the app bar — the named actions use
 * it, and apps pass their own for one-off `actions`. Give it a 17px line icon
 * (stroke 2, currentColor) as children. Styling tracks the bar `tone`.
 */
export declare function TopBarIconButton({ tone, compact, style, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    tone?: TopBarTone;
    compact?: boolean;
}): import("react").JSX.Element;
/**
 * Alias for {@link TopBar} under its platform-app-bar name. Same component,
 * same props — use whichever import name the app standardizes on.
 */
export { TopBar as DesktopActionBar };

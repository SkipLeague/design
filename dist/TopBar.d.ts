import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { type AppGlyph } from "./AppLogo.js";
import { type ProfileMenuProps } from "./ProfileMenu.js";
/**
 * The shared SkipLeague top bar (design_handoff_top_bar, Option A — dark).
 *
 * Layout is identical across apps; only the logo glyph, wordmark, and the
 * contextual action slot change:
 *   [AppLogo + wordmark] ........ [ ...actions ][ ProfileMenu ]
 *
 * - ProfileMenu is pinned to the far right on every page (the persistent slot).
 * - `actions` is the contextual slot (Print / Share / …) — render zero or more
 *   {@link TopBarIconButton}s; they appear left of the ProfileMenu only when the
 *   current page offers them.
 */
export declare function TopBar({ app, appName, actions, compact, ...profile }: {
    app: AppGlyph;
    appName: string;
    /** Contextual page actions (Print/Share buttons) rendered left of ProfileMenu. */
    actions?: ReactNode;
    /** Mobile sizing (48px bar) vs the default 54px. */
    compact?: boolean;
} & Pick<ProfileMenuProps, "user" | "currentSlug" | "apps" | "enabledSlugs" | "accountUrl" | "onSignOut" | "renderLink" | "onSignIn">): import("react").JSX.Element;
/**
 * A contextual top-bar action button (Print, Share, …) styled for the dark bar.
 * Pass a 17–18px line icon (stroke 2, currentColor) as children.
 */
export declare function TopBarIconButton({ compact, style, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    compact?: boolean;
}): import("react").JSX.Element;

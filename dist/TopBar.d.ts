import { type ButtonHTMLAttributes, type ReactNode, type RefObject } from "react";
import { type AppGlyph } from "./AppLogo.js";
import { type ProfileMenuProps } from "./ProfileMenu.js";
/** Bar surface tone: `dark` = the green header (default), `light` = white bar. */
export type TopBarTone = "dark" | "light";
/** The one bar height, in px, on every app and breakpoint (safe-area inset added on top). */
export declare const TOP_BAR_HEIGHT = 48;
/** Side padding, in px, on every app and breakpoint (safe-area insets added on top). */
export declare const TOP_BAR_SIDE_PADDING = 16;
/**
 * True once the page (or `container`, when given) has scrolled past `threshold`
 * px. Drives the bar's scroll shadow: flat at the top of a page, a soft shadow
 * once content slides underneath it. Exported for apps that build their own
 * header but want the same behavior.
 */
export declare function useScrolledPast(container?: RefObject<HTMLElement | null>, threshold?: number): boolean;
/**
 * The product wordmark, two-tone: "Skip" in white, the product name in mint
 * (brand-bright) on the dark bar; on the light bar, "Skip" in the text color
 * and the product name in brand teal. Anything that is not a one-word
 * "Skip<Name>" (e.g. "SkipLeague Home") renders in one color.
 */
export declare function TopBarWordmark({ appName, tone, size, }: {
    appName: string;
    tone?: TopBarTone;
    size?: number;
}): import("react").JSX.Element;
type ProfileProps = Pick<ProfileMenuProps, "user" | "currentSlug" | "apps" | "enabledSlugs" | "accountUrl" | "homeUrl" | "homeIsCurrent" | "onSignOut" | "renderLink" | "onSignIn">;
/**
 * The shared SkipLeague app bar (design_handoff_top_bar → design_handoff_desktop_action_bar,
 * then the November 2026 top-bar refresh). Also exported as `DesktopActionBar`.
 *
 * ONE bar for every app + breakpoint: 48px tall, 16px side padding, a 26px logo
 * tile and a two-tone wordmark ("Skip" white, product name mint), on phone,
 * iPad and desktop alike. It spans the full top row; on desktop the app adds a
 * left sidebar BELOW the bar.
 *
 *   [AppLogo + wordmark] ........ [ search inbox members share overflow ][ actions ][ ProfileMenu ]
 *
 * - Pinned by default (`position: sticky; top: 0`), which is what makes Safari
 *   tint its toolbar to the bar color. Render it as a direct child of the page's
 *   top-level column: a wrapper exactly as tall as the bar leaves sticky no
 *   room to stick. Pass `sticky={false}` for a bar inside a sheet or card.
 * - A soft shadow fades in once content scrolls under it. It watches the window
 *   by default; pass `scrollContainer` when the app scrolls an inner pane
 *   instead (e.g. a mobile shell's middle pane).
 * - ProfileMenu is pinned to the far right on every page (the persistent slot).
 * - The named action toggles render in a FIXED left→right order
 *   (search → inbox → members → share → overflow), each only when its `show*`
 *   flag is set, so the same action looks identical in every app.
 * - `actions` is an escape hatch for one-off contextual buttons; render zero or
 *   more {@link TopBarIconButton}s. They sit between the named cluster and the
 *   ProfileMenu.
 * - The app name appears ONLY here, never repeated in the sidebar.
 * - Safe areas: the bar pads itself by `env(safe-area-inset-top)` and the left
 *   and right insets, so under `viewport-fit=cover` (the iSkip app, and a
 *   home-screen web app with `black-translucent`) its content clears the status
 *   bar and the notch while its background still fills behind them. Pass
 *   `safeArea={false}` when the bar is not at the top edge of the screen.
 * - On a phone drill-in screen, use {@link TopBarDetail} instead: same bar,
 *   with Back and the page title in place of the logo.
 */
export declare function TopBar({ app, appName, tone, actions, compact: _compact, showSearch, showInbox, showMembers, showShare, showOverflow, onSearch, onInbox, onMembers, onShare, onOverflow, safeArea, sticky, scrollContainer, ...profile }: {
    app: AppGlyph;
    appName: string;
    /** Bar surface tone. `dark` (green header) is the default. */
    tone?: TopBarTone;
    /** One-off contextual buttons, rendered between the named cluster and ProfileMenu. */
    actions?: ReactNode;
    /**
     * @deprecated No effect since 0.18.0: the bar is 48px with 16px sides on every
     * breakpoint. Kept so existing call sites compile; drop it when convenient.
     */
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
    /**
     * Pad for the device safe areas (top, left, right). Default `true`: the bar
     * normally sits at the top edge of the screen. Set `false` for a bar rendered
     * somewhere else (inside a sheet or a card).
     */
    safeArea?: boolean;
    /** Pin to the top of the scroll area (default `true`). */
    sticky?: boolean;
    /** The element that scrolls, when it is not the window. Drives the scroll shadow. */
    scrollContainer?: RefObject<HTMLElement | null>;
} & ProfileProps): import("react").JSX.Element;
/**
 * The app bar for a drill-in screen on a phone (a list, a match, a trip, a
 * book): the same 48px bar as {@link TopBar}, with Back, a small two-tone app
 * name and the page title in place of the logo and wordmark. It replaces both a
 * separate back bar and the repeated page-title row beneath it.
 *
 *   [‹] SkipLists           ........ [ actions ][ ProfileMenu ]
 *       Groceries
 *
 * Top-level screens keep {@link TopBar}. On iPad and desktop, keep TopBar and
 * the page's own large title: space is not tight there.
 */
export declare function TopBarDetail({ appName, title, subtitle, onBack, backLabel, tone, actions, safeArea, sticky, scrollContainer, ...profile }: {
    appName: string;
    /** The page title, e.g. the list or book name. Truncates with an ellipsis. */
    title: string;
    /** Optional second line in place of the app name (e.g. "Custom list"). */
    subtitle?: string;
    onBack: () => void;
    /** Accessible label + tooltip for Back (default "Back"). */
    backLabel?: string;
    tone?: TopBarTone;
    /** Contextual buttons ({@link TopBarIconButton}s), before the ProfileMenu. */
    actions?: ReactNode;
    safeArea?: boolean;
    sticky?: boolean;
    scrollContainer?: RefObject<HTMLElement | null>;
} & ProfileProps): import("react").JSX.Element;
/**
 * A ghost (borderless-fill) icon button for the app bar — the named actions use
 * it, and apps pass their own for one-off `actions`. Give it a 17px line icon
 * (stroke 2, currentColor) as children. Styling tracks the bar `tone`.
 */
export declare function TopBarIconButton({ tone, compact, style, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    tone?: TopBarTone;
    /** @deprecated No effect since 0.18.0: one 34px size everywhere. */
    compact?: boolean;
}): import("react").JSX.Element;
/**
 * The Back affordance for a drill-in / detail screen's app bar — a
 * {@link TopBarIconButton} carrying a left chevron, so every app's back button
 * looks and behaves identically (same tone-aware ghost styling as Search,
 * Share, ProfileMenu, etc.). Pair it with the app's router, e.g.
 * `<TopBarBackButton onClick={() => navigate(-1)} />`.
 *
 * Works on both a full {@link TopBar} (pass it via `actions`, though back
 * usually sits on the LEFT — apps that build a contextual detail header place it
 * directly) and a bespoke contextual header.
 */
export declare function TopBarBackButton({ tone, compact, label, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    tone?: TopBarTone;
    compact?: boolean;
    /** Accessible label + tooltip (default "Back"). */
    label?: string;
}): import("react").JSX.Element;
/**
 * Alias for {@link TopBar} under its platform-app-bar name. Same component,
 * same props — use whichever import name the app standardizes on.
 */
export { TopBar as DesktopActionBar };

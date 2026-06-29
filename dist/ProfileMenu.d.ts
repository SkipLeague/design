import { type CSSProperties, type ReactNode } from "react";
import { type AppLink } from "./apps.js";
export interface ProfileMenuUser {
    displayName?: string | null;
    email?: string | null;
}
/** Args passed to a custom `renderLink` for internal (in-app) menu links. */
export interface ProfileMenuLinkArgs {
    href: string;
    role?: string;
    style?: CSSProperties;
    children: ReactNode;
}
export interface ProfileMenuProps {
    /** The signed-in user (name + email shown at the top of the menu). */
    user?: ProfileMenuUser;
    /**
     * Slug of the app you're currently in (e.g. "skipracquetball"). That app's row
     * is highlighted light-green and non-clickable. Omit on the platform apex.
     */
    currentSlug?: string;
    /** Apps to list in the switcher. Defaults to the live SkipLeague apps. */
    apps?: AppLink[];
    /**
     * Slugs of the apps THIS user has enabled (e.g. the platform's `app_slugs`).
     * When provided, the switcher shows only those apps (the current app is always
     * kept), so every app shows the same "your apps" set without each one
     * re-implementing the filter. Omit to list every app in `apps`.
     */
    enabledSlugs?: string[];
    /** Target of the "Manage account" link. Defaults to the platform account page. */
    accountUrl?: string;
    /** Called when the user clicks "Sign out". */
    onSignOut: () => void;
    /**
     * Header tone the trigger button sits on — "dark" (default) for the apex/dark
     * headers, "light" for white headers. Only affects the button, not the menu.
     */
    tone?: "light" | "dark";
    /**
     * Render the internal "Manage account" link via your own router (e.g. React
     * Router's `<Link>`) instead of a full-page `<a href>`. App-switcher links to
     * OTHER SkipLeague apps are always plain `<a>` (cross-app navigation).
     * Example: `renderLink={({ href, ...p }) => <Link to={href} {...p} />}`.
     */
    renderLink?: (args: ProfileMenuLinkArgs) => ReactNode;
    /**
     * Mark "Manage account" as the current page — highlighted light-green and
     * non-clickable (e.g. the platform is already on /account).
     */
    accountIsCurrent?: boolean;
    /**
     * Signed-out support (platform apex): when there's no `user` AND this is
     * provided, the menu shows a single "Sign in" action instead of the
     * name / Manage-account / Sign-out items. Omit it to keep the always-signed-in
     * behavior product apps rely on.
     */
    onSignIn?: () => void;
    /** Label for the signed-out action (default "Sign in"). */
    signInLabel?: string;
}
/**
 * The canonical SkipLeague account control: a boxed user-icon button that opens
 * a dropdown with the user's name/email, an inline **app switcher** (one click to
 * jump to another SkipLeague app; the current app is highlighted and not
 * clickable), **Manage account**, and **Sign out**. Also covers the platform
 * apex via `renderLink` (SPA nav), `accountIsCurrent`, and `onSignIn`
 * (signed-out state).
 *
 * Requires `@skipleague/design/tokens.css` to be imported once at the app root.
 */
export declare function ProfileMenu({ user, currentSlug, apps, enabledSlugs, accountUrl, onSignOut, tone, renderLink, accountIsCurrent, onSignIn, signInLabel, }: ProfileMenuProps): import("react").JSX.Element;

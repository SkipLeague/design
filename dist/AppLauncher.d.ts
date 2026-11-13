import { type MouseEvent, type ReactNode } from "react";
import { type AppLifecycleStatus } from "./apps.js";
/**
 * One launcher tile. The platform's app records (`GET /me/apps`) satisfy this
 * directly; extra fields are ignored.
 */
export interface AppLauncherApp {
    /** Platform app slug, e.g. "skiptrips". Picks the glyph (letter tile when there is none). */
    slug: string;
    /** Display name, e.g. "SkipTrips". */
    name: string;
    /** Where the tile goes. An app with no URL yet is shown dimmed and is not a link. */
    url?: string | null;
    /** Lifecycle status: anything not Live gets a status dot, as in the ProfileMenu switcher. */
    status?: AppLifecycleStatus;
    /** Tooltip text (the platform's app description). */
    description?: string | null;
}
export interface AppLauncherProps {
    /** The user's apps, in the order to show them (the platform sends fleet display order). */
    apps: readonly AppLauncherApp[];
    /**
     * Called when a tile is activated, before the link is followed. Call
     * `event.preventDefault()` to handle the navigation yourself (for example the
     * iSkip shell Home opening the product's WebView).
     */
    onSelect?: (app: AppLauncherApp & {
        url: string;
    }, event: MouseEvent<HTMLAnchorElement>) => void;
    /** Shown instead of the grid when `apps` is empty. Defaults to nothing. */
    empty?: ReactNode;
    /** Accessible name for the grid. Default "Your apps". */
    label?: string;
    /**
     * Narrowest a tile may get, in px; the grid fits as many columns as the width
     * allows (auto-fill), so phone, iPad and desktop widths need no breakpoints.
     * Default 104.
     */
    minTileWidth?: number;
}
/**
 * A grid of the user's SkipLeague apps: each tile is the app's {@link AppLogo}
 * (or a letter tile when it has no glyph yet) over its name. Shared by the
 * platform dashboard ("Launch an app") and the iSkip app's Home screen, so the
 * two look and behave the same (MyEcosystem proposal section 6.2).
 *
 * Tiles are plain links to each app's URL. In a browser that opens the app; in
 * the iSkip app, pass `onSelect` to switch to the app's WebView instead.
 *
 * Requires `@skipleague/design/tokens.css` to be imported once at the app root.
 */
export declare function AppLauncher({ apps, onSelect, empty, label, minTileWidth }: AppLauncherProps): import("react").JSX.Element;

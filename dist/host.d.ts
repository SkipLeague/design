/**
 * `@skipleague/design/host`: what the page is running inside, and how to do the
 * few things that behave differently there.
 *
 * A SkipLeague product page runs either in an ordinary browser tab or inside the
 * iSkip app's product WebView (MyEcosystem ADR 0014). The app gives product
 * pages NO native bridge, so every capability here is a plain web API. The app
 * makes those APIs behave well natively (Web Share shows the system sheet, a
 * download is intercepted and handed to the share sheet, an external link opens
 * in Safari View Controller). This module is the one place product code asks
 * "can I?" and "do it", so products stay container-independent and a future
 * host (or a future approved capability) is a change here, not in nine repos.
 *
 * Rules for product code:
 * - Feature-detect with `getHost().has(cap)`. Never compare `hostVersion` or
 *   `kind` to decide whether something works.
 * - This module has no dependency on Capacitor, React, or anything else, and
 *   must stay that way: it is imported by websites.
 *
 * Proposal: MyEcosystem architecture/ISKIP_CAPACITOR_PROPOSAL.md section 3.5.
 */
/** Where the page is running. */
export type HostKind = "browser" | "skipleague-ios";
/** A capability a product can ask about with {@link SkipHost.has}. */
export type Capability = "share" | "saveFile" | "print" | "openExternal" | "openProduct" | "haptics";
/** What {@link SkipHost.share} did. */
export type ShareResult = "shared" | "cancelled" | "unsupported";
/** What {@link SkipHost.print} did. */
export type PrintResult = "printed" | "unsupported";
export interface ShareData {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
}
export interface SkipHost {
    /** `skipleague-ios` inside the iSkip app, `browser` everywhere else. */
    readonly kind: HostKind;
    /**
     * The app's host-contract version (the `n` in `(host n)`), bumped only when
     * behaviour a page can observe changes. `0` in a browser. For logging and
     * diagnostics only: decide behaviour with {@link SkipHost.has}.
     */
    readonly hostVersion: number;
    /** The app's own version string (the `<semver>` in the token), or `null` in a browser. */
    readonly appVersion: string | null;
    /** Whether this host supports a capability. Feature detection, never version sniffing. */
    has(cap: Capability): boolean;
    /**
     * Share through the system share sheet (Web Share). Resolves `"cancelled"` when
     * the user dismisses the sheet and `"unsupported"` when this host cannot share
     * (or cannot share this payload, e.g. files), so the caller can fall back to
     * copying a link.
     */
    share(data: ShareData): Promise<ShareResult>;
    /**
     * Save a file. In a browser this is an `<a download>` click. In the app the
     * same download is intercepted natively and handed to the iOS share sheet
     * (Save to Files, Print, Markup), so the call is identical.
     */
    saveFile(blob: Blob, filename: string): Promise<void>;
    /**
     * Print the page. Resolves `"unsupported"` (and does nothing) in the app,
     * where `window.print()` is a silent no-op; products offer their PDF instead,
     * whose share sheet includes Print. Check `has("print")` first to decide
     * which button to show.
     */
    print(): Promise<PrintResult>;
    /**
     * Open a link outside the product (a new tab in a browser; Safari View
     * Controller in the app). Only `http:` and `https:` URLs are opened; anything
     * else is ignored.
     */
    openExternal(url: string): void;
    /**
     * Go to another SkipLeague product, e.g. `openProduct("skiptrips", "/trips/42")`.
     * In the app, the navigation policy switches to that product's WebView. Throws
     * on a slug or path that cannot name a SkipLeague product page.
     */
    openProduct(slug: string, path?: string): void;
}
/** What the user-agent says about the host. Exported for tests and server-side logging. */
export declare function parseHostUserAgent(userAgent: string | null | undefined): {
    kind: HostKind;
    hostVersion: number;
    appVersion: string | null;
};
/**
 * The absolute URL of a product page: `skiptrips` + `/trips/42` becomes
 * `https://trips.skipleague.com/trips/42`.
 *
 * Throws when the slug is not a `skip<name>` product slug, or when the path is
 * not a same-origin path (it must start with a single `/`). Both guards exist so
 * this can never be turned into a link to another site.
 */
export declare function productUrl(slug: string, path?: string): string;
/**
 * The host this page is running in. Cheap to call repeatedly; the result is
 * cached per user-agent string.
 */
export declare function getHost(): SkipHost;

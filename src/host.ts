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

/**
 * The user-agent token the iSkip app appends: `SkipLeagueApp/<semver> (host <n>)`
 * (proposal section 5.3). It follows WebKit's `Mobile/15E148`, which the app
 * keeps so product mobile detection is unaffected.
 */
const APP_TOKEN = /\bSkipLeagueApp\/(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?) \(host (\d+)\)/;

/** The registrable domain every SkipLeague product lives under. */
const PRODUCT_DOMAIN = "skipleague.com";

/** What the user-agent says about the host. Exported for tests and server-side logging. */
export function parseHostUserAgent(userAgent: string | null | undefined): {
  kind: HostKind;
  hostVersion: number;
  appVersion: string | null;
} {
  const match = userAgent ? APP_TOKEN.exec(userAgent) : null;
  if (!match) return { kind: "browser", hostVersion: 0, appVersion: null };
  const hostVersion = Number.parseInt(match[2], 10);
  return {
    kind: "skipleague-ios",
    hostVersion: Number.isSafeInteger(hostVersion) ? hostVersion : 0,
    appVersion: match[1],
  };
}

/**
 * The absolute URL of a product page: `skiptrips` + `/trips/42` becomes
 * `https://trips.skipleague.com/trips/42`.
 *
 * Throws when the slug is not a `skip<name>` product slug, or when the path is
 * not a same-origin path (it must start with a single `/`). Both guards exist so
 * this can never be turned into a link to another site.
 */
export function productUrl(slug: string, path = "/"): string {
  const m = /^skip([a-z][a-z0-9]*)$/.exec(slug);
  if (!m) throw new Error(`Not a SkipLeague product slug: ${JSON.stringify(slug)}`);
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    throw new Error(`Product path must start with a single "/": ${JSON.stringify(path)}`);
  }
  const origin = `https://${m[1]}.${PRODUCT_DOMAIN}`;
  const url = new URL(path, origin);
  // Belt and braces: whatever the path contained, the result stays on that product.
  if (url.origin !== origin) throw new Error(`Product path escapes the product: ${JSON.stringify(path)}`);
  return url.href;
}

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function canWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function isHttpUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url, hasWindow() ? window.location.href : undefined);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

// How long a saved blob's object URL stays alive. Revoking immediately after the
// click cancels the download in Safari/WebKit, which reads the URL
// asynchronously; a minute is far longer than any hand-off takes.
const OBJECT_URL_LIFETIME_MS = 60_000;

function makeHost(userAgent: string | null | undefined): SkipHost {
  const { kind, hostVersion, appVersion } = parseHostUserAgent(userAgent);
  const inApp = kind === "skipleague-ios";

  const has = (cap: Capability): boolean => {
    switch (cap) {
      case "share":
        return canWebShare();
      case "saveFile":
        return hasWindow() && typeof URL.createObjectURL === "function";
      case "print":
        // Phase 0 (spike S3): window.print() exists in a WKWebView but silently
        // does nothing, and native code cannot observe the call.
        return !inApp && hasWindow() && typeof window.print === "function";
      case "openExternal":
      case "openProduct":
        return hasWindow();
      case "haptics":
        // Needs a native bridge, which product pages never get (D6). A future
        // approved capability would turn this on here, with no product change.
        return false;
      default:
        return false;
    }
  };

  return {
    kind,
    hostVersion,
    appVersion,
    has,

    async share(data) {
      if (!canWebShare()) return "unsupported";
      const payload: ShareData = { ...data };
      if (payload.files && payload.files.length === 0) delete payload.files;
      if (payload.files && typeof navigator.canShare === "function" && !navigator.canShare(payload)) {
        return "unsupported";
      }
      try {
        await navigator.share(payload);
        return "shared";
      } catch (err) {
        // AbortError: the user dismissed the sheet (in the app too, phase 0 S3).
        // Checked by name: a DOMException is not an `Error` instance everywhere.
        if (err && typeof err === "object" && (err as { name?: unknown }).name === "AbortError") return "cancelled";
        // NotAllowedError (no user gesture), TypeError (bad payload), DataError:
        // the caller should fall back exactly as if sharing were unavailable.
        return "unsupported";
      }
    },

    async saveFile(blob, filename) {
      if (!hasWindow()) throw new Error("saveFile needs a browser window");
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      try {
        a.click();
      } finally {
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), OBJECT_URL_LIFETIME_MS);
      }
    },

    async print() {
      if (!has("print")) return "unsupported";
      window.print();
      return "printed";
    },

    openExternal(url) {
      if (!hasWindow() || !isHttpUrl(url)) return;
      if (inApp) {
        // The app's navigation policy turns a main-frame navigation to a
        // non-product host into Safari View Controller and cancels it, so the
        // page stays where it is. A popup would depend on the WebView's UI
        // delegate instead.
        window.location.assign(url);
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    },

    openProduct(slug, path) {
      const url = productUrl(slug, path);
      if (!hasWindow()) return;
      // Same tab in both hosts, like the ProfileMenu app switcher: in the app,
      // the navigation policy turns this into a switch to that product's WebView.
      window.location.assign(url);
    },
  };
}

let cached: { userAgent: string | undefined; host: SkipHost } | null = null;

/**
 * The host this page is running in. Cheap to call repeatedly; the result is
 * cached per user-agent string.
 */
export function getHost(): SkipHost {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : undefined;
  if (!cached || cached.userAgent !== userAgent) cached = { userAgent, host: makeHost(userAgent) };
  return cached.host;
}

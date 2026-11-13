/**
 * `@skipleague/design/session`: the SkipLeague sign-in session as a product page
 * sees it. One shared implementation of the pattern every product hand-rolled
 * (SkipTrips `auth/skipleague.ts`, SkipLists `api/platformToken.ts`, and seven
 * more), so a fix lands once.
 *
 * How a product page gets and keeps a session:
 *   1. SkipPlatform (skipleague.com) signs the user in and sends them back with
 *      `?token=<jwt>`. Call {@link captureTokenFromUrl} once, BEFORE React
 *      renders, so the token is stored and stripped from the address bar.
 *   2. Send {@link getAccessToken} as the Bearer token on API calls.
 *   3. On a 401, call {@link renew}: it trades the apex's HttpOnly refresh
 *      cookie for a new token without leaving the page (SkipPlatform ADR-019).
 *   4. When renewal fails, {@link redirectToSignIn}. When the user signs out,
 *      {@link signOut}, which ALWAYS goes through the platform's `/logout`.
 *
 * Inside the iSkip app all of this is identical: the app answers `/login` and
 * `/logout` natively, and (stage 2) gives the WebView its own refresh cookie.
 *
 * One storage key, `skipplatform_token`, for every product. No dependency on
 * React, Capacitor, or anything else.
 *
 * Proposal: MyEcosystem architecture/ISKIP_CAPACITOR_PROPOSAL.md section 3.5.
 */

/** The one localStorage key for the platform access token, fleet-wide. */
export const SESSION_TOKEN_KEY = "skipplatform_token";

/**
 * Keys earlier product code stored the same token under. Cleared alongside the
 * real key so a product that adopts this module does not leave an old copy of
 * the token behind on a shared browser after sign-out.
 */
const LEGACY_TOKEN_KEYS = ["skipleague_token"];

/** Where the sign-in loop guard keeps its counter (sessionStorage, per tab). */
const REAUTH_KEY = "skl_session_reauth";
const REAUTH_WINDOW_MS = 30_000;

const DEFAULT_PLATFORM_URL = "https://skipleague.com";
let platformUrl = DEFAULT_PLATFORM_URL;

export interface SessionConfig {
  /**
   * The SkipPlatform origin that owns sign-in, e.g. `http://localhost:5173` in
   * local development. Defaults to `https://skipleague.com`. Set it once at
   * startup, before any other call here.
   */
  platformUrl?: string;
}

/** Point the session at a different platform origin (local development). */
export function configureSession(config: SessionConfig): void {
  if (config.platformUrl !== undefined) {
    let parsed: URL;
    try {
      parsed = new URL(config.platformUrl);
    } catch {
      throw new Error(`platformUrl must be an absolute URL: ${JSON.stringify(config.platformUrl)}`);
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error(`platformUrl must be http(s): ${JSON.stringify(config.platformUrl)}`);
    }
    platformUrl = parsed.origin;
  }
}

/** The platform origin in use (no trailing slash). */
export function getPlatformUrl(): string {
  return platformUrl;
}

// --- Token storage ---------------------------------------------------------
//
// In-memory fallback: on iOS Safari / DuckDuckGo with strict tracking
// protection, localStorage can be partitioned or blocked for a product
// subdomain reached through the cross-site sign-in redirect. setItem then
// silently does nothing. Keeping a module-level copy lets the session survive
// for the life of the page anyway.
let memToken: string | null = null;

// True once a write or removal did not verifiably land (it threw, or it
// returned but reading the key back disagrees). localStorage may then be STALE
// rather than merely empty, so reads must not trust it until a later write is
// verified. Without this, a renewed token would be shadowed by the expired one
// it replaced.
let memAuthoritative = false;

function storage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null; // some browsers throw on mere access when storage is blocked
  }
}

/** The current access token, or `null` when there is none. */
export function getAccessToken(): string | null {
  if (memAuthoritative) return memToken;
  try {
    const stored = storage()?.getItem(SESSION_TOKEN_KEY);
    if (stored) return stored;
  } catch {
    /* blocked: fall through to the in-memory copy */
  }
  return memToken;
}

/** Store a token (normally done for you by {@link captureTokenFromUrl} and {@link renew}). */
export function setAccessToken(token: string): void {
  memToken = token;
  const s = storage();
  if (!s) {
    memAuthoritative = true;
    return;
  }
  try {
    s.setItem(SESSION_TOKEN_KEY, token);
    // A call that did not throw is not proof the write landed; read it back.
    memAuthoritative = s.getItem(SESSION_TOKEN_KEY) !== token;
  } catch {
    memAuthoritative = true;
  }
}

/**
 * Forget the access token locally (for example after a 401 that renewal could
 * not fix). This does NOT end the platform session; use {@link signOut} for that.
 */
export function clearAccessToken(): void {
  memToken = null;
  const s = storage();
  if (!s) {
    memAuthoritative = true;
    return;
  }
  try {
    for (const key of LEGACY_TOKEN_KEYS) s.removeItem(key);
    s.removeItem(SESSION_TOKEN_KEY);
    // Same silent no-op risk as a write: confirm the key is really gone, or a
    // stale token would come back on the next read.
    memAuthoritative = s.getItem(SESSION_TOKEN_KEY) !== null;
  } catch {
    memAuthoritative = true;
  }
}

// --- Capture ---------------------------------------------------------------

// True only when THIS page load arrived with a fresh token from sign-in. A
// rejected fresh token is a real loop signal; a rejected token left over from
// an earlier visit is normal and just needs one clean sign-in round trip.
let cameFromSignIn = false;

/**
 * If the platform sent the user back with `?token=…`, store it and remove it
 * from the address bar (with `history.replaceState`, so it never lands in
 * history or a bookmark). Call once at startup, BEFORE the app renders, so the
 * router never sees the token. Returns whether a token was captured.
 */
export function captureTokenFromUrl(): boolean {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  if (!url.searchParams.has("token")) return false;
  url.searchParams.delete("token");
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  if (!token) return false;
  setAccessToken(token);
  cameFromSignIn = true;
  return true;
}

// --- Renewal ---------------------------------------------------------------

// Single flight: several callers hitting a 401 at once trigger ONE refresh, not
// a burst of rotations. An optimisation only; it cannot coordinate across tabs.
// That race is closed on the server by ADR-019's reuse grace window.
let renewInFlight: Promise<string | null> | null = null;

/**
 * Get a fresh access token from the platform without leaving the page, using
 * the apex's HttpOnly refresh cookie (`POST <platform>/auth/refresh` with
 * credentials). The product's origin must be in the platform's ALLOWED_ORIGINS.
 *
 * Resolves the new token (also stored), or `null` when there is no usable
 * session (signed out, offline, or blocked), in which case call
 * {@link redirectToSignIn}. Never rejects.
 */
export function renew(): Promise<string | null> {
  if (!renewInFlight) {
    renewInFlight = (async () => {
      try {
        const res = await fetch(`${platformUrl}/auth/refresh`, { method: "POST", credentials: "include" });
        if (!res.ok) return null;
        const body: unknown = await res.json();
        const token = body && typeof body === "object" ? (body as { access_token?: unknown }).access_token : null;
        if (typeof token !== "string" || !token) return null;
        setAccessToken(token);
        return token;
      } catch {
        return null;
      } finally {
        renewInFlight = null;
      }
    })();
  }
  return renewInFlight;
}

// --- Leaving the page ------------------------------------------------------

let redirecting = false;

function readReauthAttempts(): number {
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(REAUTH_KEY) || "{}");
    if (typeof raw.at === "number" && Date.now() - raw.at < REAUTH_WINDOW_MS && typeof raw.n === "number") {
      return raw.n;
    }
  } catch {
    /* unreadable or blocked: treat as no attempts */
  }
  return 0;
}

function writeReauthAttempts(n: number | null): void {
  try {
    if (n === null) window.sessionStorage.removeItem(REAUTH_KEY);
    else window.sessionStorage.setItem(REAUTH_KEY, JSON.stringify({ n, at: Date.now() }));
  } catch {
    /* blocked: the guard degrades to the per-page `redirecting` flag */
  }
}

/**
 * Tell the session that an authenticated load succeeded (for example the
 * product's own `/me` returned 200), so the sign-in loop guard resets.
 */
export function markSessionConfirmed(): void {
  if (typeof window === "undefined") return;
  writeReauthAttempts(null);
}

/**
 * Send the user to the platform sign-in, returning to `returnTo` (default: this
 * exact page). In the app, the `/login` navigation is answered natively and the
 * page reloads with a fresh token.
 *
 * Safe to call from several failing requests at once: only the first call
 * navigates. If a token that JUST arrived from sign-in is rejected again within
 * 30 seconds, the user is parked on the platform account page instead of
 * bouncing forever.
 */
export function redirectToSignIn(returnTo?: string): void {
  if (typeof window === "undefined" || redirecting) return;
  redirecting = true;
  const target = returnTo ?? window.location.href;
  if (cameFromSignIn) {
    const attempts = readReauthAttempts();
    if (attempts >= 1) {
      writeReauthAttempts(null);
      window.location.assign(`${platformUrl}/account`);
      return;
    }
    writeReauthAttempts(attempts + 1);
  }
  window.location.assign(`${platformUrl}/login?return_to=${encodeURIComponent(target)}`);
}

/**
 * Sign out of SkipLeague: forget the token here, then ALWAYS go through the
 * platform's `/logout` (which ends the platform session) and come back to
 * `returnTo` (default: this product's home page). Going straight to `/login`
 * instead would leave the platform session alive and sign the user straight
 * back in. In the app, `/logout` is answered natively with a full sign-out.
 *
 * Clear any product-owned caches (query cache, remembered selections) BEFORE
 * calling this; the page unloads right after.
 */
export function signOut(options: { returnTo?: string } = {}): void {
  clearAccessToken();
  if (typeof window === "undefined") return;
  writeReauthAttempts(null);
  const target = options.returnTo ?? `${window.location.origin}/`;
  window.location.assign(`${platformUrl}/logout?return_to=${encodeURIComponent(target)}`);
}

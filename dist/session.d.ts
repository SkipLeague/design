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
export declare const SESSION_TOKEN_KEY = "skipplatform_token";
export interface SessionConfig {
    /**
     * The SkipPlatform origin that owns sign-in, e.g. `http://localhost:5173` in
     * local development. Defaults to `https://skipleague.com`. Set it once at
     * startup, before any other call here.
     */
    platformUrl?: string;
}
/** Point the session at a different platform origin (local development). */
export declare function configureSession(config: SessionConfig): void;
/** The platform origin in use (no trailing slash). */
export declare function getPlatformUrl(): string;
/** The current access token, or `null` when there is none. */
export declare function getAccessToken(): string | null;
/** Store a token (normally done for you by {@link captureTokenFromUrl} and {@link renew}). */
export declare function setAccessToken(token: string): void;
/**
 * Forget the access token locally (for example after a 401 that renewal could
 * not fix). This does NOT end the platform session; use {@link signOut} for that.
 */
export declare function clearAccessToken(): void;
/**
 * If the platform sent the user back with `?token=…`, store it and remove it
 * from the address bar (with `history.replaceState`, so it never lands in
 * history or a bookmark). Call once at startup, BEFORE the app renders, so the
 * router never sees the token. Returns whether a token was captured.
 */
export declare function captureTokenFromUrl(): boolean;
/**
 * Get a fresh access token from the platform without leaving the page, using
 * the apex's HttpOnly refresh cookie (`POST <platform>/auth/refresh` with
 * credentials). The product's origin must be in the platform's ALLOWED_ORIGINS.
 *
 * Resolves the new token (also stored), or `null` when there is no usable
 * session (signed out, offline, or blocked), in which case call
 * {@link redirectToSignIn}. Never rejects.
 */
export declare function renew(): Promise<string | null>;
/**
 * Tell the session that an authenticated load succeeded (for example the
 * product's own `/me` returned 200), so the sign-in loop guard resets.
 */
export declare function markSessionConfirmed(): void;
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
export declare function redirectToSignIn(returnTo?: string): void;
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
export declare function signOut(options?: {
    returnTo?: string;
}): void;

/** A SkipLeague app the ProfileMenu can switch between. */
export interface AppLink {
    /** Platform app slug, e.g. "skiplists". Matches the registry + introspect. */
    slug: string;
    /** Display name, e.g. "SkipLists". */
    name: string;
    /** Absolute URL to the app. */
    url: string;
}
/**
 * Canonical list of LIVE SkipLeague apps shown in every app's switcher.
 * Add an app here (one place) when it goes live and every app's menu updates.
 * What each user actually sees is this list filtered by their enabled apps —
 * pass `enabledSlugs={user.app_slugs}` to ProfileMenu. SkipEvolve is omitted
 * until it launches.
 */
export declare const SKIPLEAGUE_APPS: AppLink[];
/** Default target for the menu's "Manage account" link (the platform account page). */
export declare const SKIPLEAGUE_ACCOUNT_URL = "https://skipleague.com/account";

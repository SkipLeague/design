/**
 * An app's lifecycle status (docs/app-lifecycle-statuses.md in SkipPlatform):
 *
 *   in_development → baking → early_access → live
 *   ("Build it → Bake it → Share it → Launch it")
 */
export type AppLifecycleStatus = "live" | "early_access" | "baking" | "in_development";
/** A SkipLeague app the ProfileMenu can switch between. */
export interface AppLink {
    /** Platform app slug, e.g. "skiplists". Matches the registry + introspect. */
    slug: string;
    /** Display name, e.g. "SkipLists". */
    name: string;
    /** Absolute URL to the app. */
    url: string;
    /**
     * Lifecycle status, when the caller knows it (the platform sends it on every app
     * it returns). Drives the status dot in the switcher. Omit and no dot is shown —
     * which is what an older caller passing a hard-coded list gets.
     */
    status?: AppLifecycleStatus;
}
/**
 * The status dot's color per lifecycle stage. The ramp runs orange → yellow → green,
 * moving toward the brand green as an app matures. `live` has no entry on purpose:
 * a Live app never gets a dot. Most users can only reach Live apps, so a dot beside
 * every row would be pure noise — the dot exists to mark the exceptions.
 */
export declare const STATUS_DOT: Record<Exclude<AppLifecycleStatus, "live">, {
    color: string;
    label: string;
}>;
/**
 * A fallback list of SkipLeague apps, for callers that have no better source.
 *
 * @deprecated Pass the apps the PLATFORM returns instead (each carries its own
 * `status`, and the list already arrives in fleet display order). This array cannot
 * know an app's status, so the switcher renders no status dots for it, and it goes
 * stale the moment an app is added — the exact drift the platform's `applications`
 * table now exists to prevent. Kept only so apps that have not migrated yet keep
 * working; remove once every app passes backend-sourced apps.
 */
export declare const SKIPLEAGUE_APPS: AppLink[];
/** Default target for the menu's "Manage account" link (the platform account page). */
export declare const SKIPLEAGUE_ACCOUNT_URL = "https://skipleague.com/account";

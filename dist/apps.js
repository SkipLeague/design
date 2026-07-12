/**
 * The status dot's color per lifecycle stage. The ramp runs orange → yellow → green,
 * moving toward the brand green as an app matures. `live` has no entry on purpose:
 * a Live app never gets a dot. Most users can only reach Live apps, so a dot beside
 * every row would be pure noise — the dot exists to mark the exceptions.
 */
export const STATUS_DOT = {
    early_access: { color: "#facc15", label: "Early Access" },
    baking: { color: "#f97316", label: "Baking" },
    in_development: { color: "#d1d5db", label: "In Development" },
};
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
export const SKIPLEAGUE_APPS = [
    { slug: "skiplists", name: "SkipLists", url: "https://lists.skipleague.com" },
    { slug: "skipracquetball", name: "SkipRacquetball", url: "https://racquetball.skipleague.com" },
    { slug: "skiptrips", name: "SkipTrips", url: "https://trips.skipleague.com" },
    { slug: "skipreading", name: "SkipReading", url: "https://reading.skipleague.com" },
    { slug: "skipgifts", name: "SkipGifts", url: "https://gifts.skipleague.com" },
    { slug: "skiptoday", name: "SkipToday", url: "https://today.skipleague.com" },
    { slug: "skipflow", name: "SkipFlow", url: "https://flow.skipleague.com" },
    { slug: "skipcontacts", name: "SkipContacts", url: "https://contacts.skipleague.com" },
];
/** Default target for the menu's "Manage account" link (the platform account page). */
export const SKIPLEAGUE_ACCOUNT_URL = "https://skipleague.com/account";

/**
 * Canonical list of LIVE SkipLeague apps shown in every app's switcher.
 * SkipToday / SkipEvolve are intentionally omitted until they go live — add
 * them here (one place) when they launch and every app's menu updates.
 */
export const SKIPLEAGUE_APPS = [
    { slug: "skiplists", name: "SkipLists", url: "https://lists.skipleague.com" },
    { slug: "skipracquetball", name: "SkipRacquetball", url: "https://racquetball.skipleague.com" },
    { slug: "skiptrips", name: "SkipTrips", url: "https://trips.skipleague.com" },
];
/** Default target for the menu's "Manage account" link (the platform account page). */
export const SKIPLEAGUE_ACCOUNT_URL = "https://skipleague.com/account";

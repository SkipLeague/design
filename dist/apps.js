/**
 * Canonical list of LIVE SkipLeague apps shown in every app's switcher.
 * Add an app here (one place) when it goes live and every app's menu updates.
 * What each user actually sees is this list filtered by their enabled apps —
 * pass `enabledSlugs={user.app_slugs}` to ProfileMenu. SkipEvolve is omitted
 * until it launches.
 */
export const SKIPLEAGUE_APPS = [
    { slug: "skiplists", name: "SkipLists", url: "https://lists.skipleague.com" },
    { slug: "skipracquetball", name: "SkipRacquetball", url: "https://racquetball.skipleague.com" },
    { slug: "skiptrips", name: "SkipTrips", url: "https://trips.skipleague.com" },
    { slug: "skipreading", name: "SkipReading", url: "https://reading.skipleague.com" },
    { slug: "skipgifts", name: "SkipGifts", url: "https://gifts.skipleague.com" },
    { slug: "skiptoday", name: "SkipToday", url: "https://today.skipleague.com" },
];
/** Default target for the menu's "Manage account" link (the platform account page). */
export const SKIPLEAGUE_ACCOUNT_URL = "https://skipleague.com/account";

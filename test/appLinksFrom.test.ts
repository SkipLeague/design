import { describe, expect, it } from "vitest";

import { appLinksFrom } from "../src/apps.js";

describe("appLinksFrom", () => {
  it("carries the lifecycle status through", () => {
    // The regression this helper exists to prevent: SkipPlatform's switcher
    // hand-rolled `{slug, name, url}` and dropped `status`, so ProfileMenu drew no
    // status dots and every app read as Live.
    const links = appLinksFrom([
      { slug: "skiplists", name: "SkipLists", url: "https://lists.skipleague.com", status: "early_access" },
    ]);

    expect(links).toEqual([
      { slug: "skiplists", name: "SkipLists", url: "https://lists.skipleague.com", status: "early_access" },
    ]);
  });

  it("drops apps with no URL — the switcher's job is to link somewhere", () => {
    const links = appLinksFrom([
      { slug: "skipflow", name: "SkipFlow", url: null, status: "in_development" },
      { slug: "skipgifts", name: "SkipGifts", url: "", status: "baking" },
      { slug: "skiplists", name: "SkipLists", url: "https://lists.skipleague.com", status: "live" },
    ]);

    expect(links.map((a) => a.slug)).toEqual(["skiplists"]);
  });

  it("tolerates a missing status (an older platform, or a hard-coded list)", () => {
    const links = appLinksFrom([{ slug: "skiptoday", name: "SkipToday", url: "https://today.skipleague.com" }]);

    expect(links[0].status).toBeUndefined();
  });

  it("accepts null/undefined — callers render before /me/apps resolves", () => {
    expect(appLinksFrom(null)).toEqual([]);
    expect(appLinksFrom(undefined)).toEqual([]);
    expect(appLinksFrom([])).toEqual([]);
  });

  it("ignores extra fields the platform sends", () => {
    // /me/apps returns id, description, display_rank, is_launched… The helper must
    // accept the full record rather than force every app to pre-trim it by hand —
    // pre-trimming by hand is what lost `status` in the first place.
    const rich = {
      id: 3,
      slug: "skipreading",
      name: "SkipReading",
      url: "https://reading.skipleague.com",
      description: "Reading memory",
      is_active: true,
      status: "live" as const,
      display_rank: 2,
      is_launched: true,
    };

    expect(appLinksFrom([rich])).toEqual([
      { slug: "skipreading", name: "SkipReading", url: "https://reading.skipleague.com", status: "live" },
    ]);
  });
});

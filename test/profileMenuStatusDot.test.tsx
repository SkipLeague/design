import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProfileMenu } from "../src/ProfileMenu.js";
import type { AppLink } from "../src/apps.js";

const user = { displayName: "Ben", email: "ben@example.com" };

async function openMenu() {
  await userEvent.click(screen.getByRole("button", { name: "Account" }));
}

function renderMenu(apps: AppLink[]) {
  return render(<ProfileMenu user={user} apps={apps} onSignOut={() => {}} />);
}

describe("ProfileMenu status dots", () => {
  it("shows no dots at all when every app the user can see is Live", async () => {
    // The common case: a normal user only ever reaches Live apps. A dot beside every
    // row would carry no information, so the switcher must look exactly as it did.
    renderMenu([
      { slug: "skiplists", name: "SkipLists", url: "https://lists.skipleague.com", status: "live" },
      { slug: "skipracquetball", name: "SkipRacquetball", url: "https://r.skipleague.com", status: "live" },
    ]);
    await openMenu();

    expect(screen.getByRole("menuitem", { name: /SkipLists/ })).toBeInTheDocument();
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("dots only the apps that are not yet Live", async () => {
    renderMenu([
      { slug: "skipracquetball", name: "SkipRacquetball", url: "https://r.skipleague.com", status: "live" },
      { slug: "skiplists", name: "SkipLists", url: "https://l.skipleague.com", status: "early_access" },
      { slug: "skiptrips", name: "SkipTrips", url: "https://t.skipleague.com", status: "baking" },
      { slug: "skipflow", name: "SkipFlow", url: "https://f.skipleague.com", status: "in_development" },
    ]);
    await openMenu();

    // Three non-Live apps → three dots. The Live one has none.
    const dots = screen.getAllByRole("img");
    expect(dots).toHaveLength(3);
    expect(dots.map((d) => d.getAttribute("aria-label"))).toEqual([
      "Early Access",
      "Baking",
      "In Development",
    ]);
  });

  it("labels each dot in words, so color is never the only signal", async () => {
    renderMenu([
      { slug: "skiplists", name: "SkipLists", url: "https://l.skipleague.com", status: "early_access" },
    ]);
    await openMenu();

    // An 8px hue difference is exactly what red-green color blindness loses.
    expect(screen.getByRole("img", { name: "Early Access" })).toHaveAttribute("title", "Early Access");
  });

  it("renders no dot when the caller supplies no status (older, unmigrated app)", async () => {
    renderMenu([{ slug: "skiplists", name: "SkipLists", url: "https://l.skipleague.com" }]);
    await openMenu();

    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("keeps the app name and the dot at opposite ends of the row", async () => {
    // Ben's constraint: the dot is hard right, not trailing the name, and the menu
    // must not get any wider. `space-between` is what puts it at the far edge.
    renderMenu([
      { slug: "skiplists", name: "SkipLists", url: "https://l.skipleague.com", status: "baking" },
    ]);
    await openMenu();

    const row = screen.getByRole("menuitem", { name: /SkipLists/ });
    expect(row).toHaveStyle({ justifyContent: "space-between" });
  });
});

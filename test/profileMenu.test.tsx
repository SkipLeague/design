import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

import { ProfileMenu } from "../src/ProfileMenu";

const user = { displayName: "Ben", email: "ben@example.com" };
const apps = [{ slug: "skiplists", name: "SkipLists", url: "https://lists.example.com" }];

describe("ProfileMenu", () => {
  // Regression: a host app's global `button { padding }` must not collapse the
  // fixed 38×38 trigger and shrink the account icon to a dot (fixed in v0.7.1).
  it("pins padding:0 on the trigger so host button styles can't collapse it", () => {
    render(<ProfileMenu user={user} currentSlug="skiplists" apps={apps} onSignOut={() => {}} />);
    const trigger = screen.getByRole("button", { name: "Account" });
    expect(trigger).toHaveStyle({ padding: "0px" });
  });

  it("shows the per-app glyph (an svg) in the switcher for a known slug", () => {
    render(<ProfileMenu user={user} currentSlug="skipracquetball" apps={apps} onSignOut={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    const menu = screen.getByRole("menu");
    // The SkipLists row renders an AppLogo glyph (svg), not a letter badge.
    expect(within(menu).getByText("SkipLists").closest("a, div")?.querySelector("svg")).toBeTruthy();
  });

  it("fires onSignOut from the menu", () => {
    const onSignOut = vi.fn();
    render(<ProfileMenu user={user} currentSlug="skiplists" apps={apps} onSignOut={onSignOut} />);
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});

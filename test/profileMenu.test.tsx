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

describe("ProfileMenu SkipLeague Home item", () => {
  const open = () => fireEvent.click(screen.getByRole("button", { name: "Account" }));

  it("links to the platform dashboard by default", () => {
    render(<ProfileMenu user={user} currentSlug="skiplists" apps={apps} onSignOut={() => {}} />);
    open();
    const home = screen.getByRole("menuitem", { name: /skipleague home/i });
    expect(home.tagName).toBe("A");
    expect(home).toHaveAttribute("href", "https://skipleague.com/");
  });

  it("comes before the app switcher", () => {
    render(<ProfileMenu user={user} currentSlug="skipracquetball" apps={apps} onSignOut={() => {}} />);
    open();
    const items = within(screen.getByRole("menu")).getAllByRole("menuitem").map((el) => el.textContent?.trim());
    expect(items[0]).toBe("SkipLeague Home");
    expect(items).toContain("SkipLists");
    expect(items.indexOf("SkipLists")).toBeGreaterThan(0);
  });

  it("never routes the absolute apex URL through renderLink (it is another site)", () => {
    const renderLink = vi.fn(({ href, children, ...p }) => (
      <span data-testid={`routed:${href}`} {...p}>
        {children}
      </span>
    ));
    render(<ProfileMenu user={user} currentSlug="skiplists" apps={apps} onSignOut={() => {}} renderLink={renderLink} />);
    open();
    expect(screen.getByRole("menuitem", { name: /skipleague home/i }).tagName).toBe("A");
    expect(renderLink.mock.calls.map((c) => c[0].href)).not.toContain("https://skipleague.com/");
  });

  it("routes a relative home URL through renderLink (platform apex)", () => {
    const renderLink = vi.fn(({ href, children, ...p }) => (
      <span data-testid={`routed:${href}`} {...p}>
        {children}
      </span>
    ));
    render(<ProfileMenu user={user} apps={apps} homeUrl="/" onSignOut={() => {}} renderLink={renderLink} />);
    open();
    expect(screen.getByTestId("routed:/")).toHaveTextContent("SkipLeague Home");
  });

  it("shows as the current page on the dashboard, and can be hidden", () => {
    const { unmount } = render(<ProfileMenu user={user} apps={apps} homeIsCurrent onSignOut={() => {}} />);
    open();
    const current = within(screen.getByRole("menu")).getByText("SkipLeague Home");
    expect(current.closest("[aria-current='page']")).toBeTruthy();
    expect(screen.queryByRole("menuitem", { name: /skipleague home/i })).toBeNull();
    unmount();

    render(<ProfileMenu user={user} apps={apps} homeUrl={null} onSignOut={() => {}} />);
    open();
    expect(within(screen.getByRole("menu")).queryByText("SkipLeague Home")).toBeNull();
  });

  it("is not shown in the signed-out menu", () => {
    render(<ProfileMenu apps={apps} onSignOut={() => {}} onSignIn={() => {}} />);
    open();
    expect(within(screen.getByRole("menu")).queryByText("SkipLeague Home")).toBeNull();
  });
});

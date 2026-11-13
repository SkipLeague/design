import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { AppLauncher } from "../src/AppLauncher";

const apps = [
  { slug: "skiplists", name: "SkipLists", url: "https://lists.skipleague.com", status: "live" as const },
  { slug: "skipcontacts", name: "SkipContacts", url: "https://contacts.skipleague.com", status: "early_access" as const },
  { slug: "skipnewthing", name: "SkipNewThing", url: "https://newthing.skipleague.com" },
  { slug: "skipflow", name: "SkipFlow", url: null, status: "in_development" as const },
];

describe("AppLauncher", () => {
  it("renders one tile per app, in order, as links to each app", () => {
    render(<AppLauncher apps={apps} />);
    const grid = screen.getByRole("list", { name: "Your apps" });
    const items = within(grid).getAllByRole("listitem");
    expect(items).toHaveLength(4);
    ["SkipLists", "SkipContacts", "SkipNewThing", "SkipFlow"].forEach((name, i) => expect(items[i]).toHaveTextContent(name));
    expect(screen.getByRole("link", { name: /SkipLists/ })).toHaveAttribute("href", "https://lists.skipleague.com");
  });

  it("uses the app glyph when one exists and a letter tile otherwise", () => {
    render(<AppLauncher apps={apps} />);
    expect(screen.getByRole("link", { name: /SkipLists/ }).querySelector("svg")).toBeTruthy();
    const letterTile = screen.getByRole("link", { name: /SkipNewThing/ });
    expect(letterTile.querySelector("svg")).toBeNull();
    expect(letterTile).toHaveTextContent("NSkipNewThing"); // "N" tile, then the name
  });

  it("shows a status dot only for apps that are not Live", () => {
    render(<AppLauncher apps={apps} />);
    expect(within(screen.getByRole("link", { name: /SkipLists/ })).queryByRole("img")).toBeNull();
    expect(within(screen.getByRole("link", { name: /SkipContacts/ })).getByRole("img", { name: "Early Access" })).toBeTruthy();
  });

  it("shows an app with no URL dimmed and not as a link", () => {
    render(<AppLauncher apps={apps} />);
    expect(screen.queryByRole("link", { name: /SkipFlow/ })).toBeNull();
    const flow = screen.getByText("SkipFlow").parentElement!;
    expect(flow).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onSelect with the app and lets it take over the navigation", () => {
    const onSelect = vi.fn((_app, e) => e.preventDefault());
    render(<AppLauncher apps={apps} onSelect={onSelect} />);
    const link = screen.getByRole("link", { name: /SkipContacts/ });
    const notPrevented = fireEvent.click(link);
    expect(notPrevented).toBe(false);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0][0]).toMatchObject({ slug: "skipcontacts", url: "https://contacts.skipleague.com" });
  });

  it("renders the empty slot when there are no apps", () => {
    render(<AppLauncher apps={[]} empty={<p>No apps yet.</p>} label="Apps" />);
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("No apps yet.")).toBeTruthy();
  });
});

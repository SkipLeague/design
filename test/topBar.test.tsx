import { act, render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TopBar, TopBarDetail, TopBarWordmark, TOP_BAR_HEIGHT, TOP_BAR_SIDE_PADDING } from "../src/TopBar.js";

// The bar's own inline style, as React emits it. Read from the server markup,
// not the jsdom DOM: jsdom's CSS parser does not understand env() and mangles
// or drops those declarations, while every browser accepts them.
function barStyle(element: React.ReactElement): string {
  const html = renderToStaticMarkup(element);
  const m = /^<div style="([^"]*)"/.exec(html);
  if (!m) throw new Error(`unexpected markup: ${html.slice(0, 80)}`);
  return m[1];
}

describe("TopBar size", () => {
  it("is one 48px / 16px size", () => {
    expect(TOP_BAR_HEIGHT).toBe(48);
    expect(TOP_BAR_SIDE_PADDING).toBe(16);
  });

  it("pads the top, left and right safe-area insets by default", () => {
    const style = barStyle(<TopBar app="lists" appName="SkipLists" onSignOut={() => {}} />);
    expect(style).toContain("box-sizing:border-box");
    expect(style).toContain("height:calc(48px + env(safe-area-inset-top, 0px))");
    expect(style).toContain("padding-top:env(safe-area-inset-top, 0px)");
    expect(style).toContain("padding-left:calc(16px + env(safe-area-inset-left, 0px))");
    expect(style).toContain("padding-right:calc(16px + env(safe-area-inset-right, 0px))");
    expect(style).toContain("padding-bottom:0");
  });

  it("ignores the deprecated compact flag: same size everywhere", () => {
    const compact = barStyle(<TopBar app="lists" appName="SkipLists" compact onSignOut={() => {}} />);
    const normal = barStyle(<TopBar app="lists" appName="SkipLists" onSignOut={() => {}} />);
    expect(compact).toBe(normal);
  });

  it("can opt out for a bar that is not at the top edge", () => {
    const style = barStyle(<TopBar app="lists" appName="SkipLists" safeArea={false} onSignOut={() => {}} />);
    expect(style).not.toContain("safe-area");
    expect(style).toContain("height:48px");
    expect(style).toContain("padding:0 16px");
  });
});

describe("TopBar pinning and scroll shadow", () => {
  it("is sticky at the top by default, so Safari can tint its toolbar from it", () => {
    const style = barStyle(<TopBar app="lists" appName="SkipLists" onSignOut={() => {}} />);
    expect(style).toContain("position:sticky");
    expect(style).toContain("top:0");
    expect(style).toContain("box-shadow:none");
  });

  it("can be unpinned for a bar inside a sheet or card", () => {
    const style = barStyle(<TopBar app="lists" appName="SkipLists" sticky={false} onSignOut={() => {}} />);
    expect(style).not.toContain("position:sticky");
  });

  it("adds a shadow once the window scrolls, and removes it at the top", () => {
    const { container } = render(<TopBar app="lists" appName="SkipLists" onSignOut={() => {}} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.style.boxShadow).toBe("none");
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 120, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar.style.boxShadow).not.toBe("none");
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar.style.boxShadow).toBe("none");
  });

  it("watches an inner scroll pane when one is passed", () => {
    const pane = document.createElement("div");
    document.body.appendChild(pane);
    const ref = createRef<HTMLElement>();
    (ref as { current: HTMLElement | null }).current = pane;
    const { container } = render(<TopBar app="lists" appName="SkipLists" scrollContainer={ref} onSignOut={() => {}} />);
    const bar = container.firstElementChild as HTMLElement;
    act(() => {
      pane.scrollTop = 40;
      pane.dispatchEvent(new Event("scroll"));
    });
    expect(bar.style.boxShadow).not.toBe("none");
    pane.remove();
  });
});

describe("TopBarWordmark", () => {
  it("splits Skip from the product name", () => {
    const html = renderToStaticMarkup(<TopBarWordmark appName="SkipLists" />);
    expect(html).toContain(">Skip</span>");
    expect(html).toContain(">Lists</span>");
    // Skip white, product name mint on the dark bar.
    expect(html).toMatch(/color:var\(--skl-color-on-dark\);font-weight:600">Skip/);
    expect(html).toMatch(/color:var\(--skl-color-brand-bright\)">Lists/);
  });

  it("uses the light palette on a light bar", () => {
    const html = renderToStaticMarkup(<TopBarWordmark appName="SkipReading" tone="light" />);
    expect(html).toMatch(/color:var\(--skl-color-text\);font-weight:600">Skip/);
    expect(html).toMatch(/color:var\(--skl-color-brand\)">Reading/);
  });

  it("leaves a name that does not start with Skip in one color", () => {
    const html = renderToStaticMarkup(<TopBarWordmark appName="SkipLeague Home" />);
    expect(html).not.toContain(">Skip</span>");
    const plain = renderToStaticMarkup(<TopBarWordmark appName="Racquetball" />);
    expect(plain).toContain(">Racquetball</span>");
  });

  it("is what TopBar renders, so the full name is still readable text", () => {
    render(<TopBar app="lists" appName="SkipLists" onSignOut={() => {}} />);
    expect(screen.getByText("Skip")).toBeTruthy();
    expect(screen.getByText("Lists")).toBeTruthy();
  });
});

describe("TopBarDetail", () => {
  it("renders Back, the app label and the page title in the 48px bar", () => {
    const onBack = vi.fn();
    render(<TopBarDetail appName="SkipLists" title="Groceries" onBack={onBack} onSignOut={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledOnce();
    expect(screen.getByText("Groceries")).toBeTruthy();
    expect(screen.getByText("Lists")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Account" })).toBeTruthy();
  });

  it("shares the bar's size, safe areas and pinning", () => {
    const style = barStyle(<TopBarDetail appName="SkipLists" title="Groceries" onBack={() => {}} onSignOut={() => {}} />);
    expect(style).toContain("height:calc(48px + env(safe-area-inset-top, 0px))");
    expect(style).toContain("position:sticky");
  });

  it("shows a subtitle in place of the app label when given", () => {
    render(<TopBarDetail appName="SkipLists" title="Groceries" subtitle="Grocery list" onBack={() => {}} onSignOut={() => {}} />);
    expect(screen.getByText("Grocery list")).toBeTruthy();
    expect(screen.queryByText("Lists")).toBeNull();
  });
});

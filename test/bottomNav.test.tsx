import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BottomNav } from "../src/BottomNav.js";

const tab = (label: string, active = false) => ({ label, icon: <svg />, active });
const four = [tab("Overview", true), tab("Activity"), tab("Directory"), tab("More")];
const action = { label: "Add", ariaLabel: "Add new", icon: <svg /> };

// Inline styles as React emits them. Read from the server markup, not the jsdom
// DOM: jsdom's CSS parser drops declarations that use env(), max() and clamp().
function styles(element: React.ReactElement) {
  const html = renderToStaticMarkup(element);
  const all = [...html.matchAll(/style="([^"]*)"/g)].map((m) => m[1]);
  return {
    html,
    bar: all.find((s) => s.includes("overflow:hidden"))!,
    button: /<button type="button" aria-label="Add new" style="([^"]*)"/.exec(html)![1],
    all,
  };
}

const INSET = "env(safe-area-inset-bottom, 0px)";
const SIDE = `clamp(0px, calc(${INSET} - 16px), 18px)`;

describe("BottomNav bottom safe area", () => {
  it("tucks the tabs into the home-indicator inset instead of stacking on it", () => {
    const { bar, all } = styles(<BottomNav tabs={four} action={action} />);
    // 9px with no inset (unchanged); inset - 14px on an iPhone (34 -> 20).
    expect(bar).toContain(`padding-bottom:max(9px, calc(${INSET} - 14px))`);
    // Nothing else adds the raw inset (or its own bottom padding) on top.
    expect(all.filter((s) => s.includes("padding-bottom"))).toHaveLength(1);
  });

  it("keeps the grouped bar's own no-inset padding", () => {
    const { bar } = styles(<BottomNav tabs={four} action={action} groups={["Giving", "Receiving"]} />);
    expect(bar).toContain(`padding-bottom:max(6px, calc(${INSET} - 14px))`);
  });
});

describe("BottomNav side inset", () => {
  it("pulls the tab row in from the rounded corners only where there is an inset", () => {
    const { bar } = styles(<BottomNav tabs={four} action={action} />);
    expect(bar).toContain(`padding-left:${SIDE}`);
    expect(bar).toContain(`padding-right:${SIDE}`);
  });

  it("keeps the + centered for an even tab count", () => {
    const { button } = styles(<BottomNav tabs={four} action={action} />);
    expect(button).toContain(`left:calc(${SIDE} + (100% - 2 * ${SIDE}) * 0.5)`);
  });

  it("keeps the + over its own column for an odd tab count", () => {
    const { button } = styles(<BottomNav tabs={four.slice(0, 3)} action={action} />);
    // 3 tabs -> 4 columns, 2 on the left: the action column centers at 2.5 / 4.
    expect(button).toContain(`* 0.625)`);
  });
});

describe("BottomNav spacing", () => {
  it("sets icon and label 7px apart", () => {
    const { html } = styles(<BottomNav tabs={four} action={action} />);
    expect(html).toContain("gap:7px");
    expect(html).not.toContain("gap:10px");
  });
});

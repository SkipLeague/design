import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TopBar } from "../src/TopBar.js";

// The bar's own inline style, as React emits it. Read from the server markup,
// not the jsdom DOM: jsdom's CSS parser does not understand env() and mangles
// or drops those declarations, while every browser accepts them.
function barStyle(element: React.ReactElement): string {
  const html = renderToStaticMarkup(element);
  const m = /^<div style="([^"]*)"/.exec(html);
  if (!m) throw new Error(`unexpected markup: ${html.slice(0, 80)}`);
  return m[1];
}

describe("TopBar safe areas", () => {
  it("pads the top, left and right safe-area insets by default", () => {
    const style = barStyle(<TopBar app="lists" appName="SkipLists" onSignOut={() => {}} />);
    expect(style).toContain("box-sizing:border-box");
    expect(style).toContain("height:calc(56px + env(safe-area-inset-top, 0px))");
    expect(style).toContain("padding-top:env(safe-area-inset-top, 0px)");
    expect(style).toContain("padding-left:calc(16px + env(safe-area-inset-left, 0px))");
    expect(style).toContain("padding-right:calc(16px + env(safe-area-inset-right, 0px))");
    expect(style).toContain("padding-bottom:0");
  });

  it("keeps the compact sizes", () => {
    const style = barStyle(<TopBar app="lists" appName="SkipLists" compact onSignOut={() => {}} />);
    expect(style).toContain("height:calc(52px + env(safe-area-inset-top, 0px))");
    expect(style).toContain("padding-left:calc(12px + env(safe-area-inset-left, 0px))");
  });

  it("can opt out for a bar that is not at the top edge", () => {
    const style = barStyle(<TopBar app="lists" appName="SkipLists" safeArea={false} onSignOut={() => {}} />);
    expect(style).not.toContain("safe-area");
    expect(style).toContain("height:56px");
    expect(style).toContain("padding:0 16px");
  });
});

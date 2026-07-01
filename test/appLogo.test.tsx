import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import { AppLogo, appGlyphForSlug, APP_GLYPHS } from "../src/AppLogo";

describe("appGlyphForSlug", () => {
  it("maps platform slugs to glyphs by dropping the skip prefix", () => {
    expect(appGlyphForSlug("skiplists")).toBe("lists");
    expect(appGlyphForSlug("skipracquetball")).toBe("racquetball");
    expect(appGlyphForSlug("SkipGifts")).toBe("gifts"); // case-insensitive
  });

  it("returns null for slugs with no glyph", () => {
    expect(appGlyphForSlug("skipevolve")).toBeNull();
    expect(appGlyphForSlug("whatever")).toBeNull();
  });
});

describe("AppLogo", () => {
  it("renders an svg glyph for every registered app", () => {
    for (const app of APP_GLYPHS) {
      const { container, unmount } = render(<AppLogo app={app} />);
      expect(container.querySelector("svg")).toBeTruthy();
      unmount();
    }
  });

  it("sizes the badge from the size prop", () => {
    const { container } = render(<AppLogo app="lists" size={48} />);
    const badge = container.firstElementChild as HTMLElement;
    expect(badge.style.width).toBe("48px");
    expect(badge.style.height).toBe("48px");
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

import { SkipLeagueLogo } from "../src/SkipLeagueLogo";
import { SKIPLEAGUE_LOGO_IMAGES } from "../src/brand/skipLeagueLogoImages";
import * as pkg from "../src/index";

const BRAND = join(__dirname, "../assets/brand/skipleague");

describe("SkipLeagueLogo", () => {
  it("is exported from the package entry", () => {
    expect(pkg.SkipLeagueLogo).toBe(SkipLeagueLogo);
  });

  it("renders the approved artwork as a named image by default", () => {
    render(<SkipLeagueLogo />);
    const img = screen.getByRole("img", { name: "SkipLeague" });
    expect(img.getAttribute("src")).toMatch(/^data:image\/webp;base64,/);
    expect(img).toHaveAttribute("width", "40");
    expect(img).toHaveAttribute("height", "40");
  });

  it("sizes square from the size prop and offers every bundled resolution", () => {
    render(<SkipLeagueLogo size={64} />);
    const img = screen.getByRole("img");
    expect(img.style.width).toBe("64px");
    expect(img.style.height).toBe("64px");
    expect(img).toHaveAttribute("sizes", "64px");
    const srcset = img.getAttribute("srcset") ?? "";
    for (const { width } of SKIPLEAGUE_LOGO_IMAGES) expect(srcset).toContain(` ${width}w`);
  });

  it("uses a custom label as its accessible name", () => {
    render(<SkipLeagueLogo label="SkipLeague home" />);
    expect(screen.getByRole("img", { name: "SkipLeague home" })).toBeInTheDocument();
  });

  it("is hidden from assistive technology when decorative", () => {
    const { container } = render(<SkipLeagueLogo decorative />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("falls back to an image at least 2x the rendered size when one exists", () => {
    const { container } = render(<SkipLeagueLogo size={40} />);
    const src = container.querySelector("img")!.getAttribute("src");
    expect(src).toBe(SKIPLEAGUE_LOGO_IMAGES.find((i) => i.width >= 80)!.src);
  });
});

describe("SkipLeague brand assets", () => {
  it("keeps the approved source byte-for-byte", () => {
    const sha = createHash("sha256").update(readFileSync(join(BRAND, "source/skipleague-logo-approved.png"))).digest("hex");
    expect(sha).toBe("506c05123ef68a51474965869e21c9b172444fed294a5e8c9800c1a6f9f571ba");
  });

  it("ships every generated asset the docs promise", () => {
    const files = [
      ...[1024, 512, 256, 128, 64].map((s) => `png/skipleague-logo-${s}.png`),
      "icons/favicon.ico",
      ...[16, 32, 48].map((s) => `icons/favicon-${s}.png`),
      "icons/icon-192.png",
      "icons/icon-512.png",
      "icons/apple-touch-icon.png",
      "icons/ios-app-icon-1024.png",
    ];
    for (const f of files) expect(existsSync(join(BRAND, f)), f).toBe(true);
  });
});

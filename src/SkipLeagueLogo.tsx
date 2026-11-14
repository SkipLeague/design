import type { CSSProperties } from "react";

import { SKIPLEAGUE_LOGO_IMAGES } from "./brand/skipLeagueLogoImages.js";

export interface SkipLeagueLogoProps {
  /** Rendered width and height in CSS pixels. Default 40. */
  size?: number;
  /**
   * Accessible name announced for the logo. Default `"SkipLeague"`.
   * Ignored when `decorative` is set.
   */
  label?: string;
  /**
   * Set when visible text next to the logo already says "SkipLeague" (a
   * wordmark, a heading), so screen readers do not hear the name twice. The
   * image is then hidden from assistive technology.
   */
  decorative?: boolean;
  /** Extra inline styles, merged over the component's own (layout only; do not recolour or reshape the mark). */
  style?: CSSProperties;
  className?: string;
}

/**
 * The SkipLeague parent-brand logo: the approved "SL" monogram tile
 * (docs/BRANDING.md). It identifies SkipLeague itself, the ecosystem and the
 * iSkip app, never a single product: products keep their own {@link AppLogo}
 * glyph.
 *
 * Renders the approved artwork (not a CSS or font recreation), inlined so it
 * needs no bundler asset setup. The browser picks the sharpest of the bundled
 * resolutions for `size` and the screen's pixel density; they cover up to
 * 128px at 3x / 192px at 2x. For anything larger (a hero or splash image) use
 * the PNG files under `assets/brand/skipleague/png/` instead.
 *
 * The tile has its own rounded corners and is transparent outside them, so it
 * sits on light and dark backgrounds as is: do not add a border, shadow, mask
 * or extra corner radius.
 */
export function SkipLeagueLogo({
  size = 40,
  label = "SkipLeague",
  decorative = false,
  style,
  className,
}: SkipLeagueLogoProps) {
  const fallback = SKIPLEAGUE_LOGO_IMAGES.find((img) => img.width >= size * 2) ?? SKIPLEAGUE_LOGO_IMAGES[SKIPLEAGUE_LOGO_IMAGES.length - 1];
  return (
    <img
      src={fallback.src}
      srcSet={SKIPLEAGUE_LOGO_IMAGES.map((img) => `${img.src} ${img.width}w`).join(", ")}
      sizes={`${size}px`}
      width={size}
      height={size}
      alt={decorative ? "" : label}
      aria-hidden={decorative || undefined}
      draggable={false}
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        verticalAlign: "middle",
        ...style,
      }}
    />
  );
}

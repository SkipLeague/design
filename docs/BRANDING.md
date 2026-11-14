# SkipLeague parent brand

The SkipLeague parent logo is the approved **SL monogram tile**: a bold, italic
white `S` and a shorter, bright cyan `L` set low beside it, on a rounded deep
teal tile with a teal wave rising on the right and the brightest green sweeping
across the lower right.

It was approved on 2026-11-13 (the second of the three final candidates) and is
**visually locked**. This repository is its one authoritative home. Do not
redesign, redraw, regenerate or "clean up" the artwork; if it ever changes, a
new image is approved and replaces the source (see
[Updating the logo](#updating-the-logo)).

## Parent logo vs product glyphs

| Mark | Identifies | Component |
| --- | --- | --- |
| SkipLeague parent logo | SkipLeague itself: the parent website, the iSkip app, shared ecosystem moments (sign-in, onboarding, splash) | `SkipLeagueLogo` |
| Product glyph | One product: Lists, Racquetball, Trips, Gifts, Reading, Today, Guide, Flow, Contacts | `AppLogo` (and `AppBadge` as the letter fallback) |

The parent logo never replaces a product glyph, and products do not get a
"parent" slug. Use the parent logo where the subject is SkipLeague as a whole,
not everywhere it would fit: a product's header, launcher tile and favicon stay
the product's own.

## Assets

Everything lives under `assets/brand/skipleague/`. Only `source/` is original;
everything in `png/`, `icons/` and `src/brand/skipLeagueLogoImages.ts` is
generated from it by `scripts/generate-brand-assets.mjs`.

| File | Size | Background | Use |
| --- | --- | --- | --- |
| `source/skipleague-logo-approved.png` | 647 x 647 | off-white canvas, no alpha | The approved clean export exactly as received (sha256 `506c0512…f571ba`). Never edited. Not shipped in the npm package. |
| `png/skipleague-logo-1024.png` | 1024 x 1024 | transparent outside the tile | High-resolution master for web and print-style use |
| `png/skipleague-logo-{512,256,128,64}.png` | as named | transparent | Web logos (hero, header, cards) |
| `icons/favicon.ico` | 16, 32, 48 | transparent | Browser favicon |
| `icons/favicon-{16,32,48}.png` | as named | transparent | PNG favicons |
| `icons/icon-{192,512}.png` | as named | transparent | Web app manifest icons |
| `icons/apple-touch-icon.png` | 180 x 180 | opaque, full bleed | iOS "Add to Home Screen" (iOS rounds it) |
| `icons/ios-app-icon-1024.png` | 1024 x 1024 | opaque, full bleed, no alpha | iSkip app icon source (Xcode single-size app icon) |

From the npm package they resolve as
`@skipleague/design/brand/skipleague/<png|icons>/<file>`, for example
`@skipleague/design/brand/skipleague/icons/favicon.ico`.

### What generation does (and does not do) to the artwork

1. Finds the tile on the source canvas and makes the canvas transparent. The
   anti-aliased edge keeps real partial transparency with the canvas white
   removed, so there is no white fringe on dark pages.
2. Crops to the tile and pads it to an exact square (the tile is 598 x 593),
   so every resize is uniform and the monogram is never stretched.
3. Resizes with Lanczos. Everything up to 512px is a downscale. The two 1024px
   files (`png/skipleague-logo-1024.png` and `icons/ios-app-icon-1024.png`) are
   a ~1.7x **upscale**, because the approved source tile is only ~598px; they
   are slightly soft at the letter edges when viewed at full size. On an
   iPhone home screen (180px at most) this does not show; it would show on the
   App Store's large icon. A higher-resolution export of this same artwork can
   replace the source with no other change (see
   [Updating the logo](#updating-the-logo)).
4. For the two **opaque full-bleed** icons only: the pixels outside the tile's
   own rounded corners are filled by continuing the neighbouring artwork colour
   outward. iOS applies its own rounded mask to app icons; its curve is a
   little different from the tile's, so without the fill a sliver of white
   would show at each corner. The fill is otherwise hidden by the mask. Do not
   add a rounded mask to these files yourself (that gives double-rounded
   corners).

Nothing else is changed: same proportions, letterforms, colours, waves and
spacing.

### No SVG master

There is deliberately **no SVG**. The artwork is a raster illustration with
soft gradients, glows and a shadow behind the letters; a faithful vector
version cannot be traced from it. The `SkipLeague_Approved_Logo_Clean.svg`
supplied with the approval is not a vector either: it is a single `<image>`
element wrapping the same 647px PNG byte for byte, so it is not stored here
(it would be a fake vector and a duplicate). The source PNG is the master. A
true vector needs a designer to redraw the artwork as vectors and a fresh
approval.

## Using it in React

```tsx
import { SkipLeagueLogo } from "@skipleague/design";

<SkipLeagueLogo size={40} />                       // announced as "SkipLeague"
<SkipLeagueLogo size={32} decorative />            // next to a visible "SkipLeague" wordmark
<SkipLeagueLogo size={48} label="SkipLeague home" /> // inside a link, name the destination
```

- `size`: CSS pixels, square. Default 40.
- `label`: the accessible name. Default `"SkipLeague"`.
- `decorative`: hides the image from screen readers (`alt=""`, `aria-hidden`).
  Use it whenever visible text beside the logo already says SkipLeague.

The component renders the approved artwork from WebP images inlined in the
package (96, 192 and 384px), so it needs no bundler asset configuration and
works offline and inside the iSkip web view. Apps that do not import it do not
pay for it. It covers sizes up to 128px sharply on 3x screens; for anything
larger, use `png/skipleague-logo-1024.png` or `-512.png` directly.

## Display sizes

| Context | Size |
| --- | --- |
| Favicon | 16, 32 (ICO) |
| Inline with text, compact headers | 24 to 32 |
| Site header / top bar | 32 to 40 |
| Cards, sign-in and onboarding | 64 to 96 |
| Splash or hero | 128 and up (PNG files) |

Below 24px the letters are still legible but the waves stop reading; that is
expected for a favicon.

## Backgrounds and clear space

- The tile carries its own background, so it works on light and dark surfaces
  without changes. Verified on white and on near-black.
- Do not put it on a busy photo or a background that is close to its own teal
  and green, where the tile edge disappears.
- Clear space: keep at least **25% of the rendered size** clear on every side
  (10px around a 40px logo). Nothing else sits inside that space.

## Reference colours

Sampled from the approved artwork, for choosing colours that sit well beside
it (for example a splash background). They are **not** design tokens and are
not added to `tokens.css`; the artwork itself is the source of truth.

| Element | Approx. hex |
| --- | --- |
| `S` | `#FFFFFF` |
| `L` | `#03F4FE` |
| Deep teal behind the letters | `#013239` |
| Tile, upper left | `#017672` |
| Teal wave, right | `#018897` |
| Bright lower wave | `#25CB85` |

## Do not

- Redraw, retype or approximate the monogram with a font or CSS.
- Recolour it, change the letter colours, or swap the background.
- Stretch, skew, rotate or crop into the tile.
- Add borders, outlines, shadows, glows or an extra corner radius / mask.
- Place another mark, text or badge inside the tile.
- Use one of the other logo finalists, or any AI regeneration, in its place.
- Keep a hand-edited copy in another repository. Native or framework copies
  (the iSkip asset catalog, a site's `public/` folder) are copied from the
  files here without editing, and refreshed from here when the logo changes.

## Updating the logo

1. A replacement is approved by Ben as a new image, never by editing the
   existing files.
2. Replace `source/skipleague-logo-approved.png` with it and update
   `SOURCE_SHA256` in `scripts/generate-brand-assets.mjs` and the checksum in
   `test/skipLeagueLogo.test.tsx` (the script and test refuse to run on an
   unexpected source, so a silent swap fails loudly).
3. Regenerate:

   ```bash
   npm i --no-save sharp@0.34.5
   node scripts/generate-brand-assets.mjs
   npm run build
   ```

4. Check the `Marks/SkipLeagueLogo` Storybook stories and the iOS icon at
   home-screen size, then open a PR. A new logo is a new package version
   (minor bump), released through [RELEASING.md](./RELEASING.md).
5. Refresh the copies in consuming repositories (the iSkip asset catalog, any
   `public/` favicon copies) from the new package version.

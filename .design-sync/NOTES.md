# design-sync notes — @skipleague/design (SkipUI)

- **`--node-modules` must point at the repo-root `../../node_modules`** (updated 2026-06-18:
  the repo now hoists deps to root; `frontend/node_modules` and the package's own `node_modules`
  no longer exist). The DS package only depends on `react` (not `react-dom`), so the React UMD
  builds the preview cards vendor into `_vendor/` come from the hoisted root, which carries
  matching `react`@18.3.1 + `react-dom`@18.3.1 (both UMD) + `lucide-react`. If a future run
  errors `--node-modules ... does not exist`, re-locate the dir holding `react-dom/umd/`:
  `find ../.. -path '*/react-dom/umd/react-dom.development.js'`.
- **Build first**: `dist/` can lag `src/` — always `npm run build` (tsc) before the converter.
- **Styling idiom**: components use inline `style` objects referencing `var(--skl-*)` CSS
  variables; the *only* stylesheet is `src/tokens.css` (the variable definitions), wired via
  `cfg.tokensGlob`. No compiled component CSS — expect a `[CSS_RUNTIME]`-style note; that's fine
  because styles are inline in the JS, the tokens just need to ship + be `@import`ed by styles.css.
- **Fonts**: `--skl-font-sans` is system fonts only (no webfonts) — no `[FONT_MISSING]` expected.

## Preview specifics
- **ProfileMenu** has no prop to open the dropdown (`open` is internal `useState`). The
  `OpenMenu` story opens it on mount via a `useEffect` that clicks the trigger `button`.
  The wrapper MUST set `alignItems: "flex-start"` — without it the flex child stretches to
  the wrapper height and the absolutely-positioned menu anchors from the bottom and clips.
  `cfg.overrides.ProfileMenu.cardMode = "column"` (one story per row) + `primaryStory: OpenMenu`.
- **Card** stories use a 420px-wide wrapper, which trips `[GRID_OVERFLOW]` in the product's
  grid view → fixed with `cfg.overrides.Card.cardMode = "column"`. Keep it.

## Known render warns
- None outstanding. `[GRID_OVERFLOW]` on Card was resolved by the `cardMode: column` override
  above (won't re-flag by construction).

## Re-sync risks (watch-list for the next run)
- The DS source uses **inline styles + `var(--skl-*)` tokens**; the only stylesheet shipped is
  `src/tokens.css` via `cfg.cssEntry`. If the team adds a real CSS file or a token rename, the
  `conventions.md` token table must be re-validated against `_ds_bundle.css` (the driver's
  conventions step does this and reports drift).
- **`--node-modules ../../frontend/node_modules`** is load-bearing (react-dom UMD). If the
  frontend's React major changes, ensure it still matches the DS's `react` peer before a re-sync.
- ProfileMenu's auto-open story depends on the component keeping a single `<button>` trigger and
  internal open-on-click. If that interaction changes upstream, the `OpenMenu` card goes blank —
  re-check it.
- All 7 components are authored (no floor cards). New components added to `src/index.ts` will
  arrive as floor cards on the next sync until previews are authored for them.

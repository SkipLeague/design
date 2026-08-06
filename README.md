# @skipleague/design (SkipUI)

The shared SkipLeague design system (roadmap #17 / #60) — tokens + React components
so every SkipLeague app uses one set of primitives instead of per-app copies.

## Installing in an app

Published to the public npm registry — a normal dependency, no `.npmrc` and no
token. Add it to the app's `package.json`:

```jsonc
// package.json
"dependencies": {
  "@skipleague/design": "^0.14.0"
}
```

`dist/` is committed to this repo and is exactly what gets published — there is
no build step on install. To pull a newer version later, bump the version
range and reinstall, same as any npm package.

```ts
import "@skipleague/design/tokens.css";
import { ProfileMenu, TopBar, AppLogo, ShareMenu } from "@skipleague/design";
```

## Maps

Two bundled datasets and one presentational component, for "where I've been"
choropleths. **No tile server, no API key, and no runtime dependencies** — the
geometry ships as plain SVG path data, so a consumer adds nothing to its
dependency tree and the map renders offline.

```tsx
import { ChoroplethMap, WORLD_PATHS, WORLD_MAP_WIDTH, WORLD_MAP_HEIGHT } from "@skipleague/design";

<ChoroplethMap
  regions={WORLD_PATHS}                       // or US_STATE_PATHS
  width={WORLD_MAP_WIDTH}
  height={WORLD_MAP_HEIGHT}
  visited={new Set(["US", "PT"])}             // ISO 3166-1 alpha-2
  ariaLabel={(drawn, total) => `World map. ${drawn} of ${total} visited.`}
  onSelect={setSelected}                      // omit for a static map
  selected={selected}
/>
```

| Dataset | Keys | Shapes |
|---|---|---|
| `WORLD_PATHS` | ISO 3166-1 alpha-2 (`"US"`) | 176 countries |
| `US_STATE_PATHS` | FIPS id (`"06"`) | 50 states + DC |

`US_STATE_PATHS` entries carry the full state name (`"California"`,
`"District of Columbia"`), which is the same string SkipPlatform's subdivision
`display_name` carries — so matching needs no crosswalk table.

**The component is dataset-agnostic.** It takes regions, a visited set and a
label; resolving *your* ids to map keys is the caller's job, because only the
caller knows what its ids are. `ariaLabel` receives how many visited regions
were actually drawn, so a caller holding a wider set than the map covers (every
subdivision on a trip, say, including ones outside the US) can't announce a
number the map visibly doesn't show.

Both datasets are generated, not hand-edited. `usStatePaths.ts` is rebuilt with
`scripts/generate-us-state-paths.mjs`; see each file's header for provenance and
licence.

## Usage

Import the tokens once at the app root, then use components anywhere:

```ts
import "@skipleague/design/tokens.css";
import { ProfileMenu } from "@skipleague/design";
```

```tsx
<ProfileMenu
  user={{ displayName: user.display_name, email: user.email }}
  currentSlug="skipracquetball"          // omit on the platform apex
  accountUrl="https://skipleague.com/account"
  onSignOut={logout}
  tone="light"                            // "dark" for dark headers (default)
/>
```

The app switcher lists the live SkipLeague apps (`SKIPLEAGUE_APPS`); the current
app is highlighted light-green and non-clickable. To add an app (e.g. when
SkipToday/SkipEvolve launch), update `src/apps.ts` — every app's menu follows.

## Exports

- `ProfileMenu`, `AppBadge`, `AppLogo`, `TopBar`, `TopBarIconButton`, `TopBarBackButton`, `ShareMenu`
- `Button`, `Card`, `Field`, `Input`, `Select`
- `SKIPLEAGUE_APPS`, `SKIPLEAGUE_ACCOUNT_URL`, type `AppLink`
- `@skipleague/design/tokens.css` — the design tokens (CSS variables)

## Build

```bash
npm install
npm run build   # tsc → dist/
```

## Releasing a new version

See **[docs/RELEASING.md](./docs/RELEASING.md)** for the full flow and the
one-time environment setup it depends on. In short: bump `version` in
`package.json` and merge that to `main` like any other change, then trigger the
**Release** workflow from the Actions tab and approve the pending deployment —
that tag push is what fires the actual npm publish. Tagging is deliberately
a separate, human-approved step from merging the version bump; there is no
single action that both merges and ships.

## Roadmap

Adopt `TopBar`/`AppLogo` + the rest across the apps (replacing per-app copies),
then keep extending the component set. See SkipPlatform roadmap #60.

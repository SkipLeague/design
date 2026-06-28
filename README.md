# @skipleague/design (SkipUI)

The shared SkipLeague design system (roadmap #17 / #60) — tokens + React components
so every SkipLeague app uses one set of primitives instead of per-app copies.
Published to **GitHub Packages** as `@skipleague/design`.

## Installing in an app

GitHub Packages hosts the `@skipleague` scope, so each consuming repo needs an
`.npmrc` pointing that scope at the GH registry:

```ini
# .npmrc (in the app repo root)
@skipleague:registry=https://npm.pkg.github.com
```

Then add the dependency and import. Installing a **private** package requires a
`read:packages` token (set `NODE_AUTH_TOKEN`/`NPM_TOKEN` in CI); if the package is
made **public**, no token is needed to install.

```ts
import "@skipleague/design/tokens.css";
import { ProfileMenu, TopBar, AppLogo, ShareMenu } from "@skipleague/design";
```

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

- `ProfileMenu`, `AppBadge`, `AppLogo`, `TopBar`, `TopBarIconButton`, `ShareMenu`
- `Button`, `Card`, `Field`, `Input`, `Select`
- `SKIPLEAGUE_APPS`, `SKIPLEAGUE_ACCOUNT_URL`, type `AppLink`
- `@skipleague/design/tokens.css` — the design tokens (CSS variables)

## Build

```bash
npm install
npm run build   # tsc → dist/
```

## Publishing

`tsc` builds to `dist/`, and `.github/workflows/publish.yml` publishes to GitHub
Packages on a version tag or a manual run:

```bash
npm version patch        # bump version + create the vX.Y.Z tag
git push --follow-tags   # the tag triggers the publish workflow
```

The publish workflow uses the built-in `GITHUB_TOKEN` (no extra secret needed to
publish a package owned by this org).

## Roadmap

Adopt `TopBar`/`AppLogo` + the rest across the apps (replacing per-app copies),
then keep extending the component set. See SkipPlatform roadmap #60.

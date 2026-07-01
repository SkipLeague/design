# @skipleague/design (SkipUI)

The shared SkipLeague design system (roadmap #17 / #60) — tokens + React components
so every SkipLeague app uses one set of primitives instead of per-app copies.

## Installing in an app

This is a **public repo installed directly from git** — no registry, no auth token.
Add it to the app's `package.json` pinned to a version tag:

```jsonc
// package.json
"dependencies": {
  "@skipleague/design": "github:SkipLeague/design#v0.3.1"
}
```

`npm install` clones the repo at that tag and runs its `prepare` script (builds
`dist/`), so the package is ready to import — in local dev and in CI, with no
`.npmrc` and no token. To pull a newer version later, bump the `#vX.Y.Z` tag.

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

There's no registry to publish to — consumers install from git by tag. To cut a
release, bump the version and push the tag, then point apps at the new tag:

```bash
npm version patch        # bump version + create the vX.Y.Z tag
git push --follow-tags   # publish the tag for consumers to pin
```

`prepare` builds `dist/` automatically on every install, so `dist/` is not committed.

## Roadmap

Adopt `TopBar`/`AppLogo` + the rest across the apps (replacing per-app copies),
then keep extending the component set. See SkipPlatform roadmap #60.

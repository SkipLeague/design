# SkipUI (@skipleague/design) — building with this design system

SkipUI is a small, token-driven React kit. Components are plain React functions
styled with **inline styles that read CSS custom properties** (`var(--skl-*)`).
There is **no CSS-class system and no provider to wrap** — the only requirement is
that the `--skl-*` design tokens are present, which `styles.css` already supplies
(it `@import`s the token sheet). Use the components directly; they style themselves.

## Components (all on `window.SkipUI`)
- **Button** — `variant="primary"` (brand-green fill, default) or `"secondary"` (white, bordered).
- **Field** — a labeled form row: `label`, optional `hint`, and the control as `children` (wrap an `Input` or `Select`).
- **Input** — token-styled text input (standard `<input>` props; `disabled` mutes it).
- **Select** — token-styled native select; pass `<option>`s as `children`.
- **Card** — a bordered section container with an optional `title` heading.
- **AppBadge** — the square brand-green letter logo for a SkipLeague app (`name`, optional `size`).
- **ProfileMenu** — the account control: a trigger button that opens a dropdown with the user,
  an inline app switcher, Manage account, and Sign out. `onSignOut` is required;
  `tone="dark"` (default) suits dark headers, `tone="light"` suits white ones.

## Styling idiom — use the tokens, never classes
Style your own layout glue (wrappers, grids, spacing) with the **same `var(--skl-*)`
tokens** the components use. There is no Tailwind / CSS-module / className layer — do not
invent class names.

- **Color**: `--skl-color-brand` (#0f766e teal), `--skl-color-brand-bright` (#5eead4 mint),
  `--skl-color-text`, `--skl-color-text-muted`, `--skl-color-text-faint`,
  `--skl-color-border`, `--skl-color-surface`, `--skl-color-surface-muted`,
  `--skl-color-current-bg` / `--skl-color-current-text` (the selected / "current" highlight).
- **Type**: `--skl-font-sans`, `--skl-text-sm`, `--skl-text-xs`, `--skl-text-2xs`.
- **Radius**: `--skl-radius-panel` (10px), `--skl-radius-control` (9px), `--skl-radius-md` (6px), `--skl-radius-badge` (5px).
- **Elevation**: `--skl-shadow-menu`.

## Where the truth lives
- Token definitions: `styles.css` → `_ds_bundle.css` (the `:root { --skl-* }` block) — read it before styling.
- Per-component API and usage: each `components/general/<Name>/<Name>.d.ts` and `<Name>.prompt.md`.

## Idiomatic example
```tsx
<Card title="Account settings">
  <div style={{ display: "grid", gap: "1rem" }}>
    <Field label="Display name"><Input defaultValue="Ben Wells" /></Field>
    <Field label="Email" hint="Used for sign-in and match notifications.">
      <Input defaultValue="ben@skipleague.com" />
    </Field>
    <Button>Save changes</Button>
  </div>
</Card>
```

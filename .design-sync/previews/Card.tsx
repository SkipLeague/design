import { Card, Field, Input, Button } from "@skipleague/design";

/** A titled section card with body copy — the standard settings-page grouping. */
export const Basic = () => (
  <div style={{ width: 420 }}>
    <Card title="Profile">
      <p style={{ margin: 0, fontFamily: "var(--skl-font-sans)", fontSize: "0.875rem", color: "var(--skl-color-text)" }}>
        Your display name and email are visible to other players in your leagues.
      </p>
    </Card>
  </div>
);

/** A card wrapping a real form — the common account-settings composition. */
export const WithForm = () => (
  <div style={{ width: 420 }}>
    <Card title="Account settings">
      <div style={{ display: "grid", gap: "1rem" }}>
        <Field label="Display name">
          <Input defaultValue="Ben Wells" />
        </Field>
        <Field label="Email" hint="Used for sign-in and match notifications.">
          <Input defaultValue="ben@skipleague.com" />
        </Field>
        <div>
          <Button>Save changes</Button>
        </div>
      </div>
    </Card>
  </div>
);

/** Untitled — a plain bordered container with no heading. */
export const Untitled = () => (
  <div style={{ width: 420 }}>
    <Card>
      <p style={{ margin: 0, fontFamily: "var(--skl-font-sans)", fontSize: "0.875rem", color: "var(--skl-color-text-muted)" }}>
        A plain bordered container used to group related controls without a heading.
      </p>
    </Card>
  </div>
);

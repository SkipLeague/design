import { Field, Input, Select } from "@skipleague/design";

/** A labeled text field — label above the control. */
export const Text = () => (
  <div style={{ width: 320 }}>
    <Field label="Display name">
      <Input defaultValue="Alex S." />
    </Field>
  </div>
);

/** A field with a hint line below the control. */
export const WithHint = () => (
  <div style={{ width: 320 }}>
    <Field label="Email" hint="Used for sign-in and match notifications.">
      <Input defaultValue="alex@example.com" />
    </Field>
  </div>
);

/** A field wrapping a Select instead of an Input. */
export const WithSelect = () => (
  <div style={{ width: 320 }}>
    <Field label="Timezone" hint="Match times are shown in your local time.">
      <Select defaultValue="America/Los_Angeles">
        <option>America/Los_Angeles</option>
        <option>America/New_York</option>
        <option>Europe/London</option>
      </Select>
    </Field>
  </div>
);

/** Two stacked fields — how a form section reads. */
export const Stacked = () => (
  <div style={{ width: 320, display: "grid", gap: "1rem" }}>
    <Field label="First name">
      <Input defaultValue="Alex" />
    </Field>
    <Field label="Last name">
      <Input defaultValue="S." />
    </Field>
  </div>
);

import { Input } from "@skipleague/design";

/** A text input with a value. */
export const Default = () => (
  <div style={{ width: 300 }}>
    <Input defaultValue="Ben Wells" />
  </div>
);

/** Empty input showing placeholder text. */
export const Placeholder = () => (
  <div style={{ width: 300 }}>
    <Input placeholder="you@example.com" />
  </div>
);

/** Disabled input — muted fill and text. */
export const Disabled = () => (
  <div style={{ width: 300 }}>
    <Input defaultValue="ben@skipleague.com" disabled />
  </div>
);

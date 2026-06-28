import { Button } from "@skipleague/design";

/** The default brand-green primary action. */
export const Primary = () => <Button>Save changes</Button>;

/** White-with-border secondary action, for the lower-emphasis choice. */
export const Secondary = () => <Button variant="secondary">Cancel</Button>;

/** Both variants paired the way they sit in a form footer. */
export const Pair = () => (
  <div style={{ display: "flex", gap: "0.75rem" }}>
    <Button>Save changes</Button>
    <Button variant="secondary">Cancel</Button>
  </div>
);

/** Disabled state (60% opacity, default cursor). */
export const Disabled = () => <Button disabled>Save changes</Button>;

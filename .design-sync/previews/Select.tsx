import { Select } from "@skipleague/design";

/** A styled select; pass `<option>`s as children. */
export const Default = () => (
  <div style={{ width: 300 }}>
    <Select defaultValue="America/New_York">
      <option>America/Los_Angeles</option>
      <option>America/New_York</option>
      <option>Europe/London</option>
    </Select>
  </div>
);

/** Select alongside other timezone choices. */
export const Timezone = () => (
  <div style={{ width: 300 }}>
    <Select defaultValue="Europe/London">
      <option>America/Los_Angeles</option>
      <option>America/Denver</option>
      <option>America/Chicago</option>
      <option>America/New_York</option>
      <option>Europe/London</option>
      <option>Europe/Paris</option>
    </Select>
  </div>
);

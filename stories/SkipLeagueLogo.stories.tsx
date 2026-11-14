import type { Meta, StoryObj } from "@storybook/react-vite";

import { SkipLeagueLogo } from "../src/SkipLeagueLogo";

const meta: Meta<typeof SkipLeagueLogo> = {
  title: "Marks/SkipLeagueLogo",
  component: SkipLeagueLogo,
  args: { size: 64 },
};
export default meta;

type Story = StoryObj<typeof SkipLeagueLogo>;

export const Single: Story = {};

const SIZES = [16, 24, 32, 40, 64, 96, 128];

function Row({ background, color }: { background: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 20, padding: 24, background, fontFamily: "var(--skl-font-sans)" }}>
      {SIZES.map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <SkipLeagueLogo size={size} />
          <span style={{ fontSize: 12, color }}>{size}px</span>
        </div>
      ))}
    </div>
  );
}

/** Common web sizes on light and dark surfaces: the gallery that catches a soft, fringed or distorted render. */
export const SizesLightAndDark: Story = {
  render: () => (
    <div>
      <Row background="#ffffff" color="#475569" />
      <Row background="#0f172a" color="#cbd5e1" />
    </div>
  ),
};

/** With a visible wordmark next to it, the logo is decorative so the name is not announced twice. */
export const WithWordmark: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 24, fontFamily: "var(--skl-font-sans)" }}>
      <SkipLeagueLogo size={32} decorative />
      <span style={{ fontWeight: 700, fontSize: 18, color: "var(--skl-color-text)" }}>SkipLeague</span>
    </div>
  ),
};

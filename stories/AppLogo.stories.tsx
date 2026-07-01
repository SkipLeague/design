import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppLogo, APP_GLYPHS } from "../src/AppLogo";

const meta: Meta<typeof AppLogo> = {
  title: "Marks/AppLogo",
  component: AppLogo,
  args: { app: "racquetball", size: 48 },
};
export default meta;

type Story = StoryObj<typeof AppLogo>;

export const Single: Story = {};

/** Every per-app glyph — the visual gallery that catches a bad/missing mark. */
export const AllGlyphs: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, padding: 24, fontFamily: "var(--skl-font-sans)" }}>
      {APP_GLYPHS.map((app) => (
        <div key={app} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 100 }}>
          <AppLogo app={app} size={48} />
          <span style={{ fontSize: 12, color: "#475569" }}>{app}</span>
        </div>
      ))}
    </div>
  ),
};

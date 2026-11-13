import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppLauncher } from "../src/AppLauncher";

const apps = [
  { slug: "skiplists", name: "SkipLists", url: "#", status: "live" as const },
  { slug: "skiptrips", name: "SkipTrips", url: "#", status: "live" as const },
  { slug: "skipracquetball", name: "SkipRacquetball", url: "#", status: "live" as const },
  { slug: "skipcontacts", name: "SkipContacts", url: "#", status: "early_access" as const },
  { slug: "skipreading", name: "SkipReading", url: "#", status: "live" as const },
  { slug: "skipgifts", name: "SkipGifts", url: "#", status: "baking" as const },
  { slug: "skiptoday", name: "SkipToday", url: "#", status: "live" as const },
  { slug: "skipflow", name: "SkipFlow", url: null, status: "in_development" as const },
  { slug: "skipguide", name: "SkipGuide", url: "#", status: "live" as const },
  { slug: "skipnewthing", name: "SkipNewThing", url: "#", status: "in_development" as const },
];

const meta: Meta<typeof AppLauncher> = {
  title: "Chrome/AppLauncher",
  component: AppLauncher,
  args: { apps },
  decorators: [
    (S) => (
      <div style={{ background: "var(--skl-color-surface-muted, #f8fafc)", padding: 16 }}>
        <S />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AppLauncher>;

/** Desktop dashboard width. */
export const Default: Story = {};

/** iPhone width (402pt, as phase 0 measured), the iSkip shell Home. */
export const Phone: Story = {
  decorators: [
    (S) => (
      <div style={{ width: 402 - 32 }}>
        <S />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: { apps: [], empty: <p style={{ color: "#64748b" }}>No apps yet.</p> },
};

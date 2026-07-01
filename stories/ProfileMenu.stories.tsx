import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProfileMenu } from "../src/ProfileMenu";

const apps = [
  { slug: "skiplists", name: "SkipLists", url: "#" },
  { slug: "skipracquetball", name: "SkipRacquetball", url: "#" },
  { slug: "skiptrips", name: "SkipTrips", url: "#" },
  { slug: "skipreading", name: "SkipReading", url: "#" },
];
const user = { displayName: "Ben Wells", email: "ben@skipleague.com" };

const meta: Meta<typeof ProfileMenu> = {
  title: "Chrome/ProfileMenu",
  component: ProfileMenu,
  args: { user, currentSlug: "skipracquetball", apps, onSignOut: () => {} },
};
export default meta;

type Story = StoryObj<typeof ProfileMenu>;

const onDark = (bg: string) => (S: () => JSX.Element) => (
  <div style={{ background: bg, padding: 20, display: "flex", justifyContent: "flex-end", minHeight: 320 }}>
    <S />
  </div>
);

export const Dark: Story = {
  args: { tone: "dark" },
  decorators: [(S) => onDark("#0e2e2a")(S)],
};

export const Light: Story = {
  args: { tone: "light" },
  decorators: [(S) => onDark("#ffffff")(S)],
};

/**
 * Regression guard, made visible: a host app with a global `button { padding }`
 * must NOT collapse the fixed 38×38 trigger and shrink the account icon to a dot
 * (the bug fixed in v0.7.1 with an explicit padding:0). The icon should stay full
 * size here despite the aggressive global rule.
 */
export const WithHostButtonPadding: Story = {
  args: { tone: "dark" },
  decorators: [
    (S) => (
      <div style={{ background: "#0e2e2a", padding: 20, display: "flex", justifyContent: "flex-end", minHeight: 320 }}>
        <style>{`button { padding: 0.5rem 1rem; }`}</style>
        <S />
      </div>
    ),
  ],
};

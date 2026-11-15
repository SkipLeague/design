import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowDownUp, Search } from "lucide-react";

import { TopBar, TopBarDetail, TopBarIconButton } from "../src/TopBar";

// The November 2026 top-bar refresh: one 48px bar everywhere, two-tone
// wordmark ("Skip" white, product name mint), pinned, shadow on scroll, and the
// drill-in variant that carries the page title on phones.
const meta: Meta = { title: "Chrome/TopBar" };
export default meta;

const noop = () => {};
const user = { displayName: "Sample User", email: "sample@example.com" };

const Page = ({ rows = 30 }: { rows?: number }) => (
  <div style={{ padding: 16, display: "grid", gap: 10, fontFamily: "var(--skl-font-sans)", background: "#f8fafc" }}>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} style={{ height: 52, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10 }} />
    ))}
  </div>
);

export const AllApps: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <TopBar app="lists" appName="SkipLists" user={user} onSignOut={noop} sticky={false}
        actions={<TopBarIconButton aria-label="Sort"><ArrowDownUp size={17} /></TopBarIconButton>} />
      <TopBar app="racquetball" appName="SkipRacquetball" user={user} onSignOut={noop} sticky={false} />
      <TopBar app="trips" appName="SkipTrips" user={user} onSignOut={noop} sticky={false} />
      <TopBar app="today" appName="SkipToday" user={user} onSignOut={noop} sticky={false} />
      <TopBar app="reading" appName="SkipReading" user={user} onSignOut={noop} sticky={false} showSearch />
    </div>
  ),
};

export const PinnedWithScrollShadow: StoryObj = {
  render: () => (
    <div>
      <TopBar app="lists" appName="SkipLists" user={user} onSignOut={noop} />
      <Page />
    </div>
  ),
};

export const DrillIn: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 390 }}>
      <TopBarDetail appName="SkipLists" title="Groceries" onBack={noop} user={user} onSignOut={noop}
        actions={<TopBarIconButton aria-label="Search"><Search size={17} /></TopBarIconButton>} />
      <Page rows={12} />
    </div>
  ),
};

export const LightTone: StoryObj = {
  render: () => <TopBar app="reading" appName="SkipReading" tone="light" user={user} onSignOut={noop} sticky={false} />,
};

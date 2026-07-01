import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, Home, Plus, Trophy, Users } from "lucide-react";

import { ResponsiveShell } from "../src/ResponsiveShell";
import { IconRail } from "../src/IconRail";
import { SidebarNav } from "../src/SidebarNav";

// Mock chrome/content so the shell has something to reflow. Resize the Storybook
// canvas across 720px and 1080px to see phone → tablet → desktop.
const TopBarMock = () => (
  <div style={{ height: 52, background: "#0e2e2a", color: "#eafaf6", display: "flex", alignItems: "center", padding: "0 16px", fontFamily: "var(--skl-font-sans)", fontWeight: 700 }}>
    SkipRacquetball
  </div>
);

const MainMock = () => (
  <div style={{ maxWidth: 620, margin: "0 auto", padding: 20, fontFamily: "var(--skl-font-sans)" }}>
    <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Players</h1>
    {["Dana Cho", "Marco Ruiz", "Tara Singh"].map((n) => (
      <div key={n} style={{ display: "flex", gap: 12, padding: "11px 13px", border: "1px solid #e2e8f0", borderRadius: 14, marginBottom: 10, alignItems: "center" }}>
        <span style={{ width: 40, height: 40, borderRadius: 12, background: "var(--skl-color-brand)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>
          {n.split(" ").map((p) => p[0]).join("")}
        </span>
        <span style={{ fontWeight: 600 }}>{n}</span>
      </div>
    ))}
  </div>
);

const DetailMock = () => (
  <div style={{ padding: 18, fontFamily: "var(--skl-font-sans)" }}>
    <div style={{ fontWeight: 800, fontSize: 17 }}>Dana Cho</div>
    <div style={{ color: "#64748b", fontSize: 12.5, marginBottom: 14 }}>Rank #3 · Singles</div>
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ flex: 1, background: "#eef2f7", borderRadius: 13, padding: 13, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 28, color: "var(--skl-color-brand)" }}>4</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Your wins</div>
      </div>
      <div style={{ flex: 1, background: "#eef2f7", borderRadius: 13, padding: 13, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 28 }}>2</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Their wins</div>
      </div>
    </div>
  </div>
);

const BottomNavMock = () => (
  <div style={{ display: "flex", justifyContent: "space-around", padding: "8px 6px 12px", background: "#fff", borderTop: "1px solid #e2e8f0", fontFamily: "var(--skl-font-sans)" }}>
    {[["Home", Home], ["Players", Users], ["Ranks", BarChart3], ["League", Trophy]].map(([label, Icon]) => {
      const I = Icon as typeof Home;
      return (
        <div key={label as string} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 600, color: "#94a3b8" }}>
          <I size={22} /> {label as string}
        </div>
      );
    })}
  </div>
);

const railItems = [
  { key: "match", label: "Match", icon: <Plus size={21} />, onClick: () => {} },
  { key: "home", label: "Home", icon: <Home size={21} />, active: true },
  { key: "players", label: "Players", icon: <Users size={21} /> },
  { key: "ranks", label: "Ranks", icon: <BarChart3 size={21} /> },
  { key: "league", label: "League", icon: <Trophy size={21} /> },
];
const sidebarSections = [
  {
    items: [
      { key: "match", label: "Log a match", icon: <Plus size={19} /> },
      { key: "home", label: "Home", icon: <Home size={19} />, active: true },
      { key: "players", label: "Players", icon: <Users size={19} /> },
      { key: "ranks", label: "Rankings", icon: <BarChart3 size={19} /> },
      { key: "league", label: "League", icon: <Trophy size={19} /> },
    ],
  },
];

const meta: Meta<typeof ResponsiveShell> = {
  title: "Shell/ResponsiveShell",
  component: ResponsiveShell,
  parameters: {
    docs: { description: { component: "Resize the canvas across **720px** and **1080px** to see the reflow: phone bottom-tabs → tablet icon-rail → desktop sidebar (+ docked detail)." } },
  },
  decorators: [(S) => <div style={{ height: 640, border: "1px solid #cbd5e1" }}><S /></div>],
};
export default meta;

type Story = StoryObj<typeof ResponsiveShell>;

/** The Players list-detail layout (detail docks on desktop, overlays on phone/tablet). */
export const PlayersWithDetail: Story = {
  args: {
    topBar: <TopBarMock />,
    main: <MainMock />,
    detail: <DetailMock />,
    detailOpen: false,
    bottomNav: <BottomNavMock />,
    rail: <IconRail items={railItems} />,
    sidebar: <SidebarNav sections={sidebarSections} width={236} />,
  },
};

/** A view with no docked detail — desktop is sidebar + content (2 columns). */
export const NoDetail: Story = {
  args: {
    topBar: <TopBarMock />,
    main: <MainMock />,
    bottomNav: <BottomNavMock />,
    rail: <IconRail items={railItems} />,
    sidebar: <SidebarNav sections={sidebarSections} width={236} />,
  },
};

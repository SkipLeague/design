import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image as ImageIcon, Gamepad2 } from "lucide-react";

import { RecordRow, recordRowActions } from "../src/RecordRow";
import { ListActionBar } from "../src/ListActionBar";
import { StatBandHero } from "../src/StatBandHero";
import { ListSearch } from "../src/ListSearch";

const meta: Meta = { title: "Lists/Record system" };
export default meta;
type Story = StoryObj;

const noop = () => {};
const actions = recordRowActions({ onEdit: noop, onDuplicate: noop, onDelete: noop });

const Screen = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 340, background: "var(--skl-color-canvas)", borderRadius: 22, padding: "13px 12px 16px" }}>
    {children}
  </div>
);

/** 2a — Countries: search, (real map lives in the app; band shown for context), rows with flag tiles + visit stats. */
export const Countries: Story = {
  render: () => (
    <Screen>
      <ListSearch value="" onChange={noop} placeholder="Search countries" />
      <div style={{ marginTop: 11, marginBottom: 4, fontSize: 11, color: "#94a3b8" }}>
        (SkipLists renders your real world map here, at full size)
      </div>
      <ListActionBar count={18} onSort={noop} onAdd={noop} style={{ margin: "9px 2px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <RecordRow leading={{ kind: "emoji", emoji: "🇫🇷" }} title="France" subline="2005, 2013, 2021" stat={{ value: 3, label: "visits" }} actions={actions} onOpen={noop} />
        <RecordRow leading={{ kind: "emoji", emoji: "🇬🇧" }} title="United Kingdom" subline="England, Scotland" stat={{ value: 5, label: "visits" }} actions={actions} onOpen={noop} />
        <RecordRow leading={{ kind: "emoji", emoji: "🇮🇹" }} title="Italy" subline="2018, 2023" stat={{ value: 2, label: "visits" }} actions={actions} onOpen={noop} />
      </div>
    </Screen>
  ),
};

/** 2b — Trips: 4-stat band hero + flag rows with nights. */
export const Trips: Story = {
  render: () => (
    <Screen>
      <ListSearch value="" onChange={noop} placeholder="Search trips" />
      <StatBandHero
        style={{ marginTop: 11 }}
        stats={[
          { value: 6, label: "trips" },
          { value: 47, label: "nights" },
          { value: 11, label: "states" },
          { value: 5, label: "countries" },
        ]}
      />
      <ListActionBar count={6} onSort={noop} onAdd={noop} style={{ margin: "9px 2px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <RecordRow leading={{ kind: "emoji", emoji: "🇮🇹" }} title="Amalfi Coast" subline="Italy · Jun 2023" stat={{ value: 7, label: "nights" }} actions={actions} onOpen={noop} />
        <RecordRow leading={{ kind: "emoji", emoji: "🇯🇵" }} title="Kyoto" subline="Japan · Apr 2024" stat={{ value: 9, label: "nights" }} actions={actions} onOpen={noop} />
      </div>
    </Screen>
  ),
};

/** 2c — Artwork: no hero, larger search leads the body, gradient tiles, no trailing stat. */
export const Artwork: Story = {
  render: () => (
    <Screen>
      <ListSearch value="" onChange={noop} placeholder="Search artworks & artists" size="lg" />
      <ListActionBar count={12} onSort={noop} onAdd={noop} style={{ margin: "13px 2px 9px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <RecordRow leading={{ kind: "gradient", gradient: "linear-gradient(135deg,#bfdbfe,#93c5fd)", node: <ImageIcon size={22} /> }} title="Starry Night" subline="Vincent van Gogh · 1889" actions={actions} onOpen={noop} />
        <RecordRow leading={{ kind: "gradient", gradient: "linear-gradient(135deg,#fbcfe8,#f9a8d4)", node: <ImageIcon size={22} /> }} title="The Great Wave" subline="Hokusai · c.1831" actions={actions} onOpen={noop} />
      </div>
    </Screen>
  ),
};

/** Generic custom list (e.g. Dean's Video Games): glyph tile + numeric stat. */
export const CustomList: Story = {
  render: () => (
    <Screen>
      <ListSearch value="" onChange={noop} placeholder="Search records" />
      <ListActionBar count={13} onSort={noop} onAdd={noop} style={{ margin: "13px 2px 9px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <RecordRow leading={{ kind: "glyph", node: <Gamepad2 size={24} />, tint: "#64748b" }} title="Grand Theft Auto V" subline="PS4 · 2014 · Rockstar Games" stat={{ value: 97, label: "metacritic" }} actions={actions} onOpen={noop} />
        <RecordRow leading={{ kind: "glyph", node: <Gamepad2 size={24} />, tint: "#64748b" }} title="Shadow of the Colossus" subline="PS4 · 2018 · Bluepoint Games" stat={{ value: 91, label: "metacritic" }} actions={actions} onOpen={noop} />
      </div>
    </Screen>
  ),
};

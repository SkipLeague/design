import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ChoroplethMap } from "../src/maps/ChoroplethMap";
import { WORLD_PATHS, WORLD_MAP_WIDTH, WORLD_MAP_HEIGHT } from "../src/maps/worldMapPaths";
import { US_STATE_PATHS, US_MAP_WIDTH, US_MAP_HEIGHT } from "../src/maps/usStatePaths";

const meta: Meta<typeof ChoroplethMap> = {
  title: "Data/ChoroplethMap",
  component: ChoroplethMap,
};
export default meta;

type Story = StoryObj<typeof ChoroplethMap>;

const frame = (children: React.ReactNode) => (
  <div style={{ maxWidth: 640, padding: 16, fontFamily: "var(--skl-font-sans)" }}>{children}</div>
);

/** The world, keyed by ISO 3166-1 alpha-2. */
export const World: Story = {
  render: () =>
    frame(
      <ChoroplethMap
        regions={WORLD_PATHS}
        width={WORLD_MAP_WIDTH}
        height={WORLD_MAP_HEIGHT}
        visited={new Set(["US", "PT", "ZA", "JP", "AU", "IS"])}
        ariaLabel={(drawn, total) => `World map. ${drawn} of ${total} countries visited.`}
      />,
    ),
};

/** US states, keyed by FIPS id. Alaska and Hawaii are inset by the projection. */
export const UsStates: Story = {
  render: () =>
    frame(
      <ChoroplethMap
        regions={US_STATE_PATHS}
        width={US_MAP_WIDTH}
        height={US_MAP_HEIGHT}
        visited={
          new Set(
            Object.entries(US_STATE_PATHS)
              .filter(([, s]) =>
                ["Hawaii", "Washington", "Colorado", "Illinois", "New York", "Alaska"].includes(s.name),
              )
              .map(([id]) => id),
          )
        }
        ariaLabel={(drawn, total) => `US map. ${drawn} of ${total} states visited.`}
      />,
    ),
};

/** Nowhere visited — the "before you've travelled" state, which should still
 *  read as a map rather than as an error. */
export const Empty: Story = {
  render: () =>
    frame(
      <ChoroplethMap
        regions={WORLD_PATHS}
        width={WORLD_MAP_WIDTH}
        height={WORLD_MAP_HEIGHT}
        visited={new Set()}
        ariaLabel={(drawn, total) => `World map. ${drawn} of ${total} countries visited.`}
      />,
    ),
};

/** Tap a region to select it; tap the ocean to clear. The selected shape paints
 *  last so its outline is not clipped by its neighbours. */
export const Interactive: Story = {
  render: function Interactive() {
    const [selected, setSelected] = useState<string | null>("FR");
    return frame(
      <>
        <ChoroplethMap
          regions={WORLD_PATHS}
          width={WORLD_MAP_WIDTH}
          height={WORLD_MAP_HEIGHT}
          visited={new Set(["FR", "ES", "IT"])}
          selected={selected}
          onSelect={setSelected}
          ariaLabel={(drawn, total) => `World map. ${drawn} of ${total} countries visited.`}
        />
        <p style={{ marginTop: 8, font: "600 13px var(--skl-font-sans)", color: "#334155" }}>
          {selected ? WORLD_PATHS[selected]?.name : "Tap a country."}
        </p>
      </>,
    );
  },
};

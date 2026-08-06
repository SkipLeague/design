import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ChoroplethMap } from "../src/maps/ChoroplethMap.js";
import { WORLD_PATHS, WORLD_MAP_WIDTH, WORLD_MAP_HEIGHT } from "../src/maps/worldMapPaths.js";
import { US_STATE_PATHS, US_MAP_WIDTH, US_MAP_HEIGHT } from "../src/maps/usStatePaths.js";

const REGIONS = {
  a: { name: "Aland", path: "M0,0L10,0L10,10Z" },
  b: { name: "Beeland", path: "M20,0L30,0L30,10Z" },
  c: { name: "Ceeland", path: "M40,0L50,0L50,10Z" },
};

const label = (drawn: number, total: number) => `Map. ${drawn} of ${total} visited.`;

function paths(container: HTMLElement) {
  return [...container.querySelectorAll("path")];
}

describe("ChoroplethMap", () => {
  it("fills visited regions and still draws the rest as context", () => {
    const { container } = render(
      <ChoroplethMap
        regions={REGIONS}
        width={100}
        height={100}
        visited={new Set(["a", "c"])}
        ariaLabel={label}
      />,
    );

    const filled = paths(container).filter((p) => p.getAttribute("fill") === "#0f766e");
    expect(filled).toHaveLength(2);
    expect(paths(container)).toHaveLength(3);
  });

  it("counts only regions it can actually draw", () => {
    // Callers routinely hold a wider set than the dataset covers — every
    // subdivision on a trip, including ones in other countries. Reporting
    // those would claim more than the map shows.
    render(
      <ChoroplethMap
        regions={REGIONS}
        width={100}
        height={100}
        visited={new Set(["a", "not-on-this-map"])}
        ariaLabel={label}
      />,
    );

    expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Map. 1 of 3 visited.");
  });

  it("is exposed as an image so its label is announced at all", () => {
    render(
      <ChoroplethMap regions={REGIONS} width={100} height={100} visited={new Set()} ariaLabel={label} />,
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("reports the tapped region, and clears on the background", async () => {
    const onSelect = vi.fn();
    const { container } = render(
      <ChoroplethMap
        regions={REGIONS}
        width={100}
        height={100}
        visited={new Set(["a"])}
        ariaLabel={label}
        onSelect={onSelect}
      />,
    );

    await userEvent.click(paths(container)[0]);
    expect(onSelect).toHaveBeenLastCalledWith("a");

    await userEvent.click(screen.getByRole("img"));
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it("toggles a region off when it is tapped again", async () => {
    const onSelect = vi.fn();
    const { container } = render(
      <ChoroplethMap
        regions={REGIONS}
        width={100}
        height={100}
        visited={new Set()}
        ariaLabel={label}
        onSelect={onSelect}
        selected="a"
      />,
    );

    // "a" paints last when selected, so it is the final path.
    await userEvent.click(paths(container)[paths(container).length - 1]);
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it("paints the selected region last so its outline is not clipped", () => {
    const { container } = render(
      <ChoroplethMap
        regions={REGIONS}
        width={100}
        height={100}
        visited={new Set()}
        ariaLabel={label}
        selected="a"
      />,
    );

    const last = paths(container)[paths(container).length - 1];
    expect(last.getAttribute("d")).toBe(REGIONS.a.path);
  });

  it("is not interactive without onSelect", async () => {
    const { container } = render(
      <ChoroplethMap regions={REGIONS} width={100} height={100} visited={new Set()} ariaLabel={label} />,
    );
    expect(paths(container)[0].style.cursor).toBe("");
  });
});

describe("the bundled datasets", () => {
  it("ships the world keyed by ISO alpha-2", () => {
    expect(Object.keys(WORLD_PATHS)).toHaveLength(176);
    expect(WORLD_PATHS.US.name).toBe("United States");
    expect(WORLD_PATHS.PT.name).toBe("Portugal");
    expect(WORLD_MAP_WIDTH).toBe(900);
    expect(WORLD_MAP_HEIGHT).toBeCloseTo(440.7, 1);
  });

  it("ships the 50 states plus DC, named as SkipPlatform names them", () => {
    const names = Object.values(US_STATE_PATHS).map((s) => s.name);
    expect(names).toHaveLength(51);
    // The match that means no crosswalk table is needed.
    expect(names).toContain("District of Columbia");
    expect(names).toContain("California");
    // Territories are absent by design: geoAlbersUsa drops anything outside
    // US bounds, so shipping them would mean shapes that never render.
    expect(names).not.toContain("Puerto Rico");
  });

  it("every region has a non-empty path, so nothing renders blank", () => {
    for (const [key, region] of Object.entries({ ...WORLD_PATHS, ...US_STATE_PATHS })) {
      expect(region.path.length, `${key} (${region.name}) has no path`).toBeGreaterThan(0);
      expect(region.path.startsWith("M"), `${key} path is malformed`).toBe(true);
    }
  });

  it("US paths sit inside the coordinate space they were projected into", () => {
    // Catches a bad regeneration: a projection fitted to the wrong feature set
    // puts shapes outside the viewBox, where they silently do not render.
    const numbers = Object.values(US_STATE_PATHS)
      .flatMap((s) => s.path.match(/-?\d+(\.\d+)?/g) ?? [])
      .map(Number);
    expect(Math.min(...numbers)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...numbers)).toBeLessThanOrEqual(Math.max(US_MAP_WIDTH, US_MAP_HEIGHT));
  });

  it("draws the real datasets without error", () => {
    const { container } = render(
      <ChoroplethMap
        regions={US_STATE_PATHS}
        width={US_MAP_WIDTH}
        height={US_MAP_HEIGHT}
        visited={new Set(Object.keys(US_STATE_PATHS).slice(0, 3))}
        ariaLabel={label}
      />,
    );
    expect(paths(container)).toHaveLength(51);
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Map. 3 of 51 visited.");
  });
});

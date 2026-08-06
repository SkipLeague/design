import { useMemo, useState } from "react";

/** One region the map can draw. Both bundled datasets already have this shape,
 *  and an app supplying its own only needs a name and an SVG path. */
export interface MapRegion {
  name: string;
  path: string;
}

export interface ChoroplethMapProps {
  /** key -> region. `US_STATE_PATHS`, `WORLD_PATHS`, or your own. */
  regions: Record<string, MapRegion>;
  /** The coordinate space `regions` was generated in. */
  width: number;
  height: number;
  /** Keys to fill as visited. Keys the map has no shape for are ignored, not
   *  an error — see `drawableCount`. */
  visited: Set<string>;
  /** Announced on the <svg>. Receives how many visited regions were actually
   *  drawn and how many regions exist, so the label can't claim more than the
   *  map shows. */
  ariaLabel: (drawn: number, total: number) => string;
  /** Called when a region is tapped, and with null when the background is.
   *  Omit for a static map. */
  onSelect?: (key: string | null) => void;
  /** The tapped region, if the parent is tracking one. */
  selected?: string | null;
  visitedFill?: string;
  unvisitedFill?: string;
}

const DEFAULT_VISITED = "#0f766e";
const DEFAULT_UNVISITED = "#dbe4ec";
const STROKE = "#f8fafc";
const SELECTED_STROKE = "#0e2e2a";

/**
 * A "where I've been" map: regions you've visited filled in, the rest drawn as
 * context.
 *
 * Presentational and dataset-agnostic on purpose. It takes regions, a visited
 * set and a label, and knows nothing about countries, states, trips or reading
 * lists — so the same component draws SkipLists' Countries Visited, SkipTrips'
 * travel statistics and whatever comes next. Resolving *your* ids to map keys
 * is the caller's job, because only the caller knows what its ids are.
 *
 * **No tile server and no API key.** The bundled datasets are plain SVG path
 * data (`worldMapPaths`, `usStatePaths`), so this renders offline and adds
 * nothing to a consumer's dependency tree.
 *
 * ```tsx
 * <ChoroplethMap
 *   regions={WORLD_PATHS}
 *   width={WORLD_MAP_WIDTH}
 *   height={WORLD_MAP_HEIGHT}
 *   visited={new Set(["US", "PT"])}
 *   ariaLabel={(drawn, total) => `World map. ${drawn} of ${total} visited.`}
 * />
 * ```
 */
export function ChoroplethMap({
  regions,
  width,
  height,
  visited,
  ariaLabel,
  onSelect,
  selected = null,
  visitedFill = DEFAULT_VISITED,
  unvisitedFill = DEFAULT_UNVISITED,
}: ChoroplethMapProps) {
  const keys = useMemo(() => Object.keys(regions), [regions]);

  // The selected region paints last: SVG has no z-index, so otherwise its
  // outline is clipped by whichever neighbours are drawn after it.
  const ordered = useMemo(() => {
    if (!selected) return keys;
    return [...keys.filter((k) => k !== selected), selected];
  }, [keys, selected]);

  // Only regions this map can actually draw. Callers routinely hold a wider
  // set than the dataset covers — every subdivision on a trip, including ones
  // in other countries — and reporting those would claim more than the map
  // shows.
  const drawn = useMemo(
    () => [...visited].filter((key) => key in regions).length,
    [visited, regions],
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      // Explicit: an <svg> carrying an aria-label is not exposed as an image
      // by default, so without this the label is announced by nothing.
      role="img"
      aria-label={ariaLabel(drawn, keys.length)}
      // Tapping the background clears the selection, so there is always a way
      // out without hunting for the selected region again.
      onClick={onSelect ? () => onSelect(null) : undefined}
    >
      {ordered.map((key) => {
        const isVisited = visited.has(key);
        const isSelected = key === selected;
        return (
          <path
            key={key}
            d={regions[key].path}
            fill={isVisited ? visitedFill : unvisitedFill}
            fillOpacity={isSelected ? 0.82 : 1}
            stroke={isSelected ? SELECTED_STROKE : STROKE}
            strokeWidth={isSelected ? 0.8 : 0.3}
            style={{ cursor: onSelect ? "pointer" : undefined }}
            onClick={
              onSelect
                ? (e) => {
                    // Without this the <svg>'s own handler fires straight
                    // after and clears what was just selected.
                    e.stopPropagation();
                    onSelect(key === selected ? null : key);
                  }
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}

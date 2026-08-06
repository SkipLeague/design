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
export declare function ChoroplethMap({ regions, width, height, visited, ariaLabel, onSelect, selected, visitedFill, unvisitedFill, }: ChoroplethMapProps): import("react").JSX.Element;

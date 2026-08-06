export interface StateGeometry {
    /** Full state name, e.g. "Missouri", "District of Columbia" — the same
     *  string SkipPlatform's subdivision `display_name` carries, so the two
     *  match with no crosswalk table to keep in sync. */
    name: string;
    path: string;
}
export declare const US_MAP_WIDTH = 800;
export declare const US_MAP_HEIGHT = 500;
/** The 50 states plus DC, keyed by FIPS id. 51 shapes. */
export declare const US_STATE_PATHS: Record<string, StateGeometry>;

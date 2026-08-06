/**
 * Regenerates src/maps/usStatePaths.ts from the us-atlas TopoJSON.
 *
 * Run from a checkout that has the generation-only dependencies available:
 *
 *   npm i --no-save us-atlas topojson-client d3-geo
 *   node scripts/generate-us-state-paths.mjs
 *
 * They are deliberately NOT dependencies of this package — see the generated
 * file's header for why the projection is baked in at generation time.
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const topo = require("us-atlas/states-10m.json");
const { feature } = require("topojson-client");
const { geoAlbersUsa, geoPath } = require("d3-geo");

const WIDTH = 800;
const HEIGHT = 500;

const all = feature(topo, topo.objects.states);

// Fit to only the shapes the projection can actually place. geoAlbersUsa
// returns null for anything outside US bounds (Puerto Rico, Guam, the Virgin
// Islands…), and letting those into the fit would skew the framing of the
// shapes that do render.
const probe = geoPath(geoAlbersUsa());
const drawable = {
  type: "FeatureCollection",
  features: all.features.filter((f) => probe(f)),
};

const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], drawable);
// 2 decimal places: at this size the extra digits are invisible and roughly
// double the file.
const path = geoPath(projection).digits(2);

const rows = drawable.features
  .map((f) => ({ id: String(f.id), name: f.properties.name, d: path(f) }))
  .filter((r) => r.d)
  .sort((a, b) => a.name.localeCompare(b.name));

const dropped = all.features
  .filter((f) => !probe(f))
  .map((f) => f.properties.name);

const header = [
  "// AUTO-GENERATED — do not edit by hand.",
  "// Source: us-atlas states-10m.json (public domain, US Census TIGER), projected",
  `// once with d3-geo's geoAlbersUsa into a flat ${WIDTH} x ${HEIGHT} coordinate`,
  "// space and written out as plain SVG path data.",
  "//",
  "// **Why pre-projected instead of shipping the TopoJSON.** @skipleague/design has",
  "// no runtime dependencies, and drawing us-atlas live needs d3-geo plus",
  "// topojson-client (plus react-simple-maps, if you want it declarative). Baking",
  "// the projection in at generation time keeps that promise: every consumer gets",
  "// plain <path d> strings and adds nothing to its dependency tree. It also",
  "// matches how worldMapPaths.ts is produced, so both layers work the same way.",
  "//",
  "// The trade is that the projection is fixed. geoAlbersUsa is the right one for a",
  "// 50-states choropleth — it insets Alaska and Hawaii and drops anything outside",
  "// US bounds, which is why the territories below are absent rather than missing:",
  `//   ${dropped.join(", ")}`,
  "// A layer needing a different projection should be generated as its own dataset",
  "// rather than reprojected at runtime.",
  "//",
  "// Regenerate with scripts/generate-us-state-paths.mjs.",
  "",
  "export interface StateGeometry {",
  '  /** Full state name, e.g. "Missouri", "District of Columbia" — the same',
  "   *  string SkipPlatform's subdivision `display_name` carries, so the two",
  "   *  match with no crosswalk table to keep in sync. */",
  "  name: string;",
  "  path: string;",
  "}",
  "",
  `export const US_MAP_WIDTH = ${WIDTH};`,
  `export const US_MAP_HEIGHT = ${HEIGHT};`,
  "",
  `/** The 50 states plus DC, keyed by FIPS id. ${rows.length} shapes. */`,
  "export const US_STATE_PATHS: Record<string, StateGeometry> = {",
].join("\n");

const body = rows
  .map((r) => `  "${r.id}": { name: "${r.name}", path: "${r.d}" },`)
  .join("\n");

writeFileSync(
  new URL("../src/maps/usStatePaths.ts", import.meta.url),
  `${header}\n${body}\n};\n`,
);
console.log(`wrote ${rows.length} shapes; dropped ${dropped.length} territories`);

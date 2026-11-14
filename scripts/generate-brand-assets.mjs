/**
 * Regenerates every SkipLeague parent-logo asset from the one approved source
 * image. Nothing in assets/brand/skipleague/{png,icons} or
 * src/brand/skipLeagueLogoImages.ts is edited by hand: change this script and
 * re-run it instead (docs/BRANDING.md, "Updating the logo").
 *
 * Run from a checkout that has the generation-only dependency available:
 *
 *   npm i --no-save sharp@0.34.5
 *   node scripts/generate-brand-assets.mjs
 *
 * sharp is deliberately NOT a dependency of this package (same convention as
 * scripts/generate-us-state-paths.mjs): consumers get the generated files and
 * never run this. Pin the version when regenerating; a different libvips can
 * change the encoded bytes even when the pixels look identical.
 *
 * What it does to the artwork, and nothing else:
 *
 * 1. Finds the rounded tile. The source is the tile on an off-white canvas
 *    (1254x1254, no alpha) with a faint baked-in shadow under it. Background =
 *    the near-white region reachable from the canvas edge, so the white "S",
 *    which sits inside the tile, is never mistaken for background.
 * 2. Transparent master: background becomes transparent (the faint shadow goes
 *    with it). The 1-3px anti-aliased edge gets real partial alpha, with the
 *    white it was blended against removed, so the edge does not show a white
 *    fringe on a dark page.
 * 3. Opaque full-bleed master (for iOS and apple-touch-icon, where the OS
 *    applies its own rounded mask): the same tile with the few pixels outside
 *    its rounded corners filled by extending the neighbouring artwork colour
 *    outward. The OS mask hides almost all of them; filling them means the
 *    sliver it does not hide shows artwork colour, not white.
 * 4. Both masters are padded to an exact square (the tile is 1103x1106) so
 *    every resize is uniform: the monogram is never stretched.
 *
 * Every output is a downscale of a ~1106px master: no upscaling anywhere.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = join(ROOT, "assets/brand/skipleague");
const SOURCE = join(BRAND, "source/skipleague-logo-approved-original.png");
const SOURCE_SHA256 = "d872ceda304b63d0fb57838528104eb35bc675a75b5d2172350741de72a98a19";

// A pixel is "background" when it is this close to white and connected to the
// canvas edge. The baked shadow peaks at ~15; the tile's darkest edge colours
// are far above 40.
const BACKGROUND_MAX_DARKNESS = 40;
// Width of the anti-aliased edge band, in source pixels, on each side.
const EDGE_BAND = 3;

const sourceBytes = readFileSync(SOURCE);
const sha = createHash("sha256").update(sourceBytes).digest("hex");
if (sha !== SOURCE_SHA256) {
  throw new Error(
    `Approved source changed (sha256 ${sha}). If a new logo was approved, update ` +
      "SOURCE_SHA256 and docs/BRANDING.md together, deliberately.",
  );
}

const { data: rgb, info } = await sharp(sourceBytes).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const N = W * H;
const darkness = (i) => 255 - Math.min(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]);

// 1. Background flood fill from the canvas edge (4-connected).
const bg = new Uint8Array(N);
const stack = [];
const pushIf = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = y * W + x;
  if (bg[i] || darkness(i) > BACKGROUND_MAX_DARKNESS) return;
  bg[i] = 1;
  stack.push(i);
};
for (let x = 0; x < W; x++) { pushIf(x, 0); pushIf(x, H - 1); }
for (let y = 0; y < H; y++) { pushIf(0, y); pushIf(W - 1, y); }
while (stack.length) {
  const i = stack.pop();
  const x = i % W;
  const y = (i - x) / W;
  pushIf(x + 1, y); pushIf(x - 1, y); pushIf(x, y + 1); pushIf(x, y - 1);
}

let minX = W, minY = H, maxX = -1, maxY = -1;
for (let i = 0; i < N; i++) {
  if (bg[i]) continue;
  const x = i % W;
  const y = (i - x) / W;
  if (x < minX) minX = x;
  if (x > maxX) maxX = x;
  if (y < minY) minY = y;
  if (y > maxY) maxY = y;
}
const tileW = maxX - minX + 1;
const tileH = maxY - minY + 1;

// "core" = tile pixels at least EDGE_BAND px from any background pixel: these
// are pure artwork, never blended with the canvas.
const nearBg = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  if (!bg[i]) continue;
  const x = i % W;
  const y = (i - x) / W;
  for (let dy = -EDGE_BAND; dy <= EDGE_BAND; dy++) {
    for (let dx = -EDGE_BAND; dx <= EDGE_BAND; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx >= 0 && yy >= 0 && xx < W && yy < H) nearBg[yy * W + xx] = 1;
    }
  }
}
const core = (i) => !bg[i] && !nearBg[i];

function nearestCore(x, y, radius) {
  let best = -1, bestD = Infinity;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const j = yy * W + xx;
      if (!core(j)) continue;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = j; }
    }
  }
  return best;
}

// 2. Straight (un-premultiplied) RGBA of the tile on transparency.
const rgba = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2];
  if (core(i)) {
    rgba.set([r, g, b, 255], i * 4);
    continue;
  }
  if (!nearBg[i]) continue; // far background: transparent
  const x = i % W;
  const y = (i - x) / W;
  const ref = nearestCore(x, y, EDGE_BAND * 2 + 1);
  if (ref < 0) continue;
  const fg = [rgb[ref * 3], rgb[ref * 3 + 1], rgb[ref * 3 + 2]];
  // c = a*fg + (1-a)*255  =>  a = (255-c)/(255-fg), from the channel where the
  // artwork is furthest from white (most reliable).
  let k = 0;
  for (let c = 1; c < 3; c++) if (fg[c] < fg[k]) k = c;
  const px = [r, g, b];
  let a = (255 - px[k]) / Math.max(1, 255 - fg[k]);
  a = Math.max(0, Math.min(1, a));
  if (bg[i] && a < 0.08) continue; // shadow haze, not tile
  const out = px.map((v) => Math.round(Math.max(0, Math.min(255, (v - (1 - a) * 255) / Math.max(a, 1e-3)))));
  rgba.set([...out, Math.round(a * 255)], i * 4);
}

// Crop to the tile and pad to a square (transparent), centred.
const side = Math.max(tileW, tileH);
const padL = Math.floor((side - tileW) / 2);
const padT = Math.floor((side - tileH) / 2);
const square = Buffer.alloc(side * side * 4);
for (let y = 0; y < tileH; y++) {
  const srcRow = ((minY + y) * W + minX) * 4;
  rgba.copy(square, ((padT + y) * side + padL) * 4, srcRow, srcRow + tileW * 4);
}

// 3. Opaque full-bleed. "Solid" = fully opaque and at least RIM px inside the
// tile edge (the artwork has a 1-2px darker rim right at its edge; skipping it
// avoids a visible seam once the OS mask cuts a slightly different curve).
// Every other pixel takes the colour of the first solid pixel on the straight
// line from it toward the tile centre, plus RIM px further in. Neighbouring
// pixels sample neighbouring artwork, so the extension is a smooth
// continuation of the gradient, with no streaks.
const RIM = 4;
const opaqueA = (x, y) => x >= 0 && y >= 0 && x < side && y < side && square[(y * side + x) * 4 + 3] === 255;
const solid = new Uint8Array(side * side);
for (let y = 0; y < side; y++) {
  for (let x = 0; x < side; x++) {
    let ok = opaqueA(x, y);
    for (let d = 1; ok && d <= RIM; d++) {
      ok = opaqueA(x - d, y) && opaqueA(x + d, y) && opaqueA(x, y - d) && opaqueA(x, y + d) &&
        opaqueA(x - d, y - d) && opaqueA(x + d, y + d) && opaqueA(x - d, y + d) && opaqueA(x + d, y - d);
    }
    solid[y * side + x] = ok ? 1 : 0;
  }
}
const opaque = Buffer.alloc(side * side * 3);
const centre = (side - 1) / 2;
for (let y = 0; y < side; y++) {
  for (let x = 0; x < side; x++) {
    const i = y * side + x;
    if (solid[i]) {
      opaque[i * 3] = square[i * 4]; opaque[i * 3 + 1] = square[i * 4 + 1]; opaque[i * 3 + 2] = square[i * 4 + 2];
      continue;
    }
    const dx = centre - x, dy = centre - y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    let t = 0, sx = x, sy = y;
    while (t < len) {
      sx = Math.round(x + ux * t); sy = Math.round(y + uy * t);
      if (solid[sy * side + sx]) break;
      t += 0.5;
    }
    sx = Math.round(x + ux * (t + RIM)); sy = Math.round(y + uy * (t + RIM));
    const j = sy * side + sx;
    opaque[i * 3] = square[j * 4]; opaque[i * 3 + 1] = square[j * 4 + 1]; opaque[i * 3 + 2] = square[j * 4 + 2];
  }
}

const transparentMaster = () => sharp(square, { raw: { width: side, height: side, channels: 4 } });
const opaqueMaster = () => sharp(opaque, { raw: { width: side, height: side, channels: 3 } });
const PNG = { compressionLevel: 9, adaptiveFiltering: true, palette: false };

const written = [];
async function emit(rel, pipeline) {
  const path = join(BRAND, rel);
  mkdirSync(dirname(path), { recursive: true });
  const buf = await pipeline.toBuffer();
  writeFileSync(path, buf);
  const meta = await sharp(buf).metadata();
  written.push(`${rel}  ${meta.width}x${meta.height}  ${meta.hasAlpha ? "alpha" : "opaque"}  ${(buf.length / 1024).toFixed(1)} KB`);
  return buf;
}
const resize = (s) => ({ width: s, height: s, kernel: "lanczos3" });

// Transparent web logos (the rounded tile, transparent outside it).
for (const s of [1024, 512, 256, 128, 64]) {
  await emit(`png/skipleague-logo-${s}.png`, transparentMaster().resize(resize(s)).png(PNG));
}

// Favicons + web app manifest icons (transparent).
const icoPngs = [];
for (const s of [16, 32, 48]) {
  icoPngs.push([s, await emit(`icons/favicon-${s}.png`, transparentMaster().resize(resize(s)).png(PNG))]);
}
for (const s of [192, 512]) {
  await emit(`icons/icon-${s}.png`, transparentMaster().resize(resize(s)).png(PNG));
}

// Opaque, full-bleed: the OS applies the rounded mask itself.
await emit("icons/apple-touch-icon.png", opaqueMaster().resize(resize(180)).png(PNG));
await emit("icons/ios-app-icon-1024.png", opaqueMaster().resize(resize(1024)).png(PNG));

// favicon.ico: an ICO container holding the 16/32/48 PNGs (PNG-in-ICO is
// supported by every current browser).
{
  const header = Buffer.alloc(6 + 16 * icoPngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(icoPngs.length, 4);
  let offset = header.length;
  icoPngs.forEach(([s, buf], n) => {
    const e = 6 + n * 16;
    header.writeUInt8(s, e);
    header.writeUInt8(s, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(buf.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  const ico = Buffer.concat([header, ...icoPngs.map(([, b]) => b)]);
  writeFileSync(join(BRAND, "icons/favicon.ico"), ico);
  written.push(`icons/favicon.ico  16/32/48  alpha  ${(ico.length / 1024).toFixed(1)} KB`);
}

// The images SkipLeagueLogo renders, inlined as data URIs so the component
// works in every consumer with no bundler asset configuration (dist/ is plain
// tsc output). WebP with full-quality alpha; small enough to inline, and only
// apps that import SkipLeagueLogo pay for it (unused exports tree-shake).
const COMPONENT_SIZES = [96, 192, 384];
const uris = [];
for (const s of COMPONENT_SIZES) {
  const buf = await transparentMaster().resize(resize(s)).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toBuffer();
  uris.push([s, `data:image/webp;base64,${buf.toString("base64")}`, buf.length]);
}
const ts = `// GENERATED by scripts/generate-brand-assets.mjs from
// assets/brand/skipleague/source/skipleague-logo-approved-original.png
// (sha256 ${SOURCE_SHA256}). Do not edit by hand.

/** Approved SkipLeague parent logo, transparent outside the rounded tile, by pixel width. */
export const SKIPLEAGUE_LOGO_IMAGES: ReadonlyArray<{ readonly width: number; readonly src: string }> = [
${uris.map(([s, u]) => `  { width: ${s}, src: "${u}" },`).join("\n")}
];
`;
writeFileSync(join(ROOT, "src/brand/skipLeagueLogoImages.ts"), ts);
written.push(`src/brand/skipLeagueLogoImages.ts  WebP ${uris.map(([s, , n]) => `${s}px ${(n / 1024).toFixed(1)} KB`).join(", ")}`);

console.log(`source ${W}x${H}; tile ${tileW}x${tileH} at (${minX},${minY}); square master ${side}px`);
console.log(written.join("\n"));

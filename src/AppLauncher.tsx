import { useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

import { AppBadge } from "./AppBadge.js";
import { AppLogo, appGlyphForSlug } from "./AppLogo.js";
import { STATUS_DOT, type AppLifecycleStatus } from "./apps.js";

/**
 * One launcher tile. The platform's app records (`GET /me/apps`) satisfy this
 * directly; extra fields are ignored.
 */
export interface AppLauncherApp {
  /** Platform app slug, e.g. "skiptrips". Picks the glyph (letter tile when there is none). */
  slug: string;
  /** Display name, e.g. "SkipTrips". */
  name: string;
  /** Where the tile goes. An app with no URL yet is shown dimmed and is not a link. */
  url?: string | null;
  /** Lifecycle status: anything not Live gets a status dot, as in the ProfileMenu switcher. */
  status?: AppLifecycleStatus;
  /** Tooltip text (the platform's app description). */
  description?: string | null;
}

export interface AppLauncherProps {
  /** The user's apps, in the order to show them (the platform sends fleet display order). */
  apps: readonly AppLauncherApp[];
  /**
   * Called when a tile is activated, before the link is followed. Call
   * `event.preventDefault()` to handle the navigation yourself (for example the
   * iSkip shell Home opening the product's WebView).
   */
  onSelect?: (app: AppLauncherApp & { url: string }, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Shown instead of the grid when `apps` is empty. Defaults to nothing. */
  empty?: ReactNode;
  /** Accessible name for the grid. Default "Your apps". */
  label?: string;
  /**
   * Narrowest a tile may get, in px; the grid fits as many columns as the width
   * allows (auto-fill), so phone, iPad and desktop widths need no breakpoints.
   * Default 104.
   */
  minTileWidth?: number;
}

/**
 * A grid of the user's SkipLeague apps: each tile is the app's {@link AppLogo}
 * (or a letter tile when it has no glyph yet) over its name. Shared by the
 * platform dashboard ("Launch an app") and the iSkip app's Home screen, so the
 * two look and behave the same (MyEcosystem proposal section 6.2).
 *
 * Tiles are plain links to each app's URL. In a browser that opens the app; in
 * the iSkip app, pass `onSelect` to switch to the app's WebView instead.
 *
 * Requires `@skipleague/design/tokens.css` to be imported once at the app root.
 */
export function AppLauncher({ apps, onSelect, empty = null, label = "Your apps", minTileWidth = 104 }: AppLauncherProps) {
  if (apps.length === 0) return <>{empty}</>;
  return (
    <ul
      aria-label={label}
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        // min(…, 100%) keeps a single tile from overflowing a container narrower than minTileWidth.
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${minTileWidth}px, 100%), 1fr))`,
        gap: 12,
        fontFamily: "var(--skl-font-sans)",
      }}
    >
      {apps.map((app) => (
        <li key={app.slug} style={{ display: "flex" }}>
          <AppTile app={app} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}

function AppTile({ app, onSelect }: { app: AppLauncherApp; onSelect: AppLauncherProps["onSelect"] }) {
  const [hover, setHover] = useState(false);
  const glyph = appGlyphForSlug(app.slug);
  const url = app.url || null;

  const content = (
    <>
      {glyph ? <AppLogo app={glyph} size={44} /> : <AppBadge name={app.name} size={44} />}
      <span style={nameStyle}>{app.name}</span>
      <TileStatusDot status={app.status} />
    </>
  );

  if (!url) {
    return (
      <span aria-disabled="true" title={app.description ?? `${app.name} is not available yet`} style={{ ...tileStyle, opacity: 0.55, cursor: "default" }}>
        {content}
      </span>
    );
  }

  return (
    <a
      href={url}
      title={app.description ?? app.name}
      onClick={onSelect ? (e) => onSelect({ ...app, url }, e) : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...tileStyle,
        borderColor: hover ? "#cbd5e1" : "var(--skl-color-border)",
        boxShadow: hover ? "0 6px 18px rgba(2,6,23,0.12)" : "none",
        transform: hover ? "translateY(-1px)" : "none",
      }}
    >
      {content}
    </a>
  );
}

/** The lifecycle dot in the tile's top-right corner; nothing for a Live app. */
function TileStatusDot({ status }: { status?: AppLifecycleStatus }) {
  if (!status || status === "live") return null;
  const { color, label } = STATUS_DOT[status];
  const isOutline = status === "in_development";
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 999,
        background: isOutline ? "transparent" : color,
        border: isOutline ? `1.5px solid ${color}` : "none",
      }}
    />
  );
}

const tileStyle: CSSProperties = {
  position: "relative",
  flex: "1 1 auto",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  padding: "16px 6px 12px",
  boxSizing: "border-box",
  background: "var(--skl-color-surface)",
  border: "1px solid var(--skl-color-border)",
  borderRadius: "var(--skl-radius-panel)",
  color: "var(--skl-color-text)",
  textDecoration: "none",
  transition: "box-shadow .15s, transform .15s, border-color .15s",
};

const nameStyle: CSSProperties = {
  maxWidth: "100%",
  // 12px, like iOS home-screen labels: "SkipRacquetball" fits a phone-width
  // tile without truncating. The full name is also the tile's tooltip.
  fontSize: "var(--skl-text-xs)",
  fontWeight: 600,
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

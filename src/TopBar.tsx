import { useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";

import { AppLogo, type AppGlyph } from "./AppLogo.js";
import { ProfileMenu, type ProfileMenuProps } from "./ProfileMenu.js";

/**
 * The shared SkipLeague top bar (design_handoff_top_bar, Option A — dark).
 *
 * Layout is identical across apps; only the logo glyph, wordmark, and the
 * contextual action slot change:
 *   [AppLogo + wordmark] ........ [ ...actions ][ ProfileMenu ]
 *
 * - ProfileMenu is pinned to the far right on every page (the persistent slot).
 * - `actions` is the contextual slot (Print / Share / …) — render zero or more
 *   {@link TopBarIconButton}s; they appear left of the ProfileMenu only when the
 *   current page offers them.
 */
export function TopBar({
  app,
  appName,
  actions,
  compact = false,
  ...profile
}: {
  app: AppGlyph;
  appName: string;
  /** Contextual page actions (Print/Share buttons) rendered left of ProfileMenu. */
  actions?: ReactNode;
  /** Mobile sizing (48px bar) vs the default 54px. */
  compact?: boolean;
} & Pick<ProfileMenuProps, "user" | "currentSlug" | "apps" | "accountUrl" | "onSignOut" | "renderLink" | "onSignIn">) {
  const bar: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: compact ? 48 : 54,
    padding: compact ? "0 12px" : "0 14px",
    background: "var(--skl-color-header-dark)",
  };
  return (
    <div style={bar}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <AppLogo app={app} size={compact ? 26 : 27} />
        <span
          style={{
            fontFamily: "var(--skl-font-sans)",
            fontWeight: 700,
            fontSize: compact ? 14 : 15,
            color: "var(--skl-color-on-dark)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {appName}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {actions}
        <ProfileMenu tone="dark" {...profile} />
      </div>
    </div>
  );
}

/**
 * A contextual top-bar action button (Print, Share, …) styled for the dark bar.
 * Pass a 17–18px line icon (stroke 2, currentColor) as children.
 */
export function TopBarIconButton({
  compact = false,
  style,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { compact?: boolean }) {
  const [hover, setHover] = useState(false);
  const dim = compact ? 36 : 38;
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: dim,
        height: dim,
        borderRadius: 9,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: hover ? "rgba(255,255,255,0.08)" : "transparent",
        border: `1px solid ${hover ? "rgba(94,234,212,0.5)" : "rgba(255,255,255,0.16)"}`,
        color: hover ? "var(--skl-color-brand-bright)" : "var(--skl-color-on-dark-muted)",
        transition: "background .12s, border-color .12s, color .12s",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

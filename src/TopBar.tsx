import { useEffect, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode, type RefObject } from "react";
import { ChevronLeft, Inbox, MoreHorizontal, Search, Upload, Users, type LucideIcon } from "lucide-react";

import { AppLogo, type AppGlyph } from "./AppLogo.js";
import { ProfileMenu, type ProfileMenuProps } from "./ProfileMenu.js";

/** Bar surface tone: `dark` = the green header (default), `light` = white bar. */
export type TopBarTone = "dark" | "light";

/** The one bar height, in px, on every app and breakpoint (safe-area inset added on top). */
export const TOP_BAR_HEIGHT = 48;
/** Side padding, in px, on every app and breakpoint (safe-area insets added on top). */
export const TOP_BAR_SIDE_PADDING = 16;
const LOGO_SIZE = 26;
const BUTTON_SIZE = 34;
const SCROLL_SHADOW = "0 6px 14px rgba(2,6,23,0.18)";

/**
 * True once the page (or `container`, when given) has scrolled past `threshold`
 * px. Drives the bar's scroll shadow: flat at the top of a page, a soft shadow
 * once content slides underneath it. Exported for apps that build their own
 * header but want the same behavior.
 */
export function useScrolledPast(container?: RefObject<HTMLElement | null>, threshold = 1): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = container?.current ?? null;
    const read = () => setScrolled((el ? el.scrollTop : window.scrollY) >= threshold);
    read();
    const target: HTMLElement | Window = el ?? window;
    target.addEventListener("scroll", read, { passive: true });
    return () => target.removeEventListener("scroll", read);
  }, [container, threshold]);
  return scrolled;
}

/**
 * The product wordmark, two-tone: "Skip" in white, the product name in mint
 * (brand-bright) on the dark bar; on the light bar, "Skip" in the text color
 * and the product name in brand teal. Anything that is not a one-word
 * "Skip<Name>" (e.g. "SkipLeague Home") renders in one color.
 */
export function TopBarWordmark({
  appName,
  tone = "dark",
  size = 15,
}: {
  appName: string;
  tone?: TopBarTone;
  size?: number;
}) {
  const light = tone === "light";
  const lead = light ? "var(--skl-color-text)" : "var(--skl-color-on-dark)";
  const accent = light ? "var(--skl-color-brand)" : "var(--skl-color-brand-bright)";
  const base: CSSProperties = {
    fontSize: size,
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    letterSpacing: "-0.1px",
    minWidth: 0,
  };
  const split = /^Skip[A-Z][A-Za-z]*$/.test(appName);
  if (!split) return <span style={{ ...base, color: lead }}>{appName}</span>;
  return (
    <span style={base}>
      <span style={{ color: lead, fontWeight: 600 }}>Skip</span>
      <span style={{ color: accent }}>{appName.slice(4)}</span>
    </span>
  );
}

type ProfileProps = Pick<
  ProfileMenuProps,
  "user" | "currentSlug" | "apps" | "enabledSlugs" | "accountUrl" | "homeUrl" | "homeIsCurrent" | "onSignOut" | "renderLink" | "onSignIn"
>;

/** Shared bar surface: size, safe areas, stickiness, scroll shadow. */
function barStyle({
  tone,
  safeArea,
  sticky,
  elevated,
}: {
  tone: TopBarTone;
  safeArea: boolean;
  sticky: boolean;
  elevated: boolean;
}): CSSProperties {
  const light = tone === "light";
  return {
    display: "flex",
    alignItems: "center",
    gap: 12,
    // border-box so the top inset is added to the bar, not taken out of its
    // 48px content row, whatever box-sizing the host app sets globally.
    boxSizing: "border-box",
    ...(safeArea
      ? {
          // Phase 0 measured a 62px top inset in the iSkip app: without this the
          // logo and ProfileMenu sit under the status bar.
          height: `calc(${TOP_BAR_HEIGHT}px + env(safe-area-inset-top, 0px))`,
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingRight: `calc(${TOP_BAR_SIDE_PADDING}px + env(safe-area-inset-right, 0px))`,
          paddingBottom: 0,
          paddingLeft: `calc(${TOP_BAR_SIDE_PADDING}px + env(safe-area-inset-left, 0px))`,
        }
      : { height: TOP_BAR_HEIGHT, padding: `0 ${TOP_BAR_SIDE_PADDING}px` }),
    // Pinned: Safari 26 (iOS, iPadOS, macOS) no longer reads theme-color; it
    // tints its toolbar from a fixed or sticky element at the top of the page.
    // A bar that scrolls away gives it nothing to sample.
    ...(sticky ? { position: "sticky" as const, top: 0, zIndex: 30 } : {}),
    flex: "0 0 auto",
    background: light ? "#ffffff" : "var(--skl-color-header-dark)",
    borderBottom: light ? "1px solid var(--skl-color-border)" : undefined,
    boxShadow: elevated ? SCROLL_SHADOW : "none",
    transition: "box-shadow 150ms ease",
    fontFamily: "var(--skl-font-sans)",
  };
}

/**
 * The shared SkipLeague app bar (design_handoff_top_bar → design_handoff_desktop_action_bar,
 * then the November 2026 top-bar refresh). Also exported as `DesktopActionBar`.
 *
 * ONE bar for every app + breakpoint: 48px tall, 16px side padding, a 26px logo
 * tile and a two-tone wordmark ("Skip" white, product name mint), on phone,
 * iPad and desktop alike. It spans the full top row; on desktop the app adds a
 * left sidebar BELOW the bar.
 *
 *   [AppLogo + wordmark] ........ [ search inbox members share overflow ][ actions ][ ProfileMenu ]
 *
 * - Pinned by default (`position: sticky; top: 0`), which is what makes Safari
 *   tint its toolbar to the bar color. Render it as a direct child of the page's
 *   top-level column: a wrapper exactly as tall as the bar leaves sticky no
 *   room to stick. Pass `sticky={false}` for a bar inside a sheet or card.
 * - A soft shadow fades in once content scrolls under it. It watches the window
 *   by default; pass `scrollContainer` when the app scrolls an inner pane
 *   instead (e.g. a mobile shell's middle pane).
 * - ProfileMenu is pinned to the far right on every page (the persistent slot).
 * - The named action toggles render in a FIXED left→right order
 *   (search → inbox → members → share → overflow), each only when its `show*`
 *   flag is set, so the same action looks identical in every app.
 * - `actions` is an escape hatch for one-off contextual buttons; render zero or
 *   more {@link TopBarIconButton}s. They sit between the named cluster and the
 *   ProfileMenu.
 * - The app name appears ONLY here, never repeated in the sidebar.
 * - Safe areas: the bar pads itself by `env(safe-area-inset-top)` and the left
 *   and right insets, so under `viewport-fit=cover` (the iSkip app, and a
 *   home-screen web app with `black-translucent`) its content clears the status
 *   bar and the notch while its background still fills behind them. Pass
 *   `safeArea={false}` when the bar is not at the top edge of the screen.
 * - On a phone drill-in screen, use {@link TopBarDetail} instead: same bar,
 *   with Back and the page title in place of the logo.
 */
export function TopBar({
  app,
  appName,
  tone = "dark",
  actions,
  compact: _compact = false,
  showSearch = false,
  showInbox = false,
  showMembers = false,
  showShare = false,
  showOverflow = false,
  onSearch,
  onInbox,
  onMembers,
  onShare,
  onOverflow,
  safeArea = true,
  sticky = true,
  scrollContainer,
  ...profile
}: {
  app: AppGlyph;
  appName: string;
  /** Bar surface tone. `dark` (green header) is the default. */
  tone?: TopBarTone;
  /** One-off contextual buttons, rendered between the named cluster and ProfileMenu. */
  actions?: ReactNode;
  /**
   * @deprecated No effect since 0.18.0: the bar is 48px with 16px sides on every
   * breakpoint. Kept so existing call sites compile; drop it when convenient.
   */
  compact?: boolean;
  /** Named action toggles — each renders a ghost icon button when true, in fixed order. */
  showSearch?: boolean;
  showInbox?: boolean;
  showMembers?: boolean;
  showShare?: boolean;
  showOverflow?: boolean;
  onSearch?: () => void;
  onInbox?: () => void;
  onMembers?: () => void;
  onShare?: () => void;
  onOverflow?: () => void;
  /**
   * Pad for the device safe areas (top, left, right). Default `true`: the bar
   * normally sits at the top edge of the screen. Set `false` for a bar rendered
   * somewhere else (inside a sheet or a card).
   */
  safeArea?: boolean;
  /** Pin to the top of the scroll area (default `true`). */
  sticky?: boolean;
  /** The element that scrolls, when it is not the window. Drives the scroll shadow. */
  scrollContainer?: RefObject<HTMLElement | null>;
} & ProfileProps) {
  const elevated = useScrolledPast(scrollContainer);

  // Named actions in their fixed left→right order; only the enabled ones render.
  const named: Array<{ key: string; title: string; Icon: LucideIcon; onClick?: () => void }> = [
    showSearch && { key: "search", title: "Search", Icon: Search, onClick: onSearch },
    showInbox && { key: "inbox", title: "Inbox", Icon: Inbox, onClick: onInbox },
    showMembers && { key: "members", title: "Members", Icon: Users, onClick: onMembers },
    showShare && { key: "share", title: "Share this view", Icon: Upload, onClick: onShare },
    showOverflow && { key: "overflow", title: "More", Icon: MoreHorizontal, onClick: onOverflow },
  ].filter(Boolean) as Array<{ key: string; title: string; Icon: LucideIcon; onClick?: () => void }>;

  return (
    <div style={barStyle({ tone, safeArea, sticky, elevated })}>
      {/* Left — identity group. Shrinks and truncates before the action cluster does. */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: "0 1 auto" }}>
        <AppLogo app={app} size={LOGO_SIZE} />
        <TopBarWordmark appName={appName} tone={tone} />
      </div>

      {/* Flexible spacer. */}
      <div style={{ flex: "1 1 auto", minWidth: 8 }} />

      {/* Right — action cluster + persistent ProfileMenu. Never shrinks. */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
        {named.map(({ key, title, Icon, onClick }) => (
          <TopBarIconButton key={key} tone={tone} title={title} aria-label={title} onClick={onClick}>
            <Icon size={17} />
          </TopBarIconButton>
        ))}
        {actions}
        <ProfileMenu tone={tone} size={BUTTON_SIZE} {...profile} />
      </div>
    </div>
  );
}

/**
 * The app bar for a drill-in screen on a phone (a list, a match, a trip, a
 * book): the same 48px bar as {@link TopBar}, with Back, a small two-tone app
 * name and the page title in place of the logo and wordmark. It replaces both a
 * separate back bar and the repeated page-title row beneath it.
 *
 *   [‹] SkipLists           ........ [ actions ][ ProfileMenu ]
 *       Groceries
 *
 * Top-level screens keep {@link TopBar}. On iPad and desktop, keep TopBar and
 * the page's own large title: space is not tight there.
 */
export function TopBarDetail({
  appName,
  title,
  subtitle,
  onBack,
  backLabel = "Back",
  tone = "dark",
  actions,
  safeArea = true,
  sticky = true,
  scrollContainer,
  ...profile
}: {
  appName: string;
  /** The page title, e.g. the list or book name. Truncates with an ellipsis. */
  title: string;
  /** Optional second line in place of the app name (e.g. "Custom list"). */
  subtitle?: string;
  onBack: () => void;
  /** Accessible label + tooltip for Back (default "Back"). */
  backLabel?: string;
  tone?: TopBarTone;
  /** Contextual buttons ({@link TopBarIconButton}s), before the ProfileMenu. */
  actions?: ReactNode;
  safeArea?: boolean;
  sticky?: boolean;
  scrollContainer?: RefObject<HTMLElement | null>;
} & ProfileProps) {
  const elevated = useScrolledPast(scrollContainer);
  const light = tone === "light";
  return (
    <div style={barStyle({ tone, safeArea, sticky, elevated })}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: "1 1 auto" }}>
        <TopBarBackButton tone={tone} label={backLabel} onClick={onBack} />
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.15 }}>
          {subtitle ? (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: light ? "var(--skl-color-text-muted)" : "var(--skl-color-on-dark-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {subtitle}
            </span>
          ) : (
            <TopBarWordmark appName={appName} tone={tone} size={11} />
          )}
          <span
            title={title}
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: light ? "var(--skl-color-text)" : "var(--skl-color-on-dark)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
        {actions}
        <ProfileMenu tone={tone} size={BUTTON_SIZE} {...profile} />
      </div>
    </div>
  );
}

/**
 * A ghost (borderless-fill) icon button for the app bar — the named actions use
 * it, and apps pass their own for one-off `actions`. Give it a 17px line icon
 * (stroke 2, currentColor) as children. Styling tracks the bar `tone`.
 */
export function TopBarIconButton({
  tone = "dark",
  compact = false,
  style,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: TopBarTone;
  /** @deprecated No effect since 0.18.0: one 34px size everywhere. */
  compact?: boolean;
}) {
  const [hover, setHover] = useState(false);
  void compact;
  const dim = BUTTON_SIZE;
  const light = tone === "light";

  const palette = light
    ? {
        border: hover ? "#cbd5e1" : "var(--skl-color-border)",
        background: hover ? "var(--skl-color-surface-muted)" : "#ffffff",
        color: hover ? "var(--skl-color-text)" : "var(--skl-color-text-muted)",
      }
    : {
        border: hover ? "rgba(94,234,212,0.5)" : "rgba(255,255,255,0.16)",
        background: hover ? "rgba(255,255,255,0.08)" : "transparent",
        color: hover ? "var(--skl-color-brand-bright)" : "var(--skl-color-on-dark-muted)",
      };

  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        // Exact square, locked: min/max too, so a host app's global button
        // rules (e.g. SkipLists' phone-only `button { min-height: 40px }`)
        // can't stretch it into a rectangle. Inline styles beat those rules.
        width: dim,
        height: dim,
        minWidth: dim,
        minHeight: dim,
        maxHeight: dim,
        boxSizing: "border-box",
        borderRadius: 9,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flex: "0 0 auto",
        // Explicit padding:0 so a host app's global `button { padding }` can't
        // collapse this fixed-size box (border-box) and shrink the icon.
        padding: 0,
        background: palette.background,
        border: `1px solid ${palette.border}`,
        color: palette.color,
        transition: "background .14s, border-color .14s, color .14s",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * The Back affordance for a drill-in / detail screen's app bar — a
 * {@link TopBarIconButton} carrying a left chevron, so every app's back button
 * looks and behaves identically (same tone-aware ghost styling as Search,
 * Share, ProfileMenu, etc.). Pair it with the app's router, e.g.
 * `<TopBarBackButton onClick={() => navigate(-1)} />`.
 *
 * Works on both a full {@link TopBar} (pass it via `actions`, though back
 * usually sits on the LEFT — apps that build a contextual detail header place it
 * directly) and a bespoke contextual header.
 */
export function TopBarBackButton({
  tone = "dark",
  compact = false,
  label = "Back",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: TopBarTone;
  compact?: boolean;
  /** Accessible label + tooltip (default "Back"). */
  label?: string;
}) {
  return (
    <TopBarIconButton
      tone={tone}
      compact={compact}
      aria-label={label}
      title={label}
      {...props}
    >
      <ChevronLeft size={20} />
    </TopBarIconButton>
  );
}

/**
 * Alias for {@link TopBar} under its platform-app-bar name. Same component,
 * same props — use whichever import name the app standardizes on.
 */
export { TopBar as DesktopActionBar };

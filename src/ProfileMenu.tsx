import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CircleUser, LogIn, LogOut, Settings } from "lucide-react";
import { AppBadge } from "./AppBadge.js";
import { SKIPLEAGUE_ACCOUNT_URL, SKIPLEAGUE_APPS, type AppLink } from "./apps.js";

export interface ProfileMenuUser {
  displayName?: string | null;
  email?: string | null;
}

/** Args passed to a custom `renderLink` for internal (in-app) menu links. */
export interface ProfileMenuLinkArgs {
  href: string;
  role?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export interface ProfileMenuProps {
  /** The signed-in user (name + email shown at the top of the menu). */
  user?: ProfileMenuUser;
  /**
   * Slug of the app you're currently in (e.g. "skipracquetball"). That app's row
   * is highlighted light-green and non-clickable. Omit on the platform apex.
   */
  currentSlug?: string;
  /** Apps to list in the switcher. Defaults to the live SkipLeague apps. */
  apps?: AppLink[];
  /**
   * Slugs of the apps THIS user has enabled (e.g. the platform's `app_slugs`).
   * When provided and non-empty, the switcher shows only those apps (the current
   * app is always kept), so every app shows the same "your apps" set without each
   * one re-implementing the filter. Omit — or pass an EMPTY array — to list every
   * app in `apps`. (Empty is treated as "show all" so super-admins, who are
   * authorized without per-app slugs, don't get an empty switcher.)
   */
  enabledSlugs?: string[];
  /** Target of the "Manage account" link. Defaults to the platform account page. */
  accountUrl?: string;
  /** Called when the user clicks "Sign out". */
  onSignOut: () => void;
  /**
   * Header tone the trigger button sits on — "dark" (default) for the apex/dark
   * headers, "light" for white headers. Only affects the button, not the menu.
   */
  tone?: "light" | "dark";
  /**
   * Render the internal "Manage account" link via your own router (e.g. React
   * Router's `<Link>`) instead of a full-page `<a href>`. App-switcher links to
   * OTHER SkipLeague apps are always plain `<a>` (cross-app navigation).
   * Example: `renderLink={({ href, ...p }) => <Link to={href} {...p} />}`.
   */
  renderLink?: (args: ProfileMenuLinkArgs) => ReactNode;
  /**
   * Mark "Manage account" as the current page — highlighted light-green and
   * non-clickable (e.g. the platform is already on /account).
   */
  accountIsCurrent?: boolean;
  /**
   * Signed-out support (platform apex): when there's no `user` AND this is
   * provided, the menu shows a single "Sign in" action instead of the
   * name / Manage-account / Sign-out items. Omit it to keep the always-signed-in
   * behavior product apps rely on.
   */
  onSignIn?: () => void;
  /** Label for the signed-out action (default "Sign in"). */
  signInLabel?: string;
}

/**
 * The canonical SkipLeague account control: a boxed user-icon button that opens
 * a dropdown with the user's name/email, an inline **app switcher** (one click to
 * jump to another SkipLeague app; the current app is highlighted and not
 * clickable), **Manage account**, and **Sign out**. Also covers the platform
 * apex via `renderLink` (SPA nav), `accountIsCurrent`, and `onSignIn`
 * (signed-out state).
 *
 * Requires `@skipleague/design/tokens.css` to be imported once at the app root.
 */
export function ProfileMenu({
  user,
  currentSlug,
  apps = SKIPLEAGUE_APPS,
  enabledSlugs,
  accountUrl = SKIPLEAGUE_ACCOUNT_URL,
  onSignOut,
  tone = "dark",
  renderLink,
  accountIsCurrent = false,
  onSignIn,
  signInLabel = "Sign in",
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Show only the apps this user has enabled (always keeping the current app),
  // when the caller passes the user's enabled slugs. Otherwise list every app.
  const visibleApps =
    enabledSlugs && enabledSlugs.length > 0
      ? apps.filter((a) => a.slug === currentSlug || enabledSlugs.includes(a.slug))
      : apps;

  const signedIn = !!(user?.displayName || user?.email);
  // Signed-out menu only when a sign-in handler is supplied — otherwise keep the
  // existing always-signed-in behavior product apps depend on.
  const showSignedOut = !signedIn && !!onSignIn;

  const label = signedIn ? user!.displayName || user!.email || "Account" : "Account";
  const brand = tone === "light" ? "var(--skl-color-brand)" : "var(--skl-color-brand-bright)";
  const idleIcon = tone === "light" ? "#334155" : "#e2e8f0";
  const idleBorder = tone === "light" ? "var(--skl-color-border)" : "rgba(255,255,255,0.18)";
  const boxBg = tone === "light" ? "#ffffff" : "rgba(255,255,255,0.06)";
  const active = open || hover;

  const accountLabel = (
    <>
      <Settings size={15} /> Manage account
    </>
  );
  const accountItem = accountIsCurrent ? (
    <div aria-current="page" style={{ ...itemStyle, fontWeight: 600, background: "var(--skl-color-current-bg)", color: "var(--skl-color-current-text)", cursor: "default" }}>
      {accountLabel}
    </div>
  ) : renderLink ? (
    renderLink({ href: accountUrl, role: "menuitem", style: itemStyle, children: accountLabel })
  ) : (
    <a href={accountUrl} role="menuitem" style={itemStyle}>
      {accountLabel}
    </a>
  );

  return (
    <div ref={ref} style={{ position: "relative", fontFamily: "var(--skl-font-sans)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account"
        title={label}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: "var(--skl-radius-control)",
          cursor: "pointer",
          border: `1px solid ${active ? brand : idleBorder}`,
          background: boxBg,
          color: active ? brand : idleIcon,
          transition: "border-color 0.15s, color 0.15s",
        }}
      >
        <CircleUser size={22} />
      </button>

      {open && (
        <div role="menu" style={menuStyle}>
          {showSignedOut ? (
            <>
              <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--skl-color-border)" }}>
                <div style={{ fontWeight: 600, fontSize: "var(--skl-text-sm)", color: "var(--skl-color-text)" }}>Not signed in</div>
              </div>
              <button
                role="menuitem"
                onClick={onSignIn}
                style={{ ...itemStyle, width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
              >
                <LogIn size={15} /> {signInLabel}
              </button>
            </>
          ) : (
            <>
              <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--skl-color-border)" }}>
                <div style={{ fontWeight: 600, fontSize: "var(--skl-text-sm)", color: "var(--skl-color-text)" }}>{label}</div>
                {user?.email && <div style={{ fontSize: "var(--skl-text-xs)", color: "var(--skl-color-text-muted)" }}>{user.email}</div>}
              </div>

              {/* Switcher only when there are apps to switch to — pass apps={[]} to
                  hide it entirely (e.g. dev mode, or a single-app deployment). */}
              {visibleApps.length > 0 && (
                <>
                  <div style={switchHeading}>Switch app</div>
                  {visibleApps.map((a) => {
                    const isCurrent = a.slug === currentSlug;
                    const inner = (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <AppBadge name={a.name} />
                        {a.name}
                      </span>
                    );
                    // The app you're in: light-green highlight, not clickable.
                    return isCurrent ? (
                      <div key={a.slug} aria-current="page" style={{ ...itemStyle, fontWeight: 600, background: "var(--skl-color-current-bg)", color: "var(--skl-color-current-text)", cursor: "default" }}>
                        {inner}
                      </div>
                    ) : (
                      <a key={a.slug} href={a.url} role="menuitem" style={itemStyle}>
                        {inner}
                      </a>
                    );
                  })}
                </>
              )}

              <div style={divider} />
              {accountItem}
              <div style={divider} />
              <button
                role="menuitem"
                onClick={onSignOut}
                style={{ ...itemStyle, width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
              >
                <LogOut size={15} /> Sign out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const menuStyle: CSSProperties = {
  position: "absolute",
  right: 0,
  top: "calc(100% + 8px)",
  minWidth: 200,
  background: "var(--skl-color-surface)",
  border: "1px solid var(--skl-color-border)",
  borderRadius: "var(--skl-radius-panel)",
  boxShadow: "var(--skl-shadow-menu)",
  overflow: "hidden",
  zIndex: 50,
};

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.55rem 0.75rem",
  fontSize: "var(--skl-text-sm)",
  color: "var(--skl-color-text)",
  textDecoration: "none",
};

const switchHeading: CSSProperties = {
  padding: "0.5rem 0.75rem 0.25rem",
  fontSize: "var(--skl-text-2xs)",
  fontWeight: 600,
  color: "var(--skl-color-text-faint)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const divider: CSSProperties = {
  borderTop: "1px solid var(--skl-color-border)",
  margin: "0.25rem 0",
};

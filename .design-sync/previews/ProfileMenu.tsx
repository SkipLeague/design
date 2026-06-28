import { useEffect, useRef, type ReactNode } from "react";
import { ProfileMenu } from "@skipleague/design";

const user = { displayName: "Ben Wells", email: "ben@skipleague.com" };
const noop = () => {};

/** Renders children in a dark header box and opens the menu on mount (the menu
 * has no `open` prop — it opens on click), so the static card shows the dropdown.
 * `alignItems: flex-start` keeps the trigger at the top so the menu drops into view. */
function OpenInDarkBox({ height = 440, children }: { height?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
  }, []);
  return (
    <div
      ref={ref}
      style={{ height, background: "#0f172a", borderRadius: 10, padding: "14px 22px", display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}
    >
      {children}
    </div>
  );
}

/**
 * The flagship state: the menu open in a product app, showing the user, the inline
 * app switcher (the current app — SkipRacquetball — highlighted light-green and not
 * clickable), Manage account, and Sign out.
 */
export const OpenMenu = () => (
  <OpenInDarkBox>
    <ProfileMenu user={user} currentSlug="skipracquetball" onSignOut={noop} />
  </OpenInDarkBox>
);

/**
 * Platform apex, already on /account: `accountIsCurrent` highlights "Manage account"
 * light-green and makes it non-clickable (no `currentSlug`, so no app is current).
 */
export const AccountCurrent = () => (
  <OpenInDarkBox>
    <ProfileMenu user={user} accountIsCurrent onSignOut={noop} />
  </OpenInDarkBox>
);

/**
 * Signed-out apex: with no `user` and an `onSignIn` handler, the menu collapses to a
 * single "Sign in" action instead of the account/sign-out items.
 */
export const SignedOut = () => (
  <OpenInDarkBox height={170}>
    <ProfileMenu onSignOut={noop} onSignIn={noop} />
  </OpenInDarkBox>
);

/** The resting trigger on a dark header (the default `tone="dark"`). */
export const OnDarkHeader = () => (
  <div style={{ background: "#0f172a", borderRadius: 10, padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <span style={{ color: "#e2e8f0", fontFamily: "var(--skl-font-sans)", fontWeight: 600 }}>SkipRacquetball</span>
    <ProfileMenu user={user} currentSlug="skipracquetball" onSignOut={noop} />
  </div>
);

/** The resting trigger on a white header (`tone="light"`). */
export const OnLightHeader = () => (
  <div style={{ background: "#fff", border: "1px solid var(--skl-color-border)", borderRadius: 10, padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <span style={{ color: "var(--skl-color-text)", fontFamily: "var(--skl-font-sans)", fontWeight: 600 }}>Account</span>
    <ProfileMenu user={user} tone="light" onSignOut={noop} />
  </div>
);

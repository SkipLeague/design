import { AppBadge } from "@skipleague/design";

/** The square brand-green letter logo — first letter after the "Skip" prefix. */
export const Default = () => <AppBadge name="SkipRacquetball" />;

/** One badge per live SkipLeague app, at the default 20px size. */
export const AllApps = () => (
  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
    <AppBadge name="SkipLists" />
    <AppBadge name="SkipRacquetball" />
    <AppBadge name="SkipTrips" />
  </div>
);

/** A larger badge (the `size` prop sets both width and height). */
export const Large = () => <AppBadge name="SkipLists" size={40} />;

/** Badge beside its app name — the app-switcher row composition. */
export const WithLabel = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--skl-font-sans)", fontSize: "0.875rem", color: "var(--skl-color-text)" }}>
    <AppBadge name="SkipRacquetball" />
    SkipRacquetball
  </span>
);

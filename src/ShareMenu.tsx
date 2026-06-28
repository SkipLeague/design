import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link2, Mail, MessageCircle, MoreHorizontal } from "lucide-react";

import { TopBarIconButton } from "./TopBar.js";

/**
 * The top-bar Share dropdown (design_handoff_top_bar). A self-contained trigger
 * (the upload glyph, styled like a {@link TopBarIconButton}) + an anchored menu —
 * same open/dismiss model as ProfileMenu (click, outside-click, Escape).
 *
 * `noun` names the thing being shared ("players" → "Share players"). Pass the
 * handlers you support; omitted items are hidden.
 */
export function ShareMenu({
  noun,
  compact = false,
  onCopyLink,
  onMessages,
  onEmail,
  onMore,
}: {
  noun: string;
  compact?: boolean;
  onCopyLink?: () => void;
  onMessages?: () => void;
  onEmail?: () => void;
  onMore?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const run = (fn?: () => void) => () => {
    setOpen(false);
    fn?.();
  };

  const items: { key: string; icon: ReactNode; label: string; fn?: () => void; muted?: boolean }[] = [
    { key: "copy", icon: <Link2 size={18} />, label: "Copy link", fn: onCopyLink },
    { key: "messages", icon: <MessageCircle size={18} />, label: "Send in Messages", fn: onMessages },
    { key: "email", icon: <Mail size={18} />, label: "Email", fn: onEmail },
  ].filter((i) => i.fn);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <TopBarIconButton compact={compact} aria-label={`Share ${noun}`} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {/* iOS-style upload/share glyph (exact paths from the handoff). */}
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 14.5V3.5" />
          <path d="M8 7.2l4-3.7 4 3.7" />
          <path d="M5.5 12.5v6a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-6" />
        </svg>
      </TopBarIconButton>

      {open && (
        <>
          <style>{
            "@keyframes sklShareMenuPop{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:none}}"
          }</style>
          <div role="menu" style={panelStyle}>
            <div style={sectionLabelStyle}>Share {noun}</div>
            {items.map((it) => (
              <MenuItem key={it.key} icon={it.icon} label={it.label} onClick={run(it.fn)} />
            ))}
            {onMore && (
              <>
                <div style={dividerStyle} />
                <MenuItem icon={<MoreHorizontal size={18} />} label="More options…" onClick={run(onMore)} muted />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick, muted }: { icon: ReactNode; label: string; onClick: () => void; muted?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        width: "100%",
        padding: "9px 10px",
        border: "none",
        background: hover ? "var(--skl-color-surface-muted)" : "transparent",
        borderRadius: 8,
        font: "600 14px var(--skl-font-sans)",
        color: muted ? "var(--skl-color-text-muted)" : "var(--skl-color-text)",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span style={{ display: "inline-flex", color: muted ? "var(--skl-color-text-faint)" : "var(--skl-color-text-muted)" }}>{icon}</span>
      {label}
    </button>
  );
}

const panelStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 8px)",
  right: 0,
  width: 226,
  background: "var(--skl-color-surface)",
  border: "1px solid var(--skl-color-border)",
  borderRadius: "var(--skl-radius-panel)",
  boxShadow: "var(--skl-shadow-menu)",
  padding: 6,
  zIndex: 70,
  transformOrigin: "top right",
  animation: "sklShareMenuPop .16s ease-out",
};

const sectionLabelStyle: CSSProperties = {
  padding: "8px 10px 7px",
  font: "700 10.5px var(--skl-font-sans)",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  color: "var(--skl-color-text-faint)",
};

const dividerStyle: CSSProperties = { height: 1, background: "var(--skl-color-border)", margin: "6px 8px" };

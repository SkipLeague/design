import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The Trips-style contextual hero: a white card of equal stat cells split by
 * 1px dividers. Requires `@skipleague/design/tokens.css`.
 */
export function StatBandHero({ stats, style }) {
    return (_jsx("div", { style: {
            display: "flex",
            overflow: "hidden",
            background: "var(--skl-color-surface)",
            border: "1px solid var(--skl-color-border)",
            borderRadius: "var(--skl-radius-card)",
            fontFamily: "var(--skl-font-sans)",
            ...style,
        }, children: stats.map((s, i) => (_jsxs("div", { style: {
                flex: 1,
                padding: "12px 6px",
                textAlign: "center",
                borderLeft: i === 0 ? "none" : "1px solid var(--skl-color-divider)",
                minWidth: 0,
            }, children: [_jsx("div", { style: {
                        fontWeight: 800,
                        fontSize: 21,
                        color: "var(--skl-color-text)",
                        fontVariantNumeric: "tabular-nums",
                    }, children: s.value }), _jsx("div", { style: { fontWeight: 600, fontSize: 10, color: "var(--skl-color-text-muted)", marginTop: 2 }, children: s.label })] }, i))) }));
}

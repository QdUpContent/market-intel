import { useTheme, FONT_BODY, FONT_MONO } from "../theme";

export function Card({ children, style = {}, onClick }) {
  const { t } = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        background: t.surface,
        borderRadius: 10,
        border: `1px solid ${t.border}`,
        boxShadow: t.cardShadow,
        transition: "all 0.25s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Tag({ children, color }) {
  const { t } = useTheme();
  const c = color || t.orange;
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: 10,
        color: c,
        background: `${c}10`,
        padding: "3px 9px",
        borderRadius: 4,
        border: `1px solid ${c}20`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function EpBadge({ num, style = {} }) {
  const { t } = useTheme();
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: 9,
        color: t.orange,
        background: `${t.orange}${t.tagBg}`,
        padding: "2px 7px",
        borderRadius: 3,
        border: `1px solid ${t.orange}${t.tagBorder}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      Ep {num}
    </span>
  );
}

export function StatusDot({ status }) {
  const { t } = useTheme();
  const colors = {
    Leading: t.green,
    "Top Pick": t.green,
    Essential: t.green,
    "Major Player": t.blue,
    Established: t.blue,
    "Rising Star": t.orange,
    Rising: t.orange,
    Trending: t.orange,
    Growing: t.orangeLight,
    Disruptor: t.yellow,
    New: t.orangeLight,
    Emerging: t.yellow,
    "Watch List": t.textMuted,
    Watch: t.textMuted,
  };
  const c = colors[status] || t.textMuted;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: FONT_MONO,
        fontSize: 10,
        color: c,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c,
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
}

export function SectionHeader({ title, subtitle, count }) {
  const { t } = useTheme();
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
        {count !== undefined && (
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>
            {count} entries
          </span>
        )}
      </div>
      {subtitle && (
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: t.textMuted,
            margin: "4px 0 0 0",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function FilterBar({ options, active, onChange }) {
  const { t } = useTheme();
  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o === active ? "All" : o)}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            padding: "5px 12px",
            borderRadius: 6,
            cursor: "pointer",
            border: `1px solid ${o === active ? t.orange + "40" : t.border}`,
            background: o === active ? `${t.orange}12` : "transparent",
            color: o === active ? t.orange : t.textMuted,
            fontWeight: o === active ? 500 : 400,
            transition: "all 0.2s",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

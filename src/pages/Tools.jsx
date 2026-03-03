import { useState } from "react";
import { useTheme, FONT_MONO } from "../theme";
import TOOLS from "../data/tools.json";
import { SectionHeader, FilterBar, Card, Tag, StatusDot, EpBadge } from "../components/UI";

const ratingOrder = {
  "Top Pick": 0,
  Essential: 1,
  Trending: 2,
  Rising: 3,
  New: 4,
  Established: 5,
  Watch: 6,
};

export default function Tools() {
  const { t } = useTheme();
  const [filter, setFilter] = useState("All");
  const [openTool, setOpenTool] = useState(null);
  const categories = [
    "All",
    ...[...new Set(TOOLS.map((tl) => tl.category))].sort(),
  ];
  const filtered =
    filter === "All" ? TOOLS : TOOLS.filter((tl) => tl.category === filter);
  const sorted = [...filtered].sort(
    (a, b) => (ratingOrder[a.rating] ?? 99) - (ratingOrder[b.rating] ?? 99)
  );

  return (
    <div style={{ padding: "28px clamp(16px, 4vw, 60px) 50px", maxWidth: 860 }}>
      <SectionHeader
        title="Tools Repository"
        subtitle="AI tools reviewed and rated for content marketers and SMBs"
        count={TOOLS.length}
      />
      <FilterBar options={categories} active={filter} onChange={setFilter} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sorted.map((tl) => (
          <Card
            key={tl.name}
            onClick={() =>
              setOpenTool(openTool === tl.name ? null : tl.name)
            }
            style={{ padding: "14px 18px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ fontSize: 15, fontWeight: 600, color: t.text }}
                  >
                    {tl.name}
                  </span>
                  <StatusDot status={tl.rating} />
                  <Tag color={t.blueDark}>{tl.category}</Tag>
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: t.textMuted,
                  }}
                >
                  {tl.pricing}
                </div>
              </div>
              <span
                style={{
                  color: t.textMuted,
                  fontSize: 11,
                  transform: openTool === tl.name ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              >
                ▾
              </span>
            </div>
            {openTool === tl.name && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: `1px solid ${t.border}`,
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    color: t.textSecondary,
                    lineHeight: 1.6,
                    margin: "0 0 12px 0",
                  }}
                >
                  {tl.useCase}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 9,
                        color: t.textMuted,
                      }}
                    >
                      Covered in:
                    </span>
                    {tl.episodes.map((ep) => (
                      <EpBadge key={ep} num={ep} />
                    ))}
                  </div>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 10,
                      color: t.textMuted,
                    }}
                  >
                    Updated: {tl.lastUpdatedDisplay.slice(0, -6)}
                  </span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

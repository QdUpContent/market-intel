import { useState } from "react";
import { useTheme, FONT_MONO } from "../theme";
import PLATFORMS from "../data/platforms.json";
import { SectionHeader, FilterBar, Card, Tag, StatusDot, EpBadge } from "../components/UI";

export default function Platforms() {
  const { t } = useTheme();
  const [filter, setFilter] = useState("All");
  const [openPlatform, setOpenPlatform] = useState(null);
  const categories = ["All", ...new Set(PLATFORMS.map((p) => p.category))];
  const filtered =
    filter === "All"
      ? PLATFORMS
      : PLATFORMS.filter((p) => p.category === filter);

  return (
    <div style={{ padding: "28px clamp(16px, 4vw, 60px) 50px", maxWidth: 860 }}>
      <SectionHeader
        title="Platforms Directory"
        subtitle="AI platforms tracked and reviewed across Market Intel episodes"
        count={PLATFORMS.length}
      />
      <FilterBar options={categories} active={filter} onChange={setFilter} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 10,
        }}
      >
        {filtered.map((p) => (
          <Card
            key={p.slug}
            onClick={() =>
              setOpenPlatform(openPlatform === p.slug ? null : p.slug)
            }
            style={{ padding: 0, overflow: "hidden" }}
          >
            <div style={{ padding: "16px 18px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: t.text }}>
                  {p.name}
                </span>
                <StatusDot status={p.status} />
              </div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  color: t.textMuted,
                  marginBottom: 6,
                }}
              >
                {p.category} · {p.pricing}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: t.textSecondary,
                  lineHeight: 1.6,
                  margin: 0,
                  ...(openPlatform !== p.slug
                    ? {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }
                    : {}),
                }}
              >
                {p.description}
              </p>

              {openPlatform === p.slug && (
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: `1px solid ${t.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      flexWrap: "wrap",
                      marginBottom: 10,
                    }}
                  >
                    {p.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
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
                        Episodes:
                      </span>
                      {p.episodes.map((ep) => (
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
                      Last: {p.lastMentionedDisplay.slice(0, -6)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

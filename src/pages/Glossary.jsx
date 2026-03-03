import { useState } from "react";
import { useTheme, FONT_MONO } from "../theme";
import GLOSSARY from "../data/glossary.json";
import { SectionHeader, FilterBar, Card, Tag, EpBadge } from "../components/UI";

export default function Glossary() {
  const { t } = useTheme();
  const [filter, setFilter] = useState("All");
  const [openTerm, setOpenTerm] = useState(null);
  const categories = ["All", ...new Set(GLOSSARY.map((g) => g.category))];
  const letters = [...new Set(GLOSSARY.map((g) => g.letter))].sort();
  const filtered =
    filter === "All" ? GLOSSARY : GLOSSARY.filter((g) => g.category === filter);

  return (
    <div style={{ padding: "28px clamp(16px, 4vw, 60px) 50px", maxWidth: 860 }}>
      <SectionHeader
        title="AI Glossary"
        subtitle="Terms explained in plain language from Market Intel episodes"
        count={GLOSSARY.length}
      />
      <FilterBar options={categories} active={filter} onChange={setFilter} />
      {letters.map((letter) => {
        const terms = filtered.filter((g) => g.letter === letter);
        if (!terms.length) return null;
        return (
          <div key={letter} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 13,
                fontWeight: 700,
                color: t.orange,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{letter}</span>
              <span style={{ flex: 1, height: 1, background: t.border }} />
            </div>
            {terms.map((g) => (
              <Card
                key={g.term}
                onClick={() =>
                  setOpenTerm(openTerm === g.term ? null : g.term)
                }
                style={{ padding: "14px 18px", marginBottom: 6, cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{ fontSize: 15, fontWeight: 600, color: t.text }}
                      >
                        {g.term}
                      </span>
                      <Tag color={t.blueDark}>{g.category}</Tag>
                    </div>
                    {openTerm !== g.term && (
                      <p
                        style={{
                          fontSize: 13,
                          color: t.textSecondary,
                          margin: "6px 0 0 0",
                          lineHeight: 1.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {g.definition}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      color: t.textMuted,
                      fontSize: 11,
                      transform:
                        openTerm === g.term ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    ▾
                  </span>
                </div>
                {openTerm === g.term && (
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: `1px solid ${t.border}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        color: t.textSecondary,
                        lineHeight: 1.7,
                        margin: "0 0 12px 0",
                      }}
                    >
                      {g.definition}
                    </p>
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
                          marginRight: 4,
                        }}
                      >
                        Discussed in:
                      </span>
                      {g.episodes.map((ep) => (
                        <EpBadge key={ep} num={ep} />
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        );
      })}
    </div>
  );
}

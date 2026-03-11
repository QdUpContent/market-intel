import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTheme, FONT_BODY, FONT_MONO } from "../theme";
import { usePlayer } from "../components/AudioPlayer";
import { Card, Tag, EpBadge } from "../components/UI";
import KnowledgePopup from "../components/KnowledgePopup";
import EPISODES from "../data/episodes.json";
import SHOW_NOTES from "../data/showNotes.json";
import GLOSSARY from "../data/glossary.json";
import PLATFORMS from "../data/platforms.json";
import TOOLS from "../data/tools.json";
import { SHOW } from "../data/show";

export default function EpisodePage() {
  const { t } = useTheme();
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const { play, currentEp, isPlaying, pause, resume, seekTo } = usePlayer();
  const [popup, setPopup] = useState(null);

  const ep = EPISODES.find((e) => e.id === episodeId);
  if (!ep) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>◈</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Episode not found
        </h2>
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: 12,
            color: t.textMuted,
            marginBottom: 20,
          }}
        >
          "{episodeId}" doesn't match any episode
        </p>
        <button
          onClick={() => navigate("/episodes")}
          style={{
            fontFamily: FONT_BODY,
            fontSize: 13,
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: 7,
            cursor: "pointer",
            border: "none",
            background: `linear-gradient(135deg, ${t.orange}, ${t.orangeDark})`,
            color: "#fff",
          }}
        >
          ← All Episodes
        </button>
      </div>
    );
  }

  const notes = SHOW_NOTES[ep.id] || null;
  const isThisPlaying = currentEp?.id === ep.id && isPlaying;
  const isThisLoaded = currentEp?.id === ep.id;

  // Find related content from the knowledge hub
  const relatedGlossary = GLOSSARY.filter((g) =>
    g.episodes?.includes(ep.num)
  );
  const relatedPlatforms = PLATFORMS.filter((p) =>
    p.episodes?.includes(ep.num)
  );
  const relatedTools = TOOLS.filter((tl) => tl.episodes?.includes(ep.num));

  // Get prev/next episodes
  const epIndex = EPISODES.findIndex((e) => e.id === ep.id);
  const prevEp = epIndex < EPISODES.length - 1 ? EPISODES[epIndex + 1] : null;
  const nextEp = epIndex > 0 ? EPISODES[epIndex - 1] : null;

  const handlePlay = () => {
    if (isThisPlaying) {
      pause();
    } else if (isThisLoaded) {
      resume();
    } else {
      play(ep);
    }
  };

  const handleTimestamp = (seconds) => {
    if (!isThisLoaded) {
      // Start playing then seek
      play(ep);
      // Small delay to let audio load before seeking
      setTimeout(() => seekTo(seconds), 400);
    } else {
      seekTo(seconds);
      if (!isPlaying) resume();
    }
  };

  return (
    <div
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "0 0 100px 0",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 24,
          fontFamily: FONT_MONO,
          fontSize: 11,
          color: t.textMuted,
        }}
      >
        <Link
          to="/episodes"
          style={{
            color: t.textMuted,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = t.orange)}
          onMouseLeave={(e) => (e.target.style.color = t.textMuted)}
        >
          Episodes
        </Link>
        <span style={{ opacity: 0.4 }}>/</span>
        <span style={{ color: t.orange }}>Episode {ep.num}</span>
      </div>

      {/* ─── HERO SECTION ─── */}
      <div style={{ marginBottom: 28 }}>
        {/* Episode number + date row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: t.orange,
              background: `${t.orange}${t.tagBg}`,
              padding: "3px 10px",
              borderRadius: 4,
              border: `1px solid ${t.orange}${t.tagBorder}`,
              fontWeight: 500,
            }}
          >
            Episode {ep.num}
          </span>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: t.textMuted,
            }}
          >
            {ep.dateDisplay}
          </span>
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: t.textMuted,
            }}
          >
            · {ep.duration}
          </span>
          {ep.isNew && (
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                color: "#fff",
                background: t.orange,
                padding: "2px 7px",
                borderRadius: 3,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              New
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            margin: "0 0 14px 0",
            color: t.text,
          }}
        >
          {ep.title}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: t.textSecondary,
            margin: "0 0 16px 0",
            maxWidth: 620,
          }}
        >
          {ep.description}
        </p>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {ep.tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        {/* Play button + listen links row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handlePlay}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: FONT_BODY,
              fontSize: 13,
              fontWeight: 700,
              padding: "11px 22px",
              borderRadius: 8,
              cursor: "pointer",
              border: "none",
              background: `linear-gradient(135deg, ${t.orange}, ${t.orangeDark})`,
              color: "#fff",
              boxShadow: `0 4px 16px ${t.orange}30`,
              transition: "all 0.25s",
            }}
          >
            {isThisPlaying ? (
              <>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="#fff">
                  <rect x="2" y="1" width="3.5" height="12" rx="1" />
                  <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="#fff">
                  <path d="M3 1v12l10-6z" />
                </svg>
                {isThisLoaded ? "Resume" : "Play Episode"}
              </>
            )}
          </button>

          {/* External listen links */}
          {[
            { label: "Spotify", url: SHOW.spotify, color: "#1DB954" },
            { label: "YouTube", url: SHOW.youtube, color: "#FF0000" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: t.textMuted,
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: 6,
                border: `1px solid ${t.border}`,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = link.color + "40";
                e.target.style.color = link.color;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = t.border;
                e.target.style.color = t.textMuted;
              }}
            >
              {link.label} →
            </a>
          ))}
        </div>
      </div>

      {/* ─── DIVIDER ─── */}
      <div
        style={{
          height: 1,
          background: t.border,
          marginBottom: 28,
        }}
      />

      {/* ─── TIMESTAMPS ─── */}
      {notes?.timestamps && notes.timestamps.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              margin: "0 0 14px 0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: t.orange, fontSize: 14 }}>◈</span>
            Timestamps
          </h2>
          <Card style={{ overflow: "hidden" }}>
            {notes.timestamps.map((ts, i) => (
              <div
                key={i}
                onClick={() => handleTimestamp(ts.seconds)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 16px",
                  cursor: "pointer",
                  borderBottom:
                    i < notes.timestamps.length - 1
                      ? `1px solid ${t.border}44`
                      : "none",
                  transition: "background 0.15s",
                  background: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = t.surfaceHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 12,
                    color: t.orange,
                    minWidth: 38,
                    fontWeight: 500,
                  }}
                >
                  {ts.time}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: t.text,
                    fontWeight: 500,
                    flex: 1,
                  }}
                >
                  {ts.label}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill={t.textMuted}
                  style={{ flexShrink: 0, opacity: 0.5 }}
                >
                  <path d="M3 1v12l10-6z" />
                </svg>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* ─── SOURCES ─── */}
      {notes?.sources && notes.sources.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              margin: "0 0 14px 0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: t.blue, fontSize: 14 }}>◇</span>
            Sources & Links
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {notes.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: t.surface,
                  borderRadius: 8,
                  border: `1px solid ${t.border}`,
                  boxShadow: t.cardShadow,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = t.orange + "40";
                  e.currentTarget.style.background = t.surfaceLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = t.border;
                  e.currentTarget.style.background = t.surface;
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: t.text,
                      marginBottom: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {src.title}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 10,
                      color: t.textMuted,
                    }}
                  >
                    {src.source}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: t.orange,
                    flexShrink: 0,
                  }}
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ─── RELATED KNOWLEDGE HUB ─── */}
      {(relatedGlossary.length > 0 ||
        relatedPlatforms.length > 0 ||
        relatedTools.length > 0) && (
        <section style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              margin: "0 0 14px 0",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: t.orangeLight, fontSize: 14 }}>◉</span>
            From the Knowledge Hub
          </h2>

          {/* Glossary terms */}
          {relatedGlossary.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 9,
                  color: t.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Glossary Terms ({relatedGlossary.length})
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 8,
                }}
              >
                {relatedGlossary.map((g) => (
                  <Card
                    key={g.term}
                    onClick={() => setPopup({ item: g, type: "glossary" })}
                    style={{ padding: "12px 14px", cursor: "pointer" }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: t.orange,
                        marginBottom: 4,
                      }}
                    >
                      {g.term}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: t.textSecondary,
                        lineHeight: 1.5,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {g.definition}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Platforms */}
          {relatedPlatforms.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 9,
                  color: t.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Platforms ({relatedPlatforms.length})
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                {relatedPlatforms.map((p) => (
                  <Card
                    key={p.slug}
                    onClick={() => setPopup({ item: p, type: "platform" })}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: t.text,
                      }}
                    >
                      {p.name}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 10,
                        color: t.textMuted,
                      }}
                    >
                      {p.category}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tools */}
          {relatedTools.length > 0 && (
            <div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 9,
                  color: t.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Tools ({relatedTools.length})
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                {relatedTools.map((tl) => (
                  <Card
                    key={tl.name}
                    onClick={() => setPopup({ item: tl, type: "tool" })}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: t.text,
                      }}
                    >
                      {tl.name}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 10,
                        color: t.textMuted,
                      }}
                    >
                      {tl.category}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─── PREV / NEXT NAV ─── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          borderTop: `1px solid ${t.border}`,
          paddingTop: 20,
        }}
      >
        {prevEp ? (
          <Link
            to={`/episodes/${prevEp.id}`}
            style={{
              flex: 1,
              textDecoration: "none",
              padding: "14px 16px",
              background: t.surface,
              borderRadius: 8,
              border: `1px solid ${t.border}`,
              boxShadow: t.cardShadow,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = t.orange + "40")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = t.border)
            }
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                color: t.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              ← Previous
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: t.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              E{prevEp.num}: {prevEp.title}
            </div>
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        {nextEp ? (
          <Link
            to={`/episodes/${nextEp.id}`}
            style={{
              flex: 1,
              textDecoration: "none",
              textAlign: "right",
              padding: "14px 16px",
              background: t.surface,
              borderRadius: 8,
              border: `1px solid ${t.border}`,
              boxShadow: t.cardShadow,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = t.orange + "40")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = t.border)
            }
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                color: t.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              Next →
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: t.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              E{nextEp.num}: {nextEp.title}
            </div>
          </Link>
        ) : (
          <div style={{ flex: 1 }} />
        )}
      </div>

      {popup && (
        <KnowledgePopup
          item={popup.item}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

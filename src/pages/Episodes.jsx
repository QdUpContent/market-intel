import { useState } from "react";
import { useTheme, FONT_MONO } from "../theme";
import { SHOW } from "../data/show";
import EPISODES from "../data/episodes.json";
import { SectionHeader, Tag } from "../components/UI";
import { usePlayer } from "../components/AudioPlayer";

export default function Episodes() {
  const { t } = useTheme();
  const [openEp, setOpenEp] = useState(null);
  const { currentEp, isPlaying, play, pause, resume } = usePlayer();

  const handlePlay = (ep) => {
    if (ep.links?.audio) {
      if (currentEp?.id === ep.id) {
        isPlaying ? pause() : resume();
      } else {
        play(ep);
      }
    } else {
      const url = ep.links?.spotify || SHOW.spotify;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div style={{ padding: "28px clamp(16px, 4vw, 60px) 50px", maxWidth: 860 }}>
      <SectionHeader
        title="All Episodes"
        subtitle={`${EPISODES.length} episodes · ${SHOW.schedule}`}
        count={EPISODES.length}
      />
      {EPISODES.map((ep) => (
        <div
          key={ep.id}
          style={{
            background: openEp === ep.id ? t.surfaceLight : "transparent",
            borderRadius: 10,
            border:
              openEp === ep.id
                ? `1px solid ${t.border}`
                : "1px solid transparent",
            transition: "all 0.25s",
            marginBottom: 2,
            boxShadow: openEp === ep.id ? t.cardShadow : "none",
          }}
        >
          <div
            onClick={() => setOpenEp(openEp === ep.id ? null : ep.id)}
            style={{
              padding: "13px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlay(ep);
              }}
              title={ep.links?.audio ? (currentEp?.id === ep.id && isPlaying ? "Pause" : "Play") : "Listen on Spotify"}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                flexShrink: 0,
                background:
                  currentEp?.id === ep.id && isPlaying
                    ? `linear-gradient(135deg, ${t.orange}, ${t.orangeDark})`
                    : `${t.orange}${t.tagBg}`,
                border:
                  currentEp?.id === ep.id && isPlaying
                    ? "none"
                    : `1px solid ${t.orange}20`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  currentEp?.id === ep.id && isPlaying
                    ? `0 0 16px ${t.orange}30`
                    : "none",
                transition: "all 0.25s",
              }}
            >
              {currentEp?.id === ep.id && isPlaying ? (
                <svg width="10" height="10" viewBox="0 0 14 14" fill="#fff">
                  <rect x="2" y="1" width="3.5" height="12" rx="1" />
                  <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 14 14" fill={currentEp?.id === ep.id ? "#fff" : t.orange}>
                  <path d="M3 1v12l10-6z" />
                </svg>
              )}
            </button>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: t.textMuted,
                minWidth: 22,
              }}
            >
              {String(ep.num).padStart(2, "0")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: t.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ep.title}
                </span>
                {ep.isNew && (
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 9,
                      color: t.orange,
                      background: `${t.orange}${t.tagBg}`,
                      padding: "1px 5px",
                      borderRadius: 3,
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    New
                  </span>
                )}
              </div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  color: t.textMuted,
                  display: "flex",
                  gap: 10,
                }}
              >
                <span>{ep.dateDisplay}</span>
                <span>{ep.duration}</span>
              </div>
            </div>
            <span
              style={{
                color: t.textMuted,
                fontSize: 11,
                transform: openEp === ep.id ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              ▾
            </span>
          </div>
          {openEp === ep.id && (
            <div style={{ padding: "0 16px 14px 86px" }}>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: t.textSecondary,
                  margin: "0 0 10px 0",
                }}
              >
                {ep.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {ep.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

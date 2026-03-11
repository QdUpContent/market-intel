import { useTheme, FONT_BODY, FONT_MONO } from "../theme";
import { EpBadge, Tag, StatusDot } from "./UI";

export default function KnowledgePopup({ item, type, onClose }) {
  const { t } = useTheme();

  if (!item || !type) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 250,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 14,
          maxWidth: 480,
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: `0 20px 60px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Header bar */}
        <div
          style={{
            padding: "14px 18px 0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {type === "glossary" && <GlossaryCard item={item} t={t} />}
            {type === "platform" && <PlatformCard item={item} t={t} />}
            {type === "tool" && <ToolCard item={item} t={t} />}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: t.textMuted,
              fontSize: 18,
              cursor: "pointer",
              padding: "0 0 0 8px",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ height: 18 }} />
      </div>
    </div>
  );
}

function GlossaryCard({ item, t }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: t.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Glossary
        </span>
        <Tag color={t.blueDark}>{item.category}</Tag>
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: t.orange,
          marginBottom: 12,
          letterSpacing: "-0.02em",
        }}
      >
        {item.term}
      </div>
      <p
        style={{
          fontSize: 14,
          color: t.textSecondary,
          lineHeight: 1.7,
          margin: "0 0 14px 0",
        }}
      >
        {item.definition}
      </p>
      <EpisodesBadges episodes={item.episodes} t={t} />
    </>
  );
}

function PlatformCard({ item, t }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: t.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Platform
        </span>
        <StatusDot status={item.status} />
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: t.text,
          marginBottom: 4,
          letterSpacing: "-0.02em",
        }}
      >
        {item.name}
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          color: t.textMuted,
          marginBottom: 12,
        }}
      >
        {item.category} · {item.pricing}
      </div>
      <p
        style={{
          fontSize: 14,
          color: t.textSecondary,
          lineHeight: 1.7,
          margin: "0 0 12px 0",
        }}
      >
        {item.description}
      </p>
      {item.tags && item.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {item.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <EpisodesBadges episodes={item.episodes} t={t} />
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              color: t.orange,
              textDecoration: "none",
            }}
          >
            Visit →
          </a>
        )}
      </div>
    </>
  );
}

function ToolCard({ item, t }) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 9,
            color: t.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Tool
        </span>
        <StatusDot status={item.rating} />
        <Tag color={t.blueDark}>{item.category}</Tag>
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: t.text,
          marginBottom: 4,
          letterSpacing: "-0.02em",
        }}
      >
        {item.name}
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 11,
          color: t.textMuted,
          marginBottom: 12,
        }}
      >
        {item.pricing}
      </div>
      <p
        style={{
          fontSize: 14,
          color: t.textSecondary,
          lineHeight: 1.7,
          margin: "0 0 12px 0",
        }}
      >
        {item.useCase}
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
        <EpisodesBadges episodes={item.episodes} t={t} />
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              color: t.orange,
              textDecoration: "none",
            }}
          >
            Visit →
          </a>
        )}
      </div>
    </>
  );
}

function EpisodesBadges({ episodes, t }) {
  if (!episodes || episodes.length === 0) return null;
  return (
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
          marginRight: 2,
        }}
      >
        Episodes:
      </span>
      {episodes.map((ep) => (
        <EpBadge key={ep} num={ep} />
      ))}
    </div>
  );
}

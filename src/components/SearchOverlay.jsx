import { useTheme, FONT_BODY, FONT_MONO } from "../theme";
import { useSearch } from "../hooks/useSearch";
import { StatusDot } from "./UI";

export default function SearchOverlay({ query, setQuery, onClose, onNavigate, onPopup }) {
  const { t } = useTheme();
  const results = useSearch(query);
  const total =
    results.episodes.length +
    results.glossary.length +
    results.platforms.length +
    results.tools.length;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        paddingTop: "10vh",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: 640,
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", marginBottom: 2 }}>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search episodes, glossary, platforms, tools..."
            style={{
              width: "100%",
              padding: "16px 18px 16px 44px",
              fontSize: 16,
              fontFamily: FONT_BODY,
              background: t.surface,
              border: `2px solid ${t.orange}40`,
              borderRadius: 12,
              color: t.text,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 18,
              opacity: 0.5,
            }}
          >
            ⌕
          </span>
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: t.textMuted,
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {query.length >= 2 && (
          <div
            style={{
              background: t.surface,
              borderRadius: 12,
              border: `1px solid ${t.border}`,
              overflow: "auto",
              flex: 1,
            }}
          >
            {total === 0 && (
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: t.textMuted,
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                }}
              >
                No results for "{query}"
              </div>
            )}

            {results.episodes.length > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
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
                  Episodes ({results.episodes.length})
                </div>
                {results.episodes.slice(0, 4).map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => {
                      onNavigate("/episodes");
                      onClose();
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      marginBottom: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 10,
                        color: t.textMuted,
                        minWidth: 22,
                      }}
                    >
                      E{ep.num}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: t.text,
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ep.title}
                    </span>
                    <span
                      style={{ fontFamily: FONT_MONO, fontSize: 10, color: t.textMuted }}
                    >
                      {ep.dateDisplay.slice(0, -6)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {results.glossary.length > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
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
                  Glossary ({results.glossary.length})
                </div>
                {results.glossary.slice(0, 4).map((g) => (
                  <div
                    key={g.term}
                    onClick={() => {
                      if (onPopup) onPopup(g, "glossary");
                      else { onNavigate("/glossary"); onClose(); }
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      marginBottom: 2,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: t.orange }}>
                      {g.term}
                    </span>
                    <span
                      style={{ fontSize: 12, color: t.textSecondary, marginLeft: 8 }}
                    >
                      {g.definition.slice(0, 80)}...
                    </span>
                  </div>
                ))}
              </div>
            )}

            {results.platforms.length > 0 && (
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
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
                  Platforms ({results.platforms.length})
                </div>
                {results.platforms.slice(0, 4).map((p) => (
                  <div
                    key={p.slug}
                    onClick={() => {
                      if (onPopup) onPopup(p, "platform");
                      else { onNavigate("/platforms"); onClose(); }
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      marginBottom: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
                      {p.name}
                    </span>
                    <StatusDot status={p.status} />
                  </div>
                ))}
              </div>
            )}

            {results.tools.length > 0 && (
              <div style={{ padding: "12px 16px" }}>
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
                  Tools ({results.tools.length})
                </div>
                {results.tools.slice(0, 4).map((tl) => (
                  <div
                    key={tl.name}
                    onClick={() => {
                      if (onPopup) onPopup(tl, "tool");
                      else { onNavigate("/tools"); onClose(); }
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      marginBottom: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>
                      {tl.name}
                    </span>
                    <StatusDot status={tl.rating} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

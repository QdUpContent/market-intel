import { useNavigate } from "react-router-dom";
import { useTheme, FONT_BODY, FONT_MONO } from "../theme";
import { SHOW } from "../data/show";
import EPISODES from "../data/episodes.json";
import GLOSSARY from "../data/glossary.json";
import PLATFORMS from "../data/platforms.json";
import TOOLS from "../data/tools.json";
import Logo from "../components/Logo";
import { Card } from "../components/UI";

export default function Home() {
  const { t, mode } = useTheme();
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <header
        style={{
          padding:
            "clamp(36px, 7vh, 80px) clamp(16px, 4vw, 60px) clamp(24px, 4vh, 50px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-5%",
            right: "-5%",
            width: "30vw",
            height: "30vw",
            maxWidth: 350,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${t.orange}${mode === "dark" ? "12" : "08"}, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: "clamp(24px, 4vw, 50px)",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: "clamp(100px, 15vw, 170px)",
              height: "clamp(100px, 15vw, 170px)",
              borderRadius: 18,
              background: t.heroLogoBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                mode === "dark"
                  ? `0 6px 30px ${t.orange}15`
                  : "0 6px 30px rgba(0,0,0,0.07)",
              border: `1px solid ${mode === "dark" ? t.border : t.borderLight}`,
              overflow: "hidden",
            }}
          >
            <Logo
              size={999}
              style={{ width: "90%", height: "90%", borderRadius: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h1
              style={{
                fontSize: "clamp(28px, 4.5vw, 48px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                margin: "0 0 6px 0",
              }}
            >
              <span style={{ color: t.blueDark }}>AI</span>{" "}
              <span style={{ color: t.logoText }}>Market Intel</span>
            </h1>
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: 12,
                color: t.orange,
                letterSpacing: "0.06em",
                fontWeight: 500,
                margin: "0 0 10px 0",
              }}
            >
              {SHOW.tagline}
            </p>
            <p
              style={{
                fontSize: "clamp(13px, 1.4vw, 16px)",
                fontWeight: 300,
                color: t.textSecondary,
                lineHeight: 1.7,
                maxWidth: 480,
                margin: "0 0 8px 0",
              }}
            >
              Your weekly intelligence briefing on AI and content creation. No
              hype. No jargon. Just curated insights for busy content marketers
              and SMB professionals.
            </p>
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: t.textMuted,
                margin: "0 0 16px 0",
              }}
            >
              Hosted by <span style={{ color: t.orange }}>{SHOW.host}</span> ·{" "}
              {SHOW.agency}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a
                href={SHOW.spotify}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "9px 18px",
                  borderRadius: 7,
                  cursor: "pointer",
                  border: "none",
                  background: `linear-gradient(135deg, ${t.orange}, ${t.orangeDark})`,
                  color: "#fff",
                  boxShadow: `0 4px 16px ${t.orange}30`,
                  textDecoration: "none",
                }}
              >
                Subscribe
              </a>
              {[
                { label: "Episodes", to: "/episodes" },
                { label: "Glossary", to: "/glossary" },
                { label: "Platforms", to: "/platforms" },
                { label: "Tools", to: "/tools" },
              ].map((l) => (
                <button
                  key={l.label}
                  onClick={() => navigate(l.to)}
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "9px 18px",
                    borderRadius: 7,
                    cursor: "pointer",
                    border: `1px solid ${t.borderLight}`,
                    background: "transparent",
                    color: t.textSecondary,
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Latest Episode */}
      <div style={{ padding: "0 clamp(16px, 4vw, 60px)", marginBottom: 28 }}>
        <Card
          style={{
            padding: "16px 20px",
            borderLeft: `3px solid ${t.orange}`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              flexShrink: 0,
              background: `linear-gradient(135deg, ${t.orange}, ${t.orangeDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 20px ${t.orange}30`,
              cursor: "pointer",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="#fff">
              <path d="M3 1v12l10-6z" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 9,
                color: t.orange,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 2,
              }}
            >
              Latest · {EPISODES[0].dateDisplay}
            </div>
            <div
              style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              {EPISODES[0].title}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div style={{ padding: "0 clamp(16px, 4vw, 60px)", marginBottom: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 8,
          }}
        >
          {[
            { label: "Episodes", value: EPISODES.length, icon: "◈" },
            {
              label: "Glossary Terms",
              value: GLOSSARY.length,
              icon: "◇",
              to: "/glossary",
            },
            {
              label: "Platforms",
              value: PLATFORMS.length,
              icon: "◉",
              to: "/platforms",
            },
            {
              label: "Tools Reviewed",
              value: TOOLS.length,
              icon: "◐",
              to: "/tools",
            },
          ].map((s) => (
            <Card
              key={s.label}
              onClick={s.to ? () => navigate(s.to) : undefined}
              style={{
                padding: "14px 16px",
                cursor: s.to ? "pointer" : "default",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16, opacity: 0.4 }}>{s.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: t.orange,
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 9,
                      color: t.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginTop: 2,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Episodes Preview */}
      <div style={{ padding: "0 clamp(16px, 4vw, 60px) 28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            Recent Episodes
          </h2>
          <button
            onClick={() => navigate("/episodes")}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: t.orange,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View all →
          </button>
        </div>
        {EPISODES.slice(0, 5).map((ep) => (
          <div
            key={ep.id}
            style={{
              padding: "10px 0",
              borderBottom: `1px solid ${t.border}33`,
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
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: t.textMuted,
                flexShrink: 0,
              }}
            >
              {ep.dateDisplay.slice(0, -6)}
            </span>
          </div>
        ))}
      </div>

      {/* Glossary Highlights */}
      <div style={{ padding: "0 clamp(16px, 4vw, 60px) 28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            Glossary Highlights
          </h2>
          <button
            onClick={() => navigate("/glossary")}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              color: t.orange,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View all →
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 8,
          }}
        >
          {GLOSSARY.slice(0, 4).map((g) => (
            <Card
              key={g.term}
              onClick={() => navigate("/glossary")}
              style={{ padding: "14px 16px" }}
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

      {/* About / Subscribe */}
      <section
        style={{
          padding: "28px clamp(16px, 4vw, 60px) 40px",
          borderTop: `1px solid ${t.border}`,
        }}
      >
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 10px 0" }}>
              About
            </h2>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.7,
                color: t.textSecondary,
                margin: "0 0 10px 0",
              }}
            >
              Market Intel is your weekly intelligence briefing on AI and content
              creation. No hype. No jargon. Just curated insights for busy
              content marketers and SMB professionals.
            </p>
            <div
              style={{
                padding: "10px 14px",
                background: `${t.orange}06`,
                border: `1px solid ${t.orange}12`,
                borderRadius: 8,
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: t.textMuted,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: t.orange, fontWeight: 500 }}>
                AI Disclosure:
              </span>{" "}
              This show features AI avatars with voice cloning. All insights are
              created by Q'd Up's human content marketing experts.
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200, maxWidth: 320 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 10px 0" }}>
              Subscribe
            </h2>
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: t.textMuted,
                margin: "0 0 12px 0",
              }}
            >
              {SHOW.schedule}
            </p>
            {[
              { name: "Spotify", c: "#1DB954", url: SHOW.spotify },
              { name: "Apple Podcasts", c: t.orange, url: "#" },
              { name: "YouTube", c: "#FF0000", url: SHOW.youtube },
              { name: "RSS Feed", c: t.blueDark, url: SHOW.rss },
            ].map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 7,
                  border: `1px solid ${t.border}`,
                  marginBottom: 4,
                  cursor: "pointer",
                  background: t.surface,
                  boxShadow: t.cardShadow,
                  textDecoration: "none",
                  color: t.text,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: p.c }}>
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

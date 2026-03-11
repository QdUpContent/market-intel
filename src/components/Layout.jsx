import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme, FONT_BODY, FONT_MONO } from "../theme";
import { SHOW } from "../data/show";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SearchOverlay from "./SearchOverlay";
import KnowledgePopup from "./KnowledgePopup";

const navItems = [
  { to: "/episodes", label: "Episodes" },
  { to: "/glossary", label: "Glossary" },
  { to: "/platforms", label: "Platforms" },
  { to: "/tools", label: "Tools" },
];

export default function Layout() {
  const { t, mode } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [popup, setPopup] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        color: t.text,
        fontFamily: FONT_BODY,
        transition: "background 0.4s, color 0.4s",
      }}
    >
      {/* Grain overlay (dark mode only) */}
      {mode === "dark" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 999,
            opacity: 0.3,
            background:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          }}
        />
      )}

      {/* Search overlay */}
      {searchOpen && (
        <SearchOverlay
          query={searchQuery}
          setQuery={setSearchQuery}
          onClose={() => {
            setSearchOpen(false);
            setSearchQuery("");
          }}
          onNavigate={(path) => navigate(path)}
          onPopup={(item, type) => {
            setSearchOpen(false);
            setSearchQuery("");
            setPopup({ item, type });
          }}
        />
      )}

      {/* Knowledge popup */}
      {popup && (
        <KnowledgePopup
          item={popup.item}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Navigation */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: t.navBg,
          borderBottom: `1px solid ${t.border}`,
          padding: "0 clamp(16px, 4vw, 60px)",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.4s",
        }}
      >
        <NavLink
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Logo size={34} />
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: t.logoText,
              }}
            >
              <span style={{ color: t.blueDark }}>AI </span>Market Intel
            </div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 7.5,
                color: t.textMuted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              {SHOW.tagline}
            </div>
          </div>
        </NavLink>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              style={({ isActive }) => ({
                fontFamily: FONT_BODY,
                fontSize: 12,
                color: isActive ? t.orange : t.textSecondary,
                background: isActive ? `${t.orange}08` : "transparent",
                border: "none",
                padding: "5px 10px",
                borderRadius: 5,
                textDecoration: "none",
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.2s",
              })}
            >
              {n.label}
            </NavLink>
          ))}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              background: "none",
              border: `1px solid ${t.border}`,
              color: t.textMuted,
              padding: "4px 10px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 11,
              fontFamily: FONT_MONO,
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginLeft: 4,
            }}
          >
            ⌕ <span style={{ fontSize: 10 }}>Search</span>
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {/* Page content */}
      <Outlet />

      {/* Footer */}
      <footer
        style={{
          padding: "14px clamp(16px, 4vw, 60px)",
          borderTop: `1px solid ${t.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: t.textMuted }}>
          © 2026{" "}
          <a
            href={SHOW.agencyUrl}
            style={{ color: t.orange, textDecoration: "none" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {SHOW.agency}
          </a>
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: t.textMuted }}>
          {SHOW.title} · {SHOW.tagline}
        </span>
      </footer>
    </div>
  );
}

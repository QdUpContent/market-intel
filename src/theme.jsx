import { createContext, useContext, useState, useEffect } from "react";

const themes = {
  dark: {
    orange: "#E87D2A",
    orangeLight: "#F09A4E",
    orangeDark: "#CC6A1E",
    blue: "#5A7BA0",
    blueDark: "#3D5A80",
    blueDeep: "#2C4460",
    bg: "#0C1017",
    surface: "#111821",
    surfaceLight: "#182029",
    surfaceHover: "#1E2832",
    border: "#1E2A36",
    borderLight: "#2A3A4A",
    text: "#EAF0F6",
    textSecondary: "#8A9BB0",
    textMuted: "#506070",
    cardShadow: "none",
    logoText: "#fff",
    tagBg: "0C",
    tagBorder: "18",
    navBg: "#0C1017dd",
    inputBg: "#111821",
    heroLogoBg: "transparent",
    green: "#34D399",
    red: "#F87171",
    yellow: "#FBBF24",
  },
  light: {
    orange: "#D97125",
    orangeLight: "#E8923F",
    orangeDark: "#C0601A",
    blue: "#3D5A80",
    blueDark: "#2C4460",
    blueDeep: "#1E3450",
    bg: "#F7F8FA",
    surface: "#FFFFFF",
    surfaceLight: "#F0F2F5",
    surfaceHover: "#E8EBF0",
    border: "#E2E6EC",
    borderLight: "#D0D6DE",
    text: "#1A2332",
    textSecondary: "#506070",
    textMuted: "#8A95A5",
    cardShadow: "0 1px 3px rgba(0,0,0,0.06)",
    logoText: "#1A2332",
    tagBg: "08",
    tagBorder: "15",
    navBg: "#F7F8FAee",
    inputBg: "#F0F2F5",
    heroLogoBg: "#fff",
    green: "#059669",
    red: "#DC2626",
    yellow: "#D97706",
  },
};

const ThemeCtx = createContext();

export function useTheme() {
  return useContext(ThemeCtx);
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mi-theme") || "light";
    }
    return "light";
  });

  const toggle = () =>
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      localStorage.setItem("mi-theme", next);
      return next;
    });

  const t = themes[mode];

  useEffect(() => {
    document.body.style.background = t.bg;
    document.body.style.margin = "0";
  }, [t.bg]);

  return (
    <ThemeCtx.Provider value={{ t, mode, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

// Font family constants
export const FONT_BODY = "'Plus Jakarta Sans', sans-serif";
export const FONT_MONO = "'JetBrains Mono', monospace";

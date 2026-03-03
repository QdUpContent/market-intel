import { useTheme } from "../theme";

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const isDark = mode === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        border: "none",
        cursor: "pointer",
        position: "relative",
        background: isDark ? "#2A3A4A" : "#D0D6DE",
        transition: "background 0.3s",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          position: "absolute",
          top: 3,
          left: isDark ? 21 : 3,
          background: isDark ? "#E87D2A" : "#3D5A80",
          transition: "left 0.3s, background 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          color: "#fff",
        }}
      >
        {isDark ? "☾" : "☀"}
      </div>
    </button>
  );
}

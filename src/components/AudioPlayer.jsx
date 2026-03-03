import { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";
import { useTheme, FONT_BODY, FONT_MONO } from "../theme";

// ─────────────────────────────────────────────
// Player context so any component can trigger playback
// ─────────────────────────────────────────────
const PlayerCtx = createContext();

export function usePlayer() {
  return useContext(PlayerCtx);
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentEp, setCurrentEp] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play — called directly from click handlers (user gesture context)
  const play = useCallback((episode) => {
    if (!episode?.links?.audio) return;
    const audio = audioRef.current;
    if (!audio) return;

    // If switching episodes, load new src
    if (!currentEp || currentEp.id !== episode.id) {
      audio.src = episode.links.audio;
      audio.load();
    }

    audio.play().then(() => {
      setCurrentEp(episode);
      setIsPlaying(true);
    }).catch((err) => {
      console.warn("Audio play failed:", err);
      // Still show the player so user can tap play manually
      setCurrentEp(episode);
      setIsPlaying(false);
    });
  }, [currentEp]);

  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setCurrentEp(null);
    setIsPlaying(false);
  }, []);

  return (
    <PlayerCtx.Provider
      value={{ currentEp, isPlaying, play, pause, resume, stop }}
    >
      {/* Audio element always mounted — hidden */}
      <audio ref={audioRef} preload="metadata" />
      {children}
      {currentEp && (
        <AudioPlayerBar audioRef={audioRef} />
      )}
    </PlayerCtx.Provider>
  );
}

// ─────────────────────────────────────────────
// The visible player bar
// ─────────────────────────────────────────────
function AudioPlayerBar({ audioRef }) {
  const { t } = useTheme();
  const { currentEp, isPlaying, pause, resume, stop } = usePlayer();
  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const ct = audio.currentTime;
      const dur = audio.duration || 0;
      setCurrentTime(ct);
      setDuration(dur);
      setProgress(dur > 0 ? (ct / dur) * 100 : 0);
    };

    const onEnded = () => stop();
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    // Pick up duration if already loaded
    if (audio.duration) setDuration(audio.duration);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [audioRef, stop]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!progressRef.current || !audio) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * (audio.duration || 0);
  };

  const fmt = (sec) => {
    if (!sec || !isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!currentEp) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 150,
        background: t.surface,
        borderTop: `1px solid ${t.border}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "0 clamp(16px, 4vw, 60px)",
      }}
    >
      {/* Progress bar — clickable */}
      <div
        ref={progressRef}
        onClick={handleSeek}
        style={{
          height: 3,
          background: t.border,
          cursor: "pointer",
          position: "relative",
          marginTop: -1,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${t.orange}, ${t.orangeLight})`,
            borderRadius: 2,
            transition: "width 0.1s linear",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          height: 56,
        }}
      >
        {/* Play/Pause */}
        <button
          onClick={isPlaying ? pause : resume}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            flexShrink: 0,
            background: `linear-gradient(135deg, ${t.orange}, ${t.orangeDark})`,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 12px ${t.orange}25`,
          }}
        >
          {isPlaying ? (
            <svg width="10" height="10" viewBox="0 0 14 14" fill="#fff">
              <rect x="2" y="1" width="3.5" height="12" rx="1" />
              <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 14 14" fill="#fff">
              <path d="M3 1v12l10-6z" />
            </svg>
          )}
        </button>

        {/* Episode info */}
        <div style={{ flex: 1, minWidth: 0 }}>
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
            {currentEp.title}
          </div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              color: t.textMuted,
              display: "flex",
              gap: 8,
            }}
          >
            <span>E{currentEp.num}</span>
            <span>
              {fmt(currentTime)} / {fmt(duration)}
            </span>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={stop}
          style={{
            background: "none",
            border: "none",
            color: t.textMuted,
            cursor: "pointer",
            fontSize: 16,
            padding: 4,
            flexShrink: 0,
          }}
          title="Close player"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default AudioPlayerBar;

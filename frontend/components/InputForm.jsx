"use client";
import { useState } from "react";
import { Link2, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
const isValidYoutubeUrl = (url) => {
  const pattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}/;
  return pattern.test(url.trim());
};

export default function InputForm({ onSubmit, loading, dark = true }) {
  const [mode, setMode] = useState("url"); // "url" | "file"
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const cardBg = dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)";
  const heading = dark ? "#e2e8f0" : "#1a1a2e";
  const muted = dark ? "#94a3b8" : "#64748b";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "url") {
      const trimmed = url.trim();
      if (!trimmed) {
        toast.error("Please paste a YouTube URL");
        return;
      }
      if (!isValidYoutubeUrl(trimmed)) {
        toast.error("That doesn't look like a valid YouTube URL");
        return;
      }
      onSubmit({ type: "url", value: trimmed });
    } else {
      if (!file) {
        toast.error("Please select a file");
        return;
      }
      onSubmit({ type: "file", value: file });
    }
  };

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 20,
        padding: 28,
      }}
    >
      {/* Mode toggle */}
      <div
        style={{
          display: "inline-flex",
          background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          borderRadius: 100,
          padding: 4,
          marginBottom: 20,
        }}
      >
        {["url", "file"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 20px",
              borderRadius: 100,
              border: "none",
              background: mode === m ? "rgba(99,102,241,0.2)" : "transparent",
              color: mode === m ? "#818cf8" : muted,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {m === "url" ? <Link2 size={14} /> : <Upload size={14} />}
            {m === "url" ? "YouTube URL" : "Upload File"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "url" ? (
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtu.be/..."
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px 20px",
              borderRadius: 14,
              border: `1px solid ${border}`,
              background: dark ? "rgba(0,0,0,0.3)" : "#fff",
              color: heading,
              fontSize: 14,
              outline: "none",
              marginBottom: 16,
            }}
          />
        ) : (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "32px 20px",
              borderRadius: 14,
              border: `1.5px dashed ${border}`,
              background: dark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.01)",
              cursor: "pointer",
              marginBottom: 16,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
          >
            <Upload size={22} color="#818cf8" />
            <span style={{ fontSize: 13, color: heading, fontWeight: 500 }}>
              {file ? file.name : "Click to choose a video or audio file"}
            </span>
            <span style={{ fontSize: 11, color: muted }}>
              MP4, MOV, MP3, WAV, etc.
            </span>
            <input
              type="file"
              accept="video/*,audio/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
              style={{ display: "none" }}
            />
          </label>
        )}

        <button
          type="submit"
          disabled={loading || (mode === "url" ? !url.trim() : !file)}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 14,
            border: "none",
            background:
              loading || (mode === "url" ? !url.trim() : !file)
                ? "rgba(99,102,241,0.2)"
                : "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "opacity 0.2s",
            opacity:
              loading || (mode === "url" ? !url.trim() : !file) ? 0.6 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            "Analyze Video"
          )}
        </button>
      </form>
    </div>
  );
}

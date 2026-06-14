"use client";
import { useState } from "react";
import { Link2, Upload, Loader2, AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";

const isValidYoutubeUrl = (url) => {
  const pattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}/;
  return pattern.test(url.trim());
};

function KnowMoreModal({ onClose, dark }) {
  const bg = dark ? "#0f0f1a" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const heading = dark ? "#e2e8f0" : "#1a1a2e";
  const muted = dark ? "#94a3b8" : "#64748b";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 20,
          padding: 28,
          maxWidth: 480,
          width: "100%",
          position: "relative",
          animation: "fadeInUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            color: muted,
            cursor: "pointer",
            padding: 4,
          }}
        >
          <X size={16} />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <AlertTriangle size={18} color="#f59e0b" />
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: heading,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Why YouTube URLs sometimes fail
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              icon: "🌐",
              title: "Cloud IP Blocking",
              desc: "YouTube actively blocks requests from cloud/datacenter servers (like the ones powering this app). Your home internet works fine — cloud IPs don't.",
            },
            {
              icon: "📝",
              title: "No Captions Available",
              desc: "FrameIQ uses YouTube's auto-generated captions to extract the transcript. If a video has no captions (disabled or not generated yet), processing fails.",
            },
            {
              icon: "✅",
              title: "What actually works",
              desc: "Upload the video or audio file directly using the Upload File tab. This bypasses YouTube entirely and works 100% of the time.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                gap: 12,
                padding: "14px 16px",
                background: dark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.02)",
                border: `1px solid ${border}`,
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: heading,
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "12px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function InputForm({
  onSubmit,
  loading,
  dark = true,
  urlFailed = false,
}) {
  const [mode, setMode] = useState("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    <>
      {showModal && (
        <KnowMoreModal onClose={() => setShowModal(false)} dark={dark} />
      )}

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
            <>
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
                  border: `1px solid ${urlFailed ? "rgba(245,158,11,0.4)" : border}`,
                  background: dark ? "rgba(0,0,0,0.3)" : "#fff",
                  color: heading,
                  fontSize: 14,
                  outline: "none",
                  marginBottom: 10,
                  boxSizing: "border-box",
                  transition: "border-color 0.3s",
                }}
              />

              {urlFailed && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginBottom: 16,
                    animation: "fadeInUp 0.3s ease",
                  }}
                >
                  <AlertTriangle
                    size={13}
                    color="#f59e0b"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <p
                    style={{
                      fontSize: 11,
                      color: "#f59e0b",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    YouTube processing failed — the video may not have captions.
                    Try{" "}
                    <strong
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => setMode("file")}
                    >
                      Upload File
                    </strong>{" "}
                    instead.{" "}
                    <span
                      onClick={() => setShowModal(true)}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: 600,
                        color: "#fbbf24",
                      }}
                    >
                      Know more →
                    </span>
                  </p>
                </div>
              )}
            </>
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
    </>
  );
}

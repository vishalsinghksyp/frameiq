"use client";

const t = (dark, darkVal, lightVal) => (dark ? darkVal : lightVal);

export default function Footer({ dark = true }) {
  const border = t(dark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)");
  const muted = t(dark, "#94a3b8", "#64748b");
  const mutedLight = t(dark, "rgba(255,255,255,0.3)", "rgba(0,0,0,0.3)");

  return (
    <footer
      style={{
        marginTop: 80,
        textAlign: "center",
        borderTop: `1px solid ${border}`,
        paddingTop: 32,
        paddingBottom: 40,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          color: muted,
          marginBottom: 8,
        }}
      >
        FrameIQ
      </div>

      <p
        style={{
          fontSize: 12,
          color: mutedLight,
          letterSpacing: "0.04em",
          marginBottom: 16,
        }}
      >
        Made by Vishal Singh ❤️ · Next.js + FastAPI + Mistral AI +
        faster-whisper
      </p>

      <a
        href="https://vishal-portfolio-mu-amber.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "#818cf8",
          textDecoration: "none",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 100,
          padding: "7px 18px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(99,102,241,0.1)";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "none";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
        }}
      >
        ⬡ Check out my other projects →
      </a>
    </footer>
  );
}

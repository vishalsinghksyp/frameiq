"use client";

const STEPS = [
  {
    icon: "🎙️",
    name: "Transcribe",
    desc: "Audio is extracted from your YouTube video or uploaded file and converted to text using faster-whisper, supporting any language.",
  },
  {
    icon: "🌐",
    name: "Translate",
    desc: "Non-English transcripts are automatically translated to English using Mistral AI, making content accessible regardless of source language.",
  },
  {
    icon: "🧠",
    name: "Analyze",
    desc: "AI generates a title, summary, key points, action items, decisions, and open questions — turning hours of content into a quick read.",
  },
  {
    icon: "💬",
    name: "Chat",
    desc: "A searchable knowledge base is built from the transcript, letting you ask follow-up questions and get grounded answers instantly.",
  },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Any video, any language",
    desc: "Works with YouTube URLs or local video/audio files. Automatically detects and translates non-English content.",
  },
  {
    icon: "📋",
    title: "Structured output",
    desc: "Get organized summaries, key points, action items with owners, decisions made, and unresolved questions — not just a wall of text.",
  },
  {
    icon: "🔍",
    title: "RAG-powered chat",
    desc: "Ask specific questions and get answers grounded in the actual transcript, with vector search ensuring relevant context.",
  },
  {
    icon: "🚀",
    title: "Background processing",
    desc: "Long videos process asynchronously with live progress updates — no frozen pages, no timeouts.",
  },
];

const t = (dark, darkVal, lightVal) => (dark ? darkVal : lightVal);

export default function Explanation({ dark = true }) {
  const border = t(dark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)");
  const cardBg = t(dark, "rgba(255,255,255,0.02)", "rgba(0,0,0,0.01)");
  const heading = t(dark, "#e2e8f0", "#1a1a2e");
  const muted = t(dark, "#94a3b8", "#64748b");
  const mutedLight = t(dark, "rgba(255,255,255,0.3)", "rgba(0,0,0,0.3)");

  return (
    <>
      {/* How it works */}
      <section style={{ marginTop: 80 }}>
        <div
          style={{
            fontSize: 11,
            color: muted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          How It Works
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.4rem,3vw,2rem)",
            fontWeight: 700,
            color: heading,
            marginBottom: 32,
            letterSpacing: "-0.02em",
          }}
        >
          From video to insights in four steps
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STEPS.map((step, i) => (
            <div
              key={step.name}
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: 18,
                padding: "22px 24px",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {step.icon}
                </div>
                <div
                  style={{ fontSize: 10, color: mutedLight, fontWeight: 600 }}
                >
                  0{i + 1}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: heading,
                    marginBottom: 6,
                  }}
                >
                  {step.name}
                </div>
                <div style={{ fontSize: 13, color: muted, lineHeight: 1.7 }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ marginTop: 80 }}>
        <div
          style={{
            fontSize: 11,
            color: muted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          Why Frame IQ
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.4rem,3vw,2rem)",
            fontWeight: 700,
            color: heading,
            marginBottom: 32,
            letterSpacing: "-0.02em",
          }}
        >
          Built different
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((card) => (
            <div
              key={card.title}
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: 18,
                padding: "24px 22px",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 14 }}>{card.icon}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: heading,
                  marginBottom: 8,
                }}
              >
                {card.title}
              </div>
              <div style={{ fontSize: 13, color: muted, lineHeight: 1.7 }}>
                {card.desc}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

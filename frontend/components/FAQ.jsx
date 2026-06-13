"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What video formats and sources are supported?",
    a: "You can paste any YouTube URL (including youtu.be links) or upload local video/audio files like MP4, MOV, MP3, and WAV.",
  },
  {
    q: "How long does processing take?",
    a: "It depends on video length. A 10-15 minute video typically takes 3-6 minutes, while longer videos (1 hour+) can take 10-15 minutes. Progress is shown live with each pipeline stage.",
  },
  {
    q: "Does this work for non-English videos?",
    a: "Yes! The transcription engine (faster-whisper) supports many languages, and the transcript is automatically translated to English before summarization — so you get English summaries regardless of the source language.",
  },
  {
    q: "What AI models power this?",
    a: "Transcription uses faster-whisper (local, open-source). Translation, summarization, and chat are powered by Mistral AI. The chat feature uses a RAG (Retrieval-Augmented Generation) pipeline with ChromaDB for vector search.",
  },
  {
    q: "Can I ask follow-up questions about the video?",
    a: "Yes — once processing completes, a chat interface appears where you can ask anything about the video's content. Answers are grounded in the actual transcript.",
  },
  {
    q: "Is my uploaded video stored permanently?",
    a: "Uploaded files are processed temporarily for analysis. Session data (transcript, summary, chat index) persists for your current session but isn't tied to a permanent account.",
  },
  {
    q: "Why does the chat say 'I could not find this information'?",
    a: "The chat is intentionally grounded in the video's transcript — it won't answer general knowledge questions unrelated to the content. This keeps answers accurate and relevant to what was actually said in the video.",
  },
];

const t = (dark, darkVal, lightVal) => (dark ? darkVal : lightVal);

function FaqItem({ q, a, dark }) {
  const [open, setOpen] = useState(false);

  const border = t(dark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)");
  const cardBg = t(dark, "rgba(255,255,255,0.02)", "rgba(0,0,0,0.01)");
  const heading = t(dark, "#e2e8f0", "#1a1a2e");
  const muted = t(dark, "#94a3b8", "#64748b");

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${open ? "rgba(99,102,241,0.3)" : border}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.3s",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 22px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: heading }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          color="#818cf8"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
            flexShrink: 0,
            marginLeft: 12,
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "0 22px 18px",
            fontSize: 13,
            color: muted,
            lineHeight: 1.7,
          }}
        >
          {a}
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ dark = true }) {
  const muted = t(dark, "#94a3b8", "#64748b");
  const heading = t(dark, "#e2e8f0", "#1a1a2e");

  return (
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
        FAQ
      </div>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.4rem,3vw,2rem)",
          fontWeight: 700,
          color: heading,
          marginBottom: 28,
          letterSpacing: "-0.02em",
        }}
      >
        Common questions
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAQS.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} dark={dark} />
        ))}
      </div>
    </section>
  );
}

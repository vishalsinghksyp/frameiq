"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  Check,
  FileText,
  ListChecks,
  AlertCircle,
  HelpCircle,
  ScrollText,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const TABS = [
  { id: "summary", label: "Summary", icon: Sparkles },
  { id: "key_points", label: "Key Points", icon: ListChecks },
  { id: "action_items", label: "Action Items", icon: FileText },
  { id: "decisions", label: "Decisions", icon: Check },
  { id: "questions", label: "Questions", icon: HelpCircle },
  { id: "transcript", label: "Transcript", icon: ScrollText },
];

const t = (dark, darkVal, lightVal) => (dark ? darkVal : lightVal);

function CopyButton({ text, dark }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 10,
        border: `1px solid ${t(dark, "rgba(255,255,255,0.1)", "rgba(0,0,0,0.1)")}`,
        background: "transparent",
        color: t(dark, "#94a3b8", "#64748b"),
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = t(
          dark,
          "rgba(255,255,255,0.1)",
          "rgba(0,0,0,0.1)",
        ))
      }
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function ResultsTabs({ result, dark = true }) {
  const [activeTab, setActiveTab] = useState("summary");

  const border = t(dark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)");
  const cardBg = t(dark, "rgba(255,255,255,0.02)", "rgba(0,0,0,0.01)");
  const heading = t(dark, "#e2e8f0", "#1a1a2e");
  const muted = t(dark, "#94a3b8", "#64748b");

  const content = result[activeTab] || "No content available.";

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {/* Title */}
      {result.title && (
        <div
          style={{ padding: "20px 24px", borderBottom: `1px solid ${border}` }}
        >
          <div
            style={{
              fontSize: 11,
              color: muted,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            Video Title
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: heading,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {result.title}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          borderBottom: `1px solid ${border}`,
          padding: "0 8px",
        }}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "14px 16px",
                border: "none",
                borderBottom: isActive
                  ? "2px solid #818cf8"
                  : "2px solid transparent",
                background: "transparent",
                color: isActive ? "#818cf8" : muted,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.2s",
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <CopyButton text={content} dark={dark} />
        </div>

        <div
          style={{
            fontSize: 14,
            lineHeight: 1.8,
            color: heading,
            maxHeight: 500,
            overflowY: "auto",
          }}
          className="markdown-content"
        >
          {activeTab === "transcript" ? (
            <p
              style={{
                whiteSpace: "pre-wrap",
                color: muted,
                fontSize: 13,
                lineHeight: 1.8,
              }}
            >
              {content}
            </p>
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState, useRef } from "react";
import { getStatus } from "@/lib/api";

const STAGES = [
  {
    id: "processing_audio",
    label: "Processing Audio",
    icon: "🎵",
    desc: "Downloading and chunking audio",
  },
  {
    id: "transcribing",
    label: "Transcribing",
    icon: "📝",
    desc: "Converting speech to text",
  },
  {
    id: "translating",
    label: "Translating",
    icon: "🌐",
    desc: "Translating to English",
  },
  {
    id: "llm_processing",
    label: "AI Analysis",
    icon: "🧠",
    desc: "Generating summary, key points & more",
  },
  {
    id: "building_vector_store",
    label: "Indexing",
    icon: "🔍",
    desc: "Building searchable knowledge base",
  },
];

// Map backend steps to stage groups
const STEP_TO_STAGE = {
  processing_audio: "processing_audio",
  transcribing: "transcribing",
  translating: "translating",
  generating_title: "llm_processing",
  extracting_key_points: "llm_processing",
  summarizing: "llm_processing",
  extracting_action_items: "llm_processing",
  extracting_decisions: "llm_processing",
  extracting_questions: "llm_processing",
  building_vector_store: "building_vector_store",
  complete: "complete",
};

const t = (dark, darkVal, lightVal) => (dark ? darkVal : lightVal);

function StageCard({ stage, status, dark }) {
  const colors = {
    done: {
      border: "rgba(99,102,241,0.6)",
      bg: "rgba(99,102,241,0.08)",
      dot: "#818cf8",
    },
    active: {
      border: "rgba(168,85,247,0.7)",
      bg: "rgba(168,85,247,0.1)",
      dot: "#c084fc",
    },
    pending: {
      border: t(dark, "rgba(255,255,255,0.06)", "rgba(0,0,0,0.08)"),
      bg: t(dark, "rgba(255,255,255,0.02)", "rgba(0,0,0,0.02)"),
      dot: t(dark, "rgba(255,255,255,0.2)", "rgba(0,0,0,0.2)"),
    },
  };
  const c = colors[status];

  return (
    <div
      style={{
        border: `1px solid ${c.border}`,
        background: c.bg,
        borderRadius: 16,
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "all 0.5s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {status === "active" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent, rgba(168,85,247,0.06), transparent)",
            animation: "shimmer 1.8s infinite",
          }}
        />
      )}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background:
            status === "active"
              ? "rgba(168,85,247,0.2)"
              : status === "done"
                ? "rgba(99,102,241,0.15)"
                : t(dark, "rgba(255,255,255,0.04)", "rgba(0,0,0,0.04)"),
          border: `1px solid ${c.dot}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          flexShrink: 0,
          animation:
            status === "active" ? "pulse 1.4s ease-in-out infinite" : "none",
        }}
      >
        {status === "done" ? "✓" : stage.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color:
              status === "pending"
                ? t(dark, "rgba(255,255,255,0.3)", "rgba(0,0,0,0.3)")
                : t(dark, "#e2e8f0", "#1a1a2e"),
            letterSpacing: "0.02em",
          }}
        >
          {stage.label}
        </div>
        <div
          style={{
            fontSize: 11,
            color:
              status === "pending"
                ? t(dark, "rgba(255,255,255,0.15)", "rgba(0,0,0,0.2)")
                : t(dark, "rgba(255,255,255,0.45)", "rgba(0,0,0,0.5)"),
            marginTop: 2,
          }}
        >
          {stage.desc}
        </div>
      </div>
      {status === "active" && (
        <div style={{ display: "flex", gap: 3 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#c084fc",
                animation: "bounce 1s ease-in-out infinite",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}
      {status === "done" && (
        <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 500 }}>
          Done
        </div>
      )}
    </div>
  );
}

export default function ProgressStages({
  jobId,
  onComplete,
  onError,
  dark = true,
}) {
  const [currentStage, setCurrentStage] = useState(STAGES[0].id);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const data = await getStatus(jobId);

        const stageId = STEP_TO_STAGE[data.step] || STAGES[0].id;
        setCurrentStage(stageId);

        if (data.status === "done") {
          clearInterval(intervalRef.current);
          onComplete(data.result);
        } else if (data.status === "failed") {
          clearInterval(intervalRef.current);
          onError(data.error || "Something went wrong");
        }
      } catch (err) {
        clearInterval(intervalRef.current);
        onError(err.message);
      }
    };

    poll(); // immediate first check
    intervalRef.current = setInterval(poll, 3000);

    return () => clearInterval(intervalRef.current);
  }, [jobId]);

  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {STAGES.map((stage, i) => {
        let status = "pending";
        if (i < currentIndex) status = "done";
        else if (i === currentIndex) status = "active";

        return (
          <StageCard key={stage.id} stage={stage} status={status} dark={dark} />
        );
      })}
    </div>
  );
}

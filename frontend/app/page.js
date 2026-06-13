"use client";
import { useState } from "react";
import InputForm from "@/components/InputForm";
import ProgressStages from "@/components/ProgressStages";
import ResultsTabs from "@/components/ResultsTabs";
import ChatInterface from "@/components/ChatInterface";
import Explanation from "@/components/Explanation";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { processUrl, processFile } from "@/lib/api";
import { useTheme } from "@/lib/ThemeContext";
import toast from "react-hot-toast";
import { RotateCcw, Sun, Moon } from "lucide-react";
import { ResultsSkeleton, ChatSkeleton } from "@/components/Skeleton";

export default function Home() {
  const { dark, toggle } = useTheme();
  const [jobId, setJobId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const res =
        data.type === "url"
          ? await processUrl(data.value)
          : await processFile(data.value);
      setJobId(res.job_id);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleComplete = (res) => {
    setResult(res);
    setLoading(false);
    toast.success("Analysis complete!");
  };

  const handleError = (err) => {
    toast.error(err);
    setLoading(false);
    setJobId(null);
  };

  const handleReset = () => {
    setJobId(null);
    setResult(null);
    setLoading(false);
  };

  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2.5rem",
              fontWeight: 800,
            }}
          >
            Frame
            <span
              style={{
                background: "linear-gradient(90deg, #818cf8, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              IQ
            </span>
          </h1>
          <p style={{ color: "#94a3b8", marginTop: 8 }}>
            AI-powered video summarizer & chat
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8, flexShrink: 0 }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
              border: `1px solid ${border}`,
              background: "transparent",
              color: dark ? "#e2e8f0" : "#1a1a2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* New Analysis */}
          {result && (
            <button
              onClick={handleReset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 100,
                border: "1px solid rgba(99,102,241,0.25)",
                background: "transparent",
                color: "#818cf8",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
              }}
            >
              <RotateCcw size={14} />
              New Analysis
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 32 }} />

      {!jobId && (
        <InputForm onSubmit={handleSubmit} loading={loading} dark={dark} />
      )}

      {jobId && !result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <ProgressStages
            jobId={jobId}
            onComplete={handleComplete}
            onError={handleError}
            dark={dark}
          />
          <ResultsSkeleton dark={dark} />
          <ChatSkeleton dark={dark} />
        </div>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <ResultsTabs result={result} dark={dark} />
          <ChatInterface sessionId={result.session_id} dark={dark} />
        </div>
      )}

      <Explanation dark={dark} />
      <FAQ dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}

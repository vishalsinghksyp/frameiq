"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { askQuestion } from "@/lib/api";
import toast from "react-hot-toast";

const t = (dark, darkVal, lightVal) => (dark ? darkVal : lightVal);

export default function ChatInterface({ sessionId, dark = true }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const border = t(dark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)");
  const cardBg = t(dark, "rgba(255,255,255,0.02)", "rgba(0,0,0,0.01)");
  const heading = t(dark, "#e2e8f0", "#1a1a2e");
  const muted = t(dark, "#94a3b8", "#64748b");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await askQuestion(sessionId, question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.answer },
      ]);
    } catch (err) {
      toast.error("Failed to get answer");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that question.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#818cf8",
          }}
        >
          <MessageCircle size={16} />
        </div>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: heading,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Chat with this video
          </div>
          <div style={{ fontSize: 11, color: muted }}>
            Ask anything about the content
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          padding: 20,
          minHeight: 200,
          maxHeight: 400,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: muted,
              fontSize: 13,
              padding: "30px 0",
            }}
          >
            💬 Ask a question to get started — e.g. "What were the main
            decisions made?"
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              animation: "fadeInUp 0.3s ease",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 16px",
                borderRadius: 14,
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #6366f1, #a855f7)"
                    : t(dark, "rgba(255,255,255,0.04)", "rgba(0,0,0,0.04)"),
                color: msg.role === "user" ? "#fff" : heading,
                fontSize: 13,
                lineHeight: 1.7,
              }}
              className={msg.role === "assistant" ? "markdown-content" : ""}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 14,
                background: t(
                  dark,
                  "rgba(255,255,255,0.04)",
                  "rgba(0,0,0,0.04)",
                ),
                display: "flex",
                gap: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#818cf8",
                    animation: "bounce 1s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{
          display: "flex",
          gap: 10,
          padding: 16,
          borderTop: `1px solid ${border}`,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the video..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 12,
            border: `1px solid ${border}`,
            background: t(dark, "rgba(0,0,0,0.3)", "#fff"),
            color: heading,
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "none",
            background:
              loading || !input.trim()
                ? "rgba(99,102,241,0.2)"
                : "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: loading || !input.trim() ? "default" : "pointer",
            flexShrink: 0,
          }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
}

"use client";
import { useState, useEffect, useMemo } from "react";

function Particle({ style }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

export default function ParticleField() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        key: i,
        style: {
          width: `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background:
            i % 3 === 0
              ? "rgba(99,102,241,0.5)"
              : i % 3 === 1
                ? "rgba(168,85,247,0.4)"
                : "rgba(148,163,184,0.3)",
          animation: `drift ${6 + Math.random() * 8}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 6}s`,
        },
      })),
    [],
  );

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {particles.map((p) => (
        <Particle key={p.key} style={p.style} />
      ))}
    </div>
  );
}

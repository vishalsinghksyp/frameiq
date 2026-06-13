"use client";

export default function AuroraBackground() {
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
      {/* Aurora 1 */}
      <div
        style={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
          filter: "blur(80px)",
          top: "-10%",
          left: "-10%",
          animation: "auroraMove1 18s ease-in-out infinite alternate",
        }}
      />

      {/* Aurora 2 */}
      <div
        style={{
          position: "absolute",
          width: "45vw",
          height: "45vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.20), transparent 70%)",
          filter: "blur(90px)",
          top: "20%",
          right: "-10%",
          animation: "auroraMove2 22s ease-in-out infinite alternate",
        }}
      />

      {/* Aurora 3 */}
      <div
        style={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)",
          filter: "blur(100px)",
          bottom: "-10%",
          left: "25%",
          animation: "auroraMove3 25s ease-in-out infinite alternate",
        }}
      />

      <style jsx>{`
        @keyframes auroraMove1 {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(120px, 80px) scale(1.2);
          }
        }

        @keyframes auroraMove2 {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(-100px, 100px) scale(1.15);
          }
        }

        @keyframes auroraMove3 {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(80px, -120px) scale(1.25);
          }
        }
      `}</style>
    </div>
  );
}

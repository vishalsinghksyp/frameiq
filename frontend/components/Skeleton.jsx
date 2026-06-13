"use client";

const t = (dark, darkVal, lightVal) => (dark ? darkVal : lightVal);

function ShimmerBox({ width, height, dark, style = {} }) {
  const base = t(dark, "rgba(255,255,255,0.04)", "rgba(0,0,0,0.04)");
  const shine = t(dark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.06)");

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 8,
        background: base,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, transparent, ${shine}, transparent)`,
          animation: "shimmer 1.8s infinite",
        }}
      />
    </div>
  );
}

export function ResultsSkeleton({ dark = true }) {
  const border = t(dark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)");
  const cardBg = t(dark, "rgba(255,255,255,0.02)", "rgba(0,0,0,0.01)");

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {/* Title skeleton */}
      <div
        style={{ padding: "20px 24px", borderBottom: `1px solid ${border}` }}
      >
        <ShimmerBox
          width="30%"
          height={11}
          dark={dark}
          style={{ marginBottom: 10 }}
        />
        <ShimmerBox width="60%" height={20} dark={dark} />
      </div>

      {/* Tabs skeleton */}
      <div
        style={{
          display: "flex",
          gap: 12,
          padding: "16px 24px",
          borderBottom: `1px solid ${border}`,
        }}
      >
        {[60, 80, 90, 70, 75, 85].map((w, i) => (
          <ShimmerBox key={i} width={w} height={14} dark={dark} />
        ))}
      </div>

      {/* Content skeleton */}
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <ShimmerBox width="100%" height={14} dark={dark} />
        <ShimmerBox width="95%" height={14} dark={dark} />
        <ShimmerBox width="88%" height={14} dark={dark} />
        <ShimmerBox width="92%" height={14} dark={dark} />
        <div style={{ height: 8 }} />
        <ShimmerBox width="70%" height={14} dark={dark} />
        <ShimmerBox width="98%" height={14} dark={dark} />
        <ShimmerBox width="85%" height={14} dark={dark} />
      </div>
    </div>
  );
}

export function ChatSkeleton({ dark = true }) {
  const border = t(dark, "rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)");
  const cardBg = t(dark, "rgba(255,255,255,0.02)", "rgba(0,0,0,0.01)");

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 20,
        padding: 20,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <ShimmerBox
        width={32}
        height={32}
        dark={dark}
        style={{ borderRadius: 10, flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <ShimmerBox
          width="30%"
          height={14}
          dark={dark}
          style={{ marginBottom: 6 }}
        />
        <ShimmerBox width="50%" height={11} dark={dark} />
      </div>
    </div>
  );
}

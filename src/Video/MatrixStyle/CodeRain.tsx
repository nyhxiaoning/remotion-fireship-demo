import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const columns = 32;
const rows = 18;
const glyphs = "01ネ矩陣∴∵∷∶≈≡⊕⊗".split("");

export const CodeRain: React.FC<{ opacity?: number }> = ({ opacity = 0.25 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const colWidth = Math.ceil(width / columns);
  const rowHeight = Math.ceil(height / rows);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity,
      }}
    >
      {Array.from({ length: columns }).map((_, c) => {
        const speed = 0.6 + ((c * 13) % 10) / 10;
        const yOffset = ((frame * speed) % (rows + 10)) * rowHeight;
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: c * colWidth,
              top: -rowHeight * 8 + yOffset,
              width: colWidth,
              color: "#00ff66",
              textShadow: "0 0 6px rgba(0,255,140,0.6)",
              fontFamily: "SF Pro, monospace",
              fontWeight: 700,
              fontSize: Math.max(20, Math.round(colWidth * 0.6)),
              letterSpacing: 2,
            }}
          >
            {Array.from({ length: rows + 16 }).map((_, r) => {
              const ch = glyphs[(c * 31 + r * 17) % glyphs.length];
              return (
                <div key={r} style={{ lineHeight: 1.05, opacity: Math.min(1, (r + 4) / (rows + 4)) }}>
                  {ch}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};


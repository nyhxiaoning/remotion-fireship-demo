import React from "react";
import { AbsoluteFill } from "remotion";

export const EmojiSprite: React.FC<{
  emoji: string;
  x: number;
  y: number;
  angle?: number;
  size?: number;
}> = ({ emoji, x, y, angle = 0, size = 80 }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(${angle}rad)`,
        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.35))",
        willChange: "transform, left, top",
      }}
    >
      <div style={{ fontSize: size * 0.9, lineHeight: 1 }}>{emoji}</div>
    </div>
  );
};

export const DustTrail: React.FC<{ points: { x: number; y: number; o: number }[] }>
  = ({ points }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {points.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x - 6,
            top: p.y - 6,
            width: 12,
            height: 12,
            borderRadius: 12,
            background: "rgba(255,255,255,0.85)",
            opacity: p.o,
            filter: "blur(1px)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};


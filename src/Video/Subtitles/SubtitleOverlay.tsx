import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export type CaptionItem = { start: number; end: number; text: string };

export const SubtitleOverlay: React.FC<{ captions: CaptionItem[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const active = captions.find((c) => t >= c.start && t < c.end);

  return (
    <AbsoluteFill>
      {active ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 60,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: 1400,
              padding: "14px 24px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.55)",
              color: "#fff",
              fontFamily: "SF Pro, Helvetica, Arial, sans-serif",
              fontSize: 48,
              lineHeight: 1.35,
              textAlign: "center",
              boxShadow: "0 6px 22px rgba(0,0,0,0.35)",
              backdropFilter: "blur(2px)",
            }}
          >
            {active.text}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};


import {
  AbsoluteFill,
  Audio,
  Series,
  Video,
  staticFile,
  useVideoConfig,
} from "remotion";

import { CodeRain } from "./CodeRain";
import React from "react";

const clips = [
  // 使用内置演示视频占位，确保预览可运行；可替换为 public/videos/matrix/* 中的合法素材
  staticFile("videos/using-remotion.mp4"),
  staticFile("videos/with-javascript-short.mp4"),
  staticFile("videos/player-demo.mp4"),
];

export const MatrixStyle: React.FC = () => {
  const { width, height } = useVideoConfig();
  const audio = staticFile("audio-compatible.wav");

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={audio} />

      <Series>
        {clips.map((src, i) => (
          <Series.Sequence key={i} durationInFrames={6 * 30}>
            <AbsoluteFill
              style={{
                backgroundColor: "#000",
                overflow: "hidden",
              }}
            >
              <Video
                src={src}
                style={{
                  width,
                  height,
                  objectFit: "cover",
                  filter:
                    "contrast(1.15) saturate(1.1) hue-rotate(110deg) brightness(0.9)",
                  transform:
                    i % 2 === 0
                      ? "scale(1.08) translate3d(8px,0,0)"
                      : "scale(1.08) translate3d(-8px,0,0)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
                  mixBlendMode: "multiply",
                }}
              />

              <CodeRain opacity={0.18} />
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

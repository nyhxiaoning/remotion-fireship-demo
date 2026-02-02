import React from "react";
import { AbsoluteFill, Video, staticFile, Sequence } from "remotion";
import { SubtitleOverlay, CaptionItem } from "../Subtitles/SubtitleOverlay";

const demoSrc = staticFile("videos/using-remotion.mp4");

const captions: CaptionItem[] = [
  { start: 0.0, end: 2.4, text: "一切都是幻象" },
  { start: 2.4, end: 4.8, text: "你准备醒来了吗？" },
  { start: 4.8, end: 7.2, text: "选择在你手中" },
  { start: 7.2, end: 9.6, text: "看清这个世界的真相" },
  { start: 9.6, end: 12.0, text: "跟随直觉，突破极限" },
];

export const TrailerWithSubs: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Video src={demoSrc} />
      <Sequence from={0}>
        <SubtitleOverlay captions={captions} />
      </Sequence>
    </AbsoluteFill>
  );
};


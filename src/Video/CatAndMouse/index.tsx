import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DustTrail, EmojiSprite } from "./Characters";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const mousePos = (t: number, w: number, h: number) => {
  const m = 80;
  const x = interpolate(t, [0, 0.25, 0.55, 0.8, 1], [m, w - m, w * 0.55, w * 0.2, w - m], { easing: undefined, extrapolateRight: "clamp" });
  const y = h * 0.65 + Math.sin(t * Math.PI * 6) * 90 + Math.cos(t * Math.PI * 2) * 20;
  return { x, y };
};

const catPos = (t: number, w: number, h: number) => {
  const lag = 0.05;
  const tt = clamp(t - lag, 0, 1);
  return mousePos(tt, w, h);
};

const angleTo = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  const a = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  return a;
};

export const CatAndMouse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = clamp(frame / (20 * fps), 0, 1);

  const m = mousePos(t, width, height);
  const c = catPos(t, width, height);

  const dt = 0.003;
  const m2 = mousePos(clamp(t + dt, 0, 1), width, height);
  const c2 = catPos(clamp(t + dt, 0, 1), width, height);
  const mAng = angleTo(m, m2);
  const cAng = angleTo(c, c2);

  const bgY = interpolate(t, [0, 1], [0, -120]);

  const trail = Array.from({ length: 12 }).map((_, i) => {
    const k = i + 1;
    const tt = clamp(t - k * 0.02, 0, 1);
    const p = mousePos(tt, width, height);
    return { x: p.x, y: p.y, o: 1 - k / 14 };
  });

  const audio = staticFile("audio-compatible.wav");

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0f12", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0b0f12 0%, #0f3130 70%, #062521 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: bgY, height: 3000, backgroundSize: "40px 40px", backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)" }} />
      <Audio src={audio} />

      <DustTrail points={trail} />
      <EmojiSprite emoji="🐭" x={m.x} y={m.y} angle={mAng} size={70} />
      <EmojiSprite emoji="🐱" x={c.x - 28} y={c.y - 6} angle={cAng} size={100} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center", opacity: clamp(interpolate(t, [0, 0.05, 0.1], [0, 1, 0]), 0, 1) }}>
        <div style={{ color: "#d9fff3", fontFamily: "SF Pro, Helvetica, Arial, sans-serif", fontSize: 56, letterSpacing: 2, textShadow: "0 0 12px rgba(0,255,170,0.35)" }}>猫捉老鼠</div>
      </div>
    </AbsoluteFill>
  );
};


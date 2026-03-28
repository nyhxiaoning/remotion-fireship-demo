import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';

export type OrientalOpenerProps = {
  title?: string;
  subtitle?: string;
};

const GoldDivider: React.FC<{progress: number}> = ({progress}) => {
  const width = `${Math.min(100, Math.max(0, progress * 100))}%`;
  return (
    <div style={{width: '60%', height: 2, background: 'transparent', position: 'relative'}}>
      <div
        style={{
          width,
          height: 2,
          background: 'linear-gradient(90deg,#bfa14a,#f9d97a,#bfa14a)',
          boxShadow: '0 0 8px rgba(249,217,122,0.6)',
          transition: 'width .2s',
        }}
      />
    </div>
  );
};

const InkBackground: React.FC<{t: number}> = ({t}) => {
  // 用多层径向渐变模拟国风墨色云纹
  const offset = (a: number) => `${Math.sin(t * a) * 8}px ${Math.cos(t * a) * 8}px`;
  const bg = `
    radial-gradient(600px 400px at calc(50% + ${offset(0.7)}), rgba(0,0,0,0.35), transparent 60%),
    radial-gradient(500px 320px at calc(50% - ${offset(0.9)}), rgba(0,0,0,0.25), transparent 65%),
    radial-gradient(460px 360px at 50% 50%, rgba(0,0,0,0.18), transparent 70%)
  `;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: bg,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }}
    />
  );
};

export const OrientalOpener5s: React.FC<OrientalOpenerProps> = ({title = '品牌名', subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const total = fps * 5;

  const fadeBg = interpolate(frame, [0, Math.round(0.3 * fps)], [0, 1], {extrapolateRight: 'clamp'});
  const lineGrow = interpolate(frame, [Math.round(0.3 * fps), Math.round(1.2 * fps)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleIn = spring({frame: frame - Math.round(0.6 * fps), fps, damping: 180, durationInFrames: Math.round(0.9 * fps)});
  const titleOpacity = interpolate(frame, [Math.round(0.6 * fps), Math.round(1.2 * fps)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outro = interpolate(frame, [Math.round(total - 0.6 * fps), total], [1, 0], {extrapolateLeft: 'clamp'});

  const t = frame / fps; // seconds for background motion

  return (
    <AbsoluteFill
      style={{
        width,
        height,
        background: 'linear-gradient(180deg,#1b0f0f 0%, #3e0909 100%)',
        filter: `saturate(1.05)`,
        display: 'grid',
        placeItems: 'center',
        color: '#f5e6c6',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        opacity: fadeBg * outro,
      }}
    >
      {/* 墨色云纹 */}
      <InkBackground t={t} />

      <div style={{display: 'grid', placeItems: 'center', gap: 18, textAlign: 'center'}}>
        <div
          style={{
            transform: `translateY(${(1 - titleIn) * 18}px) scale(${0.96 + titleIn * 0.04})`,
            opacity: titleOpacity * 0.95,
            textShadow:
              '0 1px 0 rgba(0,0,0,0.4), 0 0 20px rgba(249,217,122,0.25), 0 0 40px rgba(191,161,74,0.2)',
            letterSpacing: '0.05em',
          }}
        >
          <div style={{fontSize: 84, fontWeight: 900}}>{title}</div>
          {subtitle ? (
            <div style={{marginTop: 8, fontSize: 24, color: '#f5e6c6', opacity: 0.85}}>{subtitle}</div>
          ) : null}
        </div>
        <GoldDivider progress={lineGrow} />
      </div>

      {/* 角标金色装饰 */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 48,
          width: 56,
          height: 56,
          borderTop: '2px solid #f3d98c',
          borderLeft: '2px solid #f3d98c',
          filter: 'drop-shadow(0 0 6px rgba(243,217,140,0.35))',
          opacity: 0.8 * fadeBg,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          right: 48,
          width: 56,
          height: 56,
          borderBottom: '2px solid #f3d98c',
          borderRight: '2px solid #f3d98c',
          filter: 'drop-shadow(0 0 6px rgba(243,217,140,0.35))',
          opacity: 0.8 * fadeBg,
        }}
      />
    </AbsoluteFill>
  );
};


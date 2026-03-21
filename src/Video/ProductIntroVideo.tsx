import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Audio } from 'remotion';

export interface ProductIntroProps {
  productName: string;
  painPoint: string;
  feature1: { title: string; benefit: string };
  feature2: { title: string; benefit: string };
  testimonials: string[]; // 2-3 quotes
  valueBullets: string[]; // e.g., ["More Time","Less Stress","More Wins"]
  cta: { primary: string; secondary?: string; tagline?: string };
  colors?: { primary: string; secondary: string; bg: string };
  musicUrl?: string | null;
}

const TitleText: React.FC<{text: string; size?: number; color?: string}> = ({text, size=72, color='#fff'}) => (
  <div style={{ fontSize: size, fontWeight: 900, color, letterSpacing: 1.2, textShadow: '0 6px 20px rgba(0,0,0,.25)' }}>{text}</div>
);

const FadeIn: React.FC<{ children: React.ReactNode; y?: number }> = ({children, y=40}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [0, fps * 0.5], [y, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  return <div style={{ transform: `translateY(${enter}px)`, opacity }}>{children}</div>;
};

const Bg: React.FC<{colors?: ProductIntroProps['colors']}> = ({colors}) => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.15 }}>
    <div style={{ position: 'absolute', top: 40, left: 40, width: 120, height: 120, borderRadius: '50%', border: `6px solid ${colors?.secondary ?? '#38bdf8'}` }} />
    <div style={{ position: 'absolute', bottom: 60, right: 80, width: 180, height: 180, borderRadius: '50%', border: `6px solid ${colors?.primary ?? '#22c55e'}` }} />
  </div>
);

export const ProductIntroVideo: React.FC<ProductIntroProps> = ({ productName, painPoint, feature1, feature2, testimonials, valueBullets, cta, colors, musicUrl }) => {
  const { fps } = useVideoConfig();
  const durations = [10, 8, 10, 12, 10, 10].map((s) => s * fps);
  const starts = durations.map((_, i) => durations.slice(0, i).reduce((a, b) => a + b, 0));

  return (
    <AbsoluteFill style={{ background: colors?.bg ?? '#0f172a' }}>
      {/* Scene 1: Pain Point Hook (10s) */}
      <Sequence from={starts[0]} durationInFrames={durations[0]}>
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors?.bg ?? '#0f172a'} 0%, ${colors?.secondary ?? '#38bdf8'} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', maxWidth: 1200 }}>
              <TitleText text={painPoint} />
              <div style={{ marginTop: 16, fontSize: 28, color: 'rgba(255,255,255,.95)' }}>Tired of it? You’re not alone—7/10 waste hours weekly.</div>
              <div style={{ marginTop: 24, fontSize: 36, fontWeight: 800, color: '#fff' }}>Enough of the Chaos.</div>
            </div>
          </FadeIn>
          <Bg colors={colors} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Product Reveal (8s) */}
      <Sequence from={starts[1]} durationInFrames={durations[1]}>
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors?.bg ?? '#0f172a'} 0%, ${colors?.primary ?? '#22c55e'} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FadeIn>
            <div style={{ textAlign: 'center' }}>
              <TitleText text={`Meet ${productName}`} />
              <div style={{ marginTop: 12, fontSize: 28, color: 'rgba(255,255,255,.95)' }}>The all‑in‑one solution that turns frustration into flow</div>
              <div style={{ marginTop: 24, width: 960, height: 540, borderRadius: 16, background: 'rgba(0,0,0,.2)', border: '2px solid rgba(255,255,255,.2)' }} />
            </div>
          </FadeIn>
          <Bg colors={colors} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Key Feature 1 (10s) */}
      <Sequence from={starts[2]} durationInFrames={durations[2]}>
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors?.bg ?? '#0f172a'} 0%, ${colors?.secondary ?? '#38bdf8'} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, width: 1200 }}>
            <FadeIn>
              <div style={{ background: 'rgba(0,0,0,.25)', borderRadius: 16, height: 360, border: '2px solid rgba(255,255,255,.2)' }} />
            </FadeIn>
            <FadeIn>
              <div style={{ background: 'rgba(0,0,0,.1)', borderRadius: 16, height: 360, border: `2px solid ${colors?.primary ?? '#22c55e'}` }} />
            </FadeIn>
          </div>
          <div style={{ position: 'absolute', bottom: 80, textAlign: 'center' }}>
            <TitleText text={`${feature1.title}`} size={48} />
            <div style={{ marginTop: 8, fontSize: 28, color: '#fff' }}>{feature1.benefit}</div>
          </div>
          <Bg colors={colors} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: Feature 2 + Social Proof (12s) */}
      <Sequence from={starts[3]} durationInFrames={durations[3]}>
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors?.bg ?? '#0f172a'} 0%, ${colors?.primary ?? '#22c55e'} 100%)` }}>
          <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center' }}>
            <TitleText text={`${feature2.title}`} size={52} />
            <div style={{ marginTop: 8, fontSize: 28, color: '#fff' }}>{feature2.benefit} • Loved by 10k+ users</div>
          </div>
          <div style={{ position: 'absolute', bottom: 140, left: 120 }}>
            {testimonials.slice(0,3).map((t, i) => (
              <div key={i} style={{ marginBottom: 16, padding: '12px 16px', maxWidth: 600, borderRadius: 12, background: 'rgba(0,0,0,.28)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }}>“{t}”</div>
            ))}
          </div>
          <Bg colors={colors} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Value Summary (10s) */}
      <Sequence from={starts[4]} durationInFrames={durations[4]}>
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors?.bg ?? '#0f172a'} 0%, ${colors?.secondary ?? '#38bdf8'} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FadeIn>
            <div style={{ textAlign: 'center' }}>
              <TitleText text={`With ${productName}, win your day.`} size={56} />
              <div style={{ marginTop: 20, display: 'inline-flex', gap: 12 }}>
                {(valueBullets.length ? valueBullets : ['More Time','Less Stress','More Wins']).map((b, i) => (
                  <div key={i} style={{ padding: '8px 14px', borderRadius: 999, background: 'rgba(0,0,0,.25)', color: '#fff', border: '1px solid rgba(255,255,255,.25)', fontWeight: 700 }}>{b}</div>
                ))}
              </div>
            </div>
          </FadeIn>
          <Bg colors={colors} />
        </AbsoluteFill>
      </Sequence>

      {/* Scene 6: Clear CTA (10s) */}
      <Sequence from={starts[5]} durationInFrames={durations[5]}>
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors?.primary ?? '#22c55e'} 0%, ${colors?.secondary ?? '#38bdf8'} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FadeIn>
            <div style={{ textAlign: 'center' }}>
              <TitleText text={productName} size={64} />
              <div style={{ marginTop: 16 }}>
                <span style={{
                  display: 'inline-block', padding: '14px 28px',
                  background: '#0b1020', color: '#fff', borderRadius: 999, fontWeight: 800, fontSize: 28
                }}>{cta.primary}</span>
              </div>
              {cta.secondary && (
                <div style={{ marginTop: 12, fontSize: 22, color: 'rgba(0,0,0,.85)', fontWeight: 700 }}>{cta.secondary}</div>
              )}
              {cta.tagline && (
                <div style={{ marginTop: 18, fontSize: 20, color: '#0b1020' }}>{cta.tagline}</div>
              )}
            </div>
          </FadeIn>
        </AbsoluteFill>
      </Sequence>

      {musicUrl && (
        <Audio src={musicUrl} volume={0.4} />
      )}
    </AbsoluteFill>
  );
};

export default ProductIntroVideo;

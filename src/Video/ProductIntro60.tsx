import React, {useEffect, useMemo, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Series,
  Video,
  Img,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Feature = {
  title: string;
  subtitle?: string;
  media?: string; // img or video under /public
};
type Manifest = {
  productName: string;
  taglines?: string[];
  features?: Feature[];
  social?: {logos?: string[]};
  cta?: {text: string; url?: string};
  bgm?: string;
};

const useManifest = (): Manifest => {
  const [manifest, setManifest] = useState<Manifest>({
    productName: 'Acme Flow',
    taglines: ['Faster', 'Smarter', 'Effortless'],
    features: [
      {title: 'One‑click automation', subtitle: 'Reduce manual tasks by 80%'},
      {title: 'Realtime insights', subtitle: 'Decisions powered by live data'},
    ],
    social: {},
    cta: {text: 'Start your free trial', url: 'https://example.com/signup'},
  });
  const [handle] = useState(() => delayRender('product-intro-data'));
  useEffect(() => {
    const url = staticFile('assets/product-intro.json');
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setManifest((prev) => ({...prev, ...data}));
      })
      .finally(() => continueRender(handle));
  }, [handle]);
  return manifest;
};

const Title: React.FC<{text: string; subtitle?: string}> = ({text, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [0, Math.round(10 * (fps / 30))], [0, 1], {extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, Math.round(12 * (fps / 30))], [30, 0], {extrapolateRight: 'clamp'});
  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: 72, fontWeight: 800, letterSpacing: -1, opacity, transform: `translateY(${y}px)`}}>
        {text}
      </div>
      {subtitle ? <div style={{marginTop: 10, fontSize: 22, color: '#a3b3c2'}}>{subtitle}</div> : null}
    </div>
  );
};

const Taglines: React.FC<{items: string[]}> = ({items}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = Math.max(1, Math.round((1.5 * fps))); // swap every ~1.5s
  const index = Math.floor(frame / beat) % items.length;
  const local = frame % beat;
  const y = interpolate(local, [0, beat * 0.2, beat * 0.8, beat], [20, 0, 0, -20], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = interpolate(local, [0, beat * 0.15, beat * 0.85, beat], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{height: 40, position: 'relative', overflow: 'hidden', marginTop: 12}}>
      <div style={{position: 'absolute', width: '100%', textAlign: 'center', fontSize: 28, color: '#cbd5e1', transform: `translateY(${y}px)`, opacity}}>
        {items[index]}
      </div>
    </div>
  );
};

const ProblemPromise: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = interpolate(frame, [0, fps * 0.5, fps * 5, fps * 5.5], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: 36, color: '#9fb0c4', opacity: 1 - t}}>Too many steps? Slow processes?</div>
      <div style={{fontSize: 42, fontWeight: 700, marginTop: 12, opacity: t, color: '#e6edf3'}}>Now it’s 10× simpler.</div>
    </div>
  );
};

const FeatureCard: React.FC<{feature: Feature}> = ({feature}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, damping: 200, durationInFrames: fps});
  return (
    <div style={{display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 520, height: 300, borderRadius: 16, background: '#0f1620', border: '1px solid #1f2a37', overflow: 'hidden', transform: `scale(${0.9 + scale * 0.1})`}}>
        {feature.media?.match(/\.(mp4|mov|webm)$/i) ? (
          <Video src={staticFile(feature.media.replace(/^\/+/, ''))} />
        ) : feature.media ? (
          <Img src={staticFile(feature.media.replace(/^\/+/, ''))} />
        ) : (
          <div style={{width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#475569'}}>Media</div>
        )}
      </div>
      <div style={{maxWidth: 520}}>
        <div style={{fontSize: 40, fontWeight: 800}}>{feature.title}</div>
        {feature.subtitle ? <div style={{marginTop: 8, fontSize: 20, color: '#a3b3c2'}}>{feature.subtitle}</div> : null}
      </div>
    </div>
  );
};

const LogosMarquee: React.FC<{logos?: string[]}> = ({logos}) => {
  if (!logos?.length) {
    return <div style={{textAlign: 'center', color: '#9fb0c4'}}>Trusted by teams worldwide</div>;
  }
  return (
    <div style={{display: 'flex', gap: 28, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap'}}>
      {logos.map((l, i) => (
        <Img key={i} src={staticFile(l.replace(/^\/+/, ''))} style={{height: 42, opacity: 0.85}} />
      ))}
    </div>
  );
};

const CTA: React.FC<{text: string; url?: string}> = ({text, url}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, damping: 200, durationInFrames: Math.round(0.6 * fps)});
  return (
    <div style={{display: 'grid', placeItems: 'center', gap: 16}}>
      <div style={{fontSize: 56, fontWeight: 900}}>Ready to get started?</div>
      <div style={{transform: `scale(${0.9 + s * 0.1})`}}>
        <div style={{padding: '14px 28px', borderRadius: 12, background: '#2563eb', color: 'white', fontSize: 22, fontWeight: 700}}>
          {text}
        </div>
      </div>
      {url ? <div style={{fontSize: 16, color: '#9fb0c4'}}>{url}</div> : null}
    </div>
  );
};

export const ProductIntro60: React.FC = () => {
  const {fps, width, height} = useVideoConfig();
  const manifest = useManifest();

  // BGM volume automation (fade in/out)
  const frame = useCurrentFrame();
  const total = fps * 60;
  const fadeIn = interpolate(frame, [0, Math.round(0.6 * fps)], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [total - Math.round(0.8 * fps), total], [1, 0], {extrapolateLeft: 'clamp'});
  const bgmVolume = Math.min(fadeIn, fadeOut) * 0.9;

  const bgStyle: React.CSSProperties = {
    width, height,
    background: 'linear-gradient(180deg, #0b0f14 0%, #121a24 100%)',
    color: '#e6edf3',
    display: 'grid',
    alignContent: 'center',
    justifyItems: 'center',
    padding: '48px 32px',
    textAlign: 'center',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  };

  return (
    <AbsoluteFill style={bgStyle}>
      {manifest.bgm ? (
        <Audio src={staticFile(manifest.bgm.replace(/^\/+/, ''))} volume={bgmVolume} />
      ) : null}

      <Series>
        {/* Scene 1: Hook */}
        <Series.Sequence durationInFrames={fps * 10}>
          <Title text={`Meet ${manifest.productName}`} />
          {manifest.taglines?.length ? <Taglines items={manifest.taglines} /> : null}
        </Series.Sequence>

        {/* Scene 2: Problem/Promise */}
        <Series.Sequence durationInFrames={fps * 10}>
          <ProblemPromise />
        </Series.Sequence>

        {/* Scene 3: Feature #1 */}
        <Series.Sequence durationInFrames={fps * 10}>
          <FeatureCard feature={manifest.features?.[0] ?? {title: 'One‑click automation'}} />
        </Series.Sequence>

        {/* Scene 4: Feature #2 */}
        <Series.Sequence durationInFrames={fps * 10}>
          <FeatureCard feature={manifest.features?.[1] ?? {title: 'Realtime insights'}} />
        </Series.Sequence>

        {/* Scene 5: Social Proof */}
        <Series.Sequence durationInFrames={fps * 10}>
          <LogosMarquee logos={manifest.social?.logos} />
        </Series.Sequence>

        {/* Scene 6: CTA */}
        <Series.Sequence durationInFrames={fps * 10}>
          <CTA text={manifest.cta?.text ?? 'Start your free trial'} url={manifest.cta?.url} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};


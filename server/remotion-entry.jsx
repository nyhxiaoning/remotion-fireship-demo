import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { WeddingVideo } from '../src/Video/WeddingVideo';
import { ProductIntroVideo } from '../src/Video/ProductIntroVideo';

const Root = () => {
  return (
    <Composition
      id="wedding-video"
      component={WeddingVideo}
      defaultProps={{ project: { photos: [], texts: {}, music: null, template: { id: 'default', name: 'default', preview: '', colors: { primary: '#DC143C', secondary: '#FFD700' }, duration: 30, textFields: [] }, duration: 30 } }}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={900}
      calculateMetadata={({ props }) => {
        const d = (props.project?.duration ?? 30) * 30;
        return { fps: 30, width: 1920, height: 1080, durationInFrames: d };
      }}
    />
    ,
    <Composition
      key="product-intro"
      id="product-intro"
      component={ProductIntroVideo}
      defaultProps={{
        productName: 'Acme',
        painPoint: 'Wasting 30 minutes daily organizing work tasks',
        feature1: { title: '1‑click Auto‑Organization', benefit: 'Organize your entire week in 60 seconds' },
        feature2: { title: 'AI Focus Mode', benefit: 'Block distractions and boost focus by 40%' },
        testimonials: ['Saves me 2hrs/day!','Finally makes work fun!','No more missed updates.'],
        valueBullets: ['More Time','Less Stress','More Wins'],
        cta: { primary: 'Start Free Trial', secondary: '7‑day free • No card needed', tagline: 'Acme • Work Smarter, Not Harder' },
        colors: { primary: '#22c55e', secondary: '#38bdf8', bg: '#0f172a' },
        musicUrl: null,
      }}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={1800}
    />
  );
};

registerRoot(Root);

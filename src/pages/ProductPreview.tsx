import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { ProductIntroVideo, type ProductIntroProps } from '@/Video/ProductIntroVideo';

const defaultModel: ProductIntroProps = {
  productName: 'Acme',
  painPoint: 'Struggling to stay focused with scattered digital tools',
  feature1: { title: '1‑click Auto‑Organization', benefit: 'Organize your entire week in 60 seconds' },
  feature2: { title: 'AI Focus Mode', benefit: 'Block distractions and boost focus by 40%' },
  testimonials: ['Saves me 2hrs/day!','Finally makes work fun!','No more missed updates.'],
  valueBullets: ['More Time','Less Stress','More Wins'],
  cta: { primary: 'Start Free Trial', secondary: '7‑day free • No card needed', tagline: 'Acme • Work Smarter, Not Harder' },
  colors: { primary: '#22c55e', secondary: '#38bdf8', bg: '#0f172a' },
  musicUrl: null,
};

const ProductPreview: React.FC = () => {
  const [model, setModel] = useState<ProductIntroProps>(defaultModel);
  const [downloading, setDownloading] = useState(false);
  const fps = 30;
  const durationInFrames = fps * 60;

  const renderServer = async () => {
    setDownloading(true);
    try {
      const resp = await fetch('http://localhost:3001/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compositionId: 'product-intro',
          props: model,
        })
      });
      if (!resp.ok) throw new Error('Render server error');
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `product-intro-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Product Intro Preview</h1>
          <button onClick={renderServer} disabled={downloading} className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold">
            {downloading ? 'Rendering...' : 'Render MP4'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/60 rounded p-4">
            <Player
              component={ProductIntroVideo}
              durationInFrames={durationInFrames}
              fps={fps}
              compositionWidth={1920}
              compositionHeight={1080}
              inputProps={model}
              controls
              showVolumeControls
              initiallyMuted={false}
              autoPlay
            />
          </div>
          <div className="space-y-3">
            <div className="bg-slate-800/60 rounded p-3">
              <label className="text-sm text-slate-300">Product Name</label>
              <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.productName}
                onChange={(e)=>setModel({...model, productName: e.target.value})} />
              <label className="text-sm text-slate-300 mt-2 block">Pain Point</label>
              <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.painPoint}
                onChange={(e)=>setModel({...model, painPoint: e.target.value})} />
            </div>
            <div className="bg-slate-800/60 rounded p-3 grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-300">Feature 1 Title</label>
                <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.feature1.title}
                  onChange={(e)=>setModel({...model, feature1: {...model.feature1, title: e.target.value}})} />
                <label className="text-sm text-slate-300 mt-2 block">Feature 1 Benefit</label>
                <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.feature1.benefit}
                  onChange={(e)=>setModel({...model, feature1: {...model.feature1, benefit: e.target.value}})} />
              </div>
              <div>
                <label className="text-sm text-slate-300">Feature 2 Title</label>
                <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.feature2.title}
                  onChange={(e)=>setModel({...model, feature2: {...model.feature2, title: e.target.value}})} />
                <label className="text-sm text-slate-300 mt-2 block">Feature 2 Benefit</label>
                <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.feature2.benefit}
                  onChange={(e)=>setModel({...model, feature2: {...model.feature2, benefit: e.target.value}})} />
              </div>
            </div>
            <div className="bg-slate-800/60 rounded p-3">
              <label className="text-sm text-slate-300">Testimonials (comma separated)</label>
              <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.testimonials.join(', ')}
                onChange={(e)=>setModel({...model, testimonials: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
              <label className="text-sm text-slate-300 mt-2 block">Value Bullets (comma separated)</label>
              <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.valueBullets.join(', ')}
                onChange={(e)=>setModel({...model, valueBullets: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
            </div>
            <div className="bg-slate-800/60 rounded p-3">
              <label className="text-sm text-slate-300">CTA Primary</label>
              <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.cta.primary}
                onChange={(e)=>setModel({...model, cta: {...model.cta, primary: e.target.value}})} />
              <label className="text-sm text-slate-300 mt-2 block">CTA Secondary</label>
              <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.cta.secondary || ''}
                onChange={(e)=>setModel({...model, cta: {...model.cta, secondary: e.target.value}})} />
              <label className="text-sm text-slate-300 mt-2 block">Tagline</label>
              <input className="w-full mt-1 p-2 rounded bg-slate-900 border border-slate-700" value={model.cta.tagline || ''}
                onChange={(e)=>setModel({...model, cta: {...model.cta, tagline: e.target.value}})} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;

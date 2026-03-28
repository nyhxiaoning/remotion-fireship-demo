import React, {useEffect, useMemo, useState} from 'react';
import {
  AbsoluteFill,
  Sequence,
  Video,
  staticFile,
  delayRender,
  continueRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import SafeAudio from '../components/SafeAudio';

type ClipItem = {
  src: string;      // 例如: /assets/clips/clip01.mp4 (放在 public 下)
  in?: number;      // 起始秒，可选，默认0
  out?: number;     // 结束秒，可选，如未给出则整段
  label?: string;   // 备注
};

type Manifest = {
  clips?: ClipItem[];
  bgm?: string;     // 例如: /assets/audio/bgm.mp3
  // 扩展方案：支持 assets + timeline（帧级别）
  assets?: Array<{assetId: string; type: 'video' | 'audio'; src: string;}>;
  timeline?: Array<{
    layerId: string;
    assetId: string;
    startFrame: number;
    endFrame: number;
  }>;
  fps?: number;
  resolution?: {width: number; height: number};
  durationInFrames?: number;
};

const TARGET_SECONDS = 30;

export const DoraemonTrailer: React.FC = () => {
  const {fps} = useVideoConfig();
  const [handle] = useState(() => delayRender('loading-manifest'));
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toStatic = (p: string) => staticFile(p.replace(/^\/+/, '')); // 去掉开头的 /

  useEffect(() => {
    // 优先读取 soraemon.json，如不存在则回退 doraemon.json
    const tryUrls = [
      toStatic('assets/kfp.json'),
      toStatic('assets/soraemon.json'),
      toStatic('assets/doraemon.json'),
    ];

    const load = async () => {
      let lastErr: unknown = null;
      for (const u of tryUrls) {
        try {
          const res = await fetch(u);
          if (!res.ok) {
            lastErr = new Error(`无法加载清单: ${u} -> ${res.status}`);
            continue;
          }
          const data: Manifest | ClipItem[] = await res.json();
          const normalized: Manifest = Array.isArray(data)
            ? {clips: data}
            : {
                clips: data.clips,
                bgm: (data as Manifest).bgm,
                assets: (data as Manifest).assets,
                timeline: (data as Manifest).timeline,
                fps: (data as Manifest).fps,
                resolution: (data as Manifest).resolution,
                durationInFrames: (data as Manifest).durationInFrames,
              };
          setManifest(normalized);
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
        }
      }
      if (lastErr) {
        setError(lastErr instanceof Error ? lastErr.message : String(lastErr));
      }
      continueRender(handle);
    };
    load();
  }, [handle]);

  const plan = useMemo(() => {
    if (!manifest) return null;

    // 分支1：支持 assets + timeline（帧值定义）
    if (manifest.assets && manifest.timeline && manifest.timeline.length > 0) {
      const assetMap = new Map<string, string>();
      for (const a of manifest.assets) {
        if (a.type === 'video') {
          assetMap.set(a.assetId, a.src);
        }
      }
      const items = manifest.timeline
        .map((tl) => {
          const src = assetMap.get(tl.assetId);
          if (!src) return null;
          const dur = Math.max(5, tl.endFrame - tl.startFrame);
          return {src, in: Math.max(0, tl.startFrame), out: tl.endFrame, rawDuration: dur};
        })
        .filter(Boolean) as Array<{src: string; in: number; out: number; rawDuration: number;}>;

      if (items.length === 0) return null;
      const totalFrames = items.reduce((acc, it) => acc + it.rawDuration, 0);
      const targetFrames = TARGET_SECONDS * fps;
      const scale = totalFrames > targetFrames ? targetFrames / totalFrames : 1;
      return items.map((it) => ({
        src: it.src,
        in: it.in,
        out: it.out,
        duration: Math.max(10, Math.round(it.rawDuration * scale)),
      }));
    }

    // 分支2：简化 clips（秒值定义）
    if (manifest.clips?.length) {
      const items = manifest.clips
        .map((c) => ({
          src: c.src,
          in: Math.max(0, Math.floor((c.in ?? 0) * fps)),
          out: c.out && c.out > 0 ? Math.max(Math.floor(c.out * fps), Math.floor((c.in ?? 0) * fps) + 1) : null,
        }))
        .filter((c) => !!c.src);

      const framesList = items.map((it) => {
        const raw = (it.out && it.out > it.in ? it.out - it.in : Math.floor(3 * fps));
        return Math.max(5, raw);
      });
      const totalFrames = framesList.reduce((a, b) => a + b, 0);
      const targetFrames = TARGET_SECONDS * fps;
      const scale = totalFrames > targetFrames ? targetFrames / totalFrames : 1;
      const scaledDurations = framesList.map((f) => Math.max(10, Math.round(f * scale)));
      return items.map((it, i) => ({
        ...it,
        duration: scaledDurations[i],
      }));
    }

    return null;
  }, [manifest, fps]);

  // 简单的音量淡入淡出曲线
  const frame = useCurrentFrame();
  const bgmVolume = useMemo(() => {
    const fadeIn = interpolate(frame, [0, Math.round(0.5 * fps)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return fadeIn;
  }, [frame, fps]);

  if (error) {
    return (
      <AbsoluteFill style={{backgroundColor: '#0b0f14', color: '#e6edf3', padding: 40, fontFamily: 'system-ui'}}>
        <h2>无法加载视频清单</h2>
        <p>{error}</p>
        <p>请在 public/assets 下提供 doraemon.json，示例结构：</p>
        <pre style={{whiteSpace: 'pre-wrap', lineHeight: 1.5, background: '#111827', padding: 16, borderRadius: 8}}>
{`{
  "clips": [
    { "src": "/assets/clips/clip01.mp4", "in": 2.3, "out": 5.4 },
    { "src": "/assets/clips/clip02.mp4", "in": 0,   "out": 3.0 }
  ],
  "bgm": "/assets/audio/bgm.mp3"
}`}
        </pre>
      </AbsoluteFill>
    );
  }

  if (!plan) {
    return (
      <AbsoluteFill style={{backgroundColor: '#0b0f14', color: '#9ca3af', padding: 40, fontFamily: 'system-ui'}}>
        正在准备时间线…
      </AbsoluteFill>
    );
  }

  // 渲染时间线
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {/* 当前跳过 BGM，确保先成功生成视频；如需启用可将下方注释替换为 <Audio src={toStatic(manifest.bgm!)} volume={bgmVolume} /> 并保证音频可解码 */}
      {plan.map((seg, idx) => {
        return (
          <Sequence key={idx} durationInFrames={seg.duration}>
            <Video
              src={toStatic(seg.src)}
              startFrom={seg.in}
              endAt={seg.out ?? undefined}
              // 默认音量较低，突出 BGM；需要原声可调大
              volume={0.4}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

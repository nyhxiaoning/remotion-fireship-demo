import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  staticFile,
} from 'remotion';
import { WeddingProject } from '../types';

interface WeddingVideoProps {
  project: WeddingProject;
}

export const WeddingVideo: React.FC<WeddingVideoProps> = ({ project }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  const { photos, texts, music, template } = project;
  
  // 每张照片的显示时长
  const photoDuration = Math.floor(durationInFrames / Math.max(photos.length, 1));
  
  // 文案出现的时间点
  const textTimings = {
    opening: 0,
    meeting: photoDuration,
    love: photoDuration * 2,
    blessing: photoDuration * 3,
  };

  return (
    <AbsoluteFill style={{ 
      background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`,
    }}>
      {/* 背景装饰 */}
      <AbsoluteFill>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-yellow-400 rounded-full"></div>
          <div className="absolute top-20 right-20 w-24 h-24 border-4 border-red-600 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-28 h-28 border-4 border-yellow-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 border-4 border-red-600 rounded-full"></div>
        </div>
      </AbsoluteFill>

      {/* 照片展示 */}
      {photos.map((photo, index) => {
        const startFrame = index * photoDuration;
        const opacity = interpolate(
          frame,
          [startFrame, startFrame + 15, startFrame + photoDuration - 15, startFrame + photoDuration],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <Sequence key={photo.id} from={startFrame} durationInFrames={photoDuration}>
            <AbsoluteFill style={{ opacity }}>
              <Img 
                src={photo.url} 
                style={{
                  width: '60%',
                  height: '60%',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  border: `8px solid ${template.colors.secondary}`,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* 文案展示 */}
      {Object.entries(texts).map(([key, text], index) => {
        const startFrame = textTimings[key as keyof typeof textTimings];
        const progress = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <Sequence key={key} from={startFrame}>
            <AbsoluteFill
              style={{
                top: `${20 + index * 15}%`,
                left: '10%',
                transform: `translateY(${(1 - progress) * 50}px)`,
                opacity: progress,
              }}
            >
              <div 
                style={{
                  color: template.colors.secondary,
                  fontSize: '48px',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontFamily: 'serif',
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright',
                }}
              >
                {text}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* 背景音乐 */}
      {music && (
        <Audio
          src={music.url}
          volume={0.5}
          startFrom={0}
        />
      )}
    </AbsoluteFill>
  );
};
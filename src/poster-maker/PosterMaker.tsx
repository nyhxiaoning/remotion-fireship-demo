import React from 'react';
import { PosterEditor } from '../poster-editor/PosterEditor';
import { usePosterStore } from '../poster-editor/store/poster-store';

interface PosterMakerProps {
  onPosterComplete?: (posterDataUrl: string) => void;
}

export const PosterMaker: React.FC<PosterMakerProps> = ({ onPosterComplete }) => {
  const handleExportToVideo = (posterDataUrl: string) => {
    console.log('海报导出完成:', posterDataUrl);
    
    if (onPosterComplete) {
      onPosterComplete(posterDataUrl);
    }
  };

  return (
    <div className="poster-maker">
      <PosterEditor
        onExportToVideo={handleExportToVideo}
        defaultCanvasSize={{ width: 1920, height: 1080 }}
      />
    </div>
  );
};

// Remotion视频组件：展示海报制作过程
export const PosterMakerVideo: React.FC<{ posterDataUrl: string }> = ({ posterDataUrl }) => {
  return (
    <div className="poster-maker-video w-full h-full flex items-center justify-center bg-gray-900">
      <img
        src={posterDataUrl}
        alt="Generated Poster"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

// 工具函数：将海报数据集成到Remotion视频
export const integratePosterToVideo = (posterDataUrl: string, videoFrame: number) => {
  // 这里可以实现具体的集成逻辑
  // 例如：将海报作为视频某一帧的背景或元素
  return {
    type: 'poster-frame',
    dataUrl: posterDataUrl,
    frame: videoFrame
  };
};
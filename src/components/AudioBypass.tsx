import React from 'react';
import { Audio } from 'remotion';

interface AudioBypassProps {
  src: string;
  volume?: number;
  startFrom?: number;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

/**
 * 音频绕过组件 - 最简单的音频处理方式
 * 当其他音频组件失败时使用，直接传递音频源
 */
const AudioBypass: React.FC<AudioBypassProps> = ({ 
  src, 
  volume = 1, 
  startFrom = 0, 
  onError, 
  onLoad 
}) => {
  // 简单的错误处理
  const handleError = (error: Error) => {
    console.warn('音频错误（使用绕过模式）:', error.message);
    // 在绕过模式下，我们不阻止音频播放，只是记录错误
    onError?.(error);
  };

  const handleLoad = () => {
    console.log('音频加载（绕过模式）:', src);
    onLoad?.();
  };

  return (
    <Audio 
      src={src} 
      volume={volume}
      startFrom={startFrom}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

export default AudioBypass;
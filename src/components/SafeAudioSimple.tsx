import React, { useEffect, useState } from 'react';
import { Audio } from 'remotion';

interface SafeAudioProps {
  src: string;
  volume?: number;
  startFrom?: number;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

/**
 * 安全的音频组件 - 提供音频错误处理和降级方案
 * 避免使用base64数据，直接处理文件路径
 */
const SafeAudio: React.FC<SafeAudioProps> = ({ 
  src, 
  volume = 1, 
  startFrom = 0, 
  onError, 
  onLoad 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 重置状态当src改变时
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = (error: Error) => {
    console.error('音频加载错误:', error);
    setHasError(true);
    onError?.(error);
  };

  const handleLoad = () => {
    console.log('音频加载成功:', src);
    setIsLoaded(true);
    onLoad?.();
  };

  // 如果有错误，不渲染任何音频组件
  if (hasError) {
    console.warn('音频组件因错误被禁用:', src);
    return null;
  }

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

export default SafeAudio;
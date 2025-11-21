import React, { useEffect, useState } from 'react';
import { Audio } from 'remotion';
import { needsAudioRepair, repairAudioFile, createCompatibleSilentAudio } from '../utils/audio-repair';

interface SafeAudioProps {
  src: string;
  volume?: number;
  startFrom?: number;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

/**
 * 增强的音频组件 - 处理Remotion媒体解析器的WAV格式兼容性问题
 * 专门解决 "Unknown WAV box type" 错误
 */
const SafeAudio: React.FC<SafeAudioProps> = ({ 
  src, 
  volume = 1, 
  startFrom = 0, 
  onError, 
  onLoad 
}) => {
  const [audioSrc, setAudioSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAudio = async () => {
      try {
        setIsProcessing(true);
        setHasError(false);
        
        console.log('处理音频文件:', src);
        
        // 如果是base64数据，直接使用
        if (src.startsWith('data:audio/')) {
          console.log('使用base64音频数据');
          setAudioSrc(src);
          onLoad?.();
          return;
        }
        
        // 尝试获取音频文件
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`无法获取音频文件: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        console.log(`音频文件大小: ${arrayBuffer.byteLength} 字节`);
        
        // 检查是否需要修复
        if (needsAudioRepair(arrayBuffer)) {
          console.log('检测到音频格式问题，正在修复...');
          const repairedAudio = repairAudioFile(arrayBuffer);
          setAudioSrc(repairedAudio);
          console.log('音频修复完成');
        } else {
          console.log('音频格式正常，使用原文件');
          setAudioSrc(src);
        }
        
        onLoad?.();
        
      } catch (error) {
        console.error('音频处理失败:', error);
        setHasError(true);
        
        // 使用兼容的静默音频作为降级方案
        const silentAudio = createCompatibleSilentAudio();
        setAudioSrc(silentAudio);
        
        const audioError = error instanceof Error ? error : new Error('音频处理失败');
        onError?.(audioError);
      } finally {
        setIsProcessing(false);
      }
    };

    processAudio();
  }, [src, onError, onLoad]);

  const handleAudioError = (error: Error) => {
    console.error('音频播放错误:', error);
    setHasError(true);
    
    // 最后的降级方案 - 静默音频
    const silentAudio = createCompatibleSilentAudio();
    setAudioSrc(silentAudio);
    
    onError?.(error);
  };

  const handleAudioLoad = () => {
    console.log('音频加载成功:', audioSrc);
    onLoad?.();
  };

  // 处理中的状态
  if (isProcessing) {
    return (
      <div style={{ display: 'none' }}>
        {/* 处理中时使用静默音频 */}
        <Audio 
          src={createCompatibleSilentAudio()} 
          volume={0}
          startFrom={startFrom}
        />
      </div>
    );
  }

  // 渲染最终音频
  return (
    <Audio 
      src={audioSrc} 
      volume={volume}
      startFrom={startFrom}
      onError={handleAudioError}
      onLoad={handleAudioLoad}
    />
  );
};

export default SafeAudio;
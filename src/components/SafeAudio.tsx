import React, { useEffect, useState } from 'react';
import { Audio, staticFile } from 'remotion';
import { wavFileFixer } from '../utils/wav-fixer';
import { validateAudioFile } from '../utils/audio-validator';
import { createSilentAudioUrl, cleanupSilentAudio } from '../utils/silent-audio';

interface SafeAudioProps {
  src: string;
  volume?: number;
  startFrom?: number;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

export const SafeAudio: React.FC<SafeAudioProps> = ({ 
  src, 
  volume = 1, 
  startFrom = 0, 
  onError, 
  onLoad 
}) => {
  const [audioError, setAudioError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [silentAudioUrl, setSilentAudioUrl] = useState<string | null>(null);
  const silentAudioRef = useRef<string | null>(null);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        setIsLoading(true);
        setAudioError(null);

        console.log('开始加载音频文件:', src);

        // 首先验证音频文件
        const validationResult = await validateAudioFile(src);
        
        if (!validationResult.isValid) {
          console.warn('音频文件验证失败:', validationResult.error);
          
          // 尝试修复WAV文件
          if (src.endsWith('.wav')) {
            console.log('尝试修复WAV文件...');
            const fixedAudioData = await wavFileFixer.fixWAVFile(src);
            setAudioData(fixedAudioData);
            onLoad?.();
            console.log('WAV文件修复成功');
            return;
          }
          
          throw new Error(validationResult.error || '音频文件验证失败');
        }

        // 音频文件验证通过
        console.log('音频文件验证通过:', validationResult.format);
        setAudioData(src);
        onLoad?.();
        
      } catch (error) {
        const audioError = error instanceof Error ? error : new Error('未知音频加载错误');
        setAudioError(audioError);
        onError?.(audioError);
        console.error('音频加载失败:', audioError);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudio();
  }, [src, onError, onLoad]);

  const parseWavFile = (arrayBuffer: ArrayBuffer) => {
    try {
      const view = new DataView(arrayBuffer);
      let offset = 12; // 跳过RIFF头部

      while (offset < arrayBuffer.byteLength) {
        const chunkId = String.fromCharCode(
          view.getUint8(offset),
          view.getUint8(offset + 1),
          view.getUint8(offset + 2),
          view.getUint8(offset + 3)
        );
        
        const chunkSize = view.getUint32(offset + 4, true);
        
        console.log(`WAV Chunk: ${chunkId}, Size: ${chunkSize}`);
        
        if (chunkId === 'fmt ') {
          // 音频格式块
          const audioFormat = view.getUint16(offset + 8, true);
          const numChannels = view.getUint16(offset + 10, true);
          const sampleRate = view.getUint32(offset + 12, true);
          
          console.log(`音频格式: ${audioFormat}, 声道数: ${numChannels}, 采样率: ${sampleRate}`);
          
          if (audioFormat !== 1) {
            console.warn(`非PCM音频格式: ${audioFormat}`);
          }
        } else if (chunkId === 'data') {
          // 音频数据块
          console.log(`音频数据大小: ${chunkSize} bytes`);
          break;
        }
        
        offset += 8 + chunkSize;
      }
    } catch (error) {
      console.error('WAV文件解析失败:', error);
      throw new Error(`WAV文件格式错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 如果音频加载失败，提供降级方案
  if (audioError) {
    return (
      <div style={{ display: 'none' }}>
        {/* 静默音频 - 防止错误传播 */}
        <Audio 
          src={createSilentAudio()} 
          volume={0}
          startFrom={startFrom}
        />
        {/* 错误边界组件 */}
        <AudioErrorBoundary error={audioError} src={src} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ display: 'none' }}>
        {/* 加载中的静默音频 */}
        <Audio 
          src={createSilentAudio()} 
          volume={0}
          startFrom={startFrom}
        />
      </div>
    );
  }

  // 正常渲染音频
  return (
    <Audio 
      src={src} 
      volume={volume}
      startFrom={startFrom}
    />
  );
};

// 创建静默音频数据
const createSilentAudio = (): string => {
  // 创建1秒的静默WAV音频
  const sampleRate = 44100;
  const numChannels = 2;
  const duration = 1; // 1秒
  const numSamples = sampleRate * numChannels * duration;
  
  const buffer = new ArrayBuffer(44 + numSamples * 2); // WAV头部 + 数据
  const view = new DataView(buffer);
  
  // WAV文件头部
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  // RIFF头部
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  
  // fmt 子块
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // 子块大小
  view.setUint16(20, 1, true); // 音频格式 (PCM)
  view.setUint16(22, numChannels, true); // 声道数
  view.setUint32(24, sampleRate, true); // 采样率
  view.setUint32(28, sampleRate * numChannels * 2, true); // 字节率
  view.setUint16(32, numChannels * 2, true); // 块对齐
  view.setUint16(34, 16, true); // 位深度
  
  // data 子块
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true); // 数据大小
  
  // 静默数据 (已经在创建buffer时初始化为0)
  
  // 转换为base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return 'data:audio/wav;base64,' + btoa(binary);
};

// 音频错误边界组件
interface AudioErrorBoundaryProps {
  error: Error;
  src: string;
}

const AudioErrorBoundary: React.FC<AudioErrorBoundaryProps> = ({ error, src }) => {
  useEffect(() => {
    console.error('音频错误边界捕获:', {
      error: error.message,
      src,
      timestamp: new Date().toISOString()
    });
  }, [error, src]);

  return null; // 不显示任何UI，只在控制台记录错误
};

export default SafeAudio;
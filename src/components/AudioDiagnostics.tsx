import React, { useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface AudioDiagnosticsProps {
  audioSrc: string;
  onError?: (error: string) => void;
}

export const AudioDiagnostics: React.FC<AudioDiagnosticsProps> = ({ audioSrc, onError }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const [diagnostics, setDiagnostics] = useState({
    frame,
    audioStatus: 'checking',
    errors: [] as string[],
    warnings: [] as string[],
    info: {} as Record<string, any>
  });

  useEffect(() => {
    const checkAudioStatus = async () => {
      try {
        const errors: string[] = [];
        const warnings: string[] = [];
        const info: Record<string, any> = {};

        // 检查音频文件是否存在
        const response = await fetch(audioSrc);
        
        if (!response.ok) {
          errors.push(`音频文件无法访问: ${response.status} ${response.statusText}`);
        } else {
          info.fileSize = response.headers.get('content-length') || 'unknown';
          info.contentType = response.headers.get('content-type') || 'unknown';
          
          // 验证音频数据
          const arrayBuffer = await response.arrayBuffer();
          info.fileSizeBytes = arrayBuffer.byteLength;
          
          if (arrayBuffer.byteLength === 0) {
            errors.push('音频文件为空');
          } else {
            // 检查文件格式
            const validation = await validateAudioFormat(arrayBuffer, audioSrc);
            
            if (!validation.isValid) {
              errors.push(validation.error!);
            }
            
            if (validation.warnings && validation.warnings.length > 0) {
              warnings.push(...validation.warnings);
            }
            
            Object.assign(info, validation.info);
          }
        }

        // 检查时间同步
        const currentTime = frame / fps;
        info.currentTime = `${currentTime.toFixed(2)}s`;
        info.totalDuration = `${durationInFrames / fps}s`;
        info.frame = frame;
        info.fps = fps;

        // 更新诊断状态
        setDiagnostics({
          frame,
          audioStatus: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'ok',
          errors,
          warnings,
          info
        });

        // 调用错误回调
        if (errors.length > 0 && onError) {
          onError(errors.join('; '));
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        setDiagnostics(prev => ({
          ...prev,
          frame,
          audioStatus: 'error',
          errors: [errorMessage]
        }));
        
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    // 每30帧检查一次（大约每秒一次）
    if (frame % 30 === 0) {
      checkAudioStatus();
    }

  }, [frame, audioSrc, fps, durationInFrames, onError]);

  // 只在开发模式下显示诊断信息
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
        🔊 音频诊断 (帧: {diagnostics.frame})
      </div>
      
      <div style={{ 
        color: diagnostics.audioStatus === 'ok' ? '#4ade80' : 
               diagnostics.audioStatus === 'warning' ? '#fbbf24' : '#ef4444'
      }}>
        状态: {diagnostics.audioStatus.toUpperCase()}
      </div>

      {diagnostics.errors.length > 0 && (
        <div style={{ marginTop: '5px' }}>
          <div style={{ color: '#ef4444', fontWeight: 'bold' }}>❌ 错误:</div>
          {diagnostics.errors.map((error, index) => (
            <div key={index} style={{ color: '#ef4444', fontSize: '10px' }}>
              • {error}
            </div>
          ))}
        </div>
      )}

      {diagnostics.warnings.length > 0 && (
        <div style={{ marginTop: '5px' }}>
          <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>⚠️ 警告:</div>
          {diagnostics.warnings.map((warning, index) => (
            <div key={index} style={{ color: '#fbbf24', fontSize: '10px' }}>
              • {warning}
            </div>
          ))}
        </div>
      )}

      {Object.keys(diagnostics.info).length > 0 && (
        <div style={{ marginTop: '5px' }}>
          <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>ℹ️ 信息:</div>
          {Object.entries(diagnostics.info).map(([key, value]) => (
            <div key={key} style={{ color: '#60a5fa', fontSize: '10px' }}>
              • {key}: {String(value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 验证音频格式
 */
async function validateAudioFormat(arrayBuffer: ArrayBuffer, filePath: string): Promise<{
  isValid: boolean;
  error?: string;
  warnings?: string[];
  info?: Record<string, any>;
}> {
  const warnings: string[] = [];
  const info: Record<string, any> = {};
  
  // 检查文件扩展名
  const extension = filePath.split('.').pop()?.toLowerCase();
  info.format = extension;
  
  if (extension === 'wav') {
    return validateWavFormat(arrayBuffer, info, warnings);
  } else if (extension === 'mp3') {
    return validateMp3Format(arrayBuffer, info, warnings);
  }
  
  return {
    isValid: true,
    warnings,
    info
  };
}

/**
 * 验证WAV格式
 */
function validateWavFormat(arrayBuffer: ArrayBuffer, info: Record<string, any>, warnings: string[]) {
  const view = new DataView(arrayBuffer);
  
  // 检查RIFF头部
  const riffHeader = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(0, 4)));
  if (riffHeader !== 'RIFF') {
    return { isValid: false, error: `无效的RIFF头部: ${riffHeader}` };
  }
  
  // 检查WAVE标识
  const waveHeader = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(8, 12)));
  if (waveHeader !== 'WAVE') {
    return { isValid: false, error: `无效的WAVE标识: ${waveHeader}` };
  }
  
  // 解析WAV信息
  let offset = 12;
  let hasFmt = false;
  let hasData = false;
  
  while (offset < arrayBuffer.byteLength - 8) {
    const chunkId = String.fromCharCode(
      view.getUint8(offset), view.getUint8(offset + 1), 
      view.getUint8(offset + 2), view.getUint8(offset + 3)
    );
    
    const chunkSize = view.getUint32(offset + 4, true);
    
    if (chunkId === 'fmt ') {
      hasFmt = true;
      const audioFormat = view.getUint16(offset + 8, true);
      const channels = view.getUint16(offset + 10, true);
      const sampleRate = view.getUint32(offset + 12, true);
      const bitsPerSample = view.getUint16(offset + 20, true);
      
      info.channels = channels;
      info.sampleRate = sampleRate;
      info.bitsPerSample = bitsPerSample;
      info.audioFormat = audioFormat;
      
      if (audioFormat !== 1) {
        warnings.push(`非PCM音频格式: ${audioFormat}`);
      }
      
      if (bitsPerSample !== 16 && bitsPerSample !== 24 && bitsPerSample !== 32) {
        warnings.push(`不常见的位深度: ${bitsPerSample}`);
      }
      
    } else if (chunkId === 'data') {
      hasData = true;
      info.dataSize = chunkSize;
      info.duration = chunkSize / (info.sampleRate * info.channels * (info.bitsPerSample / 8));
      
      if (chunkSize === 0) {
        return { isValid: false, error: '音频数据块为空' };
      }
    }
    
    offset += 8 + chunkSize;
  }
  
  if (!hasFmt) {
    return { isValid: false, error: '缺少fmt子块' };
  }
  
  if (!hasData) {
    return { isValid: false, error: '缺少data子块' };
  }
  
  return { isValid: true, warnings, info };
}

/**
 * 验证MP3格式
 */
function validateMp3Format(arrayBuffer: ArrayBuffer, info: Record<string, any>, warnings: string[]) {
  const view = new DataView(arrayBuffer);
  
  // 检查ID3头部
  const id3Header = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(0, 3)));
  let offset = 0;
  
  if (id3Header === 'ID3') {
    // 跳过ID3标签
    const id3Size = view.getUint32(6, false) & 0x7f7f7f7f;
    offset = 10 + id3Size;
    info.hasId3 = true;
  }
  
  // 查找第一个MP3帧
  let frameFound = false;
  
  while (offset < arrayBuffer.byteLength - 4) {
    // 检查帧同步
    const frameSync = view.getUint16(offset, false) >> 4;
    if (frameSync === 0x7ff) {
      frameFound = true;
      
      const version = (view.getUint8(offset + 1) >> 3) & 0x03;
      const layer = (view.getUint8(offset + 1) >> 1) & 0x03;
      const bitrateIndex = (view.getUint8(offset + 2) >> 4) & 0x0f;
      const sampleRateIndex = (view.getUint8(offset + 2) >> 2) & 0x03;
      
      // 采样率表 (MPEG1)
      const sampleRates = [44100, 48000, 32000, 0];
      info.sampleRate = sampleRates[sampleRateIndex] || 44100;
      info.version = version;
      info.layer = layer;
      info.bitrateIndex = bitrateIndex;
      
      break;
    }
    offset++;
  }
  
  if (!frameFound) {
    return { isValid: false, error: '未找到有效的MP3帧' };
  }
  
  return { isValid: true, warnings, info };
}
import React, { useEffect, useState } from 'react';

interface AudioDiagnosticsProps {
  audioSrc: string;
  onError?: (error: string) => void;
}

/**
 * 简化的音频诊断组件 - 避免base64数据处理问题
 */
export const AudioDiagnostics: React.FC<AudioDiagnosticsProps> = ({ 
  audioSrc, 
  onError 
}) => {
  const [status, setStatus] = useState<'checking' | 'valid' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAudio = async () => {
      try {
        setStatus('checking');
        setError(null);

        // 简单的音频文件存在性检查
        if (!audioSrc) {
          throw new Error('音频源未提供');
        }

        if (!audioSrc.endsWith('.wav') && !audioSrc.endsWith('.mp3') && !audioSrc.endsWith('.mp4')) {
          console.warn('音频文件格式可能不受支持:', audioSrc);
        }

        // 尝试加载音频以验证
        const audio = new Audio();
        
        audio.onerror = () => {
          const errorMsg = `音频文件加载失败: ${audioSrc}`;
          setError(errorMsg);
          setStatus('error');
          onError?.(errorMsg);
        };

        audio.oncanplaythrough = () => {
          console.log('音频文件验证通过:', audioSrc);
          setStatus('valid');
        };

        audio.src = audioSrc;
        audio.load();

      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '未知音频错误';
        setError(errorMsg);
        setStatus('error');
        onError?.(errorMsg);
      }
    };

    checkAudio();
  }, [audioSrc, onError]);

  // 只在开发模式下显示诊断信息
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      backgroundColor: status === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                      status === 'valid' ? 'rgba(34, 197, 94, 0.9)' : 
                      'rgba(59, 130, 246, 0.9)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1000,
      fontFamily: 'monospace'
    }}>
      <div>🎵 音频诊断</div>
      <div>状态: {status}</div>
      <div>文件: {audioSrc.split('/').pop()}</div>
      {error && <div>错误: {error}</div>}
    </div>
  );
};
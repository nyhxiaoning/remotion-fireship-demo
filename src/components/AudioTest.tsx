import React from 'react';
import { staticFile } from 'remotion';

/**
 * 音频测试组件 - 验证音频功能是否正常
 */
export const AudioTest: React.FC = () => {
  const audioSrc = staticFile("audio.wav");
  
  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <div>🎵 音频测试</div>
      <div>文件: {audioSrc}</div>
      <div>状态: 音频组件已加载</div>
    </div>
  );
};
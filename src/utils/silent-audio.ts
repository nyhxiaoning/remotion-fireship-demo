// 静默音频生成器 - 创建符合标准的WAV文件
export const generateSilentWav = (duration: number = 1): Blob => {
  const sampleRate = 44100;
  const numChannels = 2;
  const numSamples = sampleRate * numChannels * duration;
  
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);
  
  // WAV文件头部写入函数
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
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  
  // data 子块
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  
  // 静默数据 (已在buffer创建时初始化为0)
  
  return new Blob([buffer], { type: 'audio/wav' });
};

// 创建静默音频文件的URL
export const createSilentAudioUrl = (): string => {
  const silentBlob = generateSilentWav(1); // 1秒静默
  return URL.createObjectURL(silentBlob);
};

// 清理函数
export const cleanupSilentAudio = (url: string) => {
  URL.revokeObjectURL(url);
};
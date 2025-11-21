import { staticFile } from 'remotion';

/**
 * 创建兼容的静默音频文件 - 避免Remotion解析器问题
 * 生成标准RIFF WAVE格式，不包含非标准块
 */
export const createCompatibleSilentAudio = (): string => {
  // 创建最简单的WAV文件 - 标准RIFF WAVE格式
  const sampleRate = 44100;
  const numChannels = 2;
  const bitsPerSample = 16;
  const duration = 1; // 1秒
  
  const numSamples = sampleRate * duration;
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;
  
  // 创建ArrayBuffer
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  
  // 写入WAV头部 - 最简格式
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };
  
  // RIFF头部
  writeString(0, 'RIFF');
  view.setUint32(4, fileSize, true);
  writeString(8, 'WAVE');
  
  // fmt 子块
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // 子块大小
  view.setUint16(20, 1, true); // 音频格式 (PCM)
  view.setUint16(22, numChannels, true); // 声道数
  view.setUint32(24, sampleRate, true); // 采样率
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // 字节率
  view.setUint16(32, numChannels * (bitsPerSample / 8), true); // 块对齐
  view.setUint16(34, bitsPerSample, true); // 位深度
  
  // data 子块
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  
  // 静默数据 (0)
  const dataOffset = 44;
  for (let i = 0; i < dataSize; i++) {
    view.setUint8(dataOffset + i, 0);
  }
  
  // 转换为base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return 'data:audio/wav;base64,' + btoa(binary);
};

/**
 * 检查音频文件是否需要修复
 * 检测非标准块如 JUNK, bext 等
 */
export const needsAudioRepair = (arrayBuffer: ArrayBuffer): boolean => {
  const view = new DataView(arrayBuffer);
  
  try {
    // 检查RIFF头部
    const riffHeader = String.fromCharCode(
      view.getUint8(0), view.getUint8(1), 
      view.getUint8(2), view.getUint8(3)
    );
    
    if (riffHeader !== 'RIFF') return true;
    
    // 检查WAVE标识
    const waveHeader = String.fromCharCode(
      view.getUint8(8), view.getUint8(9), 
      view.getUint8(10), view.getUint8(11)
    );
    
    if (waveHeader !== 'WAVE') return true;
    
    // 检查是否有非标准块
    let offset = 12;
    const nonStandardChunks = ['JUNK', 'bext', 'ds64', 'wavl'];
    
    while (offset < arrayBuffer.byteLength - 8) {
      const chunkId = String.fromCharCode(
        view.getUint8(offset), view.getUint8(offset + 1), 
        view.getUint8(offset + 2), view.getUint8(offset + 3)
      );
      
      if (nonStandardChunks.includes(chunkId)) {
        console.log(`检测到非标准块: ${chunkId}, 需要修复`);
        return true;
      }
      
      const chunkSize = view.getUint32(offset + 4, true);
      offset += 8 + chunkSize;
    }
    
    return false;
  } catch (error) {
    console.error('音频检查错误:', error);
    return true;
  }
};

/**
 * 修复音频文件 - 移除非标准块，创建标准RIFF WAVE格式
 */
export const repairAudioFile = (arrayBuffer: ArrayBuffer): string => {
  try {
    const view = new DataView(arrayBuffer);
    
    // 提取fmt信息
    let fmtData: { [key: string]: number } = {};
    let dataChunk: Uint8Array | null = null;
    
    let offset = 12;
    
    while (offset < arrayBuffer.byteLength - 8) {
      const chunkId = String.fromCharCode(
        view.getUint8(offset), view.getUint8(offset + 1), 
        view.getUint8(offset + 2), view.getUint8(offset + 3)
      );
      
      const chunkSize = view.getUint32(offset + 4, true);
      
      if (chunkId === 'fmt ') {
        // 提取格式信息
        const chunkData = new Uint8Array(arrayBuffer.slice(offset + 8, offset + 8 + chunkSize));
        const fmtView = new DataView(chunkData.buffer);
        
        fmtData.audioFormat = fmtView.getUint16(0, true);
        fmtData.numChannels = fmtView.getUint16(2, true);
        fmtData.sampleRate = fmtView.getUint32(4, true);
        fmtData.byteRate = fmtView.getUint32(8, true);
        fmtData.blockAlign = fmtView.getUint16(12, true);
        fmtData.bitsPerSample = fmtView.getUint16(14, true);
        
      } else if (chunkId === 'data') {
        // 提取音频数据
        dataChunk = new Uint8Array(arrayBuffer.slice(offset + 8, offset + 8 + chunkSize));
      }
      
      offset += 8 + chunkSize;
    }
    
    if (!fmtData.sampleRate || !dataChunk) {
      throw new Error('无法提取必要的音频信息');
    }
    
    // 创建新的标准WAV文件
    const dataSize = dataChunk.length;
    const fileSize = 36 + dataSize;
    
    const newBuffer = new ArrayBuffer(44 + dataSize);
    const newView = new DataView(newBuffer);
    
    // 写入标准WAV头部
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        newView.setUint8(offset + i, str.charCodeAt(i));
      }
    };
    
    // RIFF头部
    writeString(0, 'RIFF');
    newView.setUint32(4, fileSize, true);
    writeString(8, 'WAVE');
    
    // fmt 子块
    writeString(12, 'fmt ');
    newView.setUint32(16, 16, true);
    newView.setUint16(20, fmtData.audioFormat || 1, true);
    newView.setUint16(22, fmtData.numChannels || 2, true);
    newView.setUint32(24, fmtData.sampleRate || 44100, true);
    newView.setUint32(28, fmtData.byteRate || 176400, true);
    newView.setUint16(32, fmtData.blockAlign || 4, true);
    newView.setUint16(34, fmtData.bitsPerSample || 16, true);
    
    // data 子块
    writeString(36, 'data');
    newView.setUint32(40, dataSize, true);
    
    // 写入音频数据
    const audioData = new Uint8Array(newBuffer, 44);
    audioData.set(dataChunk);
    
    // 转换为base64
    const bytes = new Uint8Array(newBuffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return 'data:audio/wav;base64,' + btoa(binary);
    
  } catch (error) {
    console.error('音频修复错误:', error);
    // 如果修复失败，返回兼容的静默音频
    return createCompatibleSilentAudio();
  }
};
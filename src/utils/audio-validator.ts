import { staticFile } from 'remotion';

export interface AudioValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
  format?: {
    type: string;
    sampleRate: number;
    channels: number;
    duration?: number;
  };
}

/**
 * 验证音频文件的完整性和格式
 */
export const validateAudioFile = async (filePath: string): Promise<AudioValidationResult> => {
  try {
    const response = await fetch(staticFile(filePath));
    
    if (!response.ok) {
      return {
        isValid: false,
        error: `音频文件无法访问: ${response.status} ${response.statusText}`
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength === 0) {
      return {
        isValid: false,
        error: '音频文件为空'
      };
    }

    // 检查文件扩展名
    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['wav', 'mp3', 'm4a', 'aac', 'ogg'].includes(fileExtension)) {
      return {
        isValid: false,
        error: `不支持的音频格式: ${fileExtension}`
      };
    }

    // 验证WAV文件
    if (fileExtension === 'wav') {
      return validateWavFile(arrayBuffer, filePath);
    }

    // 验证MP3文件
    if (fileExtension === 'mp3') {
      return validateMp3File(arrayBuffer, filePath);
    }

    // 其他格式的基础验证
    return {
      isValid: true,
      format: {
        type: fileExtension,
        sampleRate: 44100, // 默认值
        channels: 2
      },
      warnings: [`未对${fileExtension}格式进行详细验证`]
    };

  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : '音频文件验证失败'
    };
  }
};

/**
 * 验证WAV文件格式
 */
const validateWavFile = (arrayBuffer: ArrayBuffer, filePath: string): AudioValidationResult => {
  try {
    const view = new DataView(arrayBuffer);
    const warnings: string[] = [];

    // 检查RIFF头部
    const riffHeader = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(0, 4)));
    if (riffHeader !== 'RIFF') {
      return {
        isValid: false,
        error: `无效的RIFF头部: ${riffHeader}`
      };
    }

    // 检查WAVE标识
    const waveHeader = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(8, 12)));
    if (waveHeader !== 'WAVE') {
      return {
        isValid: false,
        error: `无效的WAVE标识: ${waveHeader}`
      };
    }

    // 解析WAV文件结构
    let offset = 12; // 跳过RIFF头部
    let fmtFound = false;
    let dataFound = false;
    let formatInfo: any = null;

    while (offset < arrayBuffer.byteLength - 8) {
      const chunkId = String.fromCharCode(
        view.getUint8(offset),
        view.getUint8(offset + 1),
        view.getUint8(offset + 2),
        view.getUint8(offset + 3)
      );
      
      const chunkSize = view.getUint32(offset + 4, true);
      
      if (chunkId === 'fmt ') {
        fmtFound = true;
        const audioFormat = view.getUint16(offset + 8, true);
        const numChannels = view.getUint16(offset + 10, true);
        const sampleRate = view.getUint32(offset + 12, true);
        const bitsPerSample = view.getUint16(offset + 20, true);
        
        formatInfo = {
          audioFormat,
          numChannels,
          sampleRate,
          bitsPerSample
        };

        if (audioFormat !== 1) {
          warnings.push(`非PCM音频格式: ${audioFormat}`);
        }
        
        if (bitsPerSample !== 16 && bitsPerSample !== 24 && bitsPerSample !== 32) {
          warnings.push(`不常见的位深度: ${bitsPerSample}`);
        }
      } else if (chunkId === 'data') {
        dataFound = true;
        if (chunkSize === 0) {
          return {
            isValid: false,
            error: '音频数据块为空'
          };
        }
      }
      
      offset += 8 + chunkSize;
    }

    if (!fmtFound) {
      return {
        isValid: false,
        error: '未找到fmt子块'
      };
    }

    if (!dataFound) {
      return {
        isValid: false,
        error: '未找到data子块'
      };
    }

    return {
      isValid: true,
      format: {
        type: 'wav',
        sampleRate: formatInfo.sampleRate,
        channels: formatInfo.numChannels
      },
      warnings: warnings.length > 0 ? warnings : undefined
    };

  } catch (error) {
    return {
      isValid: false,
      error: `WAV文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

/**
 * 验证MP3文件格式
 */
const validateMp3File = (arrayBuffer: ArrayBuffer, filePath: string): AudioValidationResult => {
  try {
    const view = new DataView(arrayBuffer);
    
    // 检查ID3头部
    const id3Header = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(0, 3)));
    let offset = 0;
    
    if (id3Header === 'ID3') {
      // 跳过ID3标签
      const id3Size = view.getUint32(6, false) & 0x7f7f7f7f;
      offset = 10 + id3Size;
    }
    
    // 查找第一个MP3帧
    let frameFound = false;
    let sampleRate = 44100;
    let channels = 2;
    
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
        sampleRate = sampleRates[sampleRateIndex] || 44100;
        
        if (layer === 0x03) {
          channels = 2; // Layer III 通常是立体声
        }
        
        break;
      }
      offset++;
    }
    
    if (!frameFound) {
      return {
        isValid: false,
        error: '未找到有效的MP3帧'
      };
    }
    
    return {
      isValid: true,
      format: {
        type: 'mp3',
        sampleRate,
        channels
      }
    };
    
  } catch (error) {
    return {
      isValid: false,
      error: `MP3文件解析失败: ${error instanceof Error ? error.message : '未知错误'}`
    };
  }
};

/**
 * 修复常见的音频文件问题
 */
export const fixAudioFile = async (filePath: string): Promise<string> => {
  const validation = await validateAudioFile(filePath);
  
  if (validation.isValid) {
    console.log('音频文件验证通过:', filePath);
    return filePath;
  }
  
  console.warn('音频文件验证失败:', validation.error);
  
  // 尝试修复策略
  if (filePath.endsWith('.wav')) {
    console.log('尝试修复WAV文件...');
    // 这里可以实现WAV文件修复逻辑
  }
  
  // 如果无法修复，返回静默音频
  console.log('使用静默音频作为降级方案');
  return createSilentAudioDataUrl();
};

/**
 * 创建静默音频数据URL
 */
const createSilentAudioDataUrl = (): string => {
  // 创建1秒的静默WAV音频
  const sampleRate = 44100;
  const numChannels = 2;
  const duration = 1;
  const numSamples = sampleRate * numChannels * duration;
  
  const buffer = new ArrayBuffer(44 + numSamples * 2);
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
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  
  // data 子块
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);
  
  // 静默数据（已经初始化为0）
  
  // 转换为base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return 'data:audio/wav;base64,' + btoa(binary);
};
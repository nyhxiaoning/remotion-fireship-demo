import { staticFile } from 'remotion';

/**
 * WAV文件修复工具
 * 专门处理Remotion中的WAV音频解析错误
 */
export class WAVFileFixer {
  private static instance: WAVFileFixer;
  
  private constructor() {}
  
  public static getInstance(): WAVFileFixer {
    if (!WAVFileFixer.instance) {
      WAVFileFixer.instance = new WAVFileFixer();
    }
    return WAVFileFixer.instance;
  }

  /**
   * 修复WAV文件格式问题
   */
  public async fixWAVFile(filePath: string): Promise<string> {
    try {
      console.log(`开始修复WAV文件: ${filePath}`);
      
      const originalData = await this.loadWAVFile(filePath);
      const fixedData = this.rebuildWAVFile(originalData);
      
      console.log('WAV文件修复完成');
      return this.createDataURL(fixedData);
      
    } catch (error) {
      console.error('WAV文件修复失败:', error);
      return this.createSilentWAV();
    }
  }

  /**
   * 加载WAV文件
   */
  private async loadWAVFile(filePath: string): Promise<ArrayBuffer> {
    const response = await fetch(staticFile(filePath));
    
    if (!response.ok) {
      throw new Error(`无法加载音频文件: ${response.status} ${response.statusText}`);
    }
    
    return await response.arrayBuffer();
  }

  /**
   * 重建标准的WAV文件
   */
  private rebuildWAVFile(originalData: ArrayBuffer): ArrayBuffer {
    const view = new DataView(originalData);
    
    // 验证原始文件
    const isValid = this.validateWAVStructure(view);
    
    if (isValid) {
      console.log('WAV文件结构正常，无需修复');
      return originalData;
    }
    
    console.log('WAV文件结构异常，开始重建');
    
    // 提取音频数据
    const audioData = this.extractAudioData(view);
    
    // 创建标准的WAV文件
    return this.createStandardWAV(audioData);
  }

  /**
   * 验证WAV文件结构
   */
  private validateWAVStructure(view: DataView): boolean {
    try {
      // 检查RIFF头部
      const riffHeader = String.fromCharCode(
        view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)
      );
      
      if (riffHeader !== 'RIFF') {
        console.warn(`无效的RIFF头部: ${riffHeader}`);
        return false;
      }
      
      // 检查WAVE标识
      const waveHeader = String.fromCharCode(
        view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11)
      );
      
      if (waveHeader !== 'WAVE') {
        console.warn(`无效的WAVE标识: ${waveHeader}`);
        return false;
      }
      
      // 检查文件大小
      const fileSize = view.getUint32(4, true);
      if (fileSize + 8 !== view.byteLength) {
        console.warn(`文件大小不匹配: 声明${fileSize + 8}, 实际${view.byteLength}`);
        return false;
      }
      
      // 检查必需的子块
      let offset = 12;
      let hasFmt = false;
      let hasData = false;
      
      while (offset < view.byteLength - 8) {
        const chunkId = String.fromCharCode(
          view.getUint8(offset), view.getUint8(offset + 1), 
          view.getUint8(offset + 2), view.getUint8(offset + 3)
        );
        
        const chunkSize = view.getUint32(offset + 4, true);
        
        if (chunkId === 'fmt ') {
          hasFmt = true;
          
          // 验证fmt子块
          const audioFormat = view.getUint16(offset + 8, true);
          if (audioFormat !== 1) {
            console.warn(`非PCM音频格式: ${audioFormat}`);
            return false;
          }
          
          const channels = view.getUint16(offset + 10, true);
          if (channels < 1 || channels > 8) {
            console.warn(`异常的声道数: ${channels}`);
            return false;
          }
          
        } else if (chunkId === 'data') {
          hasData = true;
          
          if (chunkSize === 0) {
            console.warn('音频数据块为空');
            return false;
          }
        }
        
        offset += 8 + chunkSize;
      }
      
      if (!hasFmt) {
        console.warn('缺少fmt子块');
        return false;
      }
      
      if (!hasData) {
        console.warn('缺少data子块');
        return false;
      }
      
      console.log('WAV文件结构验证通过');
      return true;
      
    } catch (error) {
      console.error('WAV文件验证失败:', error);
      return false;
    }
  }

  /**
   * 提取音频数据
   */
  private extractAudioData(view: DataView): {
    sampleRate: number;
    channels: number;
    bitsPerSample: number;
    data: Int16Array;
  } {
    let offset = 12;
    let fmtData: any = null;
    let audioData: Int16Array | null = null;
    
    while (offset < view.byteLength - 8) {
      const chunkId = String.fromCharCode(
        view.getUint8(offset), view.getUint8(offset + 1), 
        view.getUint8(offset + 2), view.getUint8(offset + 3)
      );
      
      const chunkSize = view.getUint32(offset + 4, true);
      
      if (chunkId === 'fmt ') {
        fmtData = {
          audioFormat: view.getUint16(offset + 8, true),
          numChannels: view.getUint16(offset + 10, true),
          sampleRate: view.getUint32(offset + 12, true),
          byteRate: view.getUint32(offset + 16, true),
          blockAlign: view.getUint16(offset + 20, true),
          bitsPerSample: view.getUint16(offset + 22, true)
        };
        
      } else if (chunkId === 'data') {
        const dataStart = offset + 8;
        const dataEnd = dataStart + chunkSize;
        
        // 读取音频数据
        const samples = new Int16Array(chunkSize / 2);
        for (let i = 0; i < samples.length; i++) {
          samples[i] = view.getInt16(dataStart + i * 2, true);
        }
        
        audioData = samples;
        break;
      }
      
      offset += 8 + chunkSize;
    }
    
    if (!fmtData || !audioData) {
      throw new Error('无法提取音频数据');
    }
    
    return {
      sampleRate: fmtData.sampleRate,
      channels: fmtData.numChannels,
      bitsPerSample: fmtData.bitsPerSample,
      data: audioData
    };
  }

  /**
   * 创建标准的WAV文件
   */
  private createStandardWAV(audioData: {
    sampleRate: number;
    channels: number;
    bitsPerSample: number;
    data: Int16Array;
  }): ArrayBuffer {
    const { sampleRate, channels, bitsPerSample, data } = audioData;
    
    // 计算文件大小
    const dataSize = data.length * 2;
    const fileSize = 36 + dataSize;
    
    // 创建新的ArrayBuffer
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    
    // 写入WAV头部
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, fileSize, true);
    this.writeString(view, 8, 'WAVE');
    
    // fmt 子块
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // 子块大小
    view.setUint16(20, 1, true); // 音频格式 (PCM)
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * (bitsPerSample / 8), true); // 字节率
    view.setUint16(32, channels * (bitsPerSample / 8), true); // 块对齐
    view.setUint16(34, bitsPerSample, true); // 位深度
    
    // data 子块
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    
    // 写入音频数据
    for (let i = 0; i < data.length; i++) {
      view.setInt16(44 + i * 2, data[i], true);
    }
    
    console.log(`创建标准WAV文件: ${sampleRate}Hz, ${channels}声道, ${bitsPerSample}位`);
    return buffer;
  }

  /**
   * 写入字符串到DataView
   */
  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  /**
   * 创建DataURL
   */
  private createDataURL(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
  }

  /**
   * 创建静默WAV音频
   */
  private createSilentWAV(): string {
    console.log('创建静默WAV音频');
    
    const sampleRate = 44100;
    const channels = 2;
    const duration = 1; // 1秒
    const numSamples = sampleRate * channels * duration;
    
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    
    // WAV头部
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    this.writeString(view, 8, 'WAVE');
    
    // fmt 子块
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    
    // data 子块
    this.writeString(view, 36, 'data');
    view.setUint32(40, numSamples * 2, true);
    
    // 静默数据（已经初始化为0）
    
    return this.createDataURL(buffer);
  }
}

// 导出单例实例
export const wavFileFixer = WAVFileFixer.getInstance();
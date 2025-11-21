const { writeFileSync } = require('fs');
const { join } = require('path');

/**
 * 创建兼容 Remotion 的标准 WAV 音频文件
 * 避免非标准块如 bext, JUNK 等
 */
function createCompatibleWavFile() {
  const sampleRate = 44100;
  const numChannels = 2;
  const bitsPerSample = 16;
  const duration = 58; // 58 秒，匹配原音频长度
  
  const numSamples = sampleRate * duration;
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;
  
  // 创建 buffer
  const buffer = Buffer.alloc(44 + dataSize);
  let offset = 0;
  
  // 写入字符串函数
  const writeString = (str) => {
    buffer.write(str, offset);
    offset += str.length;
  };
  
  const writeUint32 = (value, littleEndian = true) => {
    if (littleEndian) {
      buffer.writeUInt32LE(value, offset);
    } else {
      buffer.writeUInt32BE(value, offset);
    }
    offset += 4;
  };
  
  const writeUint16 = (value, littleEndian = true) => {
    if (littleEndian) {
      buffer.writeUInt16LE(value, offset);
    } else {
      buffer.writeUInt16BE(value, offset);
    }
    offset += 2;
  };
  
  // RIFF 头部
  writeString('RIFF');
  writeUint32(fileSize);
  writeString('WAVE');
  
  // fmt 子块
  writeString('fmt ');
  writeUint32(16); // 子块大小
  writeUint16(1); // 音频格式 (PCM)
  writeUint16(numChannels); // 声道数
  writeUint32(sampleRate); // 采样率
  writeUint32(sampleRate * numChannels * (bitsPerSample / 8)); // 字节率
  writeUint16(numChannels * (bitsPerSample / 8)); // 块对齐
  writeUint16(bitsPerSample); // 位深度
  
  // data 子块
  writeString('data');
  writeUint32(dataSize);
  
  // 生成简单的音频数据（正弦波）
  const frequency = 440; // A4 音符
  const amplitude = 0.1; // 较小的振幅避免刺耳
  
  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * frequency * time) * amplitude;
    
    // 转换为 16-bit PCM
    const pcmValue = Math.round(sample * 32767);
    
    // 写入左右声道
    for (let channel = 0; channel < numChannels; channel++) {
      buffer.writeInt16LE(pcmValue, offset);
      offset += 2;
    }
  }
  
  return buffer;
}

// 生成兼容的音频文件
const compatibleAudio = createCompatibleWavFile();
const outputPath = join(process.cwd(), 'public/audio-compatible.wav');

writeFileSync(outputPath, compatibleAudio);

console.log(`✅ 兼容的音频文件已创建: ${outputPath}`);
console.log(`📊 文件大小: ${compatibleAudio.length} 字节`);
console.log(`🎵 音频长度: 58 秒`);
console.log(`🔧 格式: 44.1kHz, 16-bit, 立体声, PCM`);
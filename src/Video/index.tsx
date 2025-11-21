import React, { useState } from "react";
import { Audio, Sequence, Series, staticFile } from "remotion";
import SafeAudio from "../components/AudioBypass";
import { AudioDiagnostics } from "../components/AudioDiagnosticsSimple";
import { AudioTest } from "../components/AudioTest";

import { WeatherMap } from "../components/WeatherMap/WeatherMap";

import { Flipbook } from "./Flipbook";
import { HdTo4k } from "./helpers/hd-to-4k";
import { UsingJavaScript } from "./UsingJavaScript";
import { Reactive } from "./Reactive";
import { StorifyData } from "./StorifyData";
import { WeatherAPI } from "./WeatherAPI";
import { Component } from "./WeatherAPI/Component";
import { VideoInReact } from "./VideoInReact";
import { LikeAndSubscribe } from "./LikeAndSubscribe";
import { CheckOnGithub } from "./CheckOnGithub/Github";
import { MadeDifferent } from "./components/MadeDifferent";
import { DevTools } from "./components/DevTools";
import { VideoMadeInReact } from "./VideoMadeInReact";
import { FlipVideo } from "./Flipbook/FlipVideo";
import { ForwardsDataDriven } from "./DataDriven/ForwardsDataDriven";

const audio = staticFile("audio-compatible.wav");

// 音频错误处理回调
const handleAudioError = (error: Error) => {
  console.error('音频加载失败:', error);
  // 可以在这里添加用户通知逻辑
};

const handleAudioLoad = () => {
  console.log('音频文件加载成功');
};

export const Remotion = () => {
  const [audioError, setAudioError] = useState<string | null>(null);

  const handleAudioErrorWithDiagnostics = (error: Error) => {
    handleAudioError(error);
    setAudioError(error.message);
  };

  return (
    <>
      <Series>
        <Series.Sequence durationInFrames={70}>
          <MadeDifferent />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <UsingJavaScript />
        </Series.Sequence>
        <Series.Sequence durationInFrames={130}>
          <DevTools />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <VideoMadeInReact />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <FlipVideo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <Flipbook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <Reactive />
        </Series.Sequence>
        <Series.Sequence durationInFrames={132}>
          <VideoInReact />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <HdTo4k>
            <StorifyData />
          </HdTo4k>
        </Series.Sequence>
      </Series>
      <Sequence from={1080} durationInFrames={80}>
        <WeatherAPI />
      </Sequence>
      <Sequence from={1160} durationInFrames={120}>
        <Component />
      </Sequence>
      <Sequence from={1250} durationInFrames={230}>
        <WeatherMap />
      </Sequence>
      <Sequence from={1480} durationInFrames={170}>
        <ForwardsDataDriven />
      </Sequence>
      <Sequence from={1650} durationInFrames={50}>
        <LikeAndSubscribe />
      </Sequence>
      <Sequence from={1700} durationInFrames={50}>
        <CheckOnGithub />
      </Sequence>
      
      {/* 音频诊断组件 */}
      <AudioDiagnostics 
        audioSrc={audio} 
        onError={setAudioError}
      />
      
      {/* 安全的音频组件 */}
      <SafeAudio 
        src={audio} 
        onError={handleAudioErrorWithDiagnostics}
        onLoad={handleAudioLoad}
      />
      
      {/* 音频错误显示 */}
      {audioError && (
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          backgroundColor: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          maxWidth: '400px',
          zIndex: 1001
        }}>
          🔇 音频错误: {audioError}
        </div>
      )}
      
      {/* 音频测试显示 */}
      <AudioTest />
    </>
  );
};

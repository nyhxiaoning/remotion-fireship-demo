import { PosterMaker, PosterMakerVideo } from "./poster-maker/PosterMaker";

import { CANVAS } from "./Video/components/Canvas";
import { CheckOnGithub } from "./Video/CheckOnGithub/Github";
import { CloudyMap } from "./components/WeatherMap/CloudyMap";
import { Composition } from "remotion";
import { DataDriven } from "./Video/DataDriven";
import { LikeAndSubscribe } from "./Video/LikeAndSubscribe";
import { MadeDifferent } from "./Video/components/MadeDifferent";
import { MatrixStyle } from "./Video/MatrixStyle";
import { PosterEditorDemo } from "./poster-editor/PosterEditorDemo";
import { RainMap } from "./components/WeatherMap/RainMap";
import { Remotion } from "./Video/index";
import { StorifyData } from "./Video/StorifyData";
import { ThrowOut } from "./Video/components/ThrowOut";
import { ThrowOutZoomed } from "./Video/components/ThrowOut/Zoomed";
import { Thunderstorm } from "./components/WeatherMap/Thunderstorm";
import { ThunderstormMap } from "./components/WeatherMap/ThunderstormMap";
import { ToCodeEditor } from "./Video/ZoomOutEditor/ToCodeEditor";
import { TrailerWithSubs } from "./Video/TrailerWithSubs";
import { WeatherMap } from "./components/WeatherMap/WeatherMap";
import { ZoomOutEditor } from "./Video/ZoomOutEditor";
import { getFont } from "./Video/helpers/load-font";

const { width, height } = CANVAS;
const fps = 30;
// the audio duration is 58seconds + 4 frames
const durationInFrames = fps * 58 + 4;

getFont();

export const RemotionVideo = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Remotion}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="CloudyMap"
        component={CloudyMap}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="RainMap"
        component={RainMap}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="ThunderstormMap"
        component={ThunderstormMap}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="Thunderstorm"
        component={Thunderstorm}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="WeatherMap"
        component={WeatherMap}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
      />
      <Composition
        id="Storify"
        component={StorifyData}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
      />
      <Composition
        id="DataDriven"
        component={DataDriven}
        durationInFrames={200}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          frame: 0,
        }}
      />
      <Composition
        id="LikeAndSubscribe"
        component={LikeAndSubscribe}
        durationInFrames={200}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="CheckOnGithub"
        component={CheckOnGithub}
        durationInFrames={200}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="MadeDifferent"
        component={MadeDifferent}
        durationInFrames={200}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="ThrowOut"
        component={ThrowOut}
        durationInFrames={200}
        fps={fps}
        width={1246}
        height={528}
      />
      <Composition
        id="ThrowOutZoomed"
        component={ThrowOutZoomed}
        durationInFrames={200}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="BoardRoomZoomOut"
        component={ZoomOutEditor}
        durationInFrames={30}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="ToCodeEditor"
        component={ToCodeEditor}
        durationInFrames={30}
        fps={fps}
        width={width}
        height={height}
      />

      {/* 低代码海报制作器 */}
      <Composition
        id="PosterMaker"
        component={PosterMaker}
        durationInFrames={300}
        fps={fps}
        width={1920}
        height={1080}
      />

      {/* 海报视频展示 */}
      <Composition
        id="PosterMakerVideo"
        component={PosterMakerVideo}
        durationInFrames={120}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          posterDataUrl:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        }}
      />

      {/* 海报编辑器演示 */}
      <Composition
        id="PosterEditorDemo"
        component={PosterEditorDemo}
        durationInFrames={300}
        fps={fps}
        width={1920}
        height={1080}
      />
      <Composition
        id="MatrixStyle"
        component={MatrixStyle}
        durationInFrames={18 * fps}
        fps={fps}
        width={1920}
        height={1080}
      />
      <Composition
        id="TrailerWithSubs"
        component={TrailerWithSubs}
        durationInFrames={20 * fps}
        fps={fps}
        width={1920}
        height={1080}
      />
    </>
  );
};

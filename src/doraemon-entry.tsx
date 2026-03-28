import {Composition, registerRoot} from 'remotion';
import {DoraemonTrailer} from './Video/DoraemonTrailer';

const Root = () => {
  const fps = 30;
  return (
    <>
      <Composition
        id="DoraemonTrailer"
        component={DoraemonTrailer}
        durationInFrames={fps * 30}
        fps={fps}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(Root);


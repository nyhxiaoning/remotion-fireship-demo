import {Composition, registerRoot} from 'remotion';
import {DoraemonTrailer} from './Video/DoraemonTrailer';
import {ProductIntro60} from './Video/ProductIntro60';

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
      <Composition
        id="ProductIntro60"
        component={ProductIntro60}
        durationInFrames={fps * 60}
        fps={fps}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(Root);

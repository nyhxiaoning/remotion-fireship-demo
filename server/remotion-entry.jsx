import React from 'react';
import { registerRoot, Composition } from 'remotion';
import { WeddingVideo } from '../src/Video/WeddingVideo';

const Root = () => {
  return (
    <Composition
      id="wedding-video"
      component={WeddingVideo}
      defaultProps={{ project: { photos: [], texts: {}, music: null, template: { id: 'default', name: 'default', preview: '', colors: { primary: '#DC143C', secondary: '#FFD700' }, duration: 30, textFields: [] }, duration: 30 } }}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={900}
      calculateMetadata={({ props }) => {
        const d = (props.project?.duration ?? 30) * 30;
        return { fps: 30, width: 1920, height: 1080, durationInFrames: d };
      }}
    />
  );
};

registerRoot(Root);

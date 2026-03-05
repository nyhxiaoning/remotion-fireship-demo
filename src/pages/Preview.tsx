import React from 'react';
import { Player } from '@remotion/player';
import { WeddingVideo } from '@/Video/WeddingVideo';
import { useWeddingStore } from '@/store/weddingStore';
import { useNavigate } from 'react-router-dom';

const Preview: React.FC = () => {
  const { project } = useWeddingStore();
  const navigate = useNavigate();
  const fps = 30;
  const durationInFrames = project.duration * fps;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-red-800">预览</h1>
          <div className="space-x-2">
            <button onClick={() => navigate('/editor')} className="px-4 py-2 border border-red-600 text-red-800 rounded">返回编辑</button>
            <button onClick={() => navigate('/render')} className="px-4 py-2 bg-yellow-500 text-red-800 rounded font-bold">开始渲染</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <Player
            component={WeddingVideo}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionWidth={1920}
            compositionHeight={1080}
            controls
            inputProps={{ project }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Play, Film } from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import { Player } from '@remotion/player';
import { WeddingVideo } from '@/Video/WeddingVideo';

const Render: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { project } = useWeddingStore();
  const navigate = useNavigate();
  const playerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hiddenContainerRef = useRef<HTMLDivElement | null>(null);
  const fps = 30;
  const durationMs = project.duration * 1000;

  const startRender = async (e?: React.SyntheticEvent) => {
    setIsRendering(true);
    setProgress(1);
    
    try {
      const resp = await fetch('http://localhost:3001/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      });
      if (!resp.ok) {
        throw new Error('渲染服务返回错误');
      }
      const reader = resp.body?.getReader();
      const chunks: Uint8Array[] = [];
      if (reader) {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
          }
        }
      }
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setIsRendering(false);
      setProgress(100);

    } catch (error) {
      console.error('渲染失败:', error);
      setIsRendering(false);
      setProgress(0);
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `婚礼视频_${project.template.name}_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 移除自动渲染，改为用户点击触发，以满足浏览器媒体策略

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <Film className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-red-800 mb-2">视频渲染</h1>
              <p className="text-red-600">正在生成您的高清婚礼视频</p>
            </div>

            {!videoUrl ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-red-600 mb-2">
                    <span>渲染进度</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-yellow-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-red-700 font-medium">
                    {isRendering ? '正在渲染视频...' : '准备开始渲染'}
                  </p>
                  <p className="text-red-500 text-sm">
                    模板: {project.template.name} | 时长: {project.duration}秒 | 文案: {Object.keys(project.texts).length}段
                  </p>
                </div>

                {progress === 0 && !isRendering && (
                  <button
                    onClick={startRender}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
                  >
                    开始渲染
                  </button>
                )}

                {isRendering && (
                  <div className="flex items-center justify-center space-x-2 text-red-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    <span>渲染中，请稍候...</span>
                  </div>
                )}

                <div className="text-center text-red-500 text-sm">将调用服务端渲染生成 MP4</div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Play className="w-5 h-5" />
                    <span className="font-medium">渲染完成！</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    您的婚礼视频已生成完成，可以下载或预览
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">视频信息</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>模板: {project.template.name}</p>
                    <p>时长: {project.duration}秒</p>
                    <p>文案段落: {Object.keys(project.texts).length}段</p>
                    <p>照片数量: {project.photos.length}张</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={downloadVideo}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>下载视频</span>
                  </button>
                  <button
                    onClick={() => navigate('/preview')}
                    className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 font-bold py-3 rounded-lg transition-colors"
                  >
                    返回预览
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Render;

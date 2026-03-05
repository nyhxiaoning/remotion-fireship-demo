import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Render: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 5);
        return next;
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-red-800">渲染</h1>
          <button onClick={() => navigate('/preview')} className="px-4 py-2 border border-red-600 text-red-800 rounded">返回预览</button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-red-800 mb-4">正在生成高清视频...</p>
          <div className="w-full h-4 bg-red-100 rounded">
            <div style={{ width: `${progress}%` }} className="h-4 bg-yellow-500 rounded"></div>
          </div>
          <p className="mt-2 text-red-600">进度 {progress}%</p>
          <div className="mt-6">
            <button disabled className="px-4 py-2 bg-red-300 text-white rounded">下载（即将支持）</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Render;

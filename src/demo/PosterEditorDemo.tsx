import React from 'react';
import { SimplePosterEditor } from '../poster-editor/SimplePosterEditor';

export const PosterEditorDemo: React.FC = () => {
  const handleExport = (posterDataUrl: string) => {
    console.log('海报导出完成:', posterDataUrl);
    alert('海报导出成功！');
  };

  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="container mx-auto p-4 h-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">低代码海报设计器演示</h1>
        <SimplePosterEditor
          onExport={handleExport}
          width={1200}
          height={800}
        />
      </div>
    </div>
  );
};
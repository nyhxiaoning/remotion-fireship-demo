import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableCanvas } from './components/DraggableCanvas';
import { ComponentLibrary } from './components/ComponentLibrary';
import { PropertyEditor } from './components/PropertyEditor';
import { PosterRenderer } from './core/PosterRenderer';
import { usePosterStore } from './store/poster-store';
import { PosterElement } from './types';

interface PosterEditorProps {
  onExportToVideo?: (posterData: string) => void;
  defaultCanvasSize?: { width: number; height: number };
}

export const PosterEditor: React.FC<PosterEditorProps> = ({ 
  onExportToVideo, 
  defaultCanvasSize = { width: 800, height: 600 } 
}) => {
  const [selectedElement, setSelectedElement] = useState<PosterElement | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { elements, canvasSize } = usePosterStore();

  const handleExportPoster = async (posterDataUrl: string) => {
    if (onExportToVideo) {
      onExportToVideo(posterDataUrl);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="poster-editor flex h-screen bg-gray-100">
        {/* 左侧组件库 */}
        <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto">
          <ComponentLibrary />
        </div>

        {/* 中间画布区域 */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">海报设计器</h2>
              <div className="space-x-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {showPreview ? '编辑模式' : '预览模式'}
                </button>
              </div>
            </div>
            
            {showPreview ? (
              <PosterRenderer
                elements={elements}
                canvasSize={canvasSize}
                onExport={handleExportPoster}
              />
            ) : (
              <DraggableCanvas
                width={canvasSize.width}
                height={canvasSize.height}
                onElementSelect={setSelectedElement}
                selectedElementId={selectedElement?.id || null}
              />
            )}
          </div>
        </div>

        {/* 右侧属性编辑器 */}
        <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
          <PropertyEditor
            element={selectedElement}
            onUpdate={(updatedElement) => {
              // 更新逻辑将在store中处理
              setSelectedElement(updatedElement);
            }}
          />
        </div>
      </div>
    </DndProvider>
  );
};

// 导出主要组件和工具函数
export { PosterRenderer } from './core/PosterRenderer';
export { usePosterStore } from './store/poster-store';
export * from './types';
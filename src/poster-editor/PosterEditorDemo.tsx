import React from 'react';
import { DraggableCanvas } from './components/DraggableCanvas';
import { ComponentLibrary } from './components/ComponentLibrary';
import { PropertyEditor } from './components/PropertyEditor';
import { PosterRenderer } from './core/PosterRenderer';
import { usePosterStore } from './store/poster-store';

export const PosterEditorDemo: React.FC = () => {
  const { selectedElement, elements, updateElement, addElement, deleteElement } = usePosterStore();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 组件库 */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">组件库</h2>
        <ComponentLibrary />
      </div>

      {/* 画布区域 */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg h-full">
          <DraggableCanvas />
        </div>
      </div>

      {/* 属性编辑器 */}
      <div className="w-80 bg-white shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">属性面板</h2>
        <PropertyEditor />
      </div>
    </div>
  );
};

export default PosterEditorDemo;
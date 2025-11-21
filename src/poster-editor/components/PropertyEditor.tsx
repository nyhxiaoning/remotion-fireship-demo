import React from 'react';
import { PosterElement } from '../types';

interface PropertyEditorProps {
  element: PosterElement | null;
  onUpdate: (element: PosterElement) => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({ element, onUpdate }) => {
  if (!element) {
    return (
      <div className="property-editor empty-state">
        <p className="text-gray-500 text-center py-8">选择一个元素来编辑属性</p>
      </div>
    );
  }

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onUpdate({
      ...element,
      position: { ...element.position, [axis]: value }
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    onUpdate({
      ...element,
      size: { ...element.size, [dimension]: value }
    });
  };

  const handleRotationChange = (rotation: number) => {
    onUpdate({ ...element, rotation });
  };

  const handleOpacityChange = (opacity: number) => {
    onUpdate({ ...element, opacity });
  };

  const renderPropertyInputs = () => {
    switch (element.type) {
      case 'text':
        return <TextPropertyInputs element={element} onUpdate={onUpdate} />;
      case 'image':
        return <ImagePropertyInputs element={element} onUpdate={onUpdate} />;
      case 'shape':
        return <ShapePropertyInputs element={element} onUpdate={onUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="property-editor space-y-4">
      <h3 className="text-lg font-semibold">属性编辑</h3>
      
      {/* 通用属性 */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">位置与尺寸</h4>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600">X 坐标</label>
            <input
              type="number"
              value={element.position.x}
              onChange={(e) => handlePositionChange('x', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Y 坐标</label>
            <input
              type="number"
              value={element.position.y}
              onChange={(e) => handlePositionChange('y', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600">宽度</label>
            <input
              type="number"
              value={element.size.width}
              onChange={(e) => handleSizeChange('width', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">高度</label>
            <input
              type="number"
              value={element.size.height}
              onChange={(e) => handleSizeChange('height', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600">旋转角度</label>
          <input
            type="range"
            min="0"
            max="360"
            value={element.rotation}
            onChange={(e) => handleRotationChange(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{element.rotation}°</span>
        </div>

        <div>
          <label className="block text-xs text-gray-600">透明度</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.opacity}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{Math.round(element.opacity * 100)}%</span>
        </div>
      </div>

      {/* 特定类型属性 */}
      {renderPropertyInputs()}
    </div>
  );
};

// 文本属性编辑器
const TextPropertyInputs: React.FC<{ element: PosterElement; onUpdate: (element: PosterElement) => void }> = ({ element, onUpdate }) => {
  const properties = element.properties as any;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">文本属性</h4>
      
      <div>
        <label className="block text-xs text-gray-600">内容</label>
        <textarea
          value={properties.content}
          onChange={(e) => onUpdate({
            ...element,
            properties: { ...properties, content: e.target.value }
          })}
          className="w-full px-2 py-1 text-sm border rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600">字体大小</label>
        <input
          type="number"
          value={properties.fontSize}
          onChange={(e) => onUpdate({
            ...element,
            properties: { ...properties, fontSize: Number(e.target.value) }
          })}
          className="w-full px-2 py-1 text-sm border rounded"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600">颜色</label>
        <input
          type="color"
          value={properties.color}
          onChange={(e) => onUpdate({
            ...element,
            properties: { ...properties, color: e.target.value }
          })}
          className="w-full h-8 border rounded"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600">字体粗细</label>
        <select
          value={properties.fontWeight}
          onChange={(e) => onUpdate({
            ...element,
            properties: { ...properties, fontWeight: e.target.value }
          })}
          className="w-full px-2 py-1 text-sm border rounded"
        >
          <option value="normal">正常</option>
          <option value="bold">粗体</option>
        </select>
      </div>
    </div>
  );
};

// 图片属性编辑器
const ImagePropertyInputs: React.FC<{ element: PosterElement; onUpdate: (element: PosterElement) => void }> = ({ element, onUpdate }) => {
  const properties = element.properties as any;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">图片属性</h4>
      
      <div>
        <label className="block text-xs text-gray-600">图片URL</label>
        <input
          type="url"
          value={properties.src}
          onChange={(e) => onUpdate({
            ...element,
            properties: { ...properties, src: e.target.value }
          })}
          className="w-full px-2 py-1 text-sm border rounded"
          placeholder="输入图片URL"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600">圆角</label>
        <input
          type="number"
          value={properties.borderRadius}
          onChange={(e) => onUpdate({
            ...element,
            properties: { ...properties, borderRadius: Number(e.target.value) }
          })}
          className="w-full px-2 py-1 text-sm border rounded"
        />
      </div>
    </div>
  );
};

// 形状属性编辑器
const ShapePropertyInputs: React.FC<{ element: PosterElement; onUpdate: (element: PosterElement) => void }> = ({ element, onUpdate }) => {
  const properties = element.properties as any;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">形状属性</h4>
      
      <div>
        <label className="block text-xs text-gray-600">填充颜色</label>
        <input
          type="color"
          value={properties.fill}
          onChange={(e) => onUpdate({
            ...element,
            properties: { ...properties, fill: e.target.value }
          })}
          className="w-full h-8 border rounded"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600">边框颜色</label>
        <input
          type="color"
          value={properties.stroke}
          onChange={(e) => onUpdate({
            ...element,
            properties: { ...properties, stroke: e.target.value }
          })}
          className="w-full h-8 border rounded"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-600">边框宽度</label>
        <input
          type="number"
          value={properties.strokeWidth}
          onChange={(e) => onUpdate({
            ...element,
            properties: { ...properties, strokeWidth: Number(e.target.value) }
          })}
          className="w-full px-2 py-1 text-sm border rounded"
        />
      </div>
    </div>
  );
};
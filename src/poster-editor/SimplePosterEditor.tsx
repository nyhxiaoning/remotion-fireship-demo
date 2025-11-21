import React, { useState, useRef, useCallback } from 'react';
import { PosterElement } from '../types';

interface SimplePosterEditorProps {
  onExport?: (dataUrl: string) => void;
  width?: number;
  height?: number;
}

export const SimplePosterEditor: React.FC<SimplePosterEditorProps> = ({
  onExport,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<PosterElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 添加文本元素
  const addTextElement = useCallback(() => {
    const newElement: PosterElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 50 },
      rotation: 0,
      opacity: 1,
      zIndex: elements.length,
      properties: {
        content: '示例文本',
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000',
        fontWeight: 'normal',
        textAlign: 'left'
      }
    };
    setElements(prev => [...prev, newElement]);
  }, [elements.length]);

  // 添加形状元素
  const addShapeElement = useCallback(() => {
    const newElement: PosterElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      position: { x: 150, y: 150 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      zIndex: elements.length,
      properties: {
        type: 'rectangle',
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 2
      }
    };
    setElements(prev => [...prev, newElement]);
  }, [elements.length]);

  // 渲染画布
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 按zIndex排序渲染
    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    
    sortedElements.forEach(element => {
      ctx.save();
      
      // 应用变换
      ctx.translate(element.position.x + element.size.width / 2, element.position.y + element.size.height / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.globalAlpha = element.opacity;
      
      // 根据类型渲染
      if (element.type === 'text') {
        const props = element.properties as any;
        ctx.font = `${props.fontWeight} ${props.fontSize}px ${props.fontFamily}`;
        ctx.fillStyle = props.color;
        ctx.textAlign = props.textAlign;
        ctx.fillText(props.content, -element.size.width / 2, 0);
      } else if (element.type === 'shape') {
        const props = element.properties as any;
        ctx.fillStyle = props.fill;
        ctx.strokeStyle = props.stroke;
        ctx.lineWidth = props.strokeWidth;
        
        if (props.type === 'rectangle') {
          ctx.fillRect(-element.size.width / 2, -element.size.height / 2, element.size.width, element.size.height);
          ctx.strokeRect(-element.size.width / 2, -element.size.height / 2, element.size.width, element.size.height);
        } else if (props.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, Math.min(element.size.width, element.size.height) / 2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      }
      
      ctx.restore();
    });
  }, [elements, width, height]);

  // 处理鼠标事件
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 查找点击的元素
    const clickedElement = elements.find(element => {
      return x >= element.position.x && 
             x <= element.position.x + element.size.width &&
             y >= element.position.y && 
             y <= element.position.y + element.size.height;
    });

    if (clickedElement) {
      setSelectedElement(clickedElement.id);
      setIsDragging(true);
      setDragOffset({
        x: x - clickedElement.position.x,
        y: y - clickedElement.position.y
      });
    } else {
      setSelectedElement(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setElements(prev => prev.map(el => 
      el.id === selectedElement 
        ? { ...el, position: { x, y } }
        : el
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 导出功能
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    
    if (onExport) {
      onExport(dataUrl);
    }

    // 自动下载
    const link = document.createElement('a');
    link.download = `poster-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // 更新选中元素的属性
  const updateSelectedElement = (updates: Partial<any>) => {
    if (!selectedElement) return;

    setElements(prev => prev.map(el => 
      el.id === selectedElement 
        ? { ...el, properties: { ...el.properties, ...updates } }
        : el
    ));
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  React.useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div className="simple-poster-editor flex h-screen bg-gray-100">
      {/* 左侧工具栏 */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4">工具栏</h3>
        
        <div className="space-y-2">
          <button
            onClick={addTextElement}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            添加文本
          </button>
          
          <button
            onClick={addShapeElement}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            添加形状
          </button>
          
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            导出海报
          </button>
        </div>

        {/* 属性编辑器 */}
        {selectedElementData && (
          <div className="mt-6 space-y-3">
            <h4 className="text-md font-medium">属性编辑</h4>
            
            {selectedElementData.type === 'text' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm">文本内容</label>
                  <input
                    type="text"
                    value={(selectedElementData.properties as any).content}
                    onChange={(e) => updateSelectedElement({ content: e.target.value })}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm">字体大小</label>
                  <input
                    type="number"
                    value={(selectedElementData.properties as any).fontSize}
                    onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm">颜色</label>
                  <input
                    type="color"
                    value={(selectedElementData.properties as any).color}
                    onChange={(e) => updateSelectedElement({ color: e.target.value })}
                    className="w-full h-8 border rounded"
                  />
                </div>
              </div>
            )}
            
            {selectedElementData.type === 'shape' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm">填充颜色</label>
                  <input
                    type="color"
                    value={(selectedElementData.properties as any).fill}
                    onChange={(e) => updateSelectedElement({ fill: e.target.value })}
                    className="w-full h-8 border rounded"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 中间画布 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">海报画布</h2>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="border border-gray-300 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>

      {/* 右侧信息面板 */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4">信息</h3>
        
        <div className="space-y-2 text-sm">
          <p>元素数量: {elements.length}</p>
          <p>画布尺寸: {width} × {height}</p>
          {selectedElement && (
            <p>选中元素: {selectedElement}</p>
          )}
        </div>
        
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">使用说明</h4>
          <ul className="text-xs space-y-1 text-gray-600">
            <li>• 点击按钮添加元素</li>
            <li>• 拖拽元素移动位置</li>
            <li>• 选中元素后编辑属性</li>
            <li>• 点击导出保存海报</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
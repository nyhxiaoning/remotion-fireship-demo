import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { PosterElement } from '../types';
import { CanvasElement } from './CanvasElement';
import { usePosterStore } from '../store/poster-store';

interface DraggableCanvasProps {
  width: number;
  height: number;
  onElementSelect?: (element: PosterElement | null) => void;
  selectedElementId?: string | null;
}

export const DraggableCanvas: React.FC<DraggableCanvasProps> = ({
  width,
  height,
  onElementSelect,
  selectedElementId
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { elements, addElement, updateElement, selectedElement, setSelectedElement } = usePosterStore();

  const [{ isOver }, drop] = useDrop({
    accept: ['text', 'image', 'shape'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      
      if (offset && canvasRect) {
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        
        const newElement: PosterElement = {
          id: `element-${Date.now()}`,
          type: item.type,
          position: { x, y },
          size: { width: 100, height: 100 },
          rotation: 0,
          opacity: 1,
          zIndex: elements.length,
          properties: item.properties
        };
        
        addElement(newElement);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  useEffect(() => {
    if (canvasRef.current) {
      drop(canvasRef.current);
    }
  }, [drop]);

  const handleElementClick = (element: PosterElement) => {
    setSelectedElement(element);
    onElementSelect?.(element);
  };

  // 添加缺失的CSS导入
  useEffect(() => {
    // 动态导入样式文件
    import('../styles/poster-editor.css');
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
      onElementSelect?.(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      className={`draggable-canvas ${isOver ? 'drag-over' : ''}`}
      style={{ 
        width, 
        height, 
        border: '2px dashed #ccc',
        position: 'relative',
        backgroundColor: '#f9f9f9'
      }}
      onClick={handleCanvasClick}
    >
      {elements.map((element) => (
        <CanvasElement
          key={element.id}
          element={element}
          isSelected={selectedElement?.id === element.id}
          onClick={() => handleElementClick(element)}
          onUpdate={(updates) => updateElement(element.id, updates)}
        />
      ))}
    </div>
  );
};
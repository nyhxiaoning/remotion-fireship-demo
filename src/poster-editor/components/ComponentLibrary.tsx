import React from 'react';
import { useDrag } from 'react-dnd';

interface ComponentLibraryProps {
  className?: string;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ className }) => {
  const textComponents = [
    { name: '标题', type: 'text', properties: { content: '标题文本', fontSize: 32, fontFamily: 'Arial', color: '#000000', fontWeight: 'bold', textAlign: 'center' }},
    { name: '正文', type: 'text', properties: { content: '正文内容', fontSize: 16, fontFamily: 'Arial', color: '#333333', fontWeight: 'normal', textAlign: 'left' }},
    { name: '引用', type: 'text', properties: { content: '引用文本', fontSize: 18, fontFamily: 'Georgia', color: '#666666', fontWeight: 'normal', textAlign: 'center' }}
  ];

  const shapeComponents = [
    { name: '矩形', type: 'shape', properties: { type: 'rectangle', fill: '#3B82F6', stroke: '#1E40AF', strokeWidth: 2 }},
    { name: '圆形', type: 'shape', properties: { type: 'circle', fill: '#EF4444', stroke: '#DC2626', strokeWidth: 2 }},
    { name: '三角形', type: 'shape', properties: { type: 'triangle', fill: '#10B981', stroke: '#059669', strokeWidth: 2 }}
  ];

  const imageComponents = [
    { name: '图片占位符', type: 'image', properties: { src: '/images/placeholder.png', fit: 'cover', borderRadius: 8 }}
  ];

  return (
    <div className={`component-library ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-4">组件库</h3>
      
      <div className="space-y-6">
        <ComponentSection title="文本组件">
          {textComponents.map((component, index) => (
            <DraggableComponent key={index} {...component} />
          ))}
        </ComponentSection>

        <ComponentSection title="形状组件">
          {shapeComponents.map((component, index) => (
            <DraggableComponent key={index} {...component} />
          ))}
        </ComponentSection>

        <ComponentSection title="图片组件">
          {imageComponents.map((component, index) => (
            <DraggableComponent key={index} {...component} />
          ))}
        </ComponentSection>
      </div>
    </div>
  );
};

interface ComponentSectionProps {
  title: string;
  children: React.ReactNode;
}

const ComponentSection: React.FC<ComponentSectionProps> = ({ title, children }) => (
  <div className="component-section">
    <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
    <div className="grid grid-cols-2 gap-2">
      {children}
    </div>
  </div>
);

interface DraggableComponentProps {
  name: string;
  type: string;
  properties: any;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ name, type, properties }) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { type, properties },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`draggable-component ${isDragging ? 'dragging' : ''}`}
      style={{
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'move',
        backgroundColor: '#fff',
        textAlign: 'center',
        fontSize: '12px'
      }}
    >
      {name}
    </div>
  );
};
import React from 'react';
import { PosterElement } from '../types';

interface CanvasElementProps {
  element: PosterElement;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (updates: Partial<PosterElement>) => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onClick,
  onUpdate
}) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    zIndex: element.zIndex,
    cursor: 'move',
    border: isSelected ? '2px solid #3B82F6' : 'none',
    boxSizing: 'border-box'
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return <TextElement properties={element.properties as any} />;
      case 'image':
        return <ImageElement properties={element.properties as any} />;
      case 'shape':
        return <ShapeElement properties={element.properties as any} />;
      case 'video-frame':
        return <VideoFrameElement properties={element.properties as any} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={style}
      onClick={onClick}
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
    >
      {renderContent()}
    </div>
  );
};

const TextElement: React.FC<{ properties: any }> = ({ properties }) => {
  const style: React.CSSProperties = {
    fontSize: properties.fontSize,
    fontFamily: properties.fontFamily,
    color: properties.color,
    fontWeight: properties.fontWeight,
    textAlign: properties.textAlign,
    lineHeight: properties.lineHeight || 1.2,
    letterSpacing: properties.letterSpacing || 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: properties.textAlign === 'center' ? 'center' : 
                    properties.textAlign === 'right' ? 'flex-end' : 'flex-start',
    whiteSpace: 'pre-wrap',
    overflow: 'hidden'
  };

  return (
    <div style={style}>
      {properties.content}
    </div>
  );
};

const ImageElement: React.FC<{ properties: any }> = ({ properties }) => {
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: properties.fit,
    borderRadius: properties.borderRadius || 0
  };

  return (
    <img
      src={properties.src}
      alt={properties.alt || 'Image'}
      style={style}
      onError={(e) => {
        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSI+5Zu+54mH5YeP</dGV4dD48L3N2Zz4=';
      }}
    />
  );
};

const ShapeElement: React.FC<{ properties: any }> = ({ properties }) => {
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: properties.fill,
    border: `${properties.strokeWidth}px solid ${properties.stroke}`,
    borderRadius: properties.borderRadius || 0
  };

  if (properties.type === 'circle') {
    style.borderRadius = '50%';
  }

  return (
    <div style={style} />
  );
};

const VideoFrameElement: React.FC<{ properties: any }> = ({ properties }) => {
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '12px'
  };

  return (
    <div style={style}>
      视频帧 {properties.frameTime}s
    </div>
  );
};
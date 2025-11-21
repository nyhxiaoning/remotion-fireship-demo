import React, { useRef, useEffect, useState } from 'react';
import { PosterElement } from '../types';
import html2canvas from 'html2canvas';

interface PosterRendererProps {
  elements: PosterElement[];
  canvasSize: { width: number; height: number };
  onExport?: (dataUrl: string) => void;
  showControls?: boolean;
}

export const PosterRenderer: React.FC<PosterRendererProps> = ({ 
  elements, 
  canvasSize, 
  onExport,
  showControls = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    renderToPreview();
  }, [elements, canvasSize]);

  const renderToPreview = () => {
    if (!previewRef.current) return;

    // 清空现有内容
    previewRef.current.innerHTML = '';
    previewRef.current.style.width = `${canvasSize.width}px`;
    previewRef.current.style.height = `${canvasSize.height}px`;
    previewRef.current.style.position = 'relative';
    previewRef.current.style.backgroundColor = '#ffffff';
    previewRef.current.style.border = '1px solid #e5e7eb';

    // 渲染每个元素
    elements.forEach(element => {
      const elementDiv = createElementDiv(element);
      if (elementDiv) {
        previewRef.current?.appendChild(elementDiv);
      }
    });
  };

  const createElementDiv = (element: PosterElement): HTMLElement | null => {
    const div = document.createElement('div');
    
    // 基础样式
    div.style.position = 'absolute';
    div.style.left = `${element.position.x}px`;
    div.style.top = `${element.position.y}px`;
    div.style.width = `${element.size.width}px`;
    div.style.height = `${element.size.height}px`;
    div.style.transform = `rotate(${element.rotation}deg)`;
    div.style.opacity = `${element.opacity}`;
    div.style.zIndex = `${element.zIndex}`;
    div.style.overflow = 'hidden';

    // 根据类型添加特定内容
    switch (element.type) {
      case 'text':
        return createTextElement(div, element.properties as any);
      case 'image':
        return createImageElement(div, element.properties as any);
      case 'shape':
        return createShapeElement(div, element.properties as any);
      case 'video-frame':
        return createVideoFrameElement(div, element.properties as any);
      default:
        return null;
    }
  };

  const createTextElement = (container: HTMLElement, properties: any): HTMLElement => {
    const textDiv = document.createElement('div');
    textDiv.style.fontSize = `${properties.fontSize}px`;
    textDiv.style.fontFamily = properties.fontFamily;
    textDiv.style.color = properties.color;
    textDiv.style.fontWeight = properties.fontWeight;
    textDiv.style.textAlign = properties.textAlign;
    textDiv.style.lineHeight = `${properties.lineHeight || 1.2}`;
    textDiv.style.letterSpacing = `${properties.letterSpacing || 0}px`;
    textDiv.style.width = '100%';
    textDiv.style.height = '100%';
    textDiv.style.display = 'flex';
    textDiv.style.alignItems = 'center';
    textDiv.style.justifyContent = properties.textAlign === 'center' ? 'center' : 
                                   properties.textAlign === 'right' ? 'flex-end' : 'flex-start';
    textDiv.style.whiteSpace = 'pre-wrap';
    textDiv.style.wordBreak = 'break-word';
    textDiv.textContent = properties.content;
    
    container.appendChild(textDiv);
    return container;
  };

  const createImageElement = (container: HTMLElement, properties: any): HTMLElement => {
    const img = document.createElement('img');
    img.src = properties.src;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = properties.fit;
    img.style.borderRadius = `${properties.borderRadius || 0}px`;
    
    container.appendChild(img);
    return container;
  };

  const createShapeElement = (container: HTMLElement, properties: any): HTMLElement => {
    container.style.backgroundColor = properties.fill;
    container.style.border = `${properties.strokeWidth}px solid ${properties.stroke}`;
    
    if (properties.type === 'circle') {
      container.style.borderRadius = '50%';
    } else if (properties.type === 'rectangle' && properties.borderRadius) {
      container.style.borderRadius = `${properties.borderRadius}px`;
    }
    
    return container;
  };

  const createVideoFrameElement = (container: HTMLElement, properties: any): HTMLElement => {
    container.style.backgroundColor = '#000000';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.color = '#ffffff';
    container.style.fontSize = '12px';
    container.textContent = `视频帧 ${properties.frameTime}s`;
    
    return container;
  };

  const handleExport = async () => {
    if (!previewRef.current || isExporting) return;
    
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: '#ffffff',
        scale: 2, // 高质量导出
        useCORS: true,
        allowTaint: true
      });
      
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      onExport?.(dataUrl);
      
      // 自动下载
      const link = document.createElement('a');
      link.download = `poster-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('导出海报失败:', error);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="poster-renderer">
      <div className="preview-container mb-4">
        <div 
          ref={previewRef}
          className="poster-preview"
        />
      </div>
      
      {showControls && (
        <div className="controls flex gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isExporting ? '导出中...' : '导出海报'}
          </button>
          
          {onExport && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {isExporting ? '集成中...' : '集成到视频'}
            </button>
          )}
        </div>
      )}
      
      {/* 隐藏的canvas用于内部渲染 */}
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="hidden"
      />
    </div>
  );
};

// 工具函数：导出到视频帧
export const exportToVideoFrame = async (posterDataUrl: string): Promise<string> => {
  // 这里可以实现与Remotion的集成逻辑
  // 返回适合视频制作的格式
  return posterDataUrl;
};

// 工具函数：渲染到Canvas
export const renderToCanvas = async (
  canvas: HTMLCanvasElement, 
  elements: PosterElement[], 
  canvasSize: { width: number; height: number }
): Promise<void> => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 清空画布
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

  // 按zIndex排序并渲染每个元素
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  
  for (const element of sortedElements) {
    await renderElementToCanvas(ctx, element);
  }
};

const renderElementToCanvas = async (ctx: CanvasRenderingContext2D, element: PosterElement): Promise<void> => {
  ctx.save();
  
  // 应用变换
  ctx.translate(element.position.x + element.size.width / 2, element.position.y + element.size.height / 2);
  ctx.rotate((element.rotation * Math.PI) / 180);
  ctx.globalAlpha = element.opacity;
  
  // 根据类型渲染
  switch (element.type) {
    case 'text':
      renderTextToCanvas(ctx, element);
      break;
    case 'image':
      await renderImageToCanvas(ctx, element);
      break;
    case 'shape':
      renderShapeToCanvas(ctx, element);
      break;
  }
  
  ctx.restore();
};

const renderTextToCanvas = (ctx: CanvasRenderingContext2D, element: PosterElement): void => {
  const props = element.properties as any;
  
  ctx.font = `${props.fontWeight} ${props.fontSize}px ${props.fontFamily}`;
  ctx.fillStyle = props.color;
  ctx.textAlign = props.textAlign;
  
  const x = -element.size.width / 2;
  const y = -element.size.height / 2;
  
  ctx.fillText(props.content, x, y + props.fontSize);
};

const renderImageToCanvas = async (ctx: CanvasRenderingContext2D, element: PosterElement): Promise<void> => {
  const props = element.properties as any;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const x = -element.size.width / 2;
      const y = -element.size.height / 2;
      
      // 应用圆角遮罩
      if (props.borderRadius > 0) {
        const radius = Math.min(props.borderRadius, element.size.width / 2, element.size.height / 2);
        ctx.beginPath();
        ctx.roundRect(x, y, element.size.width, element.size.height, radius);
        ctx.clip();
      }
      
      ctx.drawImage(img, x, y, element.size.width, element.size.height);
      resolve();
    };
    
    img.onerror = () => {
      // 加载失败时绘制占位符
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(-element.size.width / 2, -element.size.height / 2, element.size.width, element.size.height);
      ctx.fillStyle = '#999';
      ctx.fillText('图片加载失败', -element.size.width / 4, 0);
      resolve();
    };
    
    img.src = props.src;
  });
};

const renderShapeToCanvas = (ctx: CanvasRenderingContext2D, element: PosterElement): void => {
  const props = element.properties as any;
  
  ctx.fillStyle = props.fill;
  ctx.strokeStyle = props.stroke;
  ctx.lineWidth = props.strokeWidth;
  
  const x = -element.size.width / 2;
  const y = -element.size.height / 2;
  
  switch (props.type) {
    case 'rectangle':
      if (props.borderRadius) {
        ctx.beginPath();
        ctx.roundRect(x, y, element.size.width, element.size.height, props.borderRadius);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(x, y, element.size.width, element.size.height);
        ctx.strokeRect(x, y, element.size.width, element.size.height);
      }
      break;
      
    case 'circle':
      const radius = Math.min(element.size.width, element.size.height) / 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -element.size.height / 2);
      ctx.lineTo(-element.size.width / 2, element.size.height / 2);
      ctx.lineTo(element.size.width / 2, element.size.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
  }
};
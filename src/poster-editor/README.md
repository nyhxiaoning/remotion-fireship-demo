# 低代码海报设计组件使用指南

## 🎯 功能概述

这个低代码海报设计组件为现有的Remotion视频制作项目提供了拖拽式的图形化设计界面，让用户无需编写代码就能创建精美的海报，并无缝集成到视频制作流程中。

## 🏗️ 架构设计

### 核心组件

1. **PosterEditor** - 主编辑器组件
2. **DraggableCanvas** - 可拖拽画布
3. **ComponentLibrary** - 组件库面板
4. **PropertyEditor** - 属性编辑器
5. **PosterRenderer** - 渲染和导出引擎

### 状态管理

使用Zustand进行状态管理，包含：
- 元素列表管理
- 选中状态
- 画布尺寸
- 历史记录

### 技术栈

- **React 19** + **TypeScript** - 前端框架
- **React DnD** - 拖拽功能
- **Zustand** - 状态管理
- **html2canvas** - 导出功能
- **Remotion** - 视频集成

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install react-dnd react-dnd-html5-backend html2canvas zustand
```

### 2. 使用主编辑器

```tsx
import { PosterEditor } from './poster-editor/PosterEditor';

function App() {
  const handleExportToVideo = (posterDataUrl: string) => {
    console.log('海报导出完成:', posterDataUrl);
    // 集成到视频制作流程
  };

  return (
    <PosterEditor
      onExportToVideo={handleExportToVideo}
      defaultCanvasSize={{ width: 1920, height: 1080 }}
    />
  );
}
```

### 3. 集成到Remotion视频

```tsx
import { PosterMakerVideo } from './poster-maker/PosterMaker';

// 在Remotion组件中使用
export const MyVideo: React.FC = () => {
  const posterDataUrl = "data:image/png;base64,...";
  
  return (
    <PosterMakerVideo posterDataUrl={posterDataUrl} />
  );
};
```

## 🎨 功能特性

### 拖拽式设计
- 从组件库拖拽元素到画布
- 支持文本、图片、形状等多种元素
- 实时预览和编辑

### 属性编辑
- 位置、尺寸、旋转角度
- 透明度、颜色、字体样式
- 圆角、边框、对齐方式

### 导出选项
- PNG/JPG格式导出
- 高质量渲染
- 自动下载功能

### 视频集成
- 与Remotion无缝集成
- 支持作为视频帧使用
- 可编程控制展示时间

## 📋 组件API

### PosterEditor Props

```typescript
interface PosterEditorProps {
  onExportToVideo?: (posterDataUrl: string) => void;
  defaultCanvasSize?: { width: number; height: number };
}
```

### PosterElement 类型

```typescript
interface PosterElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'video-frame';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  zIndex: number;
  properties: TextProperties | ImageProperties | ShapeProperties | VideoFrameProperties;
}
```

## 🔧 高级用法

### 自定义组件

```tsx
// 创建自定义文本组件
const CustomTextComponent = {
  name: '自定义标题',
  type: 'text',
  properties: {
    content: '自定义文本',
    fontSize: 48,
    fontFamily: 'Arial',
    color: '#FF6B6B',
    fontWeight: 'bold',
    textAlign: 'center'
  }
};
```

### 模板系统

```tsx
// 保存为模板
const saveAsTemplate = (elements: PosterElement[], name: string) => {
  const template = {
    id: `template-${Date.now()}`,
    name,
    elements,
    canvasSize: { width: 1920, height: 1080 },
    tags: ['营销', '社交媒体']
  };
  
  // 保存到本地存储或后端
  localStorage.setItem('posterTemplates', JSON.stringify(template));
};
```

### 批量导出

```tsx
// 批量导出多个尺寸
const exportMultipleSizes = async (elements: PosterElement[]) => {
  const sizes = [
    { width: 1920, height: 1080, name: '横版' },
    { width: 1080, height: 1920, name: '竖版' },
    { width: 1200, height: 1200, name: '方形' }
  ];
  
  for (const size of sizes) {
    const dataUrl = await renderPoster(elements, size);
    downloadImage(dataUrl, `poster-${size.name}.png`);
  }
};
```

## 🎨 设计建议

### 视觉层次
- 使用对比色突出重要元素
- 合理运用留白和对齐
- 保持字体一致性

### 响应式设计
- 考虑不同尺寸的适配
- 使用相对单位而非绝对单位
- 测试不同设备上的显示效果

### 性能优化
- 限制同时编辑的元素数量
- 使用虚拟滚动处理大量元素
- 优化图片加载和缓存

## 🐛 常见问题

### 拖拽不工作
- 确保正确安装了react-dnd
- 检查HTML5Backend是否正确配置
- 验证组件库的拖拽源配置

### 导出图片模糊
- 增加html2canvas的scale参数
- 确保原始图片质量足够高
- 检查画布尺寸设置

### 视频集成失败
- 确认Remotion版本兼容性
- 检查posterDataUrl格式
- 验证视频组件的props类型

## 📚 扩展阅读

- [React DnD 文档](https://react-dnd.github.io/react-dnd/)
- [html2canvas 文档](https://html2canvas.hertzen.com/)
- [Remotion 文档](https://www.remotion.dev/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交代码更改
4. 创建Pull Request
5. 等待代码审查

## 📄 许可证

MIT License - 详见项目根目录的LICENSE文件
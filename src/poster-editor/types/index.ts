export interface PosterElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'video-frame';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  zIndex: number;
  properties: TextProperties | ImageProperties | ShapeProperties | VideoFrameProperties;
}

export interface TextProperties {
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ImageProperties {
  src: string;
  fit: 'contain' | 'cover' | 'fill';
  borderRadius: number;
  alt?: string;
}

export interface ShapeProperties {
  type: 'rectangle' | 'circle' | 'triangle';
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius?: number;
}

export interface VideoFrameProperties {
  videoId: string;
  frameTime: number;
  width: number;
  height: number;
}

export interface PosterTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  elements: PosterElement[];
  canvasSize: { width: number; height: number };
  tags: string[];
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'svg';
  quality: number;
  scale: number;
  transparent: boolean;
}

export interface EditorState {
  elements: PosterElement[];
  selectedElement: PosterElement | null;
  canvasSize: { width: number; height: number };
  history: EditorHistory[];
  historyIndex: number;
}

export interface EditorHistory {
  elements: PosterElement[];
  timestamp: number;
  action: string;
}
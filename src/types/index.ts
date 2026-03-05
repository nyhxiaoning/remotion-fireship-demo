export interface WeddingPhoto {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadTime: number;
}

export interface WeddingText {
  opening: string;
  meeting: string;
  love: string;
  blessing: string;
}

export interface WeddingMusic {
  id: string;
  name: string;
  url: string;
  duration: number;
}

export interface WeddingTemplate {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface WeddingProject {
  photos: WeddingPhoto[];
  texts: WeddingText;
  music: WeddingMusic | null;
  template: WeddingTemplate;
  duration: number;
}

export interface VideoSettings {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
}
import { create } from 'zustand';
import { WeddingProject, WeddingTemplate, WeddingMusic, WeddingText, WeddingPhoto } from '../types';

interface WeddingStore {
  project: WeddingProject;
  setPhotos: (photos: WeddingPhoto[]) => void;
  setTexts: (texts: WeddingText) => void;
  setMusic: (music: WeddingMusic | null) => void;
  setTemplate: (template: WeddingTemplate) => void;
  addPhoto: (photo: WeddingPhoto) => void;
  removePhoto: (photoId: string) => void;
  reorderPhotos: (startIndex: number, endIndex: number) => void;
}

const defaultTemplate: WeddingTemplate = {
  id: 'chinese_traditional',
  name: '中式传统',
  preview: '/assets/previews/chinese.jpg',
  colors: {
    primary: '#DC143C',
    secondary: '#FFD700'
  }
};

const defaultTexts: WeddingText = {
  opening: '良辰吉日，佳偶天成',
  meeting: '缘起今生，情定三生',
  love: '执子之手，与子偕老',
  blessing: '百年好合，永结同心'
};

export const useWeddingStore = create<WeddingStore>((set, get) => ({
  project: {
    photos: [],
    texts: defaultTexts,
    music: null,
    template: defaultTemplate,
    duration: 30
  },

  setPhotos: (photos) => set((state) => ({
    project: { ...state.project, photos }
  })),

  setTexts: (texts) => set((state) => ({
    project: { ...state.project, texts }
  })),

  setMusic: (music) => set((state) => ({
    project: { ...state.project, music }
  })),

  setTemplate: (template) => set((state) => ({
    project: { ...state.project, template }
  })),

  addPhoto: (photo) => set((state) => ({
    project: { 
      ...state.project, 
      photos: [...state.project.photos, photo] 
    }
  })),

  removePhoto: (photoId) => set((state) => ({
    project: { 
      ...state.project, 
      photos: state.project.photos.filter(p => p.id !== photoId) 
    }
  })),

  reorderPhotos: (startIndex, endIndex) => set((state) => {
    const photos = [...state.project.photos];
    const [removed] = photos.splice(startIndex, 1);
    photos.splice(endIndex, 0, removed);
    
    return {
      project: { ...state.project, photos }
    };
  })
}));
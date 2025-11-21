import { create } from 'zustand';
import { PosterElement } from '../types';

interface PosterStore {
  elements: PosterElement[];
  selectedElement: PosterElement | null;
  canvasSize: { width: number; height: number };
  
  // Actions
  addElement: (element: PosterElement) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<PosterElement>) => void;
  setSelectedElement: (element: PosterElement | null) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
  clearCanvas: () => void;
  loadTemplate: (elements: PosterElement[]) => void;
}

export const usePosterStore = create<PosterStore>((set, get) => ({
  elements: [],
  selectedElement: null,
  canvasSize: { width: 800, height: 600 },

  addElement: (element) => {
    set((state) => ({
      elements: [...state.elements, element]
    }));
  },

  removeElement: (id) => {
    set((state) => ({
      elements: state.elements.filter(el => el.id !== id),
      selectedElement: state.selectedElement?.id === id ? null : state.selectedElement
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      ),
      selectedElement: state.selectedElement?.id === id 
        ? { ...state.selectedElement, ...updates } 
        : state.selectedElement
    }));
  },

  setSelectedElement: (element) => {
    set({ selectedElement: element });
  },

  setCanvasSize: (size) => {
    set({ canvasSize: size });
  },

  clearCanvas: () => {
    set({ elements: [], selectedElement: null });
  },

  loadTemplate: (elements) => {
    set({ elements, selectedElement: null });
  }
}));
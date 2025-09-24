import { create } from 'zustand';
import { MakeupStyle } from '@/types';

interface AppState {
  selectedStyle: MakeupStyle | null;
  isModalOpen: boolean;
  setSelectedStyle: (style: MakeupStyle | null) => void;
  setModalOpen: (isOpen: boolean) => void;
  openModal: (style: MakeupStyle) => void;
  closeModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStyle: null,
  isModalOpen: false,
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  openModal: (style) => set({ selectedStyle: style, isModalOpen: true }),
  closeModal: () => set({ selectedStyle: null, isModalOpen: false }),
}));

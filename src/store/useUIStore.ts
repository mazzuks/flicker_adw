import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  selectedDealId: string | null;
  pipelineFilters: {
    search: string;
    owner: string;
    priority: string;
  };
  toggleSidebar: () => void;
  selectDeal: (id: string | null) => void;
  setFilters: (filters: Partial<UIState['pipelineFilters']>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  selectedDealId: null,
  pipelineFilters: {
    search: '',
    owner: 'all',
    priority: 'all',
  },
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  selectDeal: (id) => set({ selectedDealId: id }),
  setFilters: (newFilters) =>
    set((state) => ({ pipelineFilters: { ...state.pipelineFilters, ...newFilters } })),
}));

import { create } from 'zustand';

interface UIState {
  selectedCompanyId: string | null;
  sidebarCollapsed: boolean;
  viewMode: 'MY_QUEUE' | 'MASTER';
  pipelineFilters: {
    search: string;
    assigned: string;
    priority: string;
    sla: string;
    stage: string;
  };
  setSelectedCompanyId: (id: string | null) => void;
  toggleSidebar: () => void;
  setViewMode: (mode: 'MY_QUEUE' | 'MASTER') => void;
  setPipelineFilters: (filters: Partial<UIState['pipelineFilters']>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedCompanyId: null,
  sidebarCollapsed: false,
  viewMode: 'MASTER',
  pipelineFilters: {
    search: '',
    assigned: 'all',
    priority: 'all',
    sla: 'all',
    stage: 'all',
  },
  setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setViewMode: (mode) => set({ viewMode: mode }),
  setPipelineFilters: (filters) =>
    set((state) => ({ pipelineFilters: { ...state.pipelineFilters, ...filters } })),
}));

import { create } from 'zustand';

interface PipelineFilters {
  search: string;
  owner: string;
  priority: string;
  slaStatus: string;
}

interface UIState {
  // Navigation
  sidebarCollapsed: boolean;

  // Pipeline/Kanban
  selectedDealId: string | null;
  isDrawerOpen: boolean;
  activeDrawerTab: 'overview' | 'comments' | 'activities' | 'files' | 'tasks';
  filters: PipelineFilters;

  // Actions
  toggleSidebar: () => void;
  openDeal: (id: string, tab?: UIState['activeDrawerTab']) => void;
  closeDrawer: () => void;
  setTab: (tab: UIState['activeDrawerTab']) => void;
  setFilters: (filters: Partial<PipelineFilters>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  selectedDealId: null,
  isDrawerOpen: false,
  activeDrawerTab: 'overview',
  filters: {
    search: '',
    owner: 'all',
    priority: 'all',
    slaStatus: 'all',
  },

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  openDeal: (id, tab = 'overview') =>
    set({
      selectedDealId: id,
      isDrawerOpen: true,
      activeDrawerTab: tab,
    }),

  closeDrawer: () => set({ isDrawerOpen: false, selectedDealId: null }),

  setTab: (tab) => set({ activeDrawerTab: tab }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));

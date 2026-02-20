import { create } from 'zustand';

export type activeDrawerTab = 'overview' | 'tasks' | 'files' | 'comments' | 'activities';

interface UIState {
  isDrawerOpen: boolean;
  selectedDealId: string | null;
  activeDrawerTab: activeDrawerTab;
  // Actions
  openDeal: (dealId: string, tab?: activeDrawerTab) => void;
  closeDrawer: () => void;
  setTab: (tab: activeDrawerTab) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDrawerOpen: false,
  selectedDealId: null,
  activeDrawerTab: 'overview',

  openDeal: (dealId, tab = 'overview') => 
    set({ selectedDealId: dealId, isDrawerOpen: true, activeDrawerTab: tab }),
    
  closeDrawer: () => 
    set({ isDrawerOpen: false, selectedDealId: null }),

  setTab: (tab) => 
    set({ activeDrawerTab: tab }),
}));

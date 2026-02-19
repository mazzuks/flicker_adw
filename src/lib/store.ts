import { create } from 'zustand';

interface UIState {
  activeDrawer: string | null;
  inspectorOpen: boolean;
  isCommandPaletteOpen: boolean;
  setDrawer: (id: string | null) => void;
  toggleInspector: (open?: boolean) => void;
  toggleCommandPalette: (open?: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeDrawer: null,
  inspectorOpen: false,
  isCommandPaletteOpen: false,
  setDrawer: (id) => set({ activeDrawer: id }),
  toggleInspector: (open) => set((state) => ({ inspectorOpen: open ?? !state.inspectorOpen })),
  toggleCommandPalette: (open) =>
    set((state) => ({ isCommandPaletteOpen: open ?? !state.isCommandPaletteOpen })),
}));

interface EditorState {
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  currentBreakpoint: 'desktop' | 'tablet' | 'mobile';
  history: any[];
  selectNode: (id: string | null) => void;
  hoverNode: (id: string | null) => void;
  setBreakpoint: (bp: 'desktop' | 'tablet' | 'mobile') => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedNodeId: null,
  hoveredNodeId: null,
  currentBreakpoint: 'desktop',
  history: [],
  selectNode: (id) => set({ selectedNodeId: id }),
  hoverNode: (id) => set({ hoveredNodeId: id }),
  setBreakpoint: (bp) => set({ currentBreakpoint: bp }),
}));

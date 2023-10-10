import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface UIState {
  showNodesPanel: boolean;
  showNodesCmdPalette: boolean;
  storeNodeInsertPosition: { x: number; y: number };
  isSideSheetMinimized: boolean;
}

export const uiState = createModel<RootModel>()({
  state: {
    showNodesPanel: true,
    showNodesCmdPalette: false,
    storeNodeInsertPosition: { x: 0, y: 0 },
    isSideSheetMinimized: false,
  } as UIState,
  reducers: {
    setShowNodesPanel(state, showNodesPanel: boolean) {
      return {
        ...state,
        showNodesPanel,
      };
    },
    setShowNodesCmdPalette(state, showNodesCmdPalette: boolean) {
      return {
        ...state,
        showNodesCmdPalette,
      };
    },
    setNodeInsertPosition(state, nodeInsertPosition: { x: number; y: number }) {
      return {
        ...state,
        storeNodeInsertPosition: nodeInsertPosition,
      };
    },
    setIsSideSheetMinimized(state, isSideSheetMinimized: boolean) {
      return {
        ...state,
        isSideSheetMinimized,
      };
    },
  },
});

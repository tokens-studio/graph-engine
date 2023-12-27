import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface UIState {
  showNodesCmdPalette: boolean;
  storeNodeInsertPosition: { x: number; y: number };
}

export const uiState = createModel<RootModel>()({
  state: {
    showNodesCmdPalette: false,
    storeNodeInsertPosition: { x: 0, y: 0 },
  } as UIState,
  reducers: {
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
  },
});

import { ReactFlowInstance } from 'reactflow';
import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface UIState {
  currentReactFlow?: ReactFlowInstance;
  showNodesCmdPalette: boolean;
  storeNodeInsertPosition: { x: number; y: number };
}

export const uiState = createModel<RootModel>()({
  state: {
    currentReactFlow: undefined,
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
    setCurrentReactFlow(state, currentReactFlow: ReactFlowInstance) {
      return {
        ...state,
        currentReactFlow,
      };
    },
  },
});

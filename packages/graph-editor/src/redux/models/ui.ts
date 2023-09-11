import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface UIState {
  showNodesPanel: boolean;
}

export const uiState = createModel<RootModel>()({
  state: {
    showNodesPanel: true,
  } as UIState,
  reducers: {
    setShowNodesPanel(state, showNodesPanel: boolean) {
      return {
        ...state,
        showNodesPanel,
      };
    }
  }
});

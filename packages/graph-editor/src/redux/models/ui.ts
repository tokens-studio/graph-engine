import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface UIState {
  showNodesPanel: boolean;
  showNodesDropdown: boolean;
}

export const uiState = createModel<RootModel>()({
  state: {
    showNodesPanel: false,
    showNodesDropdown: false,
  } as UIState,
  reducers: {
    setShowNodesPanel(state, showNodesPanel: boolean) {
      return {
        ...state,
        showNodesPanel,
      };
    },
    setShowNodesDropdown(state, showNodesDropdown: boolean) {
      return {
        ...state,
        showNodesDropdown,
      };
    },
  }
});

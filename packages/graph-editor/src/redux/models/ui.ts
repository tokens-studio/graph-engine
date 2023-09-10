import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface UIState {
  isSidesheetVisible: boolean;
  showNodesPanel: boolean;
  showNodesDropdown: boolean;
}

export const uiState = createModel<RootModel>()({
  state: {
    isSidesheetVisible: true,
    showNodesPanel: false,
    showNodesDropdown: false,
  } as UIState,
  reducers: {
   setSidesheetVisible(state, isSidesheetVisible: boolean) {
      return {
        ...state,
        isSidesheetVisible,
      };
    },
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

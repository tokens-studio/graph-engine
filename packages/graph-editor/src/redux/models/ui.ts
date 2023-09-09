import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface UIState {
  isSidesheetVisible: boolean;
  showNodesPanel: boolean;
  isPanePinned: boolean;
}

export const uiState = createModel<RootModel>()({
  state: {
    isSidesheetVisible: true,
    showNodesPanel: false,
    isPanePinned: false,
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
    setPanePinned(state, isPanePinned: boolean) {
      return {
        ...state,
        isPanePinned,
      };
    }
  }
});

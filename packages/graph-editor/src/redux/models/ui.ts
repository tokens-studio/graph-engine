import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface UIState {
  /**
   * The distance away from a node to obscure the UI
   */
  isSidesheetVisible: boolean;
}

export const uiState = createModel<RootModel>()({
  state: {
    isSidesheetVisible: true,
  } as UIState,
  reducers: {
   setSidesheetVisible(state, isSidesheetVisible: boolean) {
      return {
        ...state,
        isSidesheetVisible,
      };
    }
  },
});

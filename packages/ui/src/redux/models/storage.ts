import { StorageProviderType } from '#/types/storageType.ts';
import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export type StorageState = {
  type: StorageProviderType;
  config: Record<string, any>;
  showPullDialog: string | false;
};

export const storageState = createModel<RootModel>()({
  state: {
    type: StorageProviderType.LOCAL,
    showPullDialog: false,
  } as StorageState,
  reducers: {
    setStorageType(state, type: StorageProviderType) {
      return {
        ...state,
        type,
      };
    },
    setShowPullDialog(state, showPullDialog: string | false) {
      return {
        ...state,
        showPullDialog,
      };
    },
  },
  effects: (dispatch) => ({}),
});

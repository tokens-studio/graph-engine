import { LocalStorage } from '#/storage/adapters/local.ts';
import { RemoteStorage } from '#/storage/interfaces/remoteStorage.ts';
import { StorageProviderType } from '#/types/storageType.ts';
import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export type StorageState = {
  /**
   * JSON representation of the state
   */
  lastSynccedState: string;
  hasUnsavedChanges: boolean;
  provider: RemoteStorage;
  config: Record<string, any>;
  showPullDialog: string | false;
};

export const storageState = createModel<RootModel>()({
  state: {
    lastSynccedState: '{}',
    hasUnsavedChanges: false,
    provider: new LocalStorage(),
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

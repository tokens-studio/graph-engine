import { RootState } from '#/redux/store.tsx';

export const storageStateSelector = (state: RootState) => state.storage;
export const uiStateSelector = (state: RootState) => state.ui;

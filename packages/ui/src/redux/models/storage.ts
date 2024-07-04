import { RemoteStorage } from '@/lib/storage/providers/base.ts';
import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface StorageState {
	storage: RemoteStorage | undefined;
	providers: RemoteStorage[];
}

export const storageState = createModel<RootModel>()({
	state: {
		storage: undefined,
		providers: []
	} as StorageState,
	reducers: {
		setStorage(state, storage: RemoteStorage | undefined) {
			return {
				...state,
				storage
			};
		}
	}
});

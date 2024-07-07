import { GithubStorage } from '@/lib/storage/providers/github.ts';
import { JourneyState } from './models/journey.ts';
import { RefState } from './models/refs.ts';
import { RematchDispatch, init } from '@rematch/core';
import { RootModel, models } from './models/index.ts';
import { StorageState, storageState } from './models/storage.ts';
import { UIState } from './models/ui.ts';
import { createTransform } from 'redux-persist';
import persistPlugin from '@rematch/persist';
import storage from 'redux-persist/lib/storage';

const StorageTransform = createTransform(
	// transform state on its way to being serialized and persisted.
	(inboundState: object, key) => {
		if (key === 'storage') {
			const inbound: StorageState = inboundState as StorageState;

			if (inbound.storage) {
				return {
					...inbound,
					storage: inbound.storage.serialize()
				};
			}
		}
		// convert mySet to an Array.
		return { ...inboundState };
	},
	// transform state being rehydrated
	(outboundState, key) => {
		if (key === 'storage') {
			const outbound: StorageState = outboundState as StorageState;

			//TODO this is hardcoded
			const val = {
				...storageState.state,
				...outbound,
				storage: outbound.storage
					? GithubStorage.deserialize(outbound.storage)
					: undefined
			};
			return val;
		}
		// convert mySet back to a Set.
		return { ...outboundState };
	}
);

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['journey', 'settings', 'storage'],
	transforms: [StorageTransform]
};

export const store = init({
	models,
	//@ts-ignore
	plugins: [persistPlugin(persistConfig)],
	redux: {
		devtoolOptions: {},
		rootReducers: {
			RESET_APP: () => undefined
		}
	}
});

export type Dispatch = RematchDispatch<RootModel>;
export type RootState = {
	ui: UIState;
	journey: JourneyState;
	refs: RefState;
	storage: StorageState;
};

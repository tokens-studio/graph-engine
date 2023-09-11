import { RematchDispatch, init } from '@rematch/core';
import { RootModel, models } from './models/index.ts';
import { UIState } from './models/ui.ts';
import persistPlugin from '@rematch/persist';
import storage from 'redux-persist/lib/storage';
import { JourneyState } from './models/journey.ts';
import { OutputState } from './models/output.tsx';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['journey', 'settings'],
};

export const store = init({
  models,
  //@ts-ignore
  plugins: [persistPlugin(persistConfig)],
  redux: {
    devtoolOptions: {},
    rootReducers: {
      RESET_APP: () => undefined,
    },
  },
});

export type Dispatch = RematchDispatch<RootModel>;
export type RootState = {
  ui: UIState;
  journey: JourneyState;
  editorOutput: OutputState;
};

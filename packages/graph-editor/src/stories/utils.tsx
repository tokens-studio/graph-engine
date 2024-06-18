import { RootModel, models } from '@/redux/models';
import { RootState } from '@/redux/store';
import { init } from '@rematch/core';

export const createMockStore = (
  initialState: Partial<{
    [K in keyof RootState]: Partial<RootState[K]>;
  }>,
) => {
  const storeModels = { ...models };
  Object.entries(initialState).forEach(([name, value]) => {
    const key = name as keyof RootState;
    storeModels[key] = {
      ...storeModels[key],
      state: {
        ...storeModels[key].state,
        ...value,
      },
    } as any; // this is only for mock purposes so we don't need to worry too much here
  });

  return init({
    models: storeModels,
    redux: {
      devtoolOptions: {},
      rootReducers: {
        RESET_APP: () => undefined,
      },
    },
  });
};

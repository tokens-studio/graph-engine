import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface JourneyState {
  showJourney: boolean;
}

export const journeyState = createModel<RootModel>()({
  state: {
    showJourney: true,
  } as JourneyState,
  reducers: {
    setShowJourney(state, showJourney: boolean) {
      return {
        ...state,
        showJourney,
      };
    },
  },
});

import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export enum EdgeType {
  bezier = 'Bezier',
  smoothStep = 'Smooth step',
  straight = 'Straight',
  simpleBezier = 'Simple Bezier',
}

export interface SettingsState {
  edgeType: EdgeType;
}

export const settingsState = createModel<RootModel>()({
  state: {
    edgeType: EdgeType.bezier,
  } as SettingsState,
  reducers: {
    setEdgeType(state, edgeType: EdgeType) {
      return {
        ...state,
        edgeType,
      };
    },
  },
});

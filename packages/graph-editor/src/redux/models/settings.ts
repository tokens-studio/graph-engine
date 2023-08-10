import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export enum EdgeType {
  bezier = 'Bezier',
  smoothStep = 'Smooth step',
  straight = 'Straight',
  simpleBezier = 'Simple Bezier',
}
export enum LayoutType {
  dagre = 'Dagre',
  elkForce = 'Elk - Force',
  elkRect = 'Elk - Rect',
  elkLayered = 'Elk - Layered',
  elkStress = 'Elk - Stress',
}

export interface SettingsState {
  /**
   * The distance away from a node to obscure the UI
   */
  obscureDistance: number;
  edgeType: EdgeType;
  layoutType: LayoutType;
}

export const settingsState = createModel<RootModel>()({
  state: {
    obscureDistance: 0.5,
    edgeType: EdgeType.bezier,
    layoutType: LayoutType.dagre,
  } as SettingsState,
  reducers: {
    setObscureDistance(state, obscureDistance: number) {
      return {
        ...state,
        obscureDistance,
      };
    },
    setEdgeType(state, edgeType: EdgeType) {
      return {
        ...state,
        edgeType,
      };
    },
    setLayoutType(state, layoutType: LayoutType) {
      return {
        ...state,
        layoutType,
      };
    },
  },
});

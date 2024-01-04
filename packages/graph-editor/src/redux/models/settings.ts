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
  debugMode: boolean;
  showTimings: boolean;
  showGrid: boolean;
  /**
   * Whether to show the types inline with the nodes
   */
  inlineTypes: boolean;
  snapGrid: boolean;
}

export const settingsState = createModel<RootModel>()({
  state: {
    obscureDistance: 0.5,
    edgeType: EdgeType.bezier,
    layoutType: LayoutType.dagre,
    showGrid: true,
    showTimings: false,
    inlineTypes: false,
    snapGrid: false,
    debugMode: false,
  } as SettingsState,
  reducers: {
    setSnapGrid(state, snapGrid: boolean) {
      return {
        ...state,
        snapGrid,
      };
    },
    setShowGrid(state, showGrid: boolean) {
      return {
        ...state,
        showGrid,
      };
    },
    setDebugMode(state, debugMode: boolean) {
      return {
        ...state,
        debugMode,
      };
    },
    setObscureDistance(state, obscureDistance: number) {
      return {
        ...state,
        obscureDistance,
      };
    },
    setInlineTypes(state, inlineTypes: boolean) {
      return {
        ...state,
        inlineTypes,
      };
    },
    setEdgeType(state, edgeType: EdgeType) {
      return {
        ...state,
        edgeType,
      };
    },
    setShowTimings(state, showTimings: boolean) {
      return {
        ...state,
        showTimings,
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

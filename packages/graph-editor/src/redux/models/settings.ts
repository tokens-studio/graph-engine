import { RootModel } from './root.js';
import { createModel } from '@rematch/core';

export enum EdgeType {
  bezier = 'Bezier',
  smoothStep = 'Smooth step',
  straight = 'Straight',
  simpleBezier = 'Simple Bezier'
}
export enum LayoutType {
  dagre = 'Dagre',
  elkForce = 'Elk - Force',
  elkRect = 'Elk - Rect',
  elkLayered = 'Elk - Layered',
  elkStress = 'Elk - Stress',
}

export interface SettingsState {
  edgeType: EdgeType;
  layoutType: LayoutType;
  debugMode: boolean;
  showTimings: boolean;
  showMinimap: boolean;
  showGrid: boolean;
  showSearch: boolean;
  /**
   * Whether to delay the update of a node when a value is changed
   */
  delayedUpdate: boolean
  /**
   * Whether to show the types inline with the nodes
   */
  inlineTypes: boolean;
  /**
   * Whether to show the values inline with the nodes
   */
  inlineValues: boolean;
  connectOnClick: boolean;
  snapGrid: boolean;
}

export const settingsState = createModel<RootModel>()({
  state: {
    edgeType: EdgeType.bezier,
    layoutType: LayoutType.dagre,
    showGrid: true,
    connectOnClick: true,
    showTimings: false,
    showSearch: false,
    inlineTypes: false,
    inlineValues: true,
    snapGrid: false,
    debugMode: false,
    showMinimap: false,
    delayedUpdate: false
  } as SettingsState,
  reducers: {

    setConnectOnClick(state, connectOnClick: boolean) {
      return {
        ...state,
        connectOnClick,
      };
    },
    setShowSearch(state, showSearch: boolean) {
      return {
        ...state,
        showSearch,
      };
    },
    setShowMinimap(state, showMinimap: boolean) {
      return {
        ...state,
        showMinimap,
      };
    },

    setDelayedUpdate(state, delayedUpdate: boolean) {
      return {
        ...state,
        delayedUpdate,
      };
    },

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
    setInlineTypes(state, inlineTypes: boolean) {
      return {
        ...state,
        inlineTypes,
      };
    },
    setInlineValues(state, inlineValues: boolean) {
      return {
        ...state,
        inlineValues,
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

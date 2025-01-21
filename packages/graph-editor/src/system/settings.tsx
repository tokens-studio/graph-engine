import { makeAutoObservable } from 'mobx';

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

export class SystemSettings {
  edgeType: EdgeType = EdgeType.bezier;
  layoutType: LayoutType = LayoutType.dagre;
  debugMode: boolean = false;
  showTimings: boolean = false;
  showMinimap: boolean = false;
  showGrid: boolean = true;
  showSearch: boolean = false;
  /**
   * Whether to delay the update of a node when a value is changed
   */
  delayedUpdate: boolean = false;
  /**
   * Whether to show the types inline with the nodes
   */
  inlineTypes: boolean = false;
  /**
   * Whether to show the values inline with the nodes
   */
  inlineValues: boolean = false;
  connectOnClick: boolean = true;
  snapGrid: boolean = false;

  constructor(config: Partial<SystemSettings>) {
    makeAutoObservable(this);
    Object.assign(this, config);
  }
  setEdgeType(edgeType: EdgeType) {
    this.edgeType = edgeType;
  }

  setLayoutType(layoutType: LayoutType) {
    this.layoutType = layoutType;
  }

  setDebugMode(debugMode: boolean) {
    this.debugMode = debugMode;
  }

  setShowTimings(showTimings: boolean) {
    this.showTimings = showTimings;
  }

  setShowMinimap(showMinimap: boolean) {
    this.showMinimap = showMinimap;
  }

  setShowGrid(showGrid: boolean) {
    this.showGrid = showGrid;
  }

  setShowSearch(showSearch: boolean) {
    this.showSearch = showSearch;
  }

  setDelayedUpdate(delayedUpdate: boolean) {
    this.delayedUpdate = delayedUpdate;
  }

  setInlineTypes(inlineTypes: boolean) {
    this.inlineTypes = inlineTypes;
  }

  setInlineValues(inlineValues: boolean) {
    this.inlineValues = inlineValues;
  }

  setConnectOnClick(connectOnClick: boolean) {
    this.connectOnClick = connectOnClick;
  }

  setSnapGrid(snapGrid: boolean) {
    this.snapGrid = snapGrid;
  }
}

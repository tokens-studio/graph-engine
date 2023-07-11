/**
 * Performs a contrast calculation between two colors using APCA-W3 calcs
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "#/types.js";
import { calcAPCA } from "apca-w3";
import chroma from "chroma-js";

export const type = NodeTypes.CONTRASTING;

export type State = {
  a: string;
  b: string;
  background: string;
  wcag: WcagVersion;
  threshold: number;
  contrast: number;
};

type contrastingValues = {
  color: string;
  sufficient: boolean;
  contrast: number;
};

export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

export const defaults: State = {
  a: "#000000",
  b: "#ffffff",
  background: "#ffffff",
  wcag: WcagVersion.V3,
  threshold: 60,
  contrast: 0,
};

export const process = (input, state: State): contrastingValues => {
  const final = {
    ...state,
    ...input,
  };

  let a, b;

  if (final.wcag == WcagVersion.V2) {
    a = chroma.contrast(final.a, final.background);
    b = chroma.contrast(final.b, final.background);
  } else {
    a = Math.abs(calcAPCA(final.a, final.background));
    b = Math.abs(calcAPCA(final.b, final.background));
  }

  let contrast: contrastingValues;

  if (a > b) {
    contrast = {
      color: final.a,
      sufficient: a >= final.threshold,
      contrast: a,
    };
  } else {
    contrast = {
      color: final.b,
      sufficient: b >= final.threshold,
      contrast: b,
    };
  }

  return contrast;
};

export const mapOutput = (input, state, processed: contrastingValues) => {
  return processed;
};

export const node: NodeDefinition<State, State> = {
  defaults,
  type,
  process,
  mapOutput,
};

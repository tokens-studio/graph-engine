/**
 * Performs a contrast calculation between two colors using APCA-W3 calcs
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "#/types.js";
import Color from "colorjs.io";

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
  let colorA = new Color(final.a);
  let colorB = new Color(final.b);
  let background = new Color(final.background);

  if (final.wcag == WcagVersion.V2) {
    a = background.contrast(colorA, "WCAG21");
    b = background.contrast(colorB, "WCAG21");
  } else {
    a = Math.abs(background.contrast(colorA, "APCA"));
    b = Math.abs(background.contrast(colorB, "APCA"));
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

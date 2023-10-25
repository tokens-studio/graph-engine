// nearestTokens.js
import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";
import chroma from "chroma-js";
import _ from "lodash";

export const type = NodeTypes.NEAREST_TOKENS;

export type State = {
  sourceColor: string;
  tokens: SingleToken[];
  compare: "Contrast" | "Hue" | "Lightness" | "Saturation";
  inverted?: boolean;
  wcag: WcagVersion;
};

export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

export const defaults: State = {
  sourceColor: "#ffffff",
  tokens: [],
  compare: "Hue",
  inverted: false,
  wcag: WcagVersion.V3,
};

export const process = (input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  const compareFunctions = {
    Contrast: (color1, color2) => chroma.contrast(color1, color2),
    Hue: (color1, color2) => Math.abs(chroma(color1).get("hsl.h") - chroma(color2).get("hsl.h")),
    Lightness: (color1, color2) => Math.abs(chroma(color1).get("hsl.l") - chroma(color2).get("hsl.l")),
    Saturation: (color1, color2) => Math.abs(chroma(color1).get("hsl.s") - chroma(color2).get("hsl.s")),
  };

  const sortedTokens = _.orderBy(
    final.tokens,
    [token => compareFunctions[final.compare](final.sourceColor, token.value)],
    [final.inverted ? 'desc' : 'asc']
  );

  return {
    sortedTokens,
  };
};


export const mapOutput = (input, state, processed) => {
    return processed ? processed : undefined;
  };

export const node: NodeDefinition<State, any> = {
  description: "Sorts Token Set by distance to Color",
  defaults,
  type,
  process,
  mapOutput,
};

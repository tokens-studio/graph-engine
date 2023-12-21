// nearestTokens.js
import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";
import { sortTokens } from "../../utils/sortTokens.js";

export const type = NodeTypes.NEAREST_TOKENS;

export type State = {
  sourceColor: string;
  tokens: SingleToken[];
  compare: "Contrast" | "Hue" | "Lightness" | "Saturation" | "Distance";
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

  const sortedTokens = sortTokens(
    final.tokens,
    final.sourceColor,
    final.compare,
    final.wcag,
    final.inverted
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

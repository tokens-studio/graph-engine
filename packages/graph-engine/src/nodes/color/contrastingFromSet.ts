import { sortTokens } from "#/utils/sortTokens.js";
import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";
import Color from "colorjs.io";

export const type = NodeTypes.CONTRASTING_FROM_SET;

export type State = {
  tokens: SingleToken[];
  background: string;
  threshold: number;
  wcag: WcagVersion;
};

export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

export const defaults: State = {
  tokens: [],
  background: "#ffffff",
  threshold: 60,
  wcag: WcagVersion.V3,
};

export const process = (input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  let contrast, index;
  let sufficient = false;

  const sorted = sortTokens(
    final.tokens,
    final.background,
    "Contrast",
    final.wcag,
    false
  );

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].compareValue > final.threshold) {
      index = i;
      sufficient = true;
      break;
    }

    if (!sufficient) {
      let maxIndex = 0;
      let maxValue = sorted[0].compareValue;

      if (sorted[i].compareValue > maxValue) {
        maxIndex = i;
        maxValue = sorted[i].compareValue;
      }

      index = maxIndex;
    }
  }

  return {
    token: sorted[index],
    index,
    sufficient,
  };
};

export const mapOutput = (input, state, processed) => {
  return processed ? processed : undefined;
};

export const node: NodeDefinition<State, State> = {
  defaults,
  type,
  process,
  mapOutput,
};

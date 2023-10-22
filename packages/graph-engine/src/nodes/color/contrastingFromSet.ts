import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";
import { calcAPCA } from "apca-w3";
import chroma from "chroma-js";

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

  for (let i = 0; i < final.tokens.length; i++) {
    let token = final.tokens[i];
    let value = token.value;

    if (final.wcag == WcagVersion.V2) {
      contrast = chroma.contrast(value, final.background);
    } else {
      contrast = Math.abs(calcAPCA(value, final.background));
    }

    if (contrast >= final.threshold) {
      index = i;
      sufficient = true;
      console.log(`Sufficient contrast found for ${token.name}`);
      break;
    }
  }

  return {
    token: final.tokens[index],
    index,
    sufficient,
  };
};

export const mapOutput = (input, state, processed) => {
  return processed ? {...processed} : null;
};

export const node: NodeDefinition<State, State> = {
  defaults,
  type,
  process,
  mapOutput,
};

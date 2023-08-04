import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";

export const type = NodeTypes.SET;

type Input = Record<string, any>;

type State = {
  title: string;
  tokens: SingleToken[];
};

//This would be populated by a request to an external source
export const defaults: State = {
  title: "",
  tokens: [],
};

export const EXTERNAL_SET_ID = "as Set";

export const process = (input: Input, state: State) => {
  return state.tokens;
};

export const mapOutput = (input: Input, state, processed: SingleToken[]) => {
  const map = processed.reduce((acc, item) => {
    //Some protection against undefined which can happen if the user deletes a token
    if (!item) {
      return acc;
    }
    acc[item.name] = item.value;
    return acc;
  }, {});

  return {
    [EXTERNAL_SET_ID]: processed,
    ...map,
  };
};

export const node: NodeDefinition<Input, State, SingleToken[]> = {
  type,
  process,
  defaults,
  mapOutput,
};

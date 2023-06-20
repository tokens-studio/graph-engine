import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";

export const type = NodeTypes.INLINE_SET;

type Input = {
  input: SingleToken[];
};

type State = {
  title: string;
  tokens: SingleToken[];
};

//This would be populated by the inline set during the drop operation
export const defaults: State = {
  title: "",
  tokens: [],
};

export const SET_ID = "as Set";

export const process = (input: Input, state: State) => {
  //Override with state if defined
  if (input.input) {
    return input.input;
  }
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
    [SET_ID]: processed,
    ...map,
  };
};

export const node: NodeDefinition<Input, State, SingleToken[]> = {
  type,
  process,
  defaults,
  mapOutput,
};

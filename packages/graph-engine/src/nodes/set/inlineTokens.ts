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
export const EXTERNAL_OBJECT_ID = "as Object";

export const process = (input: Input, state: State) => {
  //Override with state if defined
  if (input.input) {
    return input.input;
  }
  return state.tokens;
};

export const mapOutput = (input: Input, state, processed: SingleToken[]) => {
  const map = processed.reduce(
    (acc, item) => {
      //Some protection against undefined which can happen if the user deletes a token
      if (!item) {
        return acc;
      }
      acc.values[item.name] = item.value;
      acc.raw[item.name] = item;
      return acc;
    },
    {
      raw: {},
      values: {},
    }
  );

  return {
    [SET_ID]: processed,
    [EXTERNAL_OBJECT_ID]: map.raw,
    ...map.values,
  };
};

export const node: NodeDefinition<Input, State, SingleToken[]> = {
  description: "Creates a set of tokens and stores it directly in the graph",
  type,
  process,
  defaults,
  mapOutput,
};

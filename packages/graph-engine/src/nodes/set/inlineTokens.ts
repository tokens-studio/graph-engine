import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";
import { setProperty } from "dot-prop";

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
  let tokens = input.input ? input.input : state.tokens;
  const map = tokens.reduce(
    (acc, item) => {
      //Some protection against undefined which can happen if the user deletes a token
      if (!item) {
        return acc;
      }
      const { name, ...rest } = item;

      acc.values[name] = item.value;

      setProperty(acc.raw, name, rest);
      return acc;
    },
    {
      raw: {},
      values: {},
    }
  );

  return {
    [SET_ID]: tokens,
    [EXTERNAL_OBJECT_ID]: map.raw,
    ...map.values,
  };
};

export const mapOutput = (input: Input, state, processed) => processed;

export const node: NodeDefinition<Input, State> = {
  description: "Creates a set of tokens and stores it directly in the graph",
  description: "Creates a set of tokens and stores it directly in the graph",
  type,
  process,
  defaults,
  mapOutput,
};

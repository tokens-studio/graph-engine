import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.SPLIT_STRING;

export type State = {
  string: string;
  separator: string;
};

export const defaults: State = {
  string: "",
  separator: ",",
};

export const process = (input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  if (final.separator === undefined) {
    return [final.string];
  }

  return final.string.split(final.separator);
};
export const node: NodeDefinition<State, State> = {
  defaults,
  type,
  process,
};

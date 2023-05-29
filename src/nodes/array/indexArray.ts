import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.ARRAY_INDEX;

export const defaults = {
  index: 0,
};

const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };

  return final.array[final.index];
};

export const node: NodeDefinition = {
  type,
  defaults,
  process,
};

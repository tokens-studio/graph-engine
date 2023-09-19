import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.JOIN_STRING;

export type NamedInput = {
  array: string[];
  separator: string;
};

export const defaults = {
  array: [],
  separator: "",
};

export const process = (input: NamedInput, state: NamedInput) => {
  const { array, separator } = { ...state, ...input };
  return array.join(separator);
};

export const node: NodeDefinition<NamedInput> = {
  defaults,
  type,
  process,
};

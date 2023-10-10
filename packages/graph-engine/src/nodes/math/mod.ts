import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.MOD;

export const process = (input) => {
  return input.a % input.b;
};

export const node: NodeDefinition = {
  description: "Modulo node allows you to get the remainder of a division.",
  type,
  process,
};

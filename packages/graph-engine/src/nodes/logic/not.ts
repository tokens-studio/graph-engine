import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.NOT;

export const process = (input) => !input.input;

export const node: NodeDefinition = {
  description: "Not node allows you to negate a boolean value.",
  type,
  process,
};

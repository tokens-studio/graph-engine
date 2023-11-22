import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.STRINGIFY;

export const process = (input) => {
  switch (typeof input.input) {
    case "string":
      return input.input;
    case "object":
      return JSON.stringify(input.input);
    case "undefined":
      return "";
    default:
      return String(input.input);
  }
};
export const node: NodeDefinition = {
  type,
  process,
};

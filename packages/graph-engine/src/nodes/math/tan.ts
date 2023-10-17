import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.TAN;
/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input) => {
  if (input.input === undefined) throw new Error("Input is undefined");
  return Math.tan(input.input);
};

export const node: NodeDefinition = {
  description: "Tan node allows you to get the sin of a number.",
  type,
  process,
};

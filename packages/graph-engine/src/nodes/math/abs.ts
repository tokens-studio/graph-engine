import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.ABS;
/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input) => {
  if (input.input === undefined) return undefined;
  return Math.abs(input.input);
};

export const node: NodeDefinition = {
  description:
    "Absolute node allows you to get the absolute value of a number. Turning a negative number to positive.",
  type,
  process,
};

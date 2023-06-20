import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.LOWER;

/**
 * Optional validation function.
 * @param inputs
 */
export const validateInputs = (input) => {
  if (typeof input.input !== "string") {
    throw new Error("Invalid input, expected a string");
  }
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input) => {
  if (input.input === undefined) {
    return undefined;
  }

  return ("" + input.input).toLowerCase();
};

export const node: NodeDefinition = {
  type,
  validateInputs,
  process,
};

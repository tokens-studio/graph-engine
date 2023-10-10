import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.COUNT;

/**
 * Optional validation function.
 * @param inputs
 */
export const validateInputs = (inputs) => {
  if (!Array.isArray(inputs.input)) {
    throw new Error("Input must be an array");
  }
};

export const process = (input) => (input.input || []).length;

export const node: NodeDefinition = {
  description: "Counts the amount of items in an array.",
  type,
  validateInputs,
  process,
};

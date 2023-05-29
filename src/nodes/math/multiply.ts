import { NodeDefinition, NodeTypes } from "../../types.js";

import { MappedInput } from "./common.js";

export const type = NodeTypes.MULTIPLY;
import { mapInput, validateInputs } from "./common.js";

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input: MappedInput, state) => {
  return input.inputs.reduce((acc, x) => {
    if (isNaN(x.value)) {
      throw new Error("Invalid input");
    }
    return acc * x.value;
  }, 1);
};

export const node: NodeDefinition<MappedInput> = {
  type,
  mapInput,
  validateInputs,
  process,
};

import { MappedInput } from "./common.js";
import { NodeDefinition, NodeTypes } from "../../types.js";
import { mapInput, validateInputs } from "./common.js";

export const type = NodeTypes.ADD;

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input: MappedInput) => {
  return input.inputs.reduce((acc, x) => {
    if (isNaN(x.value)) {
      throw new Error("Invalid input");
    }
    return acc + x.value;
  }, 0);
};

export const node: NodeDefinition<MappedInput> = {
  mapInput,
  description: "Add node allows you to add two or more numbers.",
  validateInputs,
  type,
  process,
};

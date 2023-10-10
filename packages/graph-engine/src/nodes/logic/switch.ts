import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.SWITCH;

export const defaults = {
  //Orders the cases in the UI as the input is an object
  order: [] as string[],
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
  const candidate = input[input.condition];

  //TODO I don't like this but we'd need to change the input mapping which will break this node
  if (candidate === undefined) {
    return input.default;
  }

  return candidate;
};

export const node: NodeDefinition = {
  description:
    "Switch node allows you to conditionally choose a value based on a condition.",
  defaults,
  type,
  process,
};

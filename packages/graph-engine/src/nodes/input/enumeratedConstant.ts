import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.ENUMERATED_INPUT;

/**
 * Defines the starting state of the node
 */
export const defaults = {
  keys: [],
  current: "",
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input, state) => {
  return state.current;
};

export const node: NodeDefinition = {
  type,
  defaults,
  description:
    "Constant node allows you to provide a constant value. You can use this node to set a constant value for a specific property.",
  process,
};

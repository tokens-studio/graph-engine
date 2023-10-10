/**
 * Provides a defined constant for the graph
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.CONSTANT;

/**
 * Defines the starting state of the node
 */
export const defaults = {
  input: "",
  type: "string",
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
  return state.input;
};

export const node: NodeDefinition = {
  description:
    "Constant node allows you to provide a constant value. You can use this node to set a constant value for a specific property.",
  type,
  defaults,
  process,
};

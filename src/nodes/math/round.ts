import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.ROUND;

export const defaults = {
  value: 0,
  precision: 0,
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
  //Override with state if defined
  const final = {
    ...state,
    ...input,
  };

  const shift = 10 ** final.precision;
  return Math.round(final.value * shift) / shift;
};

export const node: NodeDefinition = {
  type,
  defaults,
  process,
};

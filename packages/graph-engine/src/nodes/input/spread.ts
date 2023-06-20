import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.SPREAD;

export type Input = {
  input: any;
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
const process = (input: Input) => {
  return input.input;
};

const mapOutput = (input, state, processed) => {
  return processed;
};

export const node: NodeDefinition<Input> = {
  type,
  process,
  mapOutput,
};

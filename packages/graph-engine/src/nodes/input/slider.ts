import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.SLIDER;

export type Input = {
  input: any;
};

export const defaults = {
  value: 50,
  max: 100,
  step: 1,
};

export type State = {
  value: number;
  max: number;
  step: number;
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
const process = (input: Input, state: State) => {
  if (input.input === undefined) {
    return state.value;
  }

  return input.input;
};

export const node: NodeDefinition<Input, State> = {
  type,
  process,
};

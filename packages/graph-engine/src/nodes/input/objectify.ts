/**
 *
 * @packageDocumentation
 */
import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.OBJECTIFY;

export type Input = Record<string, any>;

export const defaults = {
  //Orders the cases in the UI as the input is an object
  order: [] as string[],
};

/**
 * This should be a passthrough on the input. We expect the names of the inputs to be the keys of the object
 * @param input
 * @returns
 */
const process = (input: Input) => {
  return input;
};

export const node: NodeDefinition<Input> = {
  defaults,
  type,
  process,
};

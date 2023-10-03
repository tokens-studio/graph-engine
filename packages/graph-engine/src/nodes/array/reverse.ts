/**
 * Reverses a given array without mutating the original
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.REVERSE;

export type NamedInput = {
  array: any[];
};

export const process = (input: NamedInput) => {
  //Normal reverse mutates the array. We don't want that.
  return [...input.array].reverse();
};

export const node: NodeDefinition<NamedInput> = {
  description: "Reverses a given array without mutating the original",
  type,
  process,
};

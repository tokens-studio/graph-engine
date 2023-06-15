/**
 * Slices an input array
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.SLICE;

export type NamedInput = {
  array: any[];
  start: number | undefined;
  end: number | undefined;
};

export const process = (input: NamedInput) => {
  return input.array.slice(input.start, input.end);
};

export const node: NodeDefinition<NamedInput> = {
  type,
  process,
};

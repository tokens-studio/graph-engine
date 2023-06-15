/**
 * Performs an array join using a string delimiter
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.JOIN;

export type NamedInput = {
  array: any[];
  delimiter: string;
};

export const process = (input: NamedInput, state) => {
  const final = {
    ...state,
    ...input,
  };
  //Normal reverse mutates the array. We don't want that.
  return final.array.join(final.delimiter);
};

export const node: NodeDefinition<NamedInput> = {
  type,
  process,
};

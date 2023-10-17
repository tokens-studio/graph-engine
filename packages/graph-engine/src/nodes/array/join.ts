/**
 * Performs an array join using a string delimiter
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes, Type } from "../../types.js";

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
  description:
    "Join node allows you to join an array into a string using a delimiter.",

  inputs: [{
    default: [],
    name: 'array',
    description: 'Array to join',
    type: Type.ARRAY,
    items: {
      type: Type.STRING
    }
  }],

  type,
  process,
};

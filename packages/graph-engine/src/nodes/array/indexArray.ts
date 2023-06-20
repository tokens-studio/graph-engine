/**
 * Extracts a value from an array at a given index
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.ARRAY_INDEX;

export type Input = {
  array: any[];
  index: number;
};

export type State = {
  index: number;
  monad: boolean;
};

export const defaults = {
  index: 0,
  monad: false,
};

const process = (input: Input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  const value = final.array[final.index];

  return final.monad ? [value] : value;
};

export const node: NodeDefinition<Input, State> = {
  type,
  defaults,
  process,
};

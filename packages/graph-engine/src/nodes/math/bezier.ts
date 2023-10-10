import { NodeDefinition, NodeTypes } from "../../types.js";
import chroma from "chroma-js";
import { Bezier } from 'bezier-js';

export const type = NodeTypes.SCALE;

export type State = {
  curve: number[];
};

export const defaults: State = {
  curve: [.5, 0, .5, 1],
};

export type Input = {
  curve: string;
} & State;

export const process = (input: Input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  return ([] as string[]).concat(final.curve) as string[];
};

export const mapOutput = (input, state, processed) => {
  return processed
};

export const node: NodeDefinition<Input, State> = {
  type,
  defaults,
  process,
  mapOutput,
};

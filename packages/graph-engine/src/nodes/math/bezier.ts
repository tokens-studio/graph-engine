import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.BEZIER;

export type State = {
  curve: number[];
};

export const defaults: State = {
  curve: [.5, 0, .5, 1],
};

export type Input = {
  curve: [number, number, number, number];
} & State;

export const process = (input: Input, state: State) => {
  return input.curve || state.curve;
};

export const node: NodeDefinition<Input, State> = {
  type,
  description: "Bezier node allows you to generate a bezier curve.",
  defaults,
  process,
};

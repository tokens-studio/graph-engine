import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.POW;

export type State = {
  base: number;
  exponent: number;
};

export const defaults: State = {
  base: 0,
  exponent: 0,
};
export const process = (input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  const base = parseFloat(final.base);
  const exponent = parseFloat(final.exponent);

  return Math.pow(base, exponent);
};

export const node: NodeDefinition<State, State> = {
  defaults,
  type,
  process,
};

import { NodeDefinition, NodeTypes } from "../../types.js";
const type = NodeTypes.CSS_BOX;

export type Input = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type State = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const defaults = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const process = (input: Input, state: State) => {
  const { top, right, bottom, left } = {
    ...state,
    ...input,
  };
  return `${top} ${right} ${bottom} ${left}`;
};

export const node: NodeDefinition<Input, State> = {
  type,
  defaults,
  process,
};

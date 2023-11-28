import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.CSS_FUNCTIONS;

export type Input = {
  functionName: string;
  value: string;
};

export type State = {
  functionName: string;
  value: string;
};

const defaults = {
  functionName: "",
  value: "",
};

const process = (input: Input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  return `${final.functionName.replace("()", "")}(${final.value})`;
};

export const node: NodeDefinition<Input, State> = {
  type,
  defaults,
  description: "Applies a selected CSS function to a value.",
  process,
};

import { NodeDefinition, NodeTypes } from "../../types.js";

import valueParser from "postcss-value-parser";
const type = NodeTypes.PARSE_UNIT;

type Input = {
  input: string;
};
type Output = {
  unit?: string;
  number?: string;
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
const process = (input: Input) => {
  const x = valueParser.unit("" + input.input);
  if (!x) {
    return {};
  }

  return x;
};

const mapOutput = (input: Input, state: any, output: Output) => {
  return output;
};

export const node: NodeDefinition<Input, any, Output> = {
  description: "Parse unit node allows you to seperate units from a number.",
  type,
  mapOutput,
  process,
};

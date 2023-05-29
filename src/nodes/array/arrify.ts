import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.ARRIFY;

export type MappedInput = {
  inputs: {
    key: string;
    value: any;
  }[];
};

/**
 * Pure function
 * @param input
 * @param state
 */
export const mapInput = (input): MappedInput => {
  const values = Object.entries(input).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  //Returns the expected array of inputs
  return {
    inputs: values.map(([key, value]) => ({ key, value })),
  } as MappedInput;
};

export const process = (input: MappedInput) => {
  return input.inputs;
};

export const node: NodeDefinition<MappedInput> = {
  mapInput,
  type,
  process,
};

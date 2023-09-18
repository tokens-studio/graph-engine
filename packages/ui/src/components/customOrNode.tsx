import { NodeDefinition } from "@tokens-studio/graph-engine";

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
  const values = Object.entries(input).sort(([a], [b]) => {
    return ~~a < ~~b ? -1 : 1;
  });

  //Returns the expected array of inputs
  return {
    inputs: values.map(([key, value]) => ({ key, value })),
  } as MappedInput;
};


export const CUSTOM_OR_TYPE = "com.jio.ds.or";

const type = CUSTOM_OR_TYPE;

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
const process = (input: MappedInput) => {
  return input.inputs.reduce((acc, x) => {
    //coerce to bool
    return acc || !!x.value;
  }, false);
};

export const myNode: NodeDefinition<MappedInput> = {
  mapInput,
  type,
  process,
};
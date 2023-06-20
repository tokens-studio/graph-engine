import { NodeDefinition, NodeTypes } from "../../types.js";
import { TokenTypes } from "@tokens-studio/types";
import { sortEntriesNumerically } from "../utils.js";

export const type = NodeTypes.REMAP;

export const defaults = {
  lookup: {} as Record<
    string,
    {
      name: string;
      type: TokenTypes;
    }
  >,
};

type MappedInput = {
  input: {
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
  const values = sortEntriesNumerically(Object.entries(input));

  //Returns the expected array of inputs
  return {
    input: values.map(([key, value]) => ({ key, value })),
  };
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input: MappedInput, state) => {
  return input.input.map((x) => {
    return {
      value: x.value,
      type: state.lookup[x.key]?.type,
      name: state.lookup[x.key]?.name,
    };
  });
};

export const mapOutput = (input, state, processed) => {
  const mapping = {};
  mapping["as Set"] = processed;
  processed.forEach((x) => {
    mapping[x.name] = x;
  });
  return mapping;
};

export const node: NodeDefinition<MappedInput> = {
  type,
  defaults,
  mapInput,
  process,
  mapOutput,
};

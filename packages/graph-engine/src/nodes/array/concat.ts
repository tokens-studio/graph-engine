/**
 * Performs an array join using a string delimiter
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.CONCAT;

export type MappedInput = {
  array: {
    key: string;
    value: any[];
  }[];
};

/**
 * Pure function
 * @param input
 * @param state
 */
export const mapInput = (input: Record<string, any>): MappedInput => {
  const values = Object.entries(input).sort((a, b) => {
    return a[0].localeCompare(b[0]);
  });

  //Returns the expected array of inputs
  return {
    array: values.map(([key, value]) => ({ key, value })),
  } as MappedInput;
};

export const process = (input: MappedInput) => {
  return input.array.reduce((acc, x) => {
    acc.push.apply(acc, x.value);
    return acc;
  }, [] as any[]);
};

export const node: NodeDefinition<MappedInput> = {
  description: "Performs an array join using a string delimiter",
  type,
  mapInput,
  process,
};

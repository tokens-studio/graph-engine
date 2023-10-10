import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";

import { sortEntriesNumerically } from "../utils.js";

export const type = NodeTypes.FLATTEN;

type KeyValuePair = {
  key: string;
  value: any;
};

type Input = {
  inputs: KeyValuePair[];
};

/**
 * Pure function
 * @param input
 * @param state
 */
export const mapInput = (input) => {
  const { inputs } = sortEntriesNumerically(Object.entries(input)).reduce(
    (acc, [key, value]) => {
      if (key.startsWith("inputs")) {
        acc.inputs.push({
          key,
          value,
        });
      }
      return acc;
    },
    { inputs: [] as KeyValuePair[] }
  );

  //Returns the expected array of inputs
  return {
    inputs,
  };
};

export const process = (input) => {
  const { vals } = input.inputs
    .flatMap((x) => x.value)
    .reduceRight(
      (acc, val: SingleToken) => {
        if (acc.lookup[val.name]) {
          return acc;
        }
        //Must be the first time we've seen this key
        acc.lookup[val.name] = true;
        acc.vals.push(val);
        return acc;
      },
      {
        vals: [] as SingleToken[],
        lookup: {},
      }
    );
  return vals.reverse();
};

export const node: NodeDefinition<Input, any> = {
  description: "Flattens a set of tokens",
  type,
  mapInput,
  process,
};

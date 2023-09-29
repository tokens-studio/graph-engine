/**
 * Extracts an object from an object array by a given name key
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.SELECT_TOKEN;

export type Input = {
  object: { name: string; value: any; type?: string }[];
  key: string;
};

export type State = {
  key: string;
};

export const defaults = {
  key: "",
};

const process = (input: Input, state: State) => {
  const final = {
    ...state,
    ...input,
  };

  const foundObject = final.object.find((item) => item.name === final.key);
  return {
    token: foundObject ? foundObject.value : null,
    ...(foundObject || {}),
  };
};

const mapOutput = (input, state, output) => output;

export const node: NodeDefinition<Input, State> = {
  type,
  defaults,
  process,
  mapOutput,
};

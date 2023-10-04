import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";

export const type = NodeTypes.EXTRACT_TOKENS;

/**
 * Defines the starting state of the node
 */
export const defaults = {
  name: "",
  tokens: [],
};

export type MappedInput = {
  tokens: SingleToken[];
  name: string;
};
export const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };
  return final.tokens.filter((token) => token.name.startsWith(final.name));
};

export const node: NodeDefinition<MappedInput, any> = {
  type,
  defaults,
  process,
};

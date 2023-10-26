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

  const regex = new RegExp(`${final.name}`);

  return final.tokens.filter((token) => token.name.match(regex));
};

export const node: NodeDefinition<MappedInput, any> = {
  description: "Extracts tokens from a set of tokens",
  type,
  defaults,
  process,
};

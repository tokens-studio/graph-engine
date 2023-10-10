import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";

export const type = NodeTypes.GROUP;

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

export const mapInput = (input) => {
  return {
    tokens: input.tokens,
    name: input.name,
  };
};

export const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };
  return final.tokens.map((token) => ({
    ...token,
    name: final.name ? `${final.name}.${token.name}` : token.name,
  }));
};

export const node: NodeDefinition<MappedInput, any> = {
  description: "Groups tokens into a new namespace",
  type,
  defaults,
  process,
};

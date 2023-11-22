import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";

export const type = NodeTypes.UNGROUP;

/**
 * Defines the starting state of the node
 */
export const defaults = {
  tokens: [],
};

export type MappedInput = {
  tokens: SingleToken[];
};

export const process = (input: MappedInput, state) => {
  const final = {
    ...state,
    ...input,
  };
  return final.tokens.map((token) => {
    const parts = token.name.split(".");
    const name = parts.length > 1 ? parts.slice(1).join(".") : parts[0];
    return {
      ...token,
      name,
    };
  });
};

export const node: NodeDefinition<MappedInput, any> = {
  description: "Ungroups tokens by removing their namespace",
  type,
  defaults,
  process,
};

import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";

export const type = NodeTypes.EXTRACT_TOKENS;

/**
 * Defines the starting state of the node
 */
export const defaults = {
  name: "",
  tokens: [],
  enableRegex: false,
  omitted: false,
};

export type MappedInput = {
  tokens: SingleToken[];
  name: string;
  enableRegex: boolean;
  omitted: boolean;
};

export const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };

  const matches = final.tokens.filter((token) => {
    const nameMatch = final.enableRegex
      ? new RegExp(final.name).test(token.name)
      : token.name.startsWith(final.name);

    return final.omitted ? !nameMatch : nameMatch;
  });

  return matches;
};

export const node: NodeDefinition<MappedInput, any> = {
  description: "Extracts tokens from a set of tokens",
  type,
  defaults,
  process,
};

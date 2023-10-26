import { NodeDefinition, NodeTypes } from "../../types.js";
import { SingleToken } from "@tokens-studio/types";

export const type = NodeTypes.EXTRACT_SINGLE_TOKEN;

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
  const index = final.tokens.findIndex(
    (token) => token.name.match(regex) === final.name
  );
  const token = final.tokens[index];
  return token ? { ...token, index } : null;
};

export const node: NodeDefinition<MappedInput, any> = {
  description: "Extracts a single token and returns its values",
  type,
  defaults,
  process,
};

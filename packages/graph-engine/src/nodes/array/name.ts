/**
 * Slices an input array
 *
 * @packageDocumentation
 */

import { SingleToken } from "@tokens-studio/types";
import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.NAME;

export type NamedInput = {
  tokens: SingleToken[]
};

export const process = (input: NamedInput) => {
  return input.tokens.map((token, index) => {
    return {
      ...token,
      name: `${(index + 1) * 100}`
    };
  });
};

export const node: NodeDefinition<NamedInput> = {
  type,
  process,
};
import { NodeDefinition, NodeTypes } from "../../types.js";

import valueParser from "postcss-value-parser";
const type = NodeTypes.PASS_UNIT;

const defaults = {
  fallback: "px",
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
const process = (input, state) => {
  //Override with state if defined
  const final = {
    ...state,
    ...input,
  };

  const x = valueParser.unit("" + final.value);
  if (!x) {
    return undefined;
  }

  if (x.unit) {
    return final.value;
  }
  return `${final.value}${final.fallback || ""}`;
};

export const node: NodeDefinition = {
  description: "Adds a unit to a value if it doesn't already have one",
  type,
  defaults,
  process,
};

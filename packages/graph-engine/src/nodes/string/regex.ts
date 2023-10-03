import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.REGEX;

export const defaults = {
  match: "",
  flags: "",
  replace: "",
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input, state) => {
  const final = {
    ...state,
    ...input,
  };
  const regex = new RegExp(final.match, final.flags);
  return final.input.replace(regex, final.replace);
};

export const node: NodeDefinition = {
  description: "Replaces a string with a regex",
  type,
  defaults,
  process,
};

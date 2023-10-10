/**
 * A node that passes through the input to the output.
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.PASS_THROUGH;

export const process = (input) => {
  return input.input;
};

export const node: NodeDefinition = {
  description: "Pass through node allows you to pass the input to the output.",
  type,
  process,
};

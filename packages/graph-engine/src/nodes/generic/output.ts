/**
 * Acts as an output node for the graph. There can only be a single output node per graph.
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.OUTPUT;

const defaults = {
  mappings: [],
};

//Passthrough
const process = (input) => {
  return input;
};

const mapOutput = (input, state, processed) => {
  //convert the mappings to a lookup
  const lookup = state.mappings.reduce((acc, { key, name }) => {
    acc[key] = name;
    return acc;
  }, {});

  return Object.entries(processed).reduce((acc, [key, value]) => {
    acc[lookup[key]] = value;
    return acc;
  }, {});
};

export const node: NodeDefinition = {
  description:
    "Allows you to provide initial values for the whole graph. An input node can be used only once at the start of the graph. You can use this node to set brand decisions or any initial values.",
  type,
  defaults,
  process,
  mapOutput,
};

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
  type,
  defaults,
  process,
  mapOutput,
};

/**
 * Acts as an input nodes for the graph. There can only be a single input node per graph.
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.INPUT;

/**
 * Defines the starting state of the node
 */
const defaults = {
  //The default values for the node
  values: {},
  definition: {},
};

/**
 * Optional validation function.
 * @param inputs
 */
const validateInputs = (inputs, state) => {
  //Use the state to determine if the inputs were valid

  Object.keys(inputs).forEach((key) => {
    const definition = state.definition[key];
    if (definition === undefined) {
      throw new Error("Unknown input key: " + key);
    }
    /**
     * @deprecated this is a hack because definitions were not being enforced. This should always be an object
     */
    if (typeof definition == "object") {
      switch (definition.type) {
        case "string":
          if (typeof inputs[key] !== "string") {
            throw new Error("Expected string for input: " + key);
          }
      }
    }
  });
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
  const final = {
    ...state.values,
    ...input,
  };
  return final;
};

const mapOutput = (input, state, processed) => {
  return processed;
};

export const node: NodeDefinition = {
  type,
  defaults,
  validateInputs,
  process,
  mapOutput,
};

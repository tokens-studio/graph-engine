/**
 * Acts as an input nodes for the graph. There can only be a single input node per graph.
 *
 * @packageDocumentation
 */

import { IResolvedToken, flatten } from "#/utils/index.js";
import { NodeDefinition, NodeTypes } from "../../types.js";
import { DeepKeyTokenMap } from "@tokens-studio/types";

const type = NodeTypes.INPUT;

/**
 * Defines the starting state of the node
 */
const defaults = {
  //The default values for the node
  values: {},
  definition: {},
};

export type TokenSet = {
  name: string;
  tokens: DeepKeyTokenMap;
};

export type TypeDefinition = {
  type: "string" | "number" | "boolean" | "integer" | "tokenSet" | "json";
  enum?: string[];
  /**
   * Json schema for the type. Only used if the type is json
   */
  schema?: string;
  modifier?: boolean;
};

export type State = {
  values: Record<string, any>;
  definition: Record<string, TypeDefinition>;
};

export type Input = Record<string, any>;

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
        case "tokenSet":
          {
            if (typeof inputs[key] !== "object") {
              throw new Error("Expected object for input: " + key);
            }
            break;
          }
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
const process = (input: Input, state: State) => {
  const final = {
    ...state.values,
    ...input,
  };

  //We need to process the values
  return Object.fromEntries(
    Object.entries(final).map(([key, value]) => {
      const definition = state.definition[key];
      switch (definition.type) {
        case "tokenSet":
          console.log("flattenned 1", flatten(value.tokens || {}, []), value)
          return [key, flatten(value.tokens || {}, [])];
        default:
          return [key, value];
      }
    })
  );
};

const mapOutput = (input, state, processed) => {
  return processed;
};

export const node: NodeDefinition<Input, State> = {
  type,
  defaults,
  validateInputs,
  process,
  mapOutput,
};

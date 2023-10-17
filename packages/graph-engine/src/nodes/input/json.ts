/**
 * Provides a defined constant for the graph
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import Ajv, { DefinedError } from "ajv";

export class ValidationError extends Error {
  errors: DefinedError[] = [];
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const type = NodeTypes.JSON;

/**
 * Defines the starting state of the node
 */
export const defaults = {
  input: "",
  schema: "",
};

export type Input = {
  /**
   * The string representation of the JSON object
   */
  input: string;
  /**
   * The string representation of the JSON schema
   */
  schema: string;
};

/**
 * Core logic for the node. Will only be called if all inputs are valid.
 * Return undefined if the node is not ready to execute.
 * Execution can also be optionally delayed by returning a promise.
 * @param input
 * @param state
 * @returns
 */
export const process = (input: Input, state: Input) => {
  const final = {
    ...state,
    ...input,
  };

  let inputObject: Record<string, any>;
  let schema: Record<string, any>;

  //Attempt to parse the input
  try {
    inputObject = JSON.parse(final.input);
  } catch (e) {
    throw new ValidationError("Invalid JSON for input");
  }

  if (!final.schema) {
    return inputObject;
  }

  //Attempt to parse the schema
  try {
    schema = JSON.parse(final.schema);
  } catch (e) {
    throw new ValidationError("Invalid JSON for schema");
  }

  // @ts-ignore This is a weird error with typing
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  //Call the validation function
  validate(inputObject);

  if (validate.errors) {
    const error = new ValidationError("Validation errors");
    console.log(error);
    error.errors = validate.errors as unknown as DefinedError[];
    throw error;
  }

  return inputObject;
};

export const node: NodeDefinition<Input, Input> = {
  description: "JSON node allows you to define a JSON object.",
  type,
  defaults,
  process,
};

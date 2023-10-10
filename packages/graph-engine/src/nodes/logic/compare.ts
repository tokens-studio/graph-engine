import { NodeDefinition, NodeTypes } from "../../types.js";

export const type = NodeTypes.COMPARE;

export enum Operator {
  EQUAL = "==",
  NOT_EQUAL = "!=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN_OR_EQUAL = "<=",
}

export const defaults = {
  operator: Operator.EQUAL,
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
  switch (state.operator) {
    case Operator.EQUAL:
      return input.a === input.b;
    case Operator.NOT_EQUAL:
      return input.a !== input.b;
    case Operator.GREATER_THAN:
      return input.a > input.b;
    case Operator.LESS_THAN:
      return input.a < input.b;
    case Operator.GREATER_THAN_OR_EQUAL:
      return input.a >= input.b;
    case Operator.LESS_THAN_OR_EQUAL:
      return input.a <= input.b;
    default:
      return undefined;
  }
};

export const node: NodeDefinition = {
  description:
    "Compare node allows you to compare two values using multiple operators.",
  type,
  process,
};

/**
 * Extracts a property from an array of objects
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.DOT_PROP;

export type NamedInput = {
  array: any[];
  /**
   * The property to extract
   */
  accessor: string;
};

export const defaults = {
  accessor: "",
};

export const process = (input: NamedInput, state: NamedInput) => {
  const final = {
    ...state,
    ...input,
  };

  return final.array.map((x) => x[final.accessor]);
};

export const node: NodeDefinition<NamedInput, NamedInput> = {
  type,
  process,
};

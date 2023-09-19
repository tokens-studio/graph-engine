/**
 * Sort a given array without mutating the original
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import orderBy from "lodash.orderby";

const type = NodeTypes.SORT;

export enum OrderMap {
  ASC = "asc",
  DESC = "desc",
}

export type NamedInput = {
  array: any[];
  order?: OrderMap.ASC | OrderMap.DESC; // Optional parameter to specify the sort order
  sortBy?: string; // Optional parameter to specify the property to sort by
};

export const defaults = {
  order: OrderMap.ASC,
};

export const process = (input: NamedInput, state: NamedInput) => {
  const { array, order, sortBy } = { ...state, ...input };

  return orderBy(array, [sortBy], order);
};

export const node: NodeDefinition<NamedInput, NamedInput> = {
  type,
  defaults,
  process,
};

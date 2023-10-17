import { NodeDefinition } from "../types.js";
import { nodes as accessibility } from "./accessibility/index.js";
import { nodes as array } from "./array/index.js";
import { nodes as color } from "./color/index.js";
import { nodes as css } from "./css/index.js";
import { nodes as generic } from "./generic/index.js";
import { nodes as input } from "./input/index.js";
import { nodes as logic } from "./logic/index.js";
import { nodes as math } from "./math/index.js";
import { nodes as series } from "./series/index.js";
import { nodes as sets } from "./set/index.js";
import { nodes as string } from "./string/index.js";
import { nodes as typing } from "./typing/index.js";

/**
 * All nodes in the system available as an array
 */
export const nodes: NodeDefinition<any>[] = (
  [] as NodeDefinition<any, any, any>[]
).concat(
  accessibility,
  array,
  color,
  css,
  generic,
  input,
  logic,
  math,
  series,
  sets,
  string,
  typing
);

/**
 * Nodes as a lookup map using the node type as the key
 */
export const nodeLookup = nodes.reduce((acc, node) => {
  acc[node.type] = node;
  return acc;
}, {});

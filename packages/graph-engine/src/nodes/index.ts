import { NodeDefinition } from "../types.js";
import { accessibilityNodes } from "./accessibility/index.js";
import { arrayNodes } from "./array/index.js";
import { colorNodes } from "./color/index.js";
import { cssNodes } from "./css/index.js";
import { genericNodes } from "./generic/index.js";
import { inputNodes } from "./input/index.js";
import { logicNodes } from "./logic/index.js";
import { mathNodes } from "./math/index.js";
import { seriesNodes } from "./series/index.js";
import { setNodes } from "./set/index.js";
import { stringNodes } from "./string/index.js";
import { typingNodes } from "./typing/index.js";

/**
 * All nodes in the system available as an array
 */
export const nodes: NodeDefinition<any>[] = (
  [] as NodeDefinition<any, any, any>[]
).concat(
  accessibilityNodes,
  arrayNodes,
  colorNodes,
  cssNodes,
  genericNodes,
  inputNodes,
  logicNodes,
  mathNodes,
  seriesNodes,
  setNodes,
  stringNodes,
  typingNodes
);

/**
 * Nodes as a lookup map using the node type as the key
 */
export const nodeLookup = nodes.reduce((acc, node) => {
  acc[node.type] = node;
  return acc;
}, {});

export * as allNodes from "./allNodes.js";

import { node as flattenNode } from "./flatten.js";
import { node as inlineTokensNode } from "./inlineTokens.js";
import { node as externalTokensNode } from "./externalTokens.js";
import { node as invertNode } from "./invert.js";
import { node as remapNode } from "./remap.js";
import { node as resolveNode } from "./resolve.js";
import { node as groupNode } from "./group.js";
import { node as ungroupNode } from "./ungroup.js";
import { node as extractTokensNode } from "./extractTokens.js";
import { node as extractSingleTokenNode } from "./extractSingleToken.js";

export const setNodes = [
  flattenNode,
  remapNode,
  resolveNode,
  inlineTokensNode,
  invertNode,
  externalTokensNode,
  groupNode,
  ungroupNode,
  extractTokensNode,
  extractSingleTokenNode,
];

export {
  flattenNode,
  remapNode,
  resolveNode,
  inlineTokensNode,
  invertNode,
  externalTokensNode,
  groupNode,
  ungroupNode,
  extractTokensNode,
  extractSingleTokenNode,
};

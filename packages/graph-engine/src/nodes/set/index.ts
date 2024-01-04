import flatten from "./flatten.js";
import inlineTokens from "./inlineTokens.js";
import externalTokens from "./externalTokens.js";
import invert from "./invert.js";
// import { node as remap } from "./remap.js";
import resolve from "./resolve.js";
import group from "./group.js";
import ungroup from "./ungroup.js";
// import { node as extractTokens } from "./extractTokens.js";
// import { node as extractSingleToken } from "./extractSingleToken.js";

export const nodes = [
  flatten,
  inlineTokens,
  group,
  ungroup,
  resolve,
  externalTokens,
  // remap,

  invert,

  // extractTokens,
  // extractSingleToken,
];

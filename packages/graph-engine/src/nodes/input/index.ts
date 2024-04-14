import { node as constantNode } from "./constant.js";
import { node as enumeratedConstantNode } from "./enumeratedConstant.js";
import { node as objectifyNode } from "./objectify.js";
import { node as sliderNode } from "./slider.js";
import { node as spreadNode } from "./spread.js";
import { node as jsonNode } from "./json.js";

export const inputNodes = [
  constantNode,
  enumeratedConstantNode,
  objectifyNode,
  sliderNode,
  spreadNode,
  jsonNode,
];

export {
  constantNode,
  enumeratedConstantNode,
  objectifyNode,
  sliderNode,
  spreadNode,
  jsonNode,
};

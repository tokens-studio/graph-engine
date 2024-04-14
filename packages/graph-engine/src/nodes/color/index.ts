import { node as advancedBlendNode } from "./advancedBlend.js";
import { node as blendNode } from "./blend.js";
import { node as contrastingNode } from "./contrasting.js";
import { node as contrastingFromSetNode } from "./contrastingFromSet.js";
import { node as convertNode } from "./convert.js";
import { node as createNode } from "./create.js";
import { node as distanceNode } from "./distance.js";
import { node as extractNode } from "./extract.js";
import { node as polineNode } from "./poline.js";
import { node as scaleNode } from "./scale.js";
import { node as wheelNode } from "./wheel.js";
import { node as nameNode } from "./name.js";
import { node as nearestNode } from "./nearest.js";
import { node as setColorValueNode } from "./set-color-value.js";

export const colorNodes = [
  advancedBlendNode,
  blendNode,
  contrastingNode,
  contrastingFromSetNode,
  convertNode,
  createNode,
  distanceNode,
  extractNode,
  polineNode,
  scaleNode,
  wheelNode,
  nameNode,
  nearestNode,
  setColorValueNode,
];

export {
  advancedBlendNode,
  blendNode,
  contrastingNode,
  contrastingFromSetNode,
  convertNode,
  createNode,
  distanceNode,
  extractNode,
  polineNode,
  scaleNode,
  wheelNode,
  nameNode as colorNameNode,
  nearestNode,
  setColorValueNode,
};

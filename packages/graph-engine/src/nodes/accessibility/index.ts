import { node as colorBlindnessNode } from "./colorBlindness.js";
import { node as contrastNode } from "./contrast.js";
import { node as baseFontSizeNode } from "./baseFontSize.js";

export const accessibilityNodes = [
  contrastNode,
  colorBlindnessNode,
  baseFontSizeNode,
];

export { colorBlindnessNode, contrastNode, baseFontSizeNode };

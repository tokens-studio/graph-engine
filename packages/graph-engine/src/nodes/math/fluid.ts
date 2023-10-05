// node
/**
 * Calculates the fluid value for responsive font size
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.FLUID_VALUE;

type Inputs = {
  minSize: number;
  maxSize: number;
  minViewport: number;
  maxViewport: number;
  viewport: number;
};

const process = (input: Inputs, state) => {
  const { minSize, maxSize, minViewport, maxViewport, viewport } = input;

  const fontV = (100 * (maxSize - minSize)) / (maxViewport - minViewport);
  const fontR =
    (minViewport * maxSize - maxViewport * minSize) /
    (minViewport - maxViewport);
  const fluid = (viewport / 100) * fontV + fontR;
  const clamped = Math.min(maxSize, Math.max(minSize, fluid));

  return clamped;
};

export const node: NodeDefinition<Inputs> = {
  type,
  process,
};

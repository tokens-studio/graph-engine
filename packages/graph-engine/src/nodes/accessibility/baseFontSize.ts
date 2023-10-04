// node
/**
 * Calculates the base font size
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";

const type = NodeTypes.BASE_FONT_SIZE;

type Inputs = {
  visualAcuity: number;
  lightingCondition: number;
  distance: number;
  xHeightRatio: number;
  ppi: number;
  pixelDensity: number;
  correctionFactor: number;
};

const defaults = {
  correctionFactor: 13,
  visualAcuity: 0.7,
  lightingCondition: 0.85,
  distance: 30,
  xHeightRatio: 0.53,
  ppi: 458,
  pixelDensity: 3,
};

const process = (input: Inputs, state) => {
  const {
    visualAcuity,
    lightingCondition,
    distance,
    xHeightRatio,
    ppi,
    pixelDensity,
    correctionFactor,
  } = input;

  const visualCorrection =
    correctionFactor * (lightingCondition / visualAcuity);
  const xHeightMM =
    Math.tan((visualCorrection * Math.PI) / 21600) * (distance * 10) * 2;
  const xHeightPX = (xHeightMM / 25.4) * (ppi / pixelDensity);
  const fontSizePT = (2.83465 * xHeightMM * 1) / xHeightRatio;
  const fontSizePX = (1 * xHeightPX) / xHeightRatio;

  return { fontSizePX, fontSizePT };
};

export const mapOutput = (input, state, processed) => {
  return processed;
};

export const node: NodeDefinition<Inputs> = {
  description: "Calculates the base font size",
  type,
  defaults,
  process,
  mapOutput,
};

/**
 * Calculates the base font size
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes, Type } from "../../types.js";

type Inputs = {
  visualAcuity: number;
  lightingCondition: number;
  distance: number;
  xHeightRatio: number;
  ppi: number;
  pixelDensity: number;
  correctionFactor: number;
};

const process = (input: Inputs) => {
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
  // const fontSizePT = (2.83465 * xHeightMM * 1) / xHeightRatio;
  const fontSizePX = (1 * xHeightPX) / xHeightRatio;

  return {
    output: fontSizePX,
  };
};

export const node: NodeDefinition<Inputs> = {

  inputs: [{
    name: "visualAcuity",
    type: Type.NUMBER,
    default: 0.7,
  }, {
    name: "correctionFactor",
    type: Type.NUMBER,
    default: 13,
  }, {
    name: "lightingCondition",
    type: Type.NUMBER,
    default: 0.83,
  }, {
    name: "distance",
    type: Type.NUMBER,
    default: 30,
  }, {
    name: "xHeightRatio",
    type: Type.NUMBER,
    default: 0.53,
  }, {
    name: "ppi",
    type: Type.NUMBER,
    default: 458,
  }, {
    name: "pixelDensity",
    type: Type.NUMBER,
    default: 3,
  }
  ],
  outputs: [{
    name: "output",
    type: Type.NUMBER,
    description: "Font Size",
  }],
  description: "Base Font node allows you to calculate the base font size with DIN 1450.",
  type: NodeTypes.BASE_FONT_SIZE,
  process,
};


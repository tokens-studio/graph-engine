/**
 * Converts provided colors to the colors as perceived by the specified color blindness type.
 *
 * @packageDocumentation
 */

import { NodeDefinition, NodeTypes } from "../../types.js";
import blinder from "color-blind";
import chroma from "chroma-js";

const type = NodeTypes.COLOR_BLINDNESS;

export enum ColorBlindnessTypes {
  TRITANOPIA = "tritanopia",
  TRITANOMALY = "tritanomaly",
  DEUTERANOPIA = "deuteranopia",
  DEUTERANOMALY = "deuteranomaly",
  PROTANOPIA = "protanopia",
  PROTANOMALY = "protanomaly",
  ACHROMATOPSIA = "achromatopsia",
  ACHROMATOMALY = "achromatomaly",
}

type Inputs = {
  color: string;
};

const defaults = {
  type: ColorBlindnessTypes.PROTANOPIA,
};

type STATE = {
  type: ColorBlindnessTypes;
};

const process = (input: Inputs, state: STATE) => {
  const color = chroma(input.color).hex();

  let processed = color;

  switch (state.type) {
    case ColorBlindnessTypes.TRITANOPIA:
      processed = blinder.tritanopia(color);
      break;
    case ColorBlindnessTypes.TRITANOMALY:
      processed = blinder.tritanomaly(color);
      break;
    case ColorBlindnessTypes.DEUTERANOPIA:
      processed = blinder.deuteranopia(color);
      break;
    case ColorBlindnessTypes.DEUTERANOMALY:
      processed = blinder.deuteranomaly(color);
      break;

    case ColorBlindnessTypes.PROTANOMALY:
      processed = blinder.protanomaly(color);
      break;
    case ColorBlindnessTypes.ACHROMATOPSIA:
      processed = blinder.achromatopsia(color);
      break;
    case ColorBlindnessTypes.ACHROMATOMALY:
      processed = blinder.achromatomaly(color);
      break;
    default:
      processed = blinder.protanopia(color);
      break;
  }

  return processed;
};

export const node: NodeDefinition<Inputs, STATE> = {
  defaults,
  type,
  process,
};

/**
 * Converts provided colors to the colors as perceived by the specified color blindness type.
 *
 * @packageDocumentation
 */

import blinder from "color-blind";
import chroma from "chroma-js";
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { NumberSchema, ColorSchema } from "@/schemas/index.js";

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

export class NodeDefinition extends Node {
  title = "Color Blindness";
  type = NodeTypes.COLOR_BLINDNESS;
  description = "Converts provided colors to the colors as perceived by the specified color blindness type.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("type", {
      type: {
        $id: "https://schemas.tokens.studio/colorBlindness/type.json",
        title: "Color Blindness Type",
        enum: Object.values(ColorBlindnessTypes),
        type: "string",
        default: ColorBlindnessTypes.PROTANOPIA
      }
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const {type , color} = this.getAllInputs();

    const col = chroma(color).hex();

    let processed = col;

    switch (type) {
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

    this.setOutput("value", processed);
  }
}
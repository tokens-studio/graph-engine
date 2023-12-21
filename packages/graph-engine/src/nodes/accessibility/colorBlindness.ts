/**
 * Converts provided colors to the colors as perceived by the specified color blindness type.
 *
 * @packageDocumentation
 */

import blinder from "color-blind";
import chroma from "chroma-js";
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema, ColorSchema, StringSchema } from "@/schemas/index.js";

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

export default class NodeDefinition extends Node {
  static title = "Color Blindness";
  static type = NodeTypes.COLOR_BLINDNESS;
  static description =
    "Converts provided colors to the colors as perceived by the specified color blindness type.";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("type", {
      type: {
        ...StringSchema,
        title: "Color Blindness Type",
        enum: Object.values(ColorBlindnessTypes),
        default: ColorBlindnessTypes.PROTANOPIA,
      },
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { type, color } = this.getAllInputs();

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

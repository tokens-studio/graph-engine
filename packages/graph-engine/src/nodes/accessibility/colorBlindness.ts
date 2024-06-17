

import { ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import blinder from "color-blind";
import chroma from "chroma-js";

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

/**
 * Converts provided colors to the colors as perceived by the specified color blindness type.
 */
export default class NodeDefinition extends Node {
  static title = "Color Blindness";
  static type = 'studio.tokens.accessibility.colorBlindness';
  static description =
    "Converts provided colors to the colors as perceived by the specified color blindness type.";

  declare inputs: ToInput<{
    color: string;
    type: ColorBlindnessTypes;
  }>

  declare outputs: ToOutput<{
    /**
     * The calculated color contrast based on the input color and the specified color blindness type.
     */
    value: string;
  }>;


  constructor(props: INodeDefinition) {
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

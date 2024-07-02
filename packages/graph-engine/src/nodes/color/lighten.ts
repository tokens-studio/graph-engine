import { Black, toColor, toColorObject } from "./lib/utils.js";
import {
  ColorSchema,
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";
import { ColorSpace, colorSpaces } from "./lib/types.js"
import { Color as ColorType } from "../../types.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import Color from "colorjs.io";
export { ColorModifierTypes } from "@tokens-studio/types";

export default class NodeDefinition extends Node {
  static title = "Lighten Color";
  static type = "studio.tokens.color.lighten";
  static description = "Lightens a color by a specified value";

  declare inputs: ToInput<{
    color: ColorType;
    value: number;
    space: ColorSpace;
  }>;

  declare outputs: ToOutput<{
    value: ColorType
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: { 
        ...ColorSchema,
        default: Black
      },
    });
    this.addInput("value", {
      type: {
        ...NumberSchema,
        default: 0.5,
        description: "Value to apply to the modifier",
      },
    });

    this.addOutput("value", {
      type: ColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const { value, color } = this.getAllInputs();
    
    const sourceColor = toColor(color);
    const lightness = sourceColor.oklch.l;

    const newLightness = lightness + (1 - lightness) * value;
    sourceColor.oklch.l = newLightness;
    const final = toColorObject(sourceColor);

    this.setOutput("value", final);
  }
}

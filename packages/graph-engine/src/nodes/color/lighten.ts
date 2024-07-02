import {
  ColorModifier,
  ColorSpaceTypes,
} from "@tokens-studio/types";
import {
  ColorSchema,
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";
import { Color as ColorType } from "../../types.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { convertModifiedColorToHex } from "./lib/modifyColor.js";

export { ColorModifierTypes } from "@tokens-studio/types";


export default class NodeDefinition extends Node {
  static title = "Lighten Color";
  static type = "studio.tokens.color.lighten";
  static description = "Lightens a color by a specified amount.\n\nInputs: Base Color, Lighten Amount, Color Space\nOutput: Lightened color\n\nUse this node to create lighter variations of a color. Adjust the amount to control the intensity of lightening. Useful for generating hover states, creating hierarchical color schemes, or adjusting colors for different lighting contexts in your designs.";

  declare inputs: ToInput<{
    color: ColorType;
    value: number;
    space: ColorSpaceTypes;
  }>;

  declare outputs: ToOutput<{
    value: ColorType
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: { 
        ...ColorSchema,
        default: "#000000"
      },
    });
    this.addInput("value", {
      type: {
        ...NumberSchema,
        default: 0.5,
        description: "Value to apply to the modifier",
      },
    });
    this.addInput("space", {
      type: {
        ...StringSchema,
        default: "srgb",
        enum: Object.keys(ColorSpaceTypes),
        description: "The color space we are operating in",
      },
    });

    this.addOutput("value", {
      type: ColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const { space, value, color } = this.getAllInputs();

    const converted = convertModifiedColorToHex(color, {
      type: "lighten",
      space,
      value,
    } as ColorModifier);
    this.setOutput("value", converted);
  }
}

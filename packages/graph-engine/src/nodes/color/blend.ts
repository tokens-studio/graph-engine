import {
  ColorModifier,
  ColorModifierTypes,
  ColorSpaceTypes,
} from "@tokens-studio/types";
import {
  ColorSchema,
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";
import { INodeDefinition} from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { convertModifiedColorToHex } from "./lib/modifyColor.js";
export { ColorModifierTypes } from "@tokens-studio/types";

export default class NodeDefinition extends Node {
  static title = "Blend Colors";
  static type = "studio.tokens.color.blend";
  static description = "Blends a color";



  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: { 
        ...ColorSchema,
        default: "#ffffff"
      },
    });
    this.addInput("value", {
      type: {
        ...NumberSchema,
        default: 0.5,
        description: "Value to apply to the modifier",
      },
    });
    this.addInput("modifierType", {
      type: {
        ...StringSchema,
        default: ColorModifierTypes.DARKEN,
        enum: Object.values(ColorModifierTypes),
        description: "The color space we are operating in",
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
    const { modifierType, space, value, color } = this.getAllInputs();

    const converted = convertModifiedColorToHex(color, {
      type: modifierType,
      space,
      value,
    } as ColorModifier);
    this.setOutput("value", converted);
  }
}

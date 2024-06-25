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
import { Color as ColorType } from "../../types.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { modifyColor } from "./lib/modifyColor.js";
import Color from "colorjs.io";

export { ColorModifierTypes } from "@tokens-studio/types";

function convertModifiedColorToHex(baseColor: string, modifier: ColorModifier) {
  let returnedColor = baseColor;
  returnedColor = modifyColor(baseColor, modifier);
  const returnedColorInSpace = new Color(returnedColor);
  return returnedColorInSpace.to("srgb").toString({ format: "hex" });
}

export default class NodeDefinition extends Node {
  static title = "Blend Colors";
  static type = "studio.tokens.color.blend";
  static description = "Blends two colors together based on a specified modifier. The output is a hex color string. The modifier can be used to lighten, darken, saturate, desaturate, or mix the two colors together.";

  declare inputs: ToInput<{
    color: ColorType;
    mixColor: ColorType;
    value: number;
    space: ColorSpaceTypes;
    modifierType: ColorModifierTypes;
  }>;

  declare outputs: ToOutput<{
    value: ColorType
  }>;



  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("mixColor", {
      type: {
        ...ColorSchema,
        description: "Mixing color",
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
    this.addInput("modifierType", {
      type: {
        ...StringSchema,
        default: ColorModifierTypes.DARKEN,
        enum: Object.values(ColorModifierTypes),
        description: "The color space we are operating in",
      },
    });

    this.addOutput("value", {
      type: ColorSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { modifierType, mixColor, space, value, color } = this.getAllInputs();

    const converted = convertModifiedColorToHex(color, {
      type: modifierType,
      color: mixColor,
      space,
      value,
    } as ColorModifier);
    this.setOutput("value", converted);
  }
}

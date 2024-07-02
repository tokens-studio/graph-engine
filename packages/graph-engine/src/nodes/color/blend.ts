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
import { White, toColor, toColorObject } from "./lib/utils.js";
import { convertModifiedColorToHex } from "./lib/modifyColor.js";

export { ColorModifierTypes } from "@tokens-studio/types";

export default class NodeDefinition extends Node {
  static title = "Blend Colors";
  static type = "studio.tokens.color.blend";
  static description = "Blends two colors together based on a specified modifier. The output is a hex color string. The modifier can be used to lighten, darken, saturate, desaturate, or mix the two colors together.";

  declare inputs: ToInput<{
    color: ColorType;
    value: number;
    modifierType: ColorModifierTypes;
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
        default: White
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

    const col = toColor(color);
    const converted = convertModifiedColorToHex(col, {
      type: modifierType,
      space,
      value,
    } as ColorModifier);
    this.setOutput("value", toColorObject(converted));
  }
}

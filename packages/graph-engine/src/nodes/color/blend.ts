import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import Color from "colorjs.io";
import {
  ColorModifier,
  ColorModifierTypes,
  ColorSpaceTypes,
} from "@tokens-studio/types";
import {
  AnySchema,
  ColorSchema,
  NumberSchema,
  StringSchema,
} from "@/schemas/index.js";
import { modifyColor } from "./lib/modifyColor.js";

export { ColorModifierTypes } from "@tokens-studio/types";

function convertModifiedColorToHex(baseColor: string, modifier: ColorModifier) {
  let returnedColor = baseColor;
  returnedColor = modifyColor(baseColor, modifier);
  const returnedColorInSpace = new Color(returnedColor);
  return returnedColorInSpace.to("srgb").toString({ format: "hex" });
}

export default class NodeDefinition extends Node {
  static title = "Blend Colors";
  static type = NodeTypes.BLEND;
  static description = "Blends two colors together";
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

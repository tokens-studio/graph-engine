import {
  ColorModifier,
  ColorSpaceTypes,
} from "@tokens-studio/types";
import {
  ColorSchema,
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { convertModifiedColorToHex } from "./lib/modifyColor.js";

export { ColorModifierTypes } from "@tokens-studio/types";


export default class NodeDefinition extends Node {
  static title = "Lighten Color";
  static type = "studio.tokens.color.lighten";
  static description = "Lightens a color by a specified value";

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: { 
        ...ColorSchema,
        default: "#000000"
      },
      visible: true,
    });
    this.addInput("value", {
      type: {
        ...NumberSchema,
        default: 0.5,
        description: "Value to apply to the modifier",
      },
      visible: true,
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
      visible: true,
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

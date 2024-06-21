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
  static title = "Mix Colors";
  static type = "studio.tokens.color.mix";
  static description = "Mixes two colors together";


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("colorA", {
      type: { 
        ...ColorSchema,
        default: "#ffffff"
      },
      visible: true,
    });
    this.addInput("colorB", {
      type: {
        ...ColorSchema,
        default: "#000000",
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
    const { colorA, space, value, colorB } = this.getAllInputs();

    const converted = convertModifiedColorToHex(colorA, {
      type: "mix",
      color: colorB,
      space,
      value,
    } as ColorModifier);

    this.setOutput("value", converted);
  }
}

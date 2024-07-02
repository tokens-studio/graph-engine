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
import { toColor, toColorObject } from "./lib/utils.js";

export { ColorModifierTypes } from "@tokens-studio/types";


export default class NodeDefinition extends Node {
  static title = "Lighten Color";
  static type = "studio.tokens.color.lighten";
  static description = "Lightens a color by a specified value";

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

    const col = toColor(color)

    const converted = convertModifiedColorToHex(col, {
      type: "lighten",
      space,
      value,
    } as ColorModifier);

    const final = toColorObject(converted);


    this.setOutput("value", final);
  }
}

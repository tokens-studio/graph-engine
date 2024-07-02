import { Black, White, toColor, toColorObject } from "./lib/utils.js";
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
  static title = "Mix Colors";
  static type = "studio.tokens.color.mix";
  static description = "Mixes two colors together";

  declare inputs: ToInput<{
    colorA: ColorType;
    colorB: ColorType;
    value: number;
    space: ColorSpaceTypes;
  }>;

  declare outputs: ToOutput<{
    value: ColorType
  }>;


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("colorA", {
      type: {
        ...ColorSchema,
        default: White
      },
    });
    this.addInput("colorB", {
      type: {
        ...ColorSchema,
        default: Black,
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
    const { colorA, space, value, colorB } = this.getAllInputs();


    const colA = toColor(colorA);
    const colB = toColor(colorB)


    const converted = convertModifiedColorToHex(colA, {
      type: "mix",
      color: colB,
      space,
      value,
    } as ColorModifier);

    const final = toColorObject(converted);
    this.setOutput("value", final);
  }
}

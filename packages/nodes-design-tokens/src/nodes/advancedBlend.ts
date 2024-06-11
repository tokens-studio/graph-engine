import { StringSchema, Node, createVariadicSchema, ColorSchema, INodeDefinition } from "@tokens-studio/graph-engine";
import type { Color as ColorType, ToInput, ToOutput } from "@tokens-studio/graph-engine";
import { Color, blend, converter, formatHex } from "culori";
import { NonEmptyArray } from "culori/src/common.js";


export enum BlendTypes {
  NORMAL = "normal",
  MULTIPLY = "multiply",
  SCREEN = "screen",
  HARD_LIGHT = "hard-light",
  OVERLAY = "overlay",
  DARKEN = "darken",
  LIGHTEN = "lighten",
  COLOR_DODGE = "color-dodge",
  COLOR_BURN = "color-burn",
  SOFT_LIGHT = "soft-light",
  DIFFERENCE = "difference",
  EXCLUSION = "exclusion",
}



export default class NodeDefinition extends Node {
  static title = "Advanced Blend";
  static type = 'studio.tokens.design.advancedBlend';
  static description = "Advanced color blending";
  declare inputs: ToInput<{
    colors: ColorType[];
    blendType: BlendTypes;
  }>;
  declare outputs: ToOutput<{
    color: ColorType;
  }>;
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("blendType", {
      type: {
        ...StringSchema,
        default: BlendTypes.NORMAL,
        enum: Object.values(BlendTypes),
      },
      visible: true,
    });
    this.addInput("colors", {
      type: {
        ...createVariadicSchema(ColorSchema),
        default: [],
      },
      variadic: true,
      visible: true,
    });

    this.addOutput("color", {
      type: ColorSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { colors, blendType } = this.getAllInputs();
    const rgb = converter("rgb");

    const cols = colors.map((x) => rgb(x)) as NonEmptyArray<Color>;

    if (cols.length < 2) {
      throw new Error("At least two colors are required");
    }

    const blended = blend(cols, blendType);

    this.setOutput("color", formatHex(blended));
  }
}

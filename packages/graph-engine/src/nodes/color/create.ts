import { Color } from "../../types.js";
import { ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
export { ColorModifierTypes } from "@tokens-studio/types";

export const colorSpaces = [
  // RGB
  "srgb",

  

  //HSL
  "hsl",
  "hsv",
  "hwb",
  //LAB
  "lab",
  "lch",
  //Luv
  "luv",
  "lchuv",
  //OkLab
  "oklab",
  "oklch",
  "okhsv",
  //P3
  "p3",
  "p3-linear",

  //Rec
  "rec2020",
  "rec2020-linear",
  "rec2100hlg",
  "rec2100pq",

  //Prophoto
  "prophoto", 
  "prophoto-linear",

  //XYZ
  "xyz",
  "xyz-d50",
  "xyz-d65",
  "xyz-abs-d65",

  //Old
  "a98rgb",

  //exotic
  "ictcp",
  "jzazbz",
  "jzczhz"


] as const;

export type ColorSpace = typeof colorSpaces[number];

export default class NodeDefinition extends Node {
  static title = "Create Color";
  static type = "studio.tokens.color.create";
  static description = "Creates a color in a given color space with the specified channel values (using the ports a, b, c, etc) and returns it as a hex color string";

  declare inputs: ToInput<{
    /**
     * The color space to create the color in
     */
    space: ColorSpace;
    /**
     * The first channel value
     */
    a: number;
    /**
     * The second channel value
     */
    b: number;
    /**
     * The third channel value
     */
    c: number;
    /**
     * The fourth channel value
     */
    d?: number;
  }>;

  declare outputs: ToOutput<{
    value: Color;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("space", {
      type: {
        ...StringSchema,
        enum: colorSpaces,
        default: "srgb",
      },
    });
    this.addInput("a", {
      type: {
        ...NumberSchema,
        default: "0",
      },
    });
    this.addInput("b", {
      type: {
        ...NumberSchema,
        default: "0",
      },
    });
    this.addInput("c", {
      type: {
        ...NumberSchema,
        default: "0",
      },
    });

    //No default on alpha as this might result in Hex8 colors which are not always desired
    this.addInput("d", {
      type: {
        ...NumberSchema
      },
    });

    this.addOutput("value", {
      type: ColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const { a, b, c, d, space } = this.getAllInputs();


    const color = {
      space,
      channels: [a, b, c],
      alpha: d
    } as Color
    this.setOutput("value", color);
  }
}

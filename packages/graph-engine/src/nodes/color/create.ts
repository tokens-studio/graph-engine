import { Color } from "../../types.js";
import { ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { Color as CuloriColor, formatHex8, getMode } from "culori";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
export { ColorModifierTypes } from "@tokens-studio/types";

export const colorSpaces = [
  // RGB
  "rgb",
  "lrgb",
  "p3",
  "prophoto",
  "rec2020",
  "a98",
  //HSL
  "hsl",
  "hsv",
  "hsi",
  "hwb",
  //LAB
  "lab",
  "lch",
  "lab65",
  "lch65",
  //Luv
  "luv",
  "lchuv",
  //Din99"
  "dlab",
  "dlch",
  //OkLab
  "oklab",
  "oklch",
  "okhsl",
  "okhsv",
  //jab
  "jab",
  "jch",
  //Yiq
  "yiq",
  //XYZ
  "xyz50",
  "xyz65",
  //XyB
  "xyb",
  //ITP
  'itp',

  //Cubehelix
  "cubehelix"
] as const;

export type ColorSpace = typeof colorSpaces[number];

export default class NodeDefinition extends Node {
  static title = "Create Color";
  static type = "studio.tokens.color.create";
  static description = "Generates a color from individual channel values in a specified color space.\n\nInputs: Color Space, Channel values (e.g., R, G, B or H, S, L)\nOutput: Resulting color\n\nUse this node to precisely construct colors by defining their components. Choose from various color spaces like RGB, HSL, LAB, etc. Useful for programmatically generating colors, converting between color spaces, or creating colors based on specific color theory principles."
;

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
        default: "rgb",
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
    this.addInput("d", {
      type: {
        ...NumberSchema,
        default: "1",
      },
    });

    this.addOutput("value", {
      type: ColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const { a, b, c, d, space } = this.getAllInputs();

    const mode = getMode(space);
    const channels = [a, b, c, d];

    const colorObj = {
      mode: mode.mode,
    } as unknown as CuloriColor;

    mode.channels.forEach((channel, index) => {
      //@ts-ignore
      colorObj[channel] = channels[index];
    });

    const converted = formatHex8(colorObj);
    this.setOutput("value", converted);
  }
}

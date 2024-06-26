import { Color } from "../../types.js";
import {
  ColorSchema,
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";
import { Hsl, Lab, Rgb, Xyz65, converter } from "culori";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { arrayOf } from "../../schemas/utils.js";

export const colorSpaces = [
  "rgb",
  "hsl",
  "lab",
  "oklab",

  //RGB like
  "gl",
  "a98",
  "p3",
  "prophoto",
  "rec2020",

  //LAB like
  "dlab",
  "lab65",

  //XYZ
  "xyz65",

  //HSL like
  "okhsl",
  "cubehelix",
] as const;
export type ColorSpace = typeof colorSpaces[number];

export default class NodeDefinition extends Node {
  static title = "Convert Color";
  static type = "studio.tokens.color.convert";
  static description =
"Transforms a color from one color space to another.\n\nInputs: Color, Target Color Space\nOutputs: Converted color, Individual channel values\n\nUse this node to change the representation of a color. Convert between spaces like RGB, HSL, LAB, etc. Outputs both the full color and its individual components. Useful for color analysis, applying color-space-specific operations, or ensuring color consistency across different contexts.";
  declare inputs: ToInput<{
    color: Color;
    space: ColorSpace;
  }>;

  declare outputs: ToOutput<{
    /**
     * The first channel of the color
     */
    a: number;
    /**
    * The second channel of the color
    */
    b: number;
    /**
     * The third channel of the color
     */
    c: number;
    /**
     * The fourth channel of the color. This is optional and only present in some color spaces
     */
    d?: number;
    /**
     * The channels of the color as an array of numbers
     */
    channels: (number | undefined)[];
    labels: string[];
  }>;


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: ColorSchema,
    });
    this.addInput("space", {
      type: {
        ...StringSchema,
        enum: colorSpaces,
      },
    });
    this.addOutput("a", {
      type: NumberSchema,
    });
    this.addOutput("b", {
      type: NumberSchema,
    });
    this.addOutput("c", {
      type: NumberSchema,
    });
    this.addOutput("d", {
      type: NumberSchema
    });
    this.addOutput("channels", {
      type: arrayOf(NumberSchema)
    });
    this.addOutput("labels", {
      type: arrayOf(StringSchema),
    });
  }

  execute(): void | Promise<void> {
    let { color, space } = this.getAllInputs();

    if (!colorSpaces.includes(space)) {
      throw new Error("Invalid color space " + space);
    }

    if (space === "gl") {
      //No supported gl variant of rgb in color, so we convert to rgb
      space = "rgb";
    }

    const convert = converter(space);

    const output = convert(color);
    let final: {
      a?: number;
      b: number;
      c: number;
      d?: number;
      channels: (number | undefined)[];
      labels: string[];
    };

    switch (space) {
      case "a98":
      case "p3":
      case "prophoto":
      case "rec2020":
      case "gl":
      case "rgb":
        {
          const col: Rgb = output as unknown as Rgb;

          //Culori doesn't support gl, but it does output normalized rgb values so we denormalize them
          if (space === "rgb") {
            col.r *= 255;
            col.g *= 255;
            col.b *= 255;
          }
          final = {
            a: col.r,
            b: col.g,
            c: col.b,
            d: col.alpha,
            channels: [col.r, col.g, col.b, col.alpha],
            labels: ["r", "g", "b", "alpha"],
          };
        }
        break;
      case "cubehelix":
      case "hsl":
      case "okhsl":
        {
          const col: Hsl = output as unknown as Hsl;
          final = {
            a: col.h,
            b: col.s,
            c: col.l,
            d: col.alpha,
            channels: [col.h, col.s, col.l, col.alpha],
            labels: ["h", "s", "l", "alpha"],
          };
        }
        break;

      case "oklab":
      case "lab65":
      case "dlab":
      case "lab":
        {
          const col: Lab = output as unknown as Lab;
          final = {
            a: col.l,
            b: col.a,
            c: col.b,
            d: col.alpha,
            channels: [col.l, col.a, col.b, col.alpha],
            labels: ["l", "a", "b", "alpha"],
          };
        }
        break;
      case "xyz65":
        {
          const col: Xyz65 = output as unknown as Xyz65;
          final = {
            a: col.x,
            b: col.y,
            c: col.z,
            d: col.alpha,
            channels: [col.x, col.y, col.z, col.alpha],
            labels: ["x", "y", "z", "alpha"],
          };
        }
        break;
      default:
        throw new Error("Invalid color space");
    }

    this.setOutput("a", final.a);
    this.setOutput("b", final.b);
    this.setOutput("c", final.c);
    this.setOutput("d", final.d);
    this.setOutput("channels", final.channels);
    this.setOutput("labels", final.labels);
  }
}

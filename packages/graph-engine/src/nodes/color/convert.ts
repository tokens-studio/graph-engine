import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Color, NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { Rgb, Lab, Hsl, converter } from "culori";
import {
  ColorSchema,
  NumberArraySchema,
  NumberSchema,
  StringArraySchema,
  StringSchema,
} from "../../schemas/index.js";

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

  //HSL like
  "okhsl",
  "cubehelix",
] as const;
export type ColorSpace = typeof colorSpaces[number];

export default class NodeDefinition extends Node {
  static title = "Convert Color";
  static type = NodeTypes.CONVERT_COLOR;
  static description =
    "Converts a color from one color space to another and exposes the channels as outputs";

  declare inputs: ToInput<{
    color: Color;
    space: ColorSpace;
  }>;

  declare outputs: ToOutput<{
    a: number;
    b: number;
    c: number;
    d?: number;
    channels: (number | undefined)[];
    labels: string[];
  }>;


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("space", {
      type: {
        ...StringSchema,
        enum: colorSpaces,
      },
      visible: true,
    });
    this.addOutput("a", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("b", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("c", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("d", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("channels", {
      type: NumberArraySchema,
      visible: true,
    });
    this.addOutput("labels", {
      type: StringArraySchema,
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

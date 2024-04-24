import { INodeDefinition, ToInput, ToOutput } from "@/index.js";
import { Color, NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { ColorSchema, NumberSchema, StringSchema } from "@/schemas/index.js";
import { getMode, formatHex8,  Color as CuloriColor } from "culori";
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
];

export default class NodeDefinition extends Node {
  static title = "Create Color";
  static type = NodeTypes.CREATE_COLOR;
  static description = "Creates a color";

  declare inputs: ToInput<{
    space: typeof colorSpaces;
    a: number;
    b: number;
    c: number;
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
      type: NumberSchema,
      visible: true,
    });
    this.addInput("b", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("c", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("d", {
      type: NumberSchema,
      visible: true,
    });

    this.addOutput("value", {
      type: ColorSchema,
      visible: true,
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

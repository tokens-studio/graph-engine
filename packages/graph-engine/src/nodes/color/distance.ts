
import { ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { Color as ColorType } from "../../types.js";
import { INodeDefinition, ToInput, ToOutput} from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { setToPrecision } from "../../utils/precision.js";
import Color from "colorjs.io";

export const colorSpaces = [
  "Lab",
  "ICtCp",
  "Jzazbz",
] as const;

export type ColorSpace = typeof colorSpaces[number];

export default class NodeDefinition extends Node {
  static title = "Distance";
  static type = "studio.tokens.color.distance";
  static description =
    "Calculates the perceptual distance between two colors.\n\nInputs: Color A, Color B, Color Space, Precision\nOutput: Distance value\n\nUse this node to quantify how different two colors appear. Choose from various color spaces for different perceptual models. Useful for sorting colors, finding similar colors, or ensuring sufficient distinction between colors in your palette. Essential for creating accessible and visually balanced designs.";


  declare inputs: ToInput<{
    colorA: ColorType;
    colorB: ColorType;
    precision: number;
  }>;

  declare outputs: ToOutput<{
    value: ColorType
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("colorA", {
      type: {
        ...ColorSchema,
        default: "#ffffff",
      },
    });
    this.addInput("colorB", {
      type: {
        ...ColorSchema,
        default: "#000000",
      },
    });
    this.addInput("precision", {
      type: {
        ...NumberSchema,
        default: 4,
      },
    });
    this.addInput("space", {
      type: {
        ...StringSchema,
        enum: colorSpaces,
        default: "Lab",
      },
    });

    this.addOutput("value", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { colorA, colorB, space, precision } = this.getAllInputs();

    const a = new Color(colorA);
    const b = new Color(colorB);

    const distance = a.distance(b, space);

    this.setOutput("value", setToPrecision(distance, precision));
  }
}

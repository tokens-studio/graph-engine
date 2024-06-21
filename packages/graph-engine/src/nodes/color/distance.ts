
import { ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition} from "../../index.js";
import { Node } from "../../programmatic/node.js";
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
    "Distance node allows you to calculate the distance between two colors.";


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

    const shift = 10 ** precision;
    const output = Math.round(distance * shift) / shift;

    this.setOutput("value", output);
  }
}


import { ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition} from "../../index.js";
import { Node } from "../../programmatic/node.js";
import Color from "colorjs.io";

export const algorithms = [
  "76",
  "CMC",
  "2000",
  "Jz",
  "ITP",
  "OK",
] as const;

export type algorithm = typeof algorithms[number];

export default class NodeDefinition extends Node {
  static title = "Detla E (ΔE)";
  static type = "studio.tokens.color.deltaE";
  static description =
    "Delta E node allows you to calculate the distance between two colors.";


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
    this.addInput("algorithm", {
      type: {
        ...StringSchema,
        enum: algorithms,
        default: "2000",
      },
    });

    this.addOutput("value", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { colorA, colorB, algorithm, precision } = this.getAllInputs();

    const a = new Color(colorA);
    const b = new Color(colorB);

    const distance = a.deltaE(b, algorithm);

    const shift = 10 ** precision;
    const output = Math.round(distance * shift) / shift;

    this.setOutput("value", output);
  }
}


import { ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition} from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { setToPrecision } from "../../utils/precision.js";
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
  static title = "Delta E (ΔE)";
  static type = "studio.tokens.color.deltaE";
  static description =
    "Computes the Delta E (ΔE) color difference between two colors.\n\nInputs: Color A, Color B, Algorithm, Precision\nOutput: Delta E value\n\nUse this node for precise color difference calculations. Select from various ΔE algorithms for different accuracy needs. Helpful in quality control, ensuring color consistency across different media, or fine-tuning color palettes for optimal distinction. Essential for color-critical design work.";

// Delta E



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

    this.setOutput("value", setToPrecision(distance, precision));
  }
}


import {
  BooleanSchema,
  ColorSchema,
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";
import { Color as ColorType } from "../../types.js";
import { ContrastAlgorithm } from "../../types/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { Output, ToInput, ToOutput } from "../../programmatic";
import Color from "colorjs.io";

/**
 * Performs a contrast calculation between two colors using APCA-W3 calcs
 */
export default class NodeDefinition extends Node {
  static title = "Contrasting Color";
  static type = "studio.tokens.color.contrasting";
  static description = "Determines which of two colors contrasts best with a background.\n\nInputs: Color A, Color B, Background Color, Contrast Algorithm, Threshold\nOutputs: Chosen Color, Contrast Ratio, Sufficiency Boolean\n\nUse this node to automatically select the most readable color for text or UI elements. It compares two options against a background and chooses the one with better contrast. Ideal for ensuring accessibility in dynamic color situations or theming systems."

  declare inputs: ToInput<{
    a: ColorType;
    b: ColorType;
    background: ColorType;
    algorithm: ContrastAlgorithm;
    threshold: number;
  }>;
  declare outputs: ToOutput<{
    color: Output;
    sufficient: Output<boolean>;
    contrast: Output<number>;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: {
        ...ColorSchema,
        default: "#ffffff",
      },
    });
    this.addInput("b", {
      type: {
        ...ColorSchema,
        default: "#000000",
      },
    });
    this.addInput("background", {
      type: {
        ...ColorSchema,
        default: "#fd0000",
      },
    });

    this.addInput("algorithm", {
      type: {
        ...StringSchema,
        enum: Object.values(ContrastAlgorithm),
        default: ContrastAlgorithm.APCA,
      },
    });
    this.addInput("threshold", {
      type: {
        ...NumberSchema,
        default: 60,
      },
    });

    this.addOutput("sufficient", {
      type: BooleanSchema,
    });
    this.addOutput("color", {
      type: ColorSchema,
    });
    this.addOutput("contrast", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { algorithm, a, b, background, threshold } = this.getAllInputs();

    const colorA = new Color(a);
    const colorB = new Color(b);
    const backgroundCol = new Color(background);

    const contrastA = Math.abs(backgroundCol.contrast(colorA, algorithm));
    const contrastB = Math.abs(backgroundCol.contrast(colorB, algorithm));

    if (contrastA > contrastB) {
      this.setOutput("color", a);
      this.setOutput("sufficient", contrastA >= threshold);
      this.setOutput("contrast", contrastA);
    } else {
      this.setOutput("color", b);
      this.setOutput("sufficient", contrastB >= threshold);
      this.setOutput("contrast", contrastB);
    }
  }
}

import { BooleanSchema, ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { ContrastAlgorithm } from "../../types/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import Color from "colorjs.io";


export default class NodeDefinition extends Node {
  static title = "Contrast";
  static type = "studio.tokens.accessibility.contrast";
  static description = "Calculates the contrast between two color values. The output is a number representing the contrast ratio between the two colors. The higher the number, the higher the contrast between the two colors. The output is based on the APCA-W3 contrast calculation.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: {
        ...ColorSchema,
        default: "#000000",
      },
    });
    this.addInput("b", {
      type: {
        ...ColorSchema,
        default: "#ffffff",
      },
    });
    this.addInput("algorithm", {
      type: {
        ...StringSchema,
        enum: Object.values(ContrastAlgorithm),
        default: ContrastAlgorithm.APCA,
      },
    });
    this.addInput("absolute", {
      type: {
        ...BooleanSchema,
        default: false,
      },
    });

    this.addOutput("value", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { a, b, algorithm, absolute } = this.getAllInputs();
    const color = new Color(a);
    const background = new Color(b);

    const calculated = background.contrast(color, algorithm);
    
    this.setOutput("value", absolute ? Math.abs(calculated) : calculated);
  }
}

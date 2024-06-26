import { BooleanSchema, ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { ContrastAlgorithm } from "../../types/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import Color from "colorjs.io";


export default class NodeDefinition extends Node {
  static title = "Contrast";
  static type = "studio.tokens.accessibility.contrast";
  static description = "Calculates the contrast ratio between two colors.\n\nInputs: Color A, Color B, Contrast Algorithm\nOutput: Contrast ratio (number)\n\nUse this node to evaluate the visual difference between two colors. Choose from different contrast algorithms including APCA-W3. Essential for ensuring readability and accessibility in your designs, helping you meet WCAG guidelines. Useful for automatically adjusting text colors based on background.";
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

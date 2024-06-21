import { BooleanSchema, ColorSchema, NumberSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import Color from "colorjs.io";

export enum WcagVersion {
  V2 = "2.1",
  V3 = "3.0",
}

export default class NodeDefinition extends Node {
  static title = "Contrast";
  static type = "studio.tokens.color.contrast";
  static description = "Calculates the contrast between two colors";
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
    this.addInput("wcag", {
      type: {
        ...StringSchema,
        enum: Object.values(WcagVersion),
        default: WcagVersion.V3,
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
    const { a, b, wcag, absolute } = this.getAllInputs();
    const color = new Color(a);
    const background = new Color(b);

    let calculated;
    if (wcag == WcagVersion.V2) {
      calculated = background.contrast(color, "WCAG21");
    } else {
      calculated = background.contrast(color, "APCA");
    }
    this.setOutput("value", absolute ? Math.abs(calculated) : calculated);
  }
}

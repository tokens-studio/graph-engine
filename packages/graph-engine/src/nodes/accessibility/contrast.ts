import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema, ColorSchema, BooleanSchema } from "@/schemas/index.js";
import Color from "colorjs.io";

export default class NodeDefinition extends Node {
  static title = "Contrast";
  static type = NodeTypes.CONTRAST;
  static description = "Calculates the contrast between two colors";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: {
        ...ColorSchema,
        default: "#000000",
      },
      visible: true,
    });
    this.addInput("b", {
      type: {
        ...ColorSchema,
        default: "#ffffff",
      },
      visible: true,
    });
    this.addInput("absolute", {
      type: {
        ...BooleanSchema,
        default: false,
      },
      visible: true,
    });

    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { a, b, absolute } = this.getAllInputs();
    let color = new Color(a);
    let background = new Color(b);
    const calculated = background.contrast(color, "APCA");
    this.setOutput("value", absolute ? Math.abs(calculated) : calculated);
  }
}


import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { NumberSchema, ColorSchema, BooleanSchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Contrast";
  type = NodeTypes.CONTRAST;
  description = "Calculates the contrast between two colors";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("b", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("absolute", {
      type: {
        ...BooleanSchema,
        default: false
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
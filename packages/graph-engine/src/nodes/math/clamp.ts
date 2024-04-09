import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Clamp";
  static type = NodeTypes.CLAMP;
  static description =
    "Clamp node allows you to restricts a value within a specified minimum and maximum range.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: {
        ...NumberSchema,
        default: 0,
        visible: true,
      },
    });
    this.addInput("min", {
      type: {
        ...NumberSchema,
        default: 0,
      },
    });
    this.addInput("max", {
      type: {
        ...NumberSchema,
        default: 0,
      },
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value, min, max } = this.getAllInputs();
    this.setOutput("value", value > max ? max : value < min ? min : value);
  }
}

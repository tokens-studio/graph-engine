import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Ceil";
  static type = NodeTypes.CEIL;
  static description =
    "Ceil node allows you to adjusts a floating-point number to the nearest higher integer.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: NumberSchema,
      visible: true,
    });

    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value } = this.getAllInputs();

    this.setOutput("value", Math.ceil(value));
  }
}

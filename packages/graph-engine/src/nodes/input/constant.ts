import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Constant";
  static type = NodeTypes.CONSTANT;
  static description =
    "Constant node allows you to provide a constant value. You can use this node to set a constant value for a specific property.";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnySchema,
    });
    this.addOutput("value", {
      type: AnySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const input = this.getRawInput("input");
    this.setOutput("value", input.value, input.type());
  }
}

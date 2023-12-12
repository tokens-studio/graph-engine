import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { AnySchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "CONSTANT";
  type = NodeTypes.CONSTANT;
  description = "Constant node allows you to provide a constant value. You can use this node to set a constant value for a specific property.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnySchema
    });
    this.addOutput("value", {
      type: AnySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const input = this.getRawInput("input");
    this.setOutput("value", input, input.type);
  }
}
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, BooleanSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Logical Not";
  static type = NodeTypes.NOT;
  static description = "Not node allows you to negate a boolean value.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: BooleanSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value } = this.getAllInputs();

    this.setOutput("value", !value);
  }
}

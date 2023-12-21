import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { StringSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Lowercase";
  static type = NodeTypes.UPPERCASE;
  static description = "Converts a string to uppercase";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: StringSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value } = this.getAllInputs();
    this.setOutput("value", value.toUpperCase());
  }
}

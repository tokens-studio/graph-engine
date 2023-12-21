import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnyArraySchema, StringSchema } from "@/schemas/index.js";
export default class NodeDefinition extends Node {
  static title = "Join Array";
  static type = NodeTypes.JOIN;
  static description =
    "Join node allows you to join an array into a string using a delimiter.";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addInput("delimiter", {
      type: {
        ...StringSchema,
        default: ",",
      },
      visible: true,
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { delimiter, array } = this.getAllInputs();
    this.setOutput("value", array.join(delimiter));
  }
}

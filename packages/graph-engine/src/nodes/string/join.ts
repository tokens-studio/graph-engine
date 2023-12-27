import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnyArraySchema, StringSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Join String";
  static type = NodeTypes.JOIN_STRING;
  static description = "Joins an array of strings into a single string";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addInput("separator", {
      type: {
        ...StringSchema,
        default: "",
      },
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { array, separator } = this.getAllInputs();
    this.setOutput("value", array.join(separator));
  }
}

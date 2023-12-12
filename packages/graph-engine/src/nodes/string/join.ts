
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { AnyArraySchema, StringSchema } from "@/schemas/index.js";


export class NodeDefinition extends Node {
  title = "Join String";
  type = NodeTypes.JOIN_STRING;
  description = "Joins an array of strings into a single string";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addInput("separator", {
      type: {
        ...StringSchema,
        default: ''
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
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnyArraySchema, StringSchema } from "@/schemas/index.js";
export default class NodeDefinition extends Node {
  static title = "Reverse Array";
  static type = NodeTypes.REVERSE;
  static description = "Reverses a given array without mutating the original";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const array = this.getRawInput("array");
    //Normal reverse mutates the array. We don't want that.
    const reversed = [...array.value].reverse();

    this.setOutput("value", reversed, array.type());
  }
}

import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { AnyArraySchema, NumberSchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Count";
  type = NodeTypes.COUNT;
  description = "Counts the amount of items in an array."
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const value = this.getInput('value');
    this.setOutput("value", value.length);
  }
}


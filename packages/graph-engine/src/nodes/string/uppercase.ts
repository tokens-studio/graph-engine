

import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { StringSchema } from "@/schemas/index.js";


export class NodeDefinition extends Node {
  title = "Lowercase";
  type = NodeTypes.UPPERCASE;
  description = "Converts a string to uppercase";
  constructor(props: INodeDefinition) {
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
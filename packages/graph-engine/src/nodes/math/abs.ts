import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { NumberSchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Absolute";
  type = NodeTypes.ABS;
  description = "Absolute node allows you to get the absolute value of a number. Turning a negative number to positive.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("input", {
      type: NumberSchema
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const input = this.getInput("input") as number;
    this.setOutput("value", Math.abs(input));
  }
}
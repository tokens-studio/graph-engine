import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { NumberSchema, NumberArraySchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Multiply";
  type = NodeTypes.MULTIPLY;
  description = "Multiply node allows you to multiply two or more numbers.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("inputs", {
      type: {
        ...NumberArraySchema,
        default: [],
      },
      variadic: true,
      visible: true,
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const inputs = this.getInput("inputs") as number[];
    const output = inputs.reduce((acc, curr) => acc * curr, 1);
    this.setOutput("value", output);
  }
}
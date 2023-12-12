

import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { NumberSchema, NumberArraySchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Divide";
  type = NodeTypes.DIV;
  description = "Divide node allows you to divide two or more numbers.";
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
    const [start, ...rest] = inputs;
    const output = rest.reduce((acc, x) => acc / x, start);
    this.setOutput("value", output);
  }
}
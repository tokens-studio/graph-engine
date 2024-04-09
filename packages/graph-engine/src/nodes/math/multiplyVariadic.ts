import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema, NumberArraySchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Multiply (Variadic)";
  static type = NodeTypes.MULTIPLY_VARIADIC;
  static description =
    "Multiply node allows you to multiply two or more numbers.";
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

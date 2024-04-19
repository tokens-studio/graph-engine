import { INodeDefinition, Input, Output, ToInput, ToOutput } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema, NumberArraySchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Subtract (Variadic)";
  static type = NodeTypes.SUBTRACT_VARIADIC;
  static description = "Allows you to subtract two or more numbers.";

  declare inputs: ToInput<{
    inputs: number[];
  }>;
  declare outputs: ToOutput<{
    value: number;
  }>;

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
    const output = rest.reduce((acc, x) => acc - x, start);
    this.setOutput("value", output);
  }
}

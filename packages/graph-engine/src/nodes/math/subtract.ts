import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema, NumberArraySchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Subtract Node";
  static type = NodeTypes.SUBTRACT;
  static description = "Allows you to subtract two or more numbers.";
  constructor(props?: INodeDefinition) {
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

import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnyArraySchema, BooleanSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Logical or";
  static type = NodeTypes.OR;
  static description = "OR node allows you to check if all inputs are true.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("inputs", {
      type: {
        ...AnyArraySchema,
        default: [],
      },
      variadic: true,
      visible: true,
    });
    this.addOutput("value", {
      type: BooleanSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const inputs = this.getInput("inputs") as number[];
    const output = inputs.reduce((acc, curr) => acc || !!curr, false);
    this.setOutput("value", output);
  }
}

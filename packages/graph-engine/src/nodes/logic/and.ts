import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { AnyArraySchema, BooleanSchema } from "../../schemas/index.js";

export default class NodeDefinition<T> extends Node {
  static title = "Logical and";
  static type = NodeTypes.AND;
  static description = "AND node allows you to check if all inputs are true.";

  declare inputs: ToInput<{
    inputs: T[];
  }>;

  declare outputs: ToOutput<{
    value: boolean;
  }>;


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
    const output = inputs.reduce((acc, curr) => acc && !!curr, true);
    this.setOutput("value", output);
  }
}

import { AnySchema, BooleanSchema, createVariadicSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";


export default class NodeDefinition<T> extends Node {
  static title = "Logical and";
  static type = "studio.tokens.logic.and";
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
        ...createVariadicSchema(AnySchema),
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

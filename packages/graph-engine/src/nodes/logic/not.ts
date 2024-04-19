import { INodeDefinition, ToInput, ToOutput } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, BooleanSchema } from "@/schemas/index.js";

export default class NodeDefinition<T> extends Node {
  static title = "Logical Not";
  static type = NodeTypes.NOT;
  static description = "Not node allows you to negate a boolean value.";

  declare inputs: ToInput<{
    value: T;
  }>;

  declare outputs: ToOutput<{
    value: boolean;
  }>;


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: BooleanSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value } = this.getAllInputs();

    this.setOutput("value", !value);
  }
}

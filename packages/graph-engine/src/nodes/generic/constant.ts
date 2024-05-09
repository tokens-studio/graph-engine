import { INodeDefinition,  ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { AnySchema } from "../../schemas/index.js";

export default class NodeDefinition<T> extends Node {
  static title = "Constant";
  static type = NodeTypes.CONSTANT;

  declare inputs: ToInput<{
    value: T;
  }>;
  declare outputs: ToOutput<{
    value: T;
  }>;

  static description =
    "Constant node allows you to provide a constant value. You can use this node to set a constant value for a specific property.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnySchema,
    });
    this.addOutput("value", {
      type: AnySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const input = this.getRawInput("value");
    this.setOutput("value", input.value, input.type);
  }
}

import { INodeDefinition, Input, Output } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema, NumberArraySchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Multiply";
  static type = NodeTypes.MULTIPLY;
  static description = "Multiply node allows you to multiply two  numbers.";

  declare inputs: {
    a: Input<number>;
    b: Input<number>;
  };
  declare outputs: {
    value: Output<number>;
  };
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("b", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { a, b } = this.getAllInputs();
    this.setOutput("value", a * b);
  }
}

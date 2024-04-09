import { INodeDefinition, Input, Output } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Add";
  static type = NodeTypes.ADD;
  static description = "Add node allows you to add two numbers.";
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
    this.setOutput("value", a + b);
  }
}

import { INodeDefinition,  ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Subtract";
  static type = "studio.tokens.math.subtract";
  static description = "Allows you to subtract two numbers.";

  declare inputs: ToInput<{
    a: number;
    b: number;
  }>;
  declare outputs: ToOutput<{
    value: number;
  }>;
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
    this.setOutput("value", a - b);
  }
}

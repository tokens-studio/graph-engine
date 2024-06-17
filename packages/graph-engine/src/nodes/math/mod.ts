import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Modulo";
  static type = "studio.tokens.math.mod";
  static description =
    "Modulo node allows you to get the remainder of a division.";
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
    this.setOutput("value", a % b);
  }
}

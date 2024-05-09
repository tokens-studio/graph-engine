import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Absolute";
  static type = NodeTypes.ABS;
  static description =
    "Absolute node allows you to get the absolute value of a number. Turning a negative number to positive.";


  declare inputs: ToInput<{
    input: number;
  }>;
  declare outputs: ToOutput<{
    value: number;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("input", {
      type: NumberSchema,
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const input = this.getInput("input") as number;
    this.setOutput("value", Math.abs(input));
  }
}

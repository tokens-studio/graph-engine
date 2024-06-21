import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Round";
  static type = "studio.tokens.math.round";
  static description =
    "Round node allows you to adjusts a floating-point number to the nearest integer or to a specified precision.";

  declare inputs: ToInput<{
    value: number;
    precision: number;
  }>;
  declare outputs: ToOutput<{
    value: number;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: NumberSchema,
    });
    this.addInput("precision", {
      type: NumberSchema,
    });

    this.addOutput("value", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { precision, value } = this.getAllInputs();

    const shift = 10 ** precision;
    const output = Math.round(value * shift) / shift;

    this.setOutput("value", output);
  }
}

import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Floor";
  static type = NodeTypes.FLOOR;
  static description =
    "Floor node allows you to adjusts a floating-point number to the nearest lower integer.";


  declare inputs: ToInput<{
    value: number;
  }>;

  declare outputs: ToOutput<{
    value: number;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: NumberSchema,
      visible: true,
    });

    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value } = this.getAllInputs();

    this.setOutput("value", ~~value);
  }
}

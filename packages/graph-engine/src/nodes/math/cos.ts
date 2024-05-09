import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Cosine";
  static type = NodeTypes.COS;
  static description = "Cos node allows you to get the cosine of a number.";


  declare inputs: ToInput<{
    value: number;

  }>;
  declare outputs: ToOutput<{
    value: number;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: {
        ...NumberSchema,
        default: 0,
        visible: true,
      },
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const value = this.getInput("value");
    this.setOutput("value", Math.cos(value));
  }
}

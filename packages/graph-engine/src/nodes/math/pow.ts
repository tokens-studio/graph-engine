import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Power";
  static type = NodeTypes.POW;
  static description =
    "Power node allows you to Raises a base number to the power of an exponent.";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("base", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("exponent", {
      type: {
        ...NumberSchema,
        default: 2,
      },
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { base, exponent } = this.getAllInputs();
    this.setOutput("value", Math.pow(base, exponent));
  }
}

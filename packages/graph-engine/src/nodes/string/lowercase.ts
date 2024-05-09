import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { StringSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Lowercase";
  static type = NodeTypes.LOWER;
  static description = "Converts a string to lowercase";

  declare inputs: ToInput<{
    value: string;
  }>
  declare outputs: ToOutput<{
    value: string;
  }>


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: StringSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value } = this.getAllInputs();
    this.setOutput("value", value.toLowerCase());
  }
}

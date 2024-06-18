import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { StringSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Uppercase";
  static type = "studio.tokens.string.uppercase";
  static description = "Converts a string to uppercase";

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
    this.setOutput("value", value.toUpperCase());
  }
}

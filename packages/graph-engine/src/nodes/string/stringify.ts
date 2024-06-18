import { AnySchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";

export default class NodeDefinition extends Node {
  static title = "Stringify";
  static type = "studio.tokens.string.stringify";
  static description = "Converts a value to a string";

  declare inputs: ToInput<{
    value: any;
  }>;
  declare outputs: ToOutput<{
    value: string;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value } = this.getAllInputs();
    this.setOutput("value", "" + value);
  }
}

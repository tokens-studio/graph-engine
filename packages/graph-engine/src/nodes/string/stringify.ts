import { INodeDefinition, ToInput, ToOutput } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, StringSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Stringify";
  static type = NodeTypes.STRINGIFY;
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

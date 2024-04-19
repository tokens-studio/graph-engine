import { NodeTypes } from "@/types.js";
import { INodeDefinition, Node } from "@/programmatic/node.js";
import { StringSchema } from "@/schemas/index.js";
import { Input, ToInput } from "@/programmatic/input.js";
import { Output, ToOutput } from "@/programmatic";

export default class NodeDefinition extends Node {
  static title = "Split String";
  static type = NodeTypes.SPLIT_STRING;
  declare inputs: ToInput<{
    value: string;
    separator: string;
  }>;
  declare outputs: ToOutput<{
    value: string;
  }>;
  static description = "Converts a string to lowercase";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: StringSchema,
      visible: true,
    });
    this.addInput("separator", {
      type: {
        ...StringSchema,
        default: ",",
      },
      visible: true,
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value, separator } = this.getAllInputs();
    if (separator === undefined) {
      this.setOutput("value", [value]);
    } else {
      this.setOutput("value", value.split(separator));
    }
  }
}

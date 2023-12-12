
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { StringSchema } from "@/schemas/index.js";


export class NodeDefinition extends Node {
  title = "Split String";
  type = NodeTypes.SPLIT_STRING;
  description = "Converts a string to lowercase";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: StringSchema,
      visible: true,
    });
    this.addInput("separator", {
      type: {
        ...StringSchema,
        default: ","
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
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { StringSchema } from "@/schemas/index.js";


export class NodeDefinition extends Node {
  title = "Regex";
  type = NodeTypes.REGEX;
  description = "Replaces a string with a regex";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("input", {
      type: StringSchema,
      visible: true,
    });
    this.addInput("match", {
      type: {
        ...StringSchema,
        default: ""
      }
    });
    this.addInput("flags", {
      type: {
        ...StringSchema,
        default: ""
      }
    });
    this.addInput("replace", {
      type: {
        ...StringSchema,
        default: ""
      },
      visible: true,
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { input, match, flags, replace } = this.getAllInputs();
    const regex = new RegExp(match, flags);
    const output = input.replace(regex, replace);

    this.setOutput("value", output);
  }
}
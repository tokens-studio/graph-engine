import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { NumberSchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Tan";
  type = NodeTypes.TAN;
  description = "Tan node allows you to get the sin of a number."
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: {
        ...NumberSchema,
        default: 0,
        visible: true,
      }
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const value = this.getInput('value');
    this.setOutput("value", Math.tan(value));
  }
}

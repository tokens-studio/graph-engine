import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { NumberSchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Lerp";
  type = NodeTypes.LERP;
  description = "Lerp (linear interpolation) calculates a value between two numbers, A and B, based on a fraction t. For t = 0 returns A, for t = 1 returns B. It's widely used in graphics and animations for smooth transitions.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: {
        ...NumberSchema,
        default: 0
      },
      visible: true
    });
    this.addInput("b", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true
    });
    this.addInput("t", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { a, b, t } = this.getAllInputs();
    this.setOutput("value", a + t * (b - a));
  }
}

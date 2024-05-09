import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { NumberSchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Lerp";
  static type = NodeTypes.LERP;
  static description =
    "Lerp (linear interpolation) calculates a value between two numbers, A and B, based on a fraction t. For t = 0 returns A, for t = 1 returns B. It's widely used in graphics and animations for smooth transitions.";

  declare inputs: ToInput<{
    a: number;
    b: number;
    t:number
  }>;

  declare outputs: ToOutput<{
    value: number;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true,
    });
    this.addInput("b", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true,
    });
    this.addInput("t", {
      type: {
        ...NumberSchema,
        default: 0,
      },
      visible: true,
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

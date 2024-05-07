import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema, ColorSchema, GradientStopSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Gradient Stop";
  static type = NodeTypes.GRADIENT_STOP;
  static description = "Create a gradient stop.";

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("position", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("gradientStop", {
      type: GradientStopSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { color, position } = this.getAllInputs();
    this.setOutput("gradientStop", { 'color': color, 'position': position});
  }
}

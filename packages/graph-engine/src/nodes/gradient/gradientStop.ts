import { ColorSchema, GradientStopSchema, NumberSchema } from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";

export default class NodeDefinition extends Node {
  static title = "Gradient Stop";
  static type = "studio.tokens.gradient.stop";
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

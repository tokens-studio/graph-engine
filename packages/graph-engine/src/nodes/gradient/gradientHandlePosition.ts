import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { NumberSchema, GradientHandlePositionSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Gradient Handle Position";
  static type = NodeTypes.GRADIENT_HANDLE_POSITION;
  static description = "Create a gradient handle position.";

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("x", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("y", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("gradientHandlePosition", {
      type: GradientHandlePositionSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { x, y } = this.getAllInputs();
    this.setOutput("gradientHandlePosition", { 'x': x, 'y': y});
  }
}

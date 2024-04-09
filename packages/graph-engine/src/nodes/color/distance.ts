import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import chroma from "chroma-js";
import { ColorSchema } from "@/schemas/index.js";
export default class NodeDefinition extends Node {
  static title = "Color Distance";
  static type = NodeTypes.COLOR_DISTANCE;
  static description =
    "Distance node allows you to calculate the distance between two colors.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color1", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("color2", {
      type: ColorSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: ColorSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { color1, color2 } = this.getAllInputs();

    if (!chroma.valid(color1) || !chroma.valid(color2)) {
      throw new Error("Invalid color inputs");
    }

    const distance = chroma.deltaE(color1, color2);

    this.setOutput("value", distance);
  }
}

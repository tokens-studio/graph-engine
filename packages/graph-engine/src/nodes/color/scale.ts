import { INodeDefinition } from "@/index.js";
import {
  ColorArraySchema,
  ColorSchema,
  NumberSchema,
} from "@/schemas/index.js";
import { NodeTypes } from "@/types.js";
import chroma from "chroma-js";
import { Node } from "@/programmatic/node.js";

export default class NodeDefinition extends Node {
  static title = "Scale colors";
  static type = NodeTypes.SCALE;
  static description = "";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: ColorSchema,
      visible: true,
    });
    this.addInput("stepsUp", {
      type: NumberSchema,
    });
    this.addInput("stepsDown", {
      type: NumberSchema,
    });
    this.addOutput("value", {
      type: ColorArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { stepsUp, stepsDown, color } = this.getAllInputs();

    const sUp = Math.max(0, stepsUp) + 2;
    const sDown = Math.max(0, stepsDown) + 2;

    const lighter = chroma
      .scale(["white", color])
      .mode("hsl")
      .colors(stepsUp)
      .slice(1, -1);

    const mid = [chroma(color).hex()];

    const darker = chroma
      .scale([color, "black"])
      .mode("hsl")
      .colors(stepsDown)
      .slice(1, -1);
    const final = ([] as string[]).concat(lighter, mid, darker) as string[];
    this.setOutput("value", final);
  }
}

import { Color } from "../../types.js";
import {
  ColorSchema,
  NumberSchema,
} from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { arrayOf } from "../../schemas/utils.js";
import chroma from "chroma-js";

export default class NodeDefinition extends Node {
  static title = "Scale colors";
  static type = "studio.tokens.color.scale";
  static description = "";



  declare inputs: ToInput<{
    color: Color;
    stepsUp: number;
    stepsDown: number;
  }>;
  declare outputs: ToOutput<{
    value: Color[]
  }>;


  constructor(props: INodeDefinition) {
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
      type: arrayOf(ColorSchema),
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
      .colors(sUp)
      .slice(1, -1);

    const mid = [chroma(color).hex()];

    const darker = chroma
      .scale([color, "black"])
      .mode("hsl")
      .colors(sDown)
      .slice(1, -1);
    const final = ([] as string[]).concat(lighter, mid, darker) as string[];
    this.setOutput("value", final);
  }
}

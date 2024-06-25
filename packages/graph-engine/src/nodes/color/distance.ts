import { Color } from "../../types.js";
import { ColorSchema, NumberSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import chroma from "chroma-js";
export default class NodeDefinition extends Node {
  static title = "Color Distance";
  static type = "studio.tokens.color.distance";
  static description =
    "Calculate the distance between two colors. The output is a number representing the difference between the two colors. The lower the number, the closer the colors are to each other. The output is based on the CIEDE2000 color difference formula.";


  declare inputs: ToInput<{
    color1: Color;
    color2: Color;
  }>;
  declare outputs: ToOutput<{
    value: number
  }>;


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
      type: NumberSchema,
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

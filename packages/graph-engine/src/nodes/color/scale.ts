import { Color } from '../../types.js';
import { ColorSchema, NumberSchema } from '../../schemas/index.js';
import { INodeDefinition, ToInput, ToOutput } from '../../index.js';
import { Node } from '../../programmatic/node.js';
import { arrayOf } from '../../schemas/utils.js';
import chroma from 'chroma-js';

export default class NodeDefinition extends Node {
  static title = "Scale colors";
  static type = "studio.tokens.color.scale";
  static description = "Create a scale/ramp of colors based on a given color by specifying the number of steps up and down";

  declare inputs: ToInput<{
    color: Color;
    stepsUp: number;
    stepsDown: number;
  }>;
  declare outputs: ToOutput<{
    value: Color[];
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: {
        ...ColorSchema,
        default: "#7733dd",
      },
    });
    this.addInput("stepsUp", {
      type: {
        ...NumberSchema,
        default: 5,
      }
    });
    this.addInput("stepsDown", {
      type: {
        ...NumberSchema,
        default: 5,
      },
    });
    this.addOutput("value", {
      type: arrayOf(ColorSchema),
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

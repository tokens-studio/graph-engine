import { Black, toColor, toColorObject } from "./lib/utils.js";
import { Color } from "../../types.js";
import {
  ColorSchema,
  NumberSchema,
} from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { arrayOf } from "../../schemas/utils.js";

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
    value: Color[]
  }>;


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: {
        ...ColorSchema,
        default:Black,
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

    const col = toColor(color);

    const sUp = Math.max(0, stepsUp) + 2;
    const sDown = Math.max(0, stepsDown) + 2;

    const lighter = col
      .steps('white', { space: 'hsl', steps: sUp })
      .slice(1, -1).map(x=> toColorObject(x));
    const darker = col
      .steps('black', { space: 'hsl', steps: sDown })
      .slice(1, -1).map(x => toColorObject(x));
    //Not need to modify
    const mid = [color];

    const final = ([] as Color[]).concat(lighter, mid, darker) as Color[];
    this.setOutput('value', final);
  }
}

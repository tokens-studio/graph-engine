import {  ColorSchema, NumberSchema } from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { arrayOf } from "../../schemas/utils.js";
import Color from "colorjs.io";

export default class NodeDefinition extends Node {
  static title = "Color Wheel";
  static type = "studio.tokens.color.wheel";
  static description =
    "Generate Color Wheel node allows you to create a color scale based on a base color and rotation in hue. You can use this node to generate a color scale for a specific color property.";
  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("hueAmount", {
      type: {
        ...NumberSchema,
        default: 360,
      },
    });
    this.addInput("hueAngle", {
      type: {
        ...NumberSchema,
        default: 180,
      },
      visible: true,
    });
    this.addInput("saturation", {
      type: {
        ...NumberSchema,
        default: 80,
      },
      visible: true,
    });
    this.addInput("lightness", {
      type: {
        ...NumberSchema,
        default: 80,
      },
      visible: true,
    });
    this.addInput("colors", {
      type: {
        ...NumberSchema,
        default: 8,
      },
      visible: true,
    });

    this.addOutput("value", {
      type: arrayOf(ColorSchema),
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { colors, hueAngle, hueAmount, saturation, lightness } = this.getAllInputs();

    const colorList: string[] = [];

    for (let step = 0; step < colors; step++) {
      const hue = (hueAngle + ((step * hueAmount) / colors)) % 360;
      
      // Color Generation with colorjs.io
      const color = new Color("hsl", [hue, saturation, lightness]);
      const srgbColor = color.to("srgb");

      colorList.push(srgbColor.toString({ format: "hex" })); 
    }

    this.setOutput("value", colorList);
  }
}

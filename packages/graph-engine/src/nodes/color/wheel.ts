import {  ColorSchema, NumberSchema } from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { arrayOf } from "../../schemas/utils.js";
import Color from "colorjs.io";

export default class NodeDefinition extends Node {
  static title = "Color Wheel";
  static type = "studio.tokens.color.wheel";
  static description =
     "Generates a color scale based on a starting hue and rotation angle, perfect for creating harmonious color palettes.\n\nInputs: Base Hue, Angle, Saturation, Lightness, Number of Colors\nOutput: Array of Colors (hex format)\n\nAdjust the base hue and angle to explore different color relationships (e.g., complementary, triadic, analogous). Fine-tune saturation and lightness to control color intensity and brightness. Increase the number of colors for more gradual transitions or decrease for higher contrast. Ideal for quickly generating cohesive color schemes for your designs."
  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("baseHue", {
      type: {
        ...NumberSchema,
        default: 360,
      },
    });
    this.addInput("angle", {
      type: {
        ...NumberSchema,
        default: 180,
      },
    });
    this.addInput("saturation", {
      type: {
        ...NumberSchema,
        default: 80,
      },
    });
    this.addInput("lightness", {
      type: {
        ...NumberSchema,
        default: 80,
      },
    });
    this.addInput("colors", {
      type: {
        ...NumberSchema,
        default: 8,
      },
    });

    this.addOutput("value", {
      type: arrayOf(ColorSchema),
    });
  }

  execute(): void | Promise<void> {
    const { colors, baseHue, angle, saturation, lightness } = this.getAllInputs();

    const colorList: string[] = [];

    for (let step = 0; step < colors; step++) {
      // Hue Calculation
      const hueIncrement = (colors > 1) ? (angle / (colors - 1)) * step : 0;
      const hue = (baseHue + hueIncrement) % 360;
      
      // Color Generation with colorjs.io
      const color = new Color("hsl", [hue, saturation, lightness]);
      const srgbColor = color.to("srgb");

      colorList.push(srgbColor.toString({ format: "hex" })); 
    }

    this.setOutput("value", colorList);
  }
}

import {  ColorSchema } from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import Color from "colorjs.io";

export default class NodeDefinition extends Node {
  static title = "Flatten Alpha";
  static type = "studio.tokens.color.flattenAlpha";
  static description =
    "Reduces two colors to one by blending them together and removing the alpha channel. Expects a background color without alpha.";
  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("foreground", {
      type: {
        ...ColorSchema
      },
      visible: true,
    });
    this.addInput("background", {
      type: {
        ...ColorSchema
      },
      visible: true,
    });

    this.addOutput("value", {
      type: ColorSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { foreground, background } = this.getAllInputs();

    // Create color objects from strings
    const bg = new Color(background);
    const fg = new Color(foreground);

    // Decompose the foreground color to RGBA
    const [r1, g1, b1] = fg.to('srgb').coords;  // Default alpha to 1 if undefined
    const a1 = fg.alpha || 1;

    if (a1 === 1) {
      // If alpha is 1, output the foreground color directly
      this.setOutput("value", fg.toString({ format: 'hex' }));
    } else {
      // Decompose the background color to RGB (assume opaque)
      const [r2, g2, b2] = bg.to('srgb').coords;
      // Perform alpha blending formula
      const alpha = 1 - a1;
      const r = r2 * alpha + r1 * a1;
      const g = g1 * a1 + g2 * alpha;
      const b = b1 * a1 + b2 * alpha;

      // Convert blended color back to Color object and then to hex string
      const resultColor = new Color("sRGB", [r, g, b]);
      this.setOutput("value", resultColor.to('srgb').toString({ format: 'hex' }));
    }
  }
}

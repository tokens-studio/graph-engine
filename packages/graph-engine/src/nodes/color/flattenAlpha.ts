import { ColorSchema } from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { flattenAlpha } from "./lib/flattenAlpha.js";
import Color from "colorjs.io";

export default class NodeDefinition extends Node {
  static title = "Flatten Alpha";
  static type = "studio.tokens.color.flattenAlpha";
  static description =
    "Blends a color with alpha over a background, removing transparency.\n\nInputs: Foreground Color (with alpha), Background Color\nOutput: Flattened color without alpha\n\nUse this node to resolve semi-transparent colors against a background. It calculates the resulting opaque color as if the foreground was laid over the background. Useful for converting designs with transparency to flat colors, or for visualizing the final appearance of overlaid elements.";
  constructor(props: INodeDefinition) {
    super(props);

    this.addInput("foreground", {
      type: {
        ...ColorSchema
      },
    });
    this.addInput("background", {
      type: {
        ...ColorSchema
      },
    });

    this.addOutput("value", {
      type: ColorSchema,
    });
  }

  execute(): void | Promise<void> {
    const { foreground, background } = this.getAllInputs();

    // Create color objects from strings
    const bg = new Color(background);
    const fg = new Color(foreground);

    const resultColor = flattenAlpha(fg, bg);
    this.setOutput("value", resultColor.to('srgb').toString({ format: 'hex' }));
  }
}

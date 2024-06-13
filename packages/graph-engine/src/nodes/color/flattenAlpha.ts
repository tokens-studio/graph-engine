import {  ColorSchema } from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { NodeTypes } from "../../types.js";
import { flattenAlpha } from "./lib/flattenAlpha.js";
import Color from "colorjs.io";

export default class NodeDefinition extends Node {
  static title = "Flatten Alpha";
  static type = NodeTypes.FLATTE_ALPHA;
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

    const resultColor = flattenAlpha(fg, bg);
    this.setOutput("value", resultColor.to('srgb').toString({ format: 'hex' }));
  }
}

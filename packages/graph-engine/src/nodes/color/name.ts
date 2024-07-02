

import { ColorSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import namer from "color-namer";

/**
 * Return the name of the color using the `color-namer` library.
 */
export default class NodeDefinition extends Node {
  static title = "Name Color";
  static type = "studio.tokens.color.name";
  static description = "Identifies the nearest named color for a given color value.\n\nInput: Color\nOutput: Color name (string)\n\nUse this node to find human-readable names for colors. It matches the input color to the closest standard color name. Useful for improving accessibility, enhancing user communication, or adding semantic meaning to colors in your designs.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: ColorSchema,
    });
    this.addOutput("value", {
      type: StringSchema,
    });
  }

  execute(): void | Promise<void> {
    const { color } = this.getAllInputs();
    const names = namer(color, { pick: ["html"] });
    this.setOutput("value", names.html[0].name);
  }
}

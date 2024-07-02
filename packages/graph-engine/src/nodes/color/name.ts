

import { ColorSchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import { toColor, toHex } from "./lib/utils.js";
import namer from "color-namer";

/**
 * Return the name of the color using the `color-namer` library.
 */
export default class NodeDefinition extends Node {
  static title = "Name Color";
  static type = "studio.tokens.color.name";
  static description = "Returns the name of the color";
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

    //We need to convert the color to hex
    const col = toHex(toColor(color));


    const names = namer(col, { pick: ["html"] });
    this.setOutput("value", names.html[0].name);
  }
}

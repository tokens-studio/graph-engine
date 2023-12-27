// node
/**
 * Return the name of the color using the chroma.js library.
 *
 * @packageDocumentation
 */

import namer from "color-namer";
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { ColorSchema, StringSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Name Color";
  static type = NodeTypes.COLOR_NAME;
  static description = "Returns the name of the color";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("color", {
      type: ColorSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { color } = this.getAllInputs();
    const names = namer(color, { pick: ["html"] });
    this.setOutput("value", names.html[0].name);
  }
}

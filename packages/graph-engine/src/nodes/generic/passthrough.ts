/**
 * A node that passes through the input to the output.
 *
 * @packageDocumentation
 */

import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Passthrough";
  static type = NodeTypes.PASS_THROUGH;
  static description = "Passes a value through to the output";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: AnySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const input = this.getRawInput("value");
    this.setOutput("value", input.value, input.type());
  }
}

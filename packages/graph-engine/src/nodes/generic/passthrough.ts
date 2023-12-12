/**
 * A node that passes through the input to the output.
 *
 * @packageDocumentation
 */

import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { AnySchema } from "@/schemas/index.js";

export class NodeDefinition extends Node {
  title = "Passthrough";
  type = NodeTypes.PASS_THROUGH;
  description = "Passes a value through to the output";
  constructor(props: INodeDefinition) {
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
    const input = this.getRawInput("input");
    this.setOutput("value", input, input.type);
  }
}
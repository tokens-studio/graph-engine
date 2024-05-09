/**
 * A node that passes through the input to the output.
 *
 * @packageDocumentation
 */

import { INodeDefinition, ToInput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { AnySchema } from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Panic";
  static type = NodeTypes.PANIC;
  static description = "Panics if passed a truthy value";

  declare inputs: ToInput<{
    trigger: any;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("trigger", {
      type: AnySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { trigger } = this.getAllInputs();

    if (trigger) {
      throw new Error(`Panic! Received ${trigger}`);
    }
  }
}

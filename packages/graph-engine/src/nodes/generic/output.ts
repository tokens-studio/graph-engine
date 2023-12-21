/**
 * Acts as an output node for the graph. There can only be a single output node per graph.
 *
 * @packageDocumentation
 */
import { INodeDefinition, Input, Output } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Output";
  static type = NodeTypes.OUTPUT;

  //Override with static typing
  public declare inputs: {
    input: Input;
  };
  public declare outputs: {
    value: Output;
  };

  static description = "Allows you to expose outputs of the node";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("input", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: AnySchema,
      visible: false,
    });
  }

  execute(): void | Promise<void> {
    const input = this.getRawInput("input");
    this.setOutput("value", input.value, input.type());
  }
}

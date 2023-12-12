/**
 * Acts as an output node for the graph. There can only be a single output node per graph.
 *
 * @packageDocumentation
 */
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/index.js";
import { AnySchema } from "@/schemas/index.js";



export class NodeDefinition extends Node {
  title = "Output";
  type = NodeTypes.OUTPUT;
  description = "Allows you to expose outputs of the node";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("input", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: AnySchema,
    });
  }

  execute(): void | Promise<void> {
    const input = this.getRawInput("input");
    this.setOutput("value", input, input.type);
  }
}


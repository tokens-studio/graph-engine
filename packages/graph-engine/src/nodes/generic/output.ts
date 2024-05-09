/**
 * Acts as an output node for the graph. There can only be a single output node per graph.
 *
 * @packageDocumentation
 */
import { ToInput } from "../../programmatic/input.js";
import { ToOutput } from "../../programmatic/output.js";
import { annotatedSingleton } from '../../annotations/index.js';
import { NodeTypes } from "../../types.js";
import { Node, INodeDefinition } from "../../programmatic/node.js";
import { AnySchema } from "../../schemas/index.js";


export default class NodeDefinition<T> extends Node {
  static title = "Output";
  static type = NodeTypes.OUTPUT;

  //Override with static typing
  public declare inputs: ToInput<{
    input: T;
  }>;
  public declare outputs: ToOutput<{
    value: T;
  }>;

  static description = "Allows you to expose outputs of the node";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("input", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: AnySchema,
      visible: false,
    });

    this.annotations[annotatedSingleton] = true;;
  }

  execute(): void | Promise<void> {
    const input = this.getRawInput("input");
    this.setOutput("value", input.value, input.type);
  }
}

/**
 * Acts as an output node for the graph. There can only be a single output node per graph.
 *
 * @packageDocumentation
 */
import { AnySchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { NodeTypes } from "../../types.js";
import { ToInput } from "../../programmatic/input.js";
import { ToOutput } from "../../programmatic/output.js";
import { annotatedDynamicInputs, annotatedSingleton } from '../../annotations/index.js';


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
    this.annotations[annotatedSingleton] = true;
    this.annotations[annotatedDynamicInputs] = true;
  }

  execute(): void | Promise<void> {
    const inputs = this.getAllInputs();
    const outputs = this.getAllOutputs();

    //Passthrough all
    Object.keys(inputs).forEach((input) => {
      const rawInput = this.getRawInput(input);

      if(!(input in outputs)) {
          this.addOutput(input, {
          type: rawInput.type,
        });
      }

      this.setOutput(input, rawInput.value, rawInput.type);
    });

    Object.keys(outputs).forEach((output) => {
      if(!(output in inputs)) {
        delete this.outputs[output];
      }
    });
  }
}

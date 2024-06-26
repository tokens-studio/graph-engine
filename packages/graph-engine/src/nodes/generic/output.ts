
import { IDeserializeOpts } from "../../graph/types.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput } from "../../programmatic/input.js";
import { ToOutput } from "../../programmatic/output.js";
import { annotatedDynamicInputs, annotatedSingleton } from '../../annotations/index.js';


/**
 * Acts as an output node for the graph. There should only be a single output node per graph.
 */
export default class NodeDefinition<T> extends Node {
  static title = "Output";
  static type = "studio.tokens.generic.output";

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


  static override deserialize(opts: IDeserializeOpts) {
    const node = super.deserialize(opts);

    //Create the outputs immediately as we are just a passthrough
    Object.keys(node.inputs).forEach((input) => {
      const rawInput = node.getRawInput(input);
      node.addOutput(input, {
        type: rawInput.type,

      });
    });

    return node;
  }


  execute(): void | Promise<void> {
    const inputs = this.getAllInputs();
    const outputs = this.getAllOutputs();


    //Passthrough all
    Object.keys(inputs).forEach((input) => {
      const rawInput = this.getRawInput(input);

      if (!(input in outputs)) {
        this.addOutput(input, {
          type: rawInput.type,
        });
      }

      this.setOutput(input, rawInput.value, rawInput.type);
    });

    Object.keys(outputs).forEach((output) => {
      if (!(output in inputs)) {
        delete this.outputs[output];
      }
    });
  }
}

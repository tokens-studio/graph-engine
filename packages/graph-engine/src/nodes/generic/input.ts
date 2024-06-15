/**
 * Acts as an output node for the graph. There can only be a single output node per graph.
 *
 * @packageDocumentation
 */
import { INodeDefinition } from "../../programmatic/node.js";
import { Node } from "../../programmatic/node.js";
import { NodeTypes } from "../../types.js";
import { annotatedDynamicInputs, annotatedSingleton } from '../../annotations/index.js';

export default class NodeDefinition extends Node {
  static title = "Input";
  static type = NodeTypes.INPUT;

  static description =
    "Allows you to provide initial values for the whole graph. An input node can be used only once at the start of the graph. You can use this node to set brand decisions or any initial values.";
  constructor(props: INodeDefinition) {
    super(props);
    //By default we don't define any ports, these are all dynamic
    this.annotations[annotatedSingleton] = true;
    this.annotations[annotatedDynamicInputs]= true;
  }

  execute(): void | Promise<void> {
    const inputs = this.getAllInputs();

    //Remove all outputs
    this.clearOutputs();

    //Passthrough all
    Object.keys(inputs).forEach((input) => {
      const rawInput = this.getRawInput(input);

      this.addOutput(input, {
        type: rawInput.type,
        visible: true,
      });
      this.setOutput(input, rawInput.value);
    });
  }
}

import { AnySchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput } from "../../programmatic/input.js";
import { ToOutput } from "../../programmatic/output.js";
import { annotatedDynamicInputs } from '../../annotations/index.js';

/**
 * @example
 * The expected way to use the switch since it relies on dynamic inputs, is to add new Inputs for the switch node
 * ```ts
 * const switchNode = new SwitchNode();
 * switchNode.addInput("foo", {
 *  type: AnySchema,
 * });
 *
 * switchNode.addInput("bar", {
 * type: AnySchema,
 * });
 *
 * //Now if the condition matches the name 'foo' it will output the value of the foo input
 * // If no condition matches, it will output the value of the `default` input
 *
 * ```
 */
export default class NodeDefinition<T> extends Node {
  static title = "Switch";
  static type = "studio.tokens.logic.switch";
  static description =
    "Switch node allows you to conditionally choose a value based on a condition.";

  declare inputs: ToInput<{
    default: T;
    condition: string;
  }>
  declare output: ToOutput<{
    value: T;
  }>

  constructor(props: INodeDefinition) {
    super(props);

    this.annotations[annotatedDynamicInputs] = true

    this.addInput("default", {
      type: AnySchema,
    });

    this.addInput("condition", {
      type: StringSchema,
    });

    this.addOutput("value", {
      type: AnySchema,
    });
  }

  execute(): void | Promise<void> {
    const { condition } = this.getAllInputs();
    const defaultVal = this.getRawInput("default");

    //Check if an input matches the condition
    if (this.inputs[condition]) {
      const input = this.getRawInput(condition);
      this.setOutput("value", input.value, input.type);
      return;
    }

    this.setOutput("value", defaultVal.value, defaultVal.type);
  }
}

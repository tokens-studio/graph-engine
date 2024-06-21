import { AnyArraySchema, StringSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
export default class NodeDefinition<T> extends Node {
  static title = "Join Array";
  static type = "studio.tokens.array.join";

  declare inputs: ToInput<{
    array: T[];
    delimiter: string;
  }>

  declare outputs: ToOutput<{
    value: string;
  }>


  static description =
    "Join node allows you to join an array into a string using a delimiter.";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
    });
    this.addInput("delimiter", {
      type: {
        ...StringSchema,
        default: "-",
      },
    });
    this.addOutput("value", {
      type: StringSchema,
    });
  }

  execute(): void | Promise<void> {
    const { delimiter, array } = this.getAllInputs();
    this.setOutput("value", array.join(delimiter));
  }
}

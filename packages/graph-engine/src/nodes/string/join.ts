import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { StringSchema } from "../../schemas/index.js";
import { arrayOf } from "../../schemas/utils.js";

export default class NodeDefinition extends Node {
  static title = "Join String";
  static type = NodeTypes.JOIN_STRING;
  static description = "Joins an array of strings into a single string";

  declare inputs: ToInput<{
    array: string[]
    separator: string
  }>

  declare outputs: ToOutput<{
    value: string
  }>
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: arrayOf(StringSchema),
      visible: true,
    });
    this.addInput("separator", {
      type: {
        ...StringSchema,
        default: "",
      },
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { array, separator } = this.getAllInputs();
    this.setOutput("value", array.join(separator));
  }
}

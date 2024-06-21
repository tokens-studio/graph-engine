import { AnySchema, StringSchema, createVariadicSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";

export default class NodeDefinition extends Node {
  static title = "Join String";
  static type = "studio.tokens.string.join";
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
    this.addInput("items", {
      type: {
        ...createVariadicSchema(AnySchema),
        default: [],
      },
      variadic: true,
    });
    this.addInput("separator", {
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
    const { items, separator } = this.getAllInputs();
    this.setOutput("value", items.join(separator));
  }
}

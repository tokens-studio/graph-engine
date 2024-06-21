import { AnyArraySchema, AnySchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
export default class NodeDefinition<T> extends Node {
  static title = "Array push";
  static type = "studio.tokens.array.push";
  static description = "Pushes an item to an array";

  declare inputs: ToInput<{
    /**
     * The array to push to
     */
    array: T[];
    /**
     * The item to push to the array
     */
    item: T;
  }>
  declare outputs: ToOutput<{
    /**
     * The array with the item pushed to it
     */
    value: T[];
  }>


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
    });
    this.addInput("item", {
      type: AnySchema,
    });
    this.addOutput("value", {
      type: AnyArraySchema,
    });
  }

  execute(): void | Promise<void> {
    const { item } = this.getAllInputs();
    const array = this.getRawInput("array");
    const calculated = [...array.value, item];

    this.setOutput("value", calculated, array.type);
  }
}

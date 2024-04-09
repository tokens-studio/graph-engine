import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnyArraySchema, AnySchema, NumberSchema } from "@/schemas/index.js";
export default class NodeDefinition extends Node {
  static title = "Array push";
  static type = NodeTypes.ARRAY_PUSH;
  static description = "Pushes an item to an array";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addInput("item", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: AnyArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { item } = this.getAllInputs();
    const array = this.getRawInput("array");
    const calculated = [...array.value, item];

    this.setOutput("value", calculated, array.type);
  }
}

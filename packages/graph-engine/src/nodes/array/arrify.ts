import { INodeDefinition, Input, Output } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, NumberSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Arrify";
  static type = NodeTypes.ARRIFY;
  static description = "Dynamically generates an array";

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("items", {
      type: AnySchema,
      visible: true,
      variadic: true,
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const items = this.getRawInput("items");
    this.setOutput("value", items.value, items.type);
  }
}

import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import { AnyArraySchema, AnySchema, createVariadicSchema } from "../../schemas/index.js";

export default class NodeDefinition<T> extends Node {
  static title = "Arrify";
  static type = NodeTypes.ARRIFY;
  static description = "Dynamically generates an array";

  declare inputs: ToInput<{
    items: T[];
  }>;
  declare outputs: ToOutput<{
    value: T[];
  }>;


  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("items", {
      type: {
        ...createVariadicSchema(AnySchema),
        default: [],
      },
      visible: true,
      variadic: true,
    });
    this.addOutput("value", {
      type: AnyArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const items = this.getRawInput("items");
    this.setOutput("value", items.value, items.type);
  }
}

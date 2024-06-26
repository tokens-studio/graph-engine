import { AnyArraySchema, AnySchema, createVariadicSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
export default class NodeDefinition<T> extends Node {
  static title = "Arrify";
  static type = "studio.tokens.array.arrify";
  static description = "Converts various input types into a uniform array structure.\n\nInput: Any value or set of values\nOutput: Array\n\nUse this node to ensure consistent array formatting regardless of input type. It can handle single values, multiple values, or existing arrays, outputting a standardized array format. Useful for normalizing data inputs, preparing values for batch processing, or ensuring consistent data structures in your workflows.";
  
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
      variadic: true,
    });
    this.addOutput("value", {
      type: AnyArraySchema,
    });
  }

  execute(): void | Promise<void> {
    const items = this.getRawInput("items");
    this.setOutput("value", items.value, items.type);
  }
}


import { AnyArraySchema } from "../../schemas/index.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { ToInput, ToOutput } from "../../programmatic";
export default class NodeDefinition<T> extends Node {
  static title = "Concat Array";
  static type = "studio.tokens.array.concat";
  declare inputs: ToInput<{
    a: T[];
    b: T[];
  }>;

  declare outputs: ToOutput<{
    value: T[];
  }>;

  static description = "Performs an array join using a string delimiter";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: AnyArraySchema,
    });
    this.addInput("b", {
      type: AnyArraySchema,
    });
    this.addOutput("value", {
      type: AnyArraySchema,
    });
  }

  execute(): void | Promise<void> {
    const a = this.getRawInput("a");
    const b = this.getRawInput("b");

    //Verify types
    if (a.type.$id !== b.type.$id) throw new Error("Array types must match");

    const calculated = a.value.concat(b.value);
    this.setOutput("value", calculated, a.type);
  }
}

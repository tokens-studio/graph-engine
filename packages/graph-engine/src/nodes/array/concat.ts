import { Input } from "@/programmatic/input.js";
import { NodeTypes } from "@/types.js";
import { INodeDefinition, Node } from "@/programmatic/node.js";
import { AnyArraySchema } from "@/schemas/index.js";
import { Output } from "@/programmatic";
export default class NodeDefinition extends Node {
  static title = "Concat Array";
  static type = NodeTypes.CONCAT;
  declare inputs: {
    a: Input;
    b: Input;
  };

  declare outputs: {
    value: Output;
  };

  static description = "Performs an array join using a string delimiter";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addInput("b", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: AnyArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const a = this.getRawInput("a");
    const b = this.getRawInput("b");

    //Verify types
    if (a.type.$id !== b.type.$id)
      throw new Error("Array types must match");

    const calculated = a.value.concat(b.value);
    this.setOutput("value", calculated, a.type);
  }
}

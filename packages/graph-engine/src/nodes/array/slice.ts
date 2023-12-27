import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnyArraySchema, NumberSchema } from "@/schemas/index.js";
export default class NodeDefinition extends Node {
  static title = "Slice Array";
  static type = NodeTypes.SLICE;
  static description = "Slices an input array";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("array", {
      type: AnyArraySchema,
      visible: true,
    });
    this.addInput("start", {
      type: NumberSchema,
      visible: true,
    });
    this.addInput("end", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: AnyArraySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { start, end } = this.getAllInputs();
    const array = this.getRawInput("array");
    const calculated = array.value.slice(start, end);

    this.setOutput("value", calculated, array.type);
  }
}

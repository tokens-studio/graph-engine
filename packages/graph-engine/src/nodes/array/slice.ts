import { INodeDefinition, ToInput, ToOutput } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnyArraySchema, NumberSchema } from "@/schemas/index.js";
export default class NodeDefinition<T> extends Node {
  static title = "Slice Array";
  static type = NodeTypes.SLICE;
  static description = "Slices an input array";

  declare inputs: ToInput<{
    array: T[];
    start: number;
    end: number;
  }>;
  declare outputs: ToOutput<{
    value: T[];
  }>;
  constructor(props: INodeDefinition) {
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

import { AnyArraySchema, NumberSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
export default class NodeDefinition<T> extends Node {
  static title = "Slice Array";
  static type = "studio.tokens.array.slice";
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
    });
    this.addInput("start", {
      type: NumberSchema,
    });
    this.addInput("end", {
      type: NumberSchema,
    });
    this.addOutput("value", {
      type: AnyArraySchema,
    });
  }

  execute(): void | Promise<void> {
    const { start, end } = this.getAllInputs();
    const array = this.getRawInput("array");
    const calculated = array.value.slice(start, end);

    this.setOutput("value", calculated, array.type);
  }
}

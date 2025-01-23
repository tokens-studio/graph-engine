import { DataflowNode, NumberSchema } from "@tokens-studio/graph-engine";
import type {
  INodeDefinition,
  ToInput,
  ToOutput,
} from "@tokens-studio/graph-engine";

export default class NodeDefinition extends DataflowNode {
  static type = "com.my.add";
  declare inputs: ToInput<{
    a: number;
    b: number;
  }>;
  declare outputs: ToOutput<{
    value: number;
  }>;
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: NumberSchema,
    });
    this.addInput("b", {
      type: NumberSchema,
    });
    this.addOutput("value", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { a, b } = this.getAllInputs();
    this.outputs.value.set(a + b);
  }
}

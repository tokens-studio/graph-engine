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
    this.dataflow.addInput("a", {
      type: NumberSchema,
    });
    this.dataflow.addInput("b", {
      type: NumberSchema,
    });
    this.dataflow.addOutput("value", {
      type: NumberSchema,
    });
  }

  execute(): void | Promise<void> {
    const { a, b } = this.getAllInputs();
    this.outputs.value.set(a + b);
  }
}

import { AnySchema, BooleanSchema } from "../../schemas/index.js";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";

export default class NodeDefinition<T, V> extends Node {
  static title = "If";
  static type = "studio.tokens.logic.if";
  static description =
    "If node allows you to conditionally choose a value based on a condition.";


  declare inputs: ToInput<{
    condition: boolean;
    a: T;
    b: V;
  }>;

  declare outputs: ToOutput<{
    value: T | V;
  }>;



  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("condition", {
      type: BooleanSchema,
      visible: true,
    });
    this.addInput("a", {
      type: AnySchema,
      visible: true,
    });
    this.addInput("b", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: AnySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { condition } = this.getAllInputs();
    const a = this.getRawInput("a");
    const b = this.getRawInput("b");

    const val = condition ? a : b;

    this.setOutput("value", val.value, val.type);
  }
}

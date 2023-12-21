import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, BooleanSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "If";
  static type = NodeTypes.IF;
  static description =
    "If node allows you to conditionally choose a value based on a condition.";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("condition", {
      type: AnySchema,
      visible: true,
    });
    this.addOutput("value", {
      type: BooleanSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { condition } = this.getAllInputs();
    const a = this.getRawInput("a");
    const b = this.getRawInput("b");

    const val = condition ? a : b;

    this.setOutput("value", val.value, val.type());
  }
}

import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import { AnySchema, StringSchema } from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Switch";
  static type = NodeTypes.SWITCH;
  static description =
    "Switch node allows you to conditionally choose a value based on a condition.";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("default", {
      type: AnySchema,
    });

    this.addInput("condition", {
      type: StringSchema,
    });

    this.addOutput("value", {
      type: AnySchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { condition } = this.getAllInputs();
    const defaultVal = this.getRawInput("default");

    //TODO

    this.setOutput("value", defaultVal.value, defaultVal.type());
  }
}

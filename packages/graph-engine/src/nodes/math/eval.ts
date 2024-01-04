import { Parser } from "expr-eval";
import { INodeDefinition } from "@/index.js";
import { NodeTypes } from "@/types.js";
import { Node } from "@/programmatic/node.js";
import {
  NumberSchema,
  NumberArraySchema,
  StringSchema,
} from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Evaluate math";
  static type = NodeTypes.EVAL;
  static description = "Allows you to evaluate arbitrary math expressions";
  constructor(props?: INodeDefinition) {
    super(props);
    this.addInput("expression", {
      type: StringSchema,
      visible: true,
    });

    //We expect users to expose the variables they want to use in the expression as inputs

    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { expression, ...inputs } = this.getAllInputs();
    const parser = new Parser();

    const output = parser.evaluate(expression, inputs);

    this.setOutput("value", output);
  }
}

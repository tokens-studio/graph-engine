import { Parser } from "expr-eval";
import { ToInput } from "@/programmatic/input.js";
import { ToOutput } from "@/programmatic/output.js";
import { annotatedDynamicInputs } from '@/annotations/index.js';
import { NodeTypes } from "@/types.js";
import { Node, INodeDefinition } from "@/programmatic/node.js";
import {
  NumberSchema,
  StringSchema,
} from "@/schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Evaluate math";
  static type = NodeTypes.EVAL;
  static description = "Allows you to evaluate arbitrary math expressions";


  declare inputs: ToInput<{
    expression: string;
  }> & ToInput<{
    [key: string]: number
  }>;

  declare outputs: ToOutput<{
    value: number;
  }>;

  constructor(props: INodeDefinition) {
    super(props);

    this.annotations[annotatedDynamicInputs] = true
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
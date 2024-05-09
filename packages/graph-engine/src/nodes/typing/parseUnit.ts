import valueParser from "postcss-value-parser";
import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { NodeTypes } from "../../types.js";
import { Node } from "../../programmatic/node.js";
import {
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";

export default class NodeDefinition extends Node {
  static title = "Parse unit";
  static type = NodeTypes.PARSE_UNIT;
  static description =
    "Parse unit node allows you to seperate units from a number.";


  declare inputs: ToInput<{
    value: string;
    unit: string;
  }>;

  declare outputs: ToOutput<{
    number: number;
    unit: string;
  }>;

  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: StringSchema,
      visible: true,
    });
    this.addOutput("unit", {
      type: StringSchema,
      visible: true,
    });
    this.addOutput("number", {
      type: NumberSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value } = this.getAllInputs();

    const x = valueParser.unit(value);
    if (!x) {
      this.setOutput("number", 0);
      this.setOutput("unit", "");
      return;
    }

    this.setOutput("number", x.number);
    this.setOutput("unit", x.unit);
  }
}

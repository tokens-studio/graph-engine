import { INodeDefinition, ToInput, ToOutput } from "../../index.js";
import { Node } from "../../programmatic/node.js";
import {
  NumberSchema,
  StringSchema,
} from "../../schemas/index.js";
import valueParser from "postcss-value-parser";

export default class NodeDefinition extends Node {
  static title = "Parse unit";
  static type = "studio.tokens.typing.parseUnit";
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
    });
    this.addOutput("unit", {
      type: StringSchema,
    });
    this.addOutput("number", {
      type: NumberSchema,
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

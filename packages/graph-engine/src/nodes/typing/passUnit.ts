import valueParser from "postcss-value-parser";

import { NodeTypes } from "../../types.js";
import { INodeDefinition, Node } from "../../programmatic/node.js";
import { StringSchema } from "../../schemas/index.js";
import {  ToInput } from "../../programmatic/input.js";
import {  ToOutput } from "../../programmatic/output.js";

export default class NodeDefinition extends Node {
  static title = "Pass unit";
  static type = NodeTypes.PASS_UNIT;
  declare inputs: ToInput<{
    value: string;
    fallback: string;
  }>;
  declare outputs: ToOutput<{
    value: string;
  }>;
  static description = "Adds a unit to a value if it doesn't already have one";
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("value", {
      type: StringSchema,
      visible: true,
    });
    this.addInput("fallback", {
      type: {
        ...StringSchema,
        default: "px",
      },
    });
    this.addOutput("value", {
      type: StringSchema,
      visible: true,
    });
  }

  execute(): void | Promise<void> {
    const { value, fallback } = this.getAllInputs();

    const x = valueParser.unit(value);
    if (!x) {
      throw Error("Could not parse unit");
    }

    if (x.unit) {
      this.setOutput("value", value);
    } else {
      this.setOutput("value", `${value}${fallback || ""}`);
    }
  }
}
